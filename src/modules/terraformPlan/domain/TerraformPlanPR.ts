import { ValueObject } from "@lib/domain";
import { Guard, Result } from "@lib/infrastructure";

interface TerraformPlanPRProps {
  value: number;
}

export class TerraformPlanPR extends ValueObject<TerraformPlanPRProps> {
  public static minLength = 2;
  public static maxLength = 255;

  get value(): number {
    return this.props.value;
  }

  private constructor(props: TerraformPlanPRProps) {
    super(props);
  }

  public static create(props: TerraformPlanPRProps): Result<TerraformPlanPR> {
    const nullGuardResult = Guard.againstNullOrUndefined(props.value, "pr");

    if (nullGuardResult.isFailure) {
      return Result.fail<TerraformPlanPR>(nullGuardResult.getErrorValue());
    }

    return Result.ok<TerraformPlanPR>(new TerraformPlanPR(props));
  }
}
