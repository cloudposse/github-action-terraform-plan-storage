import { TerraformPlan } from "@modules/terraformPlan";

export interface IPlanRepository {
  load(commit: string, component: string, stack: string): Promise<string>;
  save(metadata: TerraformPlan): Promise<void>;
}
