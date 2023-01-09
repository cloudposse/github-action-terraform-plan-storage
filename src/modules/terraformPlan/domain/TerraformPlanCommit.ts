import { ValueObject } from "@lib/domain";
import { Guard, Result } from "@lib/infrastructure";

interface TerraformPlanCommitProps {
  value: string;
}

export class TerraformPlanCommit extends ValueObject<TerraformPlanCommitProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: TerraformPlanCommitProps) {
    super(props);
  }

  public static create(
    props: TerraformPlanCommitProps
  ): Result<TerraformPlanCommit> {
    const nullGuardResult = Guard.againstNullOrUndefined(props.value, "commit");

    if (nullGuardResult.isFailure) {
      return Result.fail<TerraformPlanCommit>(nullGuardResult.getErrorValue());
    }

    const sha1GuardResult = Guard.againstSHA1(props.value, "commit");

    if (sha1GuardResult.isFailure) {
      return Result.fail<TerraformPlanCommit>(sha1GuardResult.getErrorValue());
    }

    return Result.ok<TerraformPlanCommit>(new TerraformPlanCommit(props));
  }
}
