import * as core from "@actions/core";
import { ArtifactoryCodeRepo } from "@lib/repository";
import {
  GetPlanGitHubController,
  GetTerraformPlanUseCase
} from "@useCases/getPlan";

import { getMetadataRepo, getPlanRepo } from "./shared";

export async function getPlan() {
  try {
    const metadataRepo = getMetadataRepo();
    const planRepo = getPlanRepo();
    const codeRepo = new ArtifactoryCodeRepo();

    const useCase = new GetTerraformPlanUseCase(
      metadataRepo,
      planRepo,
      codeRepo
    );

    const controller = new GetPlanGitHubController(useCase);

    await controller.execute();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    core.setFailed(error);
  }
}
