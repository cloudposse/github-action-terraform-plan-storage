import * as core from "@actions/core";
import { GitHubBaseController, Guard } from "@lib/infrastructure";

import { GetTerraformPlanDTO } from "./dto";
import { GetTerraformPlanUseCase } from "./useCase";

export class GetPlanGitHubController extends GitHubBaseController {
  constructor(private useCase: GetTerraformPlanUseCase) {
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

    const request: GetTerraformPlanDTO = {
      component: componentInput,
      commit: this.sha,
      isMergeCommit: this.isMergeEvent,
      repositoryName: this.repository,
      repositoryOwner: this.owner,
      planPath: planPathInput,
      pr: this.pr,
      stack: stackInput,
    };

    try {
      const result = await this.useCase.execute(request);

      if (result.isLeft()) {
        const error = result.value;
        return this.fail(error.getErrorValue().toString());
      } else {
        return this.ok({});
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return this.fail(error);
    }
  }
}
