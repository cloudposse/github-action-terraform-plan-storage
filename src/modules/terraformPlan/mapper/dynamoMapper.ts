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
    //     {
    //   "repoName": { "S": "demo-full-workflow" },
    //   "commitSHA": { "S": "b8686a75f8cd24381156419694dd27ebdc2f55f7" },
    //   "pr": { "N": "11" },
    //   "component": { "S": "dummy" },
    //   "contentsHash": { "S": "1fa32ceac2ef3fc62fa725acb322d68902a6a306660a172639fc5dff34800f9e" },
    //   "tainted": { "BOOL": false },
    //   "branch": { "S": "feature/test13" },
    //   "stack": { "S": "ue1-dev" },
    //   "repoOwner": { "S": "cloudposse-sandbox" }
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
          value: raw.pr.N,
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
