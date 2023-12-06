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

const getKey = (
  repoOwner: string,
  repoName: string,
  commitSHA: string,
  component: string,
  stack: string
) => `${repoOwner}/${repoName}/${commitSHA}/${component}/${stack}.tfplan`;

export class S3PlanRepo implements IPlanRepository {
  constructor(private s3: S3Client, private bucketName: string) {}

  public async load(
    repoOwner: string,
    repoName: string,
    component: string,
    stack: string,
    commitSHA: string
  ): Promise<Uint8Array> {
    const params: GetObjectCommandInput = {
      Bucket: this.bucketName,
      Key: getKey(repoOwner, repoName, commitSHA, component, stack),
    };

    const command = new GetObjectCommand(params);
    const response = await this.s3.send(command);

    if (response.$metadata.httpStatusCode !== 200)
      throw new RepositoryErrors.PlanNotFoundError(commitSHA, component, stack);

    if (!response.Body)
      throw new RepositoryErrors.PlanNotFoundError(commitSHA, component, stack + "Http status code: " + response.$metadata.httpStatusCode);

    return await response.Body.transformToByteArray()
  }

  public async save(plan: TerraformPlan): Promise<void> {
    const { repoOwner, repoName, commitSHA, component, contents, stack } = plan;
    const params: PutObjectCommandInput = {
      Bucket: this.bucketName,
      Key: getKey(repoOwner, repoName, commitSHA, component, stack),
      Body: contents,
      ContentEncoding: "utf-8",
    };

    const command = new PutObjectCommand(params);
    await this.s3.send(command);
  }
}
