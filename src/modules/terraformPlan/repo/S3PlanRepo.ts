import {
  GetObjectCommand,
  GetObjectCommandInput,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";
import { IPlanRepository } from "@lib/repository";
import { RepositoryErrors } from "@lib/repository";
import { TerraformPlan } from "@modules/terraformPlan";

const getKey = (commit: string, component: string, stack: string) =>
  `${commit}/${component}/${stack}.tfplan`;

export class S3PlanRepo implements IPlanRepository {
  constructor(private s3: S3Client, private bucketName: string) {}

  public async load(
    commit: string,
    component: string,
    stack: string
  ): Promise<string> {
    const params: GetObjectCommandInput = {
      Bucket: this.bucketName,
      Key: getKey(commit, component, stack),
    };

    const command = new GetObjectCommand(params);
    const response = await this.s3.send(command);

    if (!response.Body)
      throw new RepositoryErrors.PlanNotFoundError(commit, component, stack);

    return response.Body.toString();
  }

  public async save(plan: TerraformPlan): Promise<void> {
    const { commitSHA: commit, component, contents, stack } = plan;
    const params: PutObjectCommandInput = {
      Bucket: this.bucketName,
      Key: getKey(commit, component, stack),
      Body: contents,
    };

    const command = new PutObjectCommand(params);
    await this.s3.send(command);
  }
}
