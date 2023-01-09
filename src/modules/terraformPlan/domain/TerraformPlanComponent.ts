import { ValueObject } from "@lib/domain";
import { Guard, Result } from "@lib/infrastructure";

interface TerraformPlanComponentProps {
  value: string;
}

export class TerraformPlanComponent extends ValueObject<TerraformPlanComponentProps> {
  public static minLength = 2;
  public static maxLength = 255;

  get value(): string {
    return this.props.value;
  }

  private constructor(props: TerraformPlanComponentProps) {
    super(props);
  }

  public static create(
    props: TerraformPlanComponentProps
  ): Result<TerraformPlanComponent> {
    const nullGuardResult = Guard.againstNullOrUndefined(
      props.value,
      "component"
    );

    if (nullGuardResult.isFailure) {
      return Result.fail<TerraformPlanComponent>(
        nullGuardResult.getErrorValue()
      );
    }

    const minGuardResult = Guard.againstMinLength(
      this.minLength,
      props.value,
      "component"
    );
    const maxGuardResult = Guard.againstMaxLength(
      this.maxLength,
      props.value,
      "component"
    );

    if (minGuardResult.isFailure) {
      return Result.fail<TerraformPlanComponent>(
        minGuardResult.getErrorValue()
      );
    }

    if (maxGuardResult.isFailure) {
      return Result.fail<TerraformPlanComponent>(
        maxGuardResult.getErrorValue()
      );
    }

    return Result.ok<TerraformPlanComponent>(new TerraformPlanComponent(props));
  }
}
