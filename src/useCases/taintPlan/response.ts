import { RepositoryErrors } from "@lib/index";

import { AppError, Either, Result } from "../../lib/infrastructure";

export type TaintTerraformPlanResponse = Either<
  | RepositoryErrors.PlanNotFoundError
  | AppError.UnexpectedError
  | Result<string>,
  Result<void>
>;
