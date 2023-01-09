import { GitHubBaseController } from "@lib/infrastructure";

import { TaintTerraformPlanDTO } from "./dto";
import { TaintTerraformPlanUseCase } from "./useCase";

export class TaintPlanGitHubController extends GitHubBaseController {
  constructor(private useCase: TaintTerraformPlanUseCase) {
    super();
    this.useCase = useCase;
  }

  public async execute(): Promise<void> {
    const request: TaintTerraformPlanDTO = {} as TaintTerraformPlanDTO;

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
