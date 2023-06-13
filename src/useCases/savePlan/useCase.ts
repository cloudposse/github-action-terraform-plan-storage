import { existsSync } from "fs";

import {
  AppError,
  Either,
  left,
  Result,
  right,
  UseCase,
} from "@lib/infrastructure";
import {
  TerraformPlan,
  TerraformPlanBranch,
  TerraformPlanCommit,
  TerraformPlanComponent,
  TerraformPlanProps,
  TerraformPlanRepository,
  TerraformPlanStack,
} from "@modules/terraformPlan";
import { TerraformPlanPR } from "@modules/terraformPlan/domain/TerraformPlanPR";

import {
  ICodeRepository,
  IMetadataRepository,
  IPlanRepository,
} from "../../lib/repository";
import { readFile } from "../../lib/system";

import { SaveTerraformPlanDTO } from "./dto";
import { SaveTerraformPlanErrors } from "./errors";
import { SaveTerraformPlanResponse } from "./response";

type Response = Either<
  | SaveTerraformPlanErrors.EmptyPlanError
  | SaveTerraformPlanErrors.FileNotFoundError
  | AppError.UnexpectedError
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | Result<any>,
  Result<void>
>;

const readPlanFile = async (
  pathToPlan: string
): Promise<Buffer | SaveTerraformPlanResponse> => {
  const planFileExists = existsSync(pathToPlan);
  if (!planFileExists) {
    return left(new SaveTerraformPlanErrors.FileNotFoundError(pathToPlan));
  }

  const planContents = await readFile(pathToPlan);
  if (!planContents) {
    return left(new SaveTerraformPlanErrors.EmptyPlanError());
  }

  return planContents;
};

export class SaveTerraformPlanUseCase
  implements UseCase<SaveTerraformPlanDTO, Promise<Response>>
{
  constructor(
    private metaDataRepository: IMetadataRepository,
    private planRepository: IPlanRepository,
    private codeRepository: ICodeRepository | undefined
  ) {}

  public async execute(req: SaveTerraformPlanDTO): Promise<Response> {
    try {
      try {
        const branchOrError = TerraformPlanBranch.create({ value: req.branch });
        if (branchOrError.isFailure) {
          return left(branchOrError);
        }
        const branch = branchOrError.getValue();

        const commitOrError = TerraformPlanCommit.create({ value: req.commit });
        if (commitOrError.isFailure) {
          return left(commitOrError);
        }
        const commitSHA = commitOrError.getValue();

        const prOrError = TerraformPlanPR.create({ value: req.pr });
        if (prOrError.isFailure) {
          return left(prOrError);
        }
        const pr = prOrError.getValue();

        const componentOrError = TerraformPlanComponent.create({
          value: req.component,
        });
        if (componentOrError.isFailure) {
          return left(componentOrError);
        }
        const component = componentOrError.getValue();

        const stackOrError = TerraformPlanStack.create({
          value: req.stack,
        });
        if (stackOrError.isFailure) {
          return left(stackOrError);
        }
        const stack = stackOrError.getValue();

        const contents = await readPlanFile(req.planPath);
        if (!Buffer.isBuffer(contents)) {
          return contents;
        }

        const repositoryOrError = TerraformPlanRepository.create({
          repoOwner: req.repositoryOwner,
          repoName: req.repositoryName,
        });
        const repository = repositoryOrError.getValue();

        if (repositoryOrError.isFailure) {
          return left(repositoryOrError);
        }

        const props: TerraformPlanProps = {
          branch,
          contents,
          commitSHA,
          component,
          stack,
          repository,
          pr,
          tainted: false,
        };

        const terraformPlanOrError = TerraformPlan.create(props);
        if (terraformPlanOrError.isFailure) {
          return left(terraformPlanOrError);
        }
        const terraformPlan = terraformPlanOrError.getValue();

        this.metaDataRepository.save(terraformPlan);
        this.planRepository.save(terraformPlan);
      } catch (err) {
        return left(new AppError.UnexpectedError(err));
      }

      return right(Result.ok<void>());
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
