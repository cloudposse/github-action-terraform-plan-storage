/* eslint-disable @typescript-eslint/no-namespace */

import { Result } from "@lib/infrastructure";

export namespace RepositoryErrors {
  export class PlanNotFoundError extends Result<Error> {
    constructor(commit: string, component: string, stack: string) {
      const message = `The plan for ${component} in the ${stack} for commit ${commit} does not exist.`;
      super(false, {
        message,
      } as Error);
    }
  }
}
