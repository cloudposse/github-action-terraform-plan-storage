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
    //    {
    //   "repoName": "demo-full-workflow",
    //   "commitSHA": "62f7f2f32bcc970970b277dd54c11cf5109f90c4",
    //   "pr": 14,
    //   "component": "dummy",
    //   "contentsHash": "aa509448d341b4012e3c89278c30506793bebacf1c51aa74c103bda853319df8",
    //   "tainted": false,
    //   "branch": "feature/test16",
    //   "stack": "ue1-dev",
    //   "createdAt": "2023-01-24T01:17:05.015Z",
    //   "id": "0359de0a-d47c-41a3-b89b-933c9eee7620",
    //   "repoOwner": "cloudposse-sandbox"
    // }

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
        contents: "",
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
      createdAt: { S: domain.createdAt },
    };

    return item;
  }
}
