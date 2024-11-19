import * as core from "@actions/core";
import { Storage } from "@google-cloud/storage";
import {
  getBlobServiceClient,
  getCosmosDBContainer,
  getDefaultBlobServiceClient
} from "@lib/azureblob/blobServiceClient";
import { dynamoClient } from "@lib/dynamo";
import {
  DynamoDBMetadataRepo,
  IMetadataRepository,
  IPlanRepository,
  S3PlanRepo
} from "@lib/repository";
import { s3Client } from "@lib/s3/s3Client";
import { AzureBlobPlanRepo } from "@modules/terraformPlan/repo/AzureBlobPlanRepo";
import { CosmosDBMetadataRepo } from "@modules/terraformPlan/repo/CosmosDbMetadataRepo";
import { FirestoreDBMetadataRepo } from "@modules/terraformPlan/repo/FirestoreDbMetadataRepo";
import { GcsPlanRepo } from "@modules/terraformPlan/repo/GcsPlanRepo";

export const getMetadataRepo = (): IMetadataRepository => {
  const tableName = core.getInput("tableName");

  const metaDataRepoType = core.getInput("metadataRepositoryType");
  core.debug(`metadataRepositoryType: ${metaDataRepoType}`);

  switch (metaDataRepoType) {
    case "dynamo":
      return new DynamoDBMetadataRepo(dynamoClient, tableName);
      break;
    case "cosmos": {
      const cosmosConnectionString = core.getInput("cosmosConnectionString");
      const cosmosContainerName = core.getInput("cosmosContainerName");
      const cosmosDatabaseName = core.getInput("cosmosDatabaseName");
      const cosmosEndpoint = core.getInput("cosmosEndpoint");

      core.debug(`cosmosConnectionString: ${cosmosConnectionString}`);
      core.debug(`cosmosContainerName: ${cosmosContainerName}`);
      core.debug(`cosmosDatabaseName: ${cosmosDatabaseName}`);
      core.debug(`cosmosEndpoint: ${cosmosEndpoint}`);

      if (!cosmosContainerName) {
        throw new Error("cosmosContainerName is required");
      }

      const container = getCosmosDBContainer(
        cosmosEndpoint,
        cosmosContainerName,
        cosmosDatabaseName,
        cosmosConnectionString
      );

      return new CosmosDBMetadataRepo(container);
      break;
    }
    case "firestore": {
      const gcpProjectId = core.getInput("gcpProjectId");
      const gcpCredentials = core.getInput("gcpCredentials");
      const firestoreCollectionName = core.getInput("firestoreCollectionName");

      core.debug(`gcpProjectId: ${gcpProjectId}`);
      core.debug(`firestoreCollectionName: ${firestoreCollectionName}`);

      if (!gcpProjectId) {
        throw new Error("gcpProjectId is required");
      }
      if (!gcpCredentials) {
        throw new Error("gcpCredentials is required");
      }
      if (!firestoreCollectionName) {
        throw new Error("firestoreCollectionName is required");
      }

      return new FirestoreDBMetadataRepo(gcpProjectId, firestoreCollectionName, JSON.parse(gcpCredentials));
      break;
    }
    default:
      throw new Error(`Invalid metadata repository type: ${metaDataRepoType}`);
  }
};

export const getPlanRepo = (): IPlanRepository => {
  const bucketName = core.getInput("bucketName");
  const planRepoType = core.getInput("planRepositoryType");

  core.debug(`planRepositoryType: ${planRepoType}`);
  core.debug(`bucketName: ${bucketName}`);

  switch (planRepoType.toLowerCase()) {
    case "s3":
      return new S3PlanRepo(s3Client, bucketName);
      break;
    case "azureblob": {
      const accountName = core.getInput("blobAccountName");
      const blobContainerName = core.getInput("blobContainerName");
      const blobConnectionString = core.getInput("blobConnectionString");

      core.debug(`blobAccountName: ${accountName}`);
      core.debug(`blobContainerName: ${blobContainerName}`);
      core.debug(`blobConnectionString: ${blobConnectionString}`);

      if (!accountName) {
        throw new Error("blobAccountName is required");
      }

      if (!blobContainerName) {
        throw new Error("blobContainerName is required");
      }

      const useDefault = !blobConnectionString;
      const client = useDefault
        ? getDefaultBlobServiceClient(accountName)
        : getBlobServiceClient(blobConnectionString);

      return new AzureBlobPlanRepo(client, blobContainerName);
      break;
    }
    case "gcs": {
      const gcpProjectId = core.getInput("gcpProjectId");
      const gcpCredentials = core.getInput("gcpCredentials");

      core.debug(`gcpProjectId: ${gcpProjectId}`);

      if (!gcpProjectId) {
        throw new Error("gcpProjectId is required");
      }
      if (!gcpCredentials) {
        throw new Error("gcpCredentials is required");
      }

      const client = new Storage({
        projectId: gcpProjectId,
        credentials: JSON.parse(gcpCredentials)
      });

      return new GcsPlanRepo(client, bucketName);
    }
    default:
      throw new Error(`Invalid plan repository type: ${planRepoType}`);
  }
};
