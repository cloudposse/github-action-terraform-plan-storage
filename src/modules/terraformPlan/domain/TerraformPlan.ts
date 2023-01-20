import { calculateHash } from "@lib/crypto";
import { AggregateRoot, UniqueEntityId } from "@lib/domain";
import { Guard, IGuardArgument, Result } from "@lib/infrastructure";

import { TerraformPlanProps } from "./TerraformPlanProps";

export class TerraformPlan extends AggregateRoot<TerraformPlanProps> {
  private constructor(props: TerraformPlanProps, id?: UniqueEntityId) {
    super(props, id);
  }

  public get component(): string {
    return this.props.component.value;
  }

  public get stack(): string {
    return this.props.stack.value;
  }

  public get owner(): string {
    return this.props.repository.owner;
  }

  public get repository(): string {
    return this.props.repository.name;
  }

  public get pr(): number {
    return this.props.pr.value;
  }

  public get branch(): string {
    return this.props.branch.value;
  }

  public get commitSHA(): string {
    return this.props.commitSHA.value;
  }

  public get tainted(): boolean {
    return this.props.tainted;
  }

  public get contents(): string {
    return this.props.contents;
  }

  public get hash(): string | undefined {
    return this.props.hash;
  }

  public get timestamp(): string {
    return this.props.dateTimeCreated?.toISOString() || "";
  }

  public static create(
    props: TerraformPlanProps,
    id?: UniqueEntityId
  ): Result<TerraformPlan> {
    const guardArgs: IGuardArgument[] = [
      { argument: props.contents, argumentName: "contents" },
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardArgs);

    if (guardResult.isFailure) {
      return Result.fail<TerraformPlan>(guardResult.getErrorValue());
    }

    const defaultValues: TerraformPlanProps = {
      ...props,
      hash: calculateHash(props.contents),
      dateTimeCreated: props.dateTimeCreated
        ? props.dateTimeCreated
        : new Date(),
      tainted: props.tainted ? props.tainted : false,
    };

    const terraformPlan = new TerraformPlan(defaultValues, id);
    return Result.ok(terraformPlan);
  }
}
