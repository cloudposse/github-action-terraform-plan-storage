import * as core from "@actions/core";
import { dynamoDocClient } from "@lib/dynamo";
import { DynamoDBMetadataRepo, S3PlanRepo } from "@lib/repository";
import { s3Client } from "@lib/s3/s3Client";
import {
  SavePlanGitHubController,
  SaveTerraformPlanUseCase,
} from "@useCases/savePlan";

export async function storePlan() {
  try {
    const tableName = core.getInput("tableName");
    const bucketName = core.getInput("bucketName");

    core.debug(`got tableName: ${tableName}`);
    core.debug(`got bucketName: ${bucketName}`);

    const metadataRepo = new DynamoDBMetadataRepo(dynamoDocClient, tableName);
    const planRepo = new S3PlanRepo(s3Client, bucketName);

    const useCase = new SaveTerraformPlanUseCase(
      metadataRepo,
      planRepo,
      undefined
    );

    const controller = new SavePlanGitHubController(useCase);

    await controller.execute();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    core.setFailed(error);
  }
}
