import * as core from "@actions/core";
import { ArtifactoryCodeRepo } from "@lib/repository";
import {
  SavePlanGitHubController,
  SaveTerraformPlanUseCase
} from "@useCases/savePlan";

import { getMetadataRepo, getPlanRepo } from "./shared";

export async function storePlan() {
  try {
    const tableName = core.getInput("tableName");
    const bucketName = core.getInput("bucketName");

    core.debug(`tableName: ${tableName}`);
    core.debug(`bucketName: ${bucketName}`);

    const metadataRepo = getMetadataRepo();
    const planRepo = getPlanRepo();

    const codeRepo = new ArtifactoryCodeRepo();

    const useCase = new SaveTerraformPlanUseCase(
      metadataRepo,
      planRepo,
      codeRepo
    );

    const controller = new SavePlanGitHubController(useCase);

    await controller.execute();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    core.setFailed(error);
  }
}
