import { TerraformPlan } from "@modules/terraformPlan";

export interface IMetadataRepository {
  load(commit: string, component: string, stack:string): Promise<TerraformPlan>;
  save(plan: TerraformPlan): Promise<void>;
}
