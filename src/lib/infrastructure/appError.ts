import { Result } from "./result";
import { UseCaseError } from "./useCaseError";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace AppError {
  export class UnexpectedError extends Result<UseCaseError> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public constructor(err: any) {
      super(false, {
        message: `An unexpected error occurred.`,
        error: err,
        stack: err.stack
      } as UseCaseError);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static create(err: any): UnexpectedError {
      return new UnexpectedError(err);
    }
  }
}
