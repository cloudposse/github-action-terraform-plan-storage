import { TerraformPlan } from "@modules/terraformPlan";

export interface IMetadataRepository {
  loadByCommit(
    component: string,
    stack: string,
    commit: string
  ): Promise<TerraformPlan>;

  loadLatestForPR(
    component: string,
    stack: string,
    pr: number
  ): Promise<TerraformPlan>;

  save(plan: TerraformPlan): Promise<void>;
}
