/* eslint-disable @typescript-eslint/no-namespace */

import { Result } from "@lib/infrastructure";

export namespace RepositoryErrors {
  export class PlanNotFoundError extends Result<Error> {
    constructor(
      component: string,
      stack: string,
      commit?: string,
      pr?: number
    ) {
      const message = `The plan for ${component} in the stack ${stack} for ${
        commit ? "commit" : "pr"
      } ${commit ? commit : pr} does not exist.`;
      super(false, {
        message
      } as Error);
    }
  }
}
