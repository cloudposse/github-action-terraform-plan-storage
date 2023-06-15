import * as core from "@actions/core";
import { dynamoClient } from "@lib/dynamo";
import {
  ArtifactoryCodeRepo,
  DynamoDBMetadataRepo,
  S3PlanRepo,
} from "@lib/repository";
import { s3Client } from "@lib/s3/s3Client";
import {
  SavePlanGitHubController,
  SaveTerraformPlanUseCase,
} from "@useCases/savePlan";

export async function storePlan() {
  try {
    const tableName = core.getInput("tableName");
    const bucketName = core.getInput("bucketName");

    core.debug(`tableName: ${tableName}`);
    core.debug(`bucketName: ${bucketName}`);

    const metadataRepo = new DynamoDBMetadataRepo(dynamoClient, tableName);
    const planRepo = new S3PlanRepo(s3Client, bucketName);

    const codeRepo = new ArtifactoryCodeRepo();

    const useCase = new SaveTerraformPlanUseCase(
      metadataRepo,
      planRepo,
      codeRepo
    );

    const controller = new SavePlanGitHubController(useCase);

    await controller.execute();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    core.setFailed(error);
  }
}
