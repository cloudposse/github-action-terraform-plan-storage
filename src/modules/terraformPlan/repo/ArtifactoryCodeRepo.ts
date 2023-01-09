import { ICodeRepository } from "@lib/repository";
import { TerraformPlan } from "@modules/terraformPlan";

export class ArtifactoryCodeRepo implements ICodeRepository {
  load(): Promise<TerraformPlan> {
    throw new Error("Method not implemented.");
  }
  save(metadata: TerraformPlan): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
