/* eslint-disable @typescript-eslint/no-namespace */

import { Result, UseCaseError } from "@lib/infrastructure";

export namespace SaveTerraformPlanErrors {
  export class FileNotFoundError extends Result<UseCaseError> {
    constructor(path: string) {
      const message = `The file ${path} does not exist.`;
      super(false, {
        message
      } as UseCaseError);
    }
  }

  export class EmptyPlanError extends Result<UseCaseError> {
    constructor() {
      const message = `An empty plan file was specified`;
      super(false, {
        message
      } as UseCaseError);
    }
  }
}
