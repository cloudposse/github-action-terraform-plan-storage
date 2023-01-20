import { ValueObject } from "@lib/domain";
import { Guard, Result } from "@lib/infrastructure";

interface TerraformPlanRepositoryProps {
  repoOwner: string;
  repoName: string;
}

export class TerraformPlanRepository extends ValueObject<TerraformPlanRepositoryProps> {
  public static minLength = 2;
  public static maxLength = 100;

  get repoOwner(): string {
    return this.props.repoOwner;
  }

  get repoName(): string {
    return this.props.repoName;
  }

  private constructor(props: TerraformPlanRepositoryProps) {
    super(props);
  }

  public static create(
    props: TerraformPlanRepositoryProps
  ): Result<TerraformPlanRepository> {
    const ownerNullGuardResult = Guard.againstNullOrUndefined(
      props.repoOwner,
      "repoOwner"
    );

    if (ownerNullGuardResult.isFailure) {
      return Result.fail<TerraformPlanRepository>(
        ownerNullGuardResult.getErrorValue()
      );
    }

    const nameNullGuardResult = Guard.againstNullOrUndefined(
      props.repoName,
      "repoName"
    );

    if (nameNullGuardResult.isFailure) {
      return Result.fail<TerraformPlanRepository>(
        nameNullGuardResult.getErrorValue()
      );
    }

    const ownerMinGuardResult = Guard.againstMinLength(
      this.minLength,
      props.repoOwner,
      "repoOwner"
    );
    if (ownerMinGuardResult.isFailure) {
      return Result.fail<TerraformPlanRepository>(
        ownerMinGuardResult.getErrorValue()
      );
    }

    const nameMinGuardResult = Guard.againstMinLength(
      this.minLength,
      props.repoName,
      "repoName"
    );
    if (nameMinGuardResult.isFailure) {
      return Result.fail<TerraformPlanRepository>(
        nameMinGuardResult.getErrorValue()
      );
    }

    const ownerMaxGuardResult = Guard.againstMaxLength(
      this.maxLength,
      props.repoOwner,
      "repoOwner"
    );
    if (ownerMaxGuardResult.isFailure) {
      return Result.fail<TerraformPlanRepository>(
        ownerMaxGuardResult.getErrorValue()
      );
    }

    const nameMaxGuardResult = Guard.againstMaxLength(
      this.maxLength,
      props.repoName,
      "repoName"
    );
    if (nameMaxGuardResult.isFailure) {
      return Result.fail<TerraformPlanRepository>(
        nameMaxGuardResult.getErrorValue()
      );
    }

    return Result.ok<TerraformPlanRepository>(
      new TerraformPlanRepository(props)
    );
  }
}
