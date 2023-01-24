import { TerraformPlan } from "@modules/terraformPlan";

export interface IPlanRepository {
  load(
    repoOwner: string,
    repoName: string,
    component: string,
    stack: string,
    commitSHA: string
  ): Promise<string>;

  save(metadata: TerraformPlan): Promise<void>;
}
