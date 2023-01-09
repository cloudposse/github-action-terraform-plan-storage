import { TerraformPlanBranch } from "./TerraformPlanBranch";
import { TerraformPlanCommit } from "./TerraformPlanCommit";
import { TerraformPlanComponent } from "./TerraformPlanComponent";
import { TerraformPlanRepository } from "./TerraformPlanRepository";
import { TerraformPlanStack } from "./TerraformPlanStack";

export interface TerraformPlanProps {
  component: TerraformPlanComponent;
  stack: TerraformPlanStack;
  repository: TerraformPlanRepository;
  branch: TerraformPlanBranch;
  commit: TerraformPlanCommit;
  tainted: boolean;
  contents: string;
  hash?: string;
  dateTimeCreated?: string | Date;
}
