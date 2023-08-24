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
    const commitSHA = core.getInput("commitSHA", { required: false });
    const failOnMissingPlan = core.getInput("failOnMissingPlan", { required: false }) === 'true';

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
      commitSHA: commitSHA || this.sha,
      isMergeCommit: this.isMergeEvent,
      repoName: this.repoName,
      repoOwner: this.repoOwner,
      planPath: planPathInput,
      pr: this.pr,
      stack: stackInput,
    };

    try {
      const result = await this.useCase.execute(request);

      if (result.isLeft()) {
        const error = result.value;
        console.log(error);
        console.log(error.getErrorValue());
        return this.fail(error.getErrorValue());
      } else {
        return this.ok({});
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      core.error(error);
      return this.fail(error);
    }
  }
}
