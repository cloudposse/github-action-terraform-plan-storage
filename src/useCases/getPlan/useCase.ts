import { existsSync } from "fs";
import { Readable } from "stream";

import * as core from "@actions/core";
import { calculateHash } from "@lib/crypto";
import {
  AppError,
  Either,
  left,
  Result,
  right,
  UseCase,
} from "@lib/infrastructure";
import { stringFromReadable, StringReader } from "@lib/readable";
import { TerraformPlan } from "@modules/terraformPlan";

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
        repoOwner,
      } = req;

      let plan: Readable;
      let metadata: TerraformPlan;

      if (isMergeCommit) {
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
        // Non-merge commit, we're on the feature branch
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

      const contents = await stringFromReadable(plan);
      const hash = await calculateHash(contents);
      core.info(`Hash of plan: ${hash}`);
      core.info(`Hash in metadata: ${metadata.contentsHash}`);
      core.info(`Plan Contents: ${contents}`);

      if (metadata.contentsHash != hash) {
        return left(
          new GetTerraformPlanErrors.ContentsHashMismatch(
            metadata.contentsHash?.toString() ?? "",
            hash
          )
        );
      }

      const contentsReadable = new Readable();
      contentsReadable.push(contents);
      contentsReadable.push(null);

      const result = await writePlanFile(planPath, contentsReadable);
      if (result.isLeft()) {
        return left(result.value);
      }

      return right(Result.ok<void>());
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
