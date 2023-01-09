import * as core from "@actions/core";
import { dynamoClient } from "@lib/dynamo";
import {
  ArtifactoryCodeRepo,
  DynamoDBMetadataRepo,
  S3PlanRepo,
} from "@lib/repository";
import { s3Client } from "@lib/s3/s3Client";
import {
  TaintPlanGitHubController,
  TaintTerraformPlanUseCase,
} from "@useCases/taintPlan";

export async function taintPlan() {
  try {
    const tableName = core.getInput("tableName");
    const bucketName = core.getInput("bucketName");

    const metadataRepo = new DynamoDBMetadataRepo(dynamoClient, tableName);
    const planRepo = new S3PlanRepo(s3Client, bucketName);
    const codeRepo = new ArtifactoryCodeRepo();

    const useCase = new TaintTerraformPlanUseCase(
      metadataRepo,
      planRepo,
      codeRepo
    );

    const controller = new TaintPlanGitHubController(useCase);

    await controller.execute();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    core.setFailed(error);
  }
}
