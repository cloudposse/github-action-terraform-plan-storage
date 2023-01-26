import { AppError, Either, Result } from "../../lib/infrastructure";

import { SaveTerraformPlanErrors } from "./errors";

export type SaveTerraformPlanResponse = Either<
  | SaveTerraformPlanErrors.EmptyPlanError
  | AppError.UnexpectedError
  | Result<string>,
  Result<void>
>;
