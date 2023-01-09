import { ValueObject } from "@lib/domain";
import { Guard, Result } from "@lib/infrastructure";

interface TerraformPlanRepositoryProps {
  owner: string;
  name: string;
}

export class TerraformPlanRepository extends ValueObject<TerraformPlanRepositoryProps> {
  public static minLength = 2;
  public static maxLength = 100;

  get owner(): string {
    return this.props.owner;
  }

  get name(): string {
    return this.props.name;
  }

  private constructor(props: TerraformPlanRepositoryProps) {
    super(props);
  }

  public static create(
    props: TerraformPlanRepositoryProps
  ): Result<TerraformPlanRepository> {
    const ownerNullGuardResult = Guard.againstNullOrUndefined(
      props.owner,
      "owner"
    );

    if (ownerNullGuardResult.isFailure) {
      return Result.fail<TerraformPlanRepository>(
        ownerNullGuardResult.getErrorValue()
      );
    }

    const nameNullGuardResult = Guard.againstNullOrUndefined(
      props.name,
      "name"
    );

    if (nameNullGuardResult.isFailure) {
      return Result.fail<TerraformPlanRepository>(
        nameNullGuardResult.getErrorValue()
      );
    }

    const ownerMinGuardResult = Guard.againstMinLength(
      this.minLength,
      props.owner,
      "owner"
    );
    if (ownerMinGuardResult.isFailure) {
      return Result.fail<TerraformPlanRepository>(
        ownerMinGuardResult.getErrorValue()
      );
    }

    const nameMinGuardResult = Guard.againstMinLength(
      this.minLength,
      props.name,
      "name"
    );
    if (nameMinGuardResult.isFailure) {
      return Result.fail<TerraformPlanRepository>(
        nameMinGuardResult.getErrorValue()
      );
    }

    const ownerMaxGuardResult = Guard.againstMaxLength(
      this.maxLength,
      props.owner,
      "owner"
    );
    if (ownerMaxGuardResult.isFailure) {
      return Result.fail<TerraformPlanRepository>(
        ownerMaxGuardResult.getErrorValue()
      );
    }

    const nameMaxGuardResult = Guard.againstMaxLength(
      this.maxLength,
      props.name,
      "name"
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
