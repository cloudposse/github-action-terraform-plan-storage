import { ValueObject } from "@lib/domain";
import { Guard, Result } from "@lib/infrastructure";

interface TerraformPlanStackProps {
  value: string;
}

export class TerraformPlanStack extends ValueObject<TerraformPlanStackProps> {
  public static minLength = 2;
  public static maxLength = 255;

  get value(): string {
    return this.props.value;
  }

  private constructor(props: TerraformPlanStackProps) {
    super(props);
  }

  public static create(
    props: TerraformPlanStackProps
  ): Result<TerraformPlanStack> {
    const nullGuardResult = Guard.againstNullOrUndefined(props.value, "stack");

    if (nullGuardResult.isFailure) {
      return Result.fail<TerraformPlanStack>(nullGuardResult.getErrorValue());
    }

    const minGuardResult = Guard.againstMinLength(
      this.minLength,
      props.value,
      "stack"
    );
    const maxGuardResult = Guard.againstMaxLength(
      this.maxLength,
      props.value,
      "stack"
    );

    if (minGuardResult.isFailure) {
      return Result.fail<TerraformPlanStack>(minGuardResult.getErrorValue());
    }

    if (maxGuardResult.isFailure) {
      return Result.fail<TerraformPlanStack>(maxGuardResult.getErrorValue());
    }

    return Result.ok<TerraformPlanStack>(new TerraformPlanStack(props));
  }
}
