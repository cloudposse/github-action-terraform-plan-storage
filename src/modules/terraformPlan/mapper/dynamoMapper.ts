import { UniqueEntityId } from "../../../lib";
import { Mapper } from "../../../lib/repository/mapper";
import { TerraformPlanCommit, TerraformPlanComponent } from "../domain";
import { TerraformPlan } from "../domain/TerraformPlan";
import { TerraformPlanBranch } from "../domain/TerraformPlanBranch";
import { TerraformPlanPR } from "../domain/TerraformPlanPR";
import { TerraformPlanRepository } from "../domain/TerraformPlanRepository";
import { TerraformPlanStack } from "../domain/TerraformPlanStack";

export class TerraformPlanDynamoDBMapper extends Mapper<TerraformPlan> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public toDomain(raw: any): TerraformPlan {
    const planOrError = TerraformPlan.create(
      {
        branch: TerraformPlanBranch.create({ value: raw.branch }).getValue(),
        commitSHA: TerraformPlanCommit.create({
          value: raw.commitSHA,
        }).getValue(),
        component: TerraformPlanComponent.create({
          value: raw.component,
        }).getValue(),
        pr: TerraformPlanPR.create({
          value: raw.pr,
        }).getValue(),
        stack: TerraformPlanStack.create({
          value: raw.stack,
        }).getValue(),
        repository: TerraformPlanRepository.create({
          repoOwner: raw.repoOwner,
          repoName: raw.repoName,
        }).getValue(),
        tainted: raw.tainted,
        createdAt: new Date(raw.createdAt),
        contents: Buffer.from(""),
        contentsHash: raw.contentsHash,
      },
      new UniqueEntityId(raw.id)
    );

    if (planOrError.isFailure) {
      throw new Error("Error converting DynamoDB item to domain");
    }

    return planOrError.getValue();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public toPersistence(domain: TerraformPlan): any {
    const item = {
      id: domain.id.toString(),
      branch: domain.branch,
      commitSHA: domain.commitSHA,
      component: domain.component,
      contentsHash: domain.contentsHash || "",
      repoOwner: domain.repoOwner,
      pr: domain.pr,
      repoName: domain.repoName,
      stack: domain.stack,
      tainted: domain.tainted,
      createdAt: domain.createdAt,
    };

    return item;
  }
}
