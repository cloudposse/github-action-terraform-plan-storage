import * as core from "@actions/core";
import { dynamoClient } from "@lib/dynamo";
import {
  ArtifactoryCodeRepo,
  DynamoDBMetadataRepo,
  S3PlanRepo,
} from "@lib/repository";
import { s3Client } from "@lib/s3/s3Client";
import {
  GetPlanGitHubController,
  GetTerraformPlanUseCase,
} from "@useCases/getPlan";

export async function getPlan() {
  try {
    const tableName = core.getInput("tableName");
    const bucketName = core.getInput("bucketName");
    const metadataRepo = new DynamoDBMetadataRepo(dynamoClient, tableName);
    const planRepo = new S3PlanRepo(s3Client, bucketName);

    const useCase = new GetTerraformPlanUseCase(
      metadataRepo,
      planRepo,
      undefined
    );

    const controller = new GetPlanGitHubController(useCase);

    await controller.execute();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    core.setFailed(error);
  }
}
