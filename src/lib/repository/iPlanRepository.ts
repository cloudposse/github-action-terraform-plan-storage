import { TerraformPlan } from "@modules/terraformPlan";

export interface IPlanRepository {
  load(
    repoOwner: string,
    repoName: string,
    component: string,
    stack: string,
    commitSHA: string
  ): Promise<Uint8Array>;

  save(metadata: TerraformPlan): Promise<void>;
}
