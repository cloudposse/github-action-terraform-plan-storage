import { TerraformPlanBranch } from "./TerraformPlanBranch";
import { TerraformPlanCommit } from "./TerraformPlanCommit";
import { TerraformPlanComponent } from "./TerraformPlanComponent";
import { TerraformPlanPR } from "./TerraformPlanPR";
import { TerraformPlanRepository } from "./TerraformPlanRepository";
import { TerraformPlanStack } from "./TerraformPlanStack";

export interface TerraformPlanProps {
  branch: TerraformPlanBranch;
  commitSHA: TerraformPlanCommit;
  component: TerraformPlanComponent;
  contents: string;
  dateTimeCreated?: Date;
  contentsHash?: string;
  pr: TerraformPlanPR;
  repository: TerraformPlanRepository;
  stack: TerraformPlanStack;
  tainted: boolean;
}
