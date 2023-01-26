import {
  AppError,
  Either,
  left,
  Result,
  right,
  UseCase,
} from "@lib/infrastructure";

import {
  ICodeRepository,
  IMetadataRepository,
  IPlanRepository,
} from "../../lib/repository";

import { TaintTerraformPlanDTO } from "./dto";
import { TaintTerraformPlanErrors } from "./errors";
import { TaintTerraformPlanResponse } from "./response";

type Response = Either<
  | TaintTerraformPlanErrors.PlanAlreadyExistsError
  | AppError.UnexpectedError
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | Result<any>,
  Result<void>
>;

export class TaintTerraformPlanUseCase
  implements UseCase<TaintTerraformPlanDTO, Promise<Response>>
{
  constructor(
    private metaDataRepository: IMetadataRepository,
    private planRepository: IPlanRepository,
    private codeRepository: ICodeRepository
  ) {}

  public async execute(
    req: TaintTerraformPlanDTO
  ): Promise<TaintTerraformPlanResponse> {
    try {
      // TODO: write taint logic

      return right(Result.ok<void>());
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
