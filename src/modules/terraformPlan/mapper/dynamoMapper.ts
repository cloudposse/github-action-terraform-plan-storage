import { UniqueEntityId } from "../../../lib";
import { Mapper } from "../../../lib/repository/mapper";
import { TerraformPlanComponent } from "../domain";
import { TerraformPlan } from "../domain/TerraformPlan";
import { TerraformPlanBranch } from "../domain/TerraformPlanBranch";
import { TerraformPlanRepository } from "../domain/TerraformPlanRepository";
import { TerraformPlanStack } from "../domain/TerraformPlanStack";

export class TerraformPlanDynamoDBMapper extends Mapper<TerraformPlan> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public toDomain(raw: any): TerraformPlan {
    try {
      const planOrError = TerraformPlan.create(
        {
          branch: TerraformPlanBranch.create({ value: raw.branch }).getValue(),
          commit: raw.commit,
          component: TerraformPlanComponent.create({
            value: raw.component,
          }).getValue(),
          stack: TerraformPlanStack.create({
            value: raw.stack,
          }).getValue(),
          repository: TerraformPlanRepository.create({
            owner: raw.owner,
            name: raw.repository,
          }).getValue(),
          tainted: raw.tainted,
          contents: "",
        },
        new UniqueEntityId(raw.id)
      );

      if (planOrError.isFailure) {
        throw new Error("Error converting DynamoDB item to domain");
      }

      return planOrError.getValue();
    } catch (err) {
      console.log(JSON.stringify(err, null, 2));
      throw new Error("Error converting DynamoDB item to domain");
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public toPersistence(domain: TerraformPlan): any {
    const item = {
      id: { S: domain.id.toString() },
      branch: { S: domain.branch },
      commit: { S: domain.commit },
      component: { S: domain.component },
      hash: { S: domain.hash || "" },
      owner: { S: domain.owner },
      repository: { S: domain.repository },
      stack: { S: domain.stack },
      tainted: { BOOL: domain.tainted },
    };

    return item;
  }
}
