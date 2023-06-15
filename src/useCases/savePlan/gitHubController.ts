import * as core from "@actions/core";
import { GitHubBaseController, Guard } from "@lib/infrastructure";

import { SaveTerraformPlanDTO } from "./dto";
import { SaveTerraformPlanUseCase } from "./useCase";

export class SavePlanGitHubController extends GitHubBaseController {
  constructor(private useCase: SaveTerraformPlanUseCase) {
    super();
    this.useCase = useCase;
  }

  public async execute(): Promise<void> {
    const componentInput = core.getInput("component");
    const stackInput = core.getInput("stack");
    const planPathInput = core.getInput("planPath");

    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argumentName: "component", argument: componentInput },
      { argumentName: "stack", argument: stackInput },
      { argumentName: "planPath", argument: planPathInput },
    ]);

    if (!guardResult.isSuccess) {
      return this.fail(guardResult.getErrorValue());
    }

    const request: SaveTerraformPlanDTO = {
      branch: this.branch,
      commit: this.sha,
      component: componentInput,
      planPath: planPathInput,
      pr: this.pr,
      repositoryName: this.repoName,
      repositoryOwner: this.repoOwner,
      stack: stackInput,
    };

    try {
      const result = await this.useCase.execute(request);

      if (result.isLeft()) {
        const error = result.value;

        return this.fail(
          error.getErrorValue().message || error.getErrorValue()
        );
      } else {
        return this.ok({});
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return this.fail(error);
    }
  }
}
