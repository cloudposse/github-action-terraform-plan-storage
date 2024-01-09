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

  public get repoOwner(): string {
    return this.props.repository.repoOwner;
  }

  public get repoName(): string {
    return this.props.repository.repoName;
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

  public get contents(): Buffer {
    return this.props.contents;
  }

  public get contentsHash(): string | undefined {
    return this.props.contentsHash;
  }

  public get createdAt(): string {
    return this.props.createdAt?.toISOString() || "";
  }

  public static create(
    props: TerraformPlanProps,
    id?: UniqueEntityId
  ): Result<TerraformPlan> {
    const guardArgs: IGuardArgument[] = [
      { argument: props.contents, argumentName: "contents" }
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardArgs);

    if (guardResult.isFailure) {
      return Result.fail<TerraformPlan>(guardResult.getErrorValue());
    }

    const defaultValues: TerraformPlanProps = {
      ...props,
      contentsHash: props.contentsHash || calculateHash(props.contents),
      createdAt: props.createdAt ? props.createdAt : new Date(),
      tainted: props.tainted ? props.tainted : false
    };

    const terraformPlan = new TerraformPlan(defaultValues, id);
    return Result.ok(terraformPlan);
  }
}
