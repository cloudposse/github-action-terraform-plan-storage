import { existsSync } from "fs";
import { Readable } from "stream";

import {
  AppError,
  Either,
  left,
  Result,
  right,
  UseCase,
} from "@lib/infrastructure";

import {
  ICodeRepository,
  IMetadataRepository,
  IPlanRepository,
} from "../../lib/repository";
import { writeFile } from "../../lib/system";

import { GetTerraformPlanDTO } from "./dto";
import { GetTerraformPlanErrors } from "./errors";
import { GetTerraformPlanResponse } from "./response";

type Response = Either<
  | GetTerraformPlanErrors.PlanAlreadyExistsError
  | AppError.UnexpectedError
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | Result<any>,
  Result<void>
>;

const writePlanFile = async (
  pathToPlan: string,
  contents: Readable
): Promise<void | GetTerraformPlanResponse> => {
  const planFileExists = existsSync(pathToPlan);
  if (planFileExists) {
    return left(new GetTerraformPlanErrors.PlanAlreadyExistsError(pathToPlan));
  }

  writeFile(pathToPlan, contents);
};

export class GetTerraformPlanUseCase
  implements UseCase<GetTerraformPlanDTO, Promise<Response>>
{
  constructor(
    private metaDataRepository: IMetadataRepository,
    private planRepository: IPlanRepository,
    private codeRepository: ICodeRepository
  ) {}

  public async execute(req: GetTerraformPlanDTO): Promise<Response> {
    //try {
    const {
      commitSHA,
      component,
      isMergeCommit,
      stack,
      planPath,
      pr,
      repoName,
      repoOwner,
    } = req;

    let plan: Readable;

    if (isMergeCommit) {
      if (!pr) {
        return left(
          new AppError.UnexpectedError("PR is required for merge commits")
        );
      }

      const metadata = await this.metaDataRepository.loadLatestForPR(
        component,
        stack,
        pr
      );

      plan = await this.planRepository.load(
        repoOwner,
        repoName,
        component,
        stack,
        metadata.commitSHA
      );
    } else {
      // Non-merge commit, we're on the feature branch
      if (!commitSHA) {
        return left(
          new AppError.UnexpectedError(
            "Commit is required for non-merge commits"
          )
        );
      }

      const metadata = await this.metaDataRepository.loadByCommit(
        component,
        stack,
        commitSHA
      );

      plan = await this.planRepository.load(
        repoOwner,
        repoName,
        component,
        stack,
        metadata.commitSHA
      );
    }

    writePlanFile(planPath, plan);

    return right(Result.ok<void>());
    // } catch (err) {
    //   return left(new AppError.UnexpectedError(err));
    // }
  }
}
