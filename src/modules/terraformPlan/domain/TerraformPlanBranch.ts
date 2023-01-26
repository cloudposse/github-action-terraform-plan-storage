import { ValueObject } from "@lib/domain";
import { Guard, Result } from "@lib/infrastructure";

interface TerraformPlanBranchProps {
  value: string;
}

export class TerraformPlanBranch extends ValueObject<TerraformPlanBranchProps> {
  public static minLength = 2;
  public static maxLength = 255;

  get value(): string {
    return this.props.value;
  }

  private constructor(props: TerraformPlanBranchProps) {
    super(props);
  }

  public static create(
    props: TerraformPlanBranchProps
  ): Result<TerraformPlanBranch> {
    const nullGuardResult = Guard.againstNullOrUndefined(props.value, "branch");

    if (nullGuardResult.isFailure) {
      return Result.fail<TerraformPlanBranch>(nullGuardResult.getErrorValue());
    }

    const minGuardResult = Guard.againstMinLength(
      this.minLength,
      props.value,
      "branch"
    );
    const maxGuardResult = Guard.againstMaxLength(
      this.maxLength,
      props.value,
      "branch"
    );

    if (minGuardResult.isFailure) {
      return Result.fail<TerraformPlanBranch>(minGuardResult.getErrorValue());
    }

    if (maxGuardResult.isFailure) {
      return Result.fail<TerraformPlanBranch>(maxGuardResult.getErrorValue());
    }

    return Result.ok<TerraformPlanBranch>(new TerraformPlanBranch(props));
  }
}
