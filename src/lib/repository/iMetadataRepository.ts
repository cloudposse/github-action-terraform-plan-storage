import { TerraformPlan } from "@modules/terraformPlan";

export interface IMetadataRepository {
  loadByCommit(
    owner: string,
    repo: string,
    component: string,
    stack: string,
    commit: string
  ): Promise<TerraformPlan>;

  loadLatestForPR(
    owner: string,
    repo: string,
    component: string,
    stack: string,
    pr: number
  ): Promise<TerraformPlan>;

  save(plan: TerraformPlan): Promise<void>;
}
