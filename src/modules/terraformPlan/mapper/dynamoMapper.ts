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
    try {
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
          dateTimeCreated: new Date(raw.timestamp),
          contents: "",
        },
        new UniqueEntityId(raw.id)
      );

      if (planOrError.isFailure) {
        throw new Error("Error converting DynamoDB item to domain");
      }

      return planOrError.getValue();
    } catch (err) {
      throw new Error(
        `Error converting DynamoDB item to domain: ${(err as Error).message}`
      );
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public toPersistence(domain: TerraformPlan): any {
    const item = {
      id: { S: domain.id.toString() },
      branch: { S: domain.branch },
      commitSHA: { S: domain.commitSHA },
      component: { S: domain.component },
      contentsHash: { S: domain.contentsHash || "" },
      repoOwner: { S: domain.repoOwner },
      pr: { N: `${domain.pr}` },
      repoName: { S: domain.repoName },
      stack: { S: domain.stack },
      tainted: { BOOL: domain.tainted },
      timestamp: { S: domain.timestamp },
    };

    return item;
  }
}
