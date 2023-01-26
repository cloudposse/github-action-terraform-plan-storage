import { TerraformPlan } from "@modules/terraformPlan";

export interface ICodeRepository {
  load(): Promise<TerraformPlan>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  save(metadata: TerraformPlan, code: any): Promise<void>;
}
