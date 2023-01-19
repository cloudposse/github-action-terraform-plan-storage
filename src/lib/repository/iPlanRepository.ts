import { TerraformPlan } from "@modules/terraformPlan";

export interface IPlanRepository {
  load(component: string, stack: string, commit: string): Promise<string>;

  save(metadata: TerraformPlan): Promise<void>;
}
