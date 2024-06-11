import { existsSync } from "fs";
import { Readable } from "stream";

import { calculateHash } from "@lib/crypto";
import {
  AppError,
  Either,
  left,
  Result,
  right,
  UseCase
} from "@lib/infrastructure";
import { stringFromReadable } from "@lib/readable";
import { TerraformPlan } from "@modules/terraformPlan";

import {
  ICodeRepository,
  IMetadataRepository,
  IPlanRepository
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
  contents: Uint8Array
): Promise<GetTerraformPlanResponse> => {
  const planFileExists = existsSync(pathToPlan);
  if (planFileExists) {
    return left(new GetTerraformPlanErrors.PlanAlreadyExistsError(pathToPlan));
  }

  writeFile(pathToPlan, contents);
  return right(Result.ok<void>());
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
    try {
      const {
        commitSHA,
        component,
        isMergeCommit,
        stack,
        planPath,
        pr,
        repoName,
        repoOwner
      } = req;

      let plan: Uint8Array;
      let metadata: TerraformPlan;

      if (commitSHA && commitSHA != "" && isMergeCommit) {
        if (!pr) {
          return left(
            new AppError.UnexpectedError("PR is required for merge commits")
          );
        }

        metadata = await this.metaDataRepository.loadLatestForPR(
          repoOwner,
          repoName,
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
        // Non-merge commit, we're on the feature branch or workflow dispatch
        if (!commitSHA) {
          return left(
            new AppError.UnexpectedError(
              "Commit is required for non-merge commits"
            )
          );
        }

        metadata = await this.metaDataRepository.loadByCommit(
          repoOwner,
          repoName,
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

      const hash = await calculateHash(plan);
      if (metadata.contentsHash != hash) {
        return left(
          new GetTerraformPlanErrors.ContentsHashMismatch(
            metadata.contentsHash?.toString() ?? "",
            hash
          )
        );
      }

      const result = await writePlanFile(planPath, plan);
      if (result.isLeft()) {
        return left(result.value);
      }

      return right(Result.ok<void>());
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
