import { Readable } from "stream";

import { TerraformPlan } from "@modules/terraformPlan";

export interface IPlanRepository {
  load(
    repoOwner: string,
    repoName: string,
    component: string,
    stack: string,
    commitSHA: string
  ): Promise<Readable>;

  save(metadata: TerraformPlan): Promise<void>;
}
