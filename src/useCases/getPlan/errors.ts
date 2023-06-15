/* eslint-disable @typescript-eslint/no-namespace */

import { Result, UseCaseError } from "@lib/infrastructure";

export namespace GetTerraformPlanErrors {
  export class PlanAlreadyExistsError extends Result<UseCaseError> {
    constructor(path: string) {
      const message = `A plan file already exists at ${path}.`;
      super(false, {
        message,
      } as UseCaseError);
    }
  }

  export class ContentsHashMismatch extends Result<UseCaseError> {
    constructor(expected: string, actual: string) {
      const message = `The contents of the plan file have changed since storing. Expected hash ${expected}, got ${actual}.`;
      super(false, {
        message,
      } as UseCaseError);
    }
  }
}
