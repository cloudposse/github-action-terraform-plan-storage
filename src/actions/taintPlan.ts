import * as core from "@actions/core";
import { ArtifactoryCodeRepo } from "@lib/repository";
import {
  TaintPlanGitHubController,
  TaintTerraformPlanUseCase
} from "@useCases/taintPlan";

import { getMetadataRepo, getPlanRepo } from "./shared";

export async function taintPlan() {
  try {
    const metadataRepo = getMetadataRepo();
    const planRepo = getPlanRepo();
    const codeRepo = new ArtifactoryCodeRepo();

    const useCase = new TaintTerraformPlanUseCase(
      metadataRepo,
      planRepo,
      codeRepo
    );

    const controller = new TaintPlanGitHubController(useCase);

    await controller.execute();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    core.setFailed(error);
  }
}
