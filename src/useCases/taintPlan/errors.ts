/* eslint-disable @typescript-eslint/no-namespace */

import { Result, UseCaseError } from "@lib/infrastructure";

export namespace TaintTerraformPlanErrors {
  export class PlanAlreadyExistsError extends Result<UseCaseError> {
    constructor(path: string) {
      const message = `A plan file already exists at ${path}.`;
      super(false, {
        message,
      } as UseCaseError);
    }
  }
}
