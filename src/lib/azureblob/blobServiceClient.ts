import { CosmosClient } from "@azure/cosmos";
import { DefaultAzureCredential } from "@azure/identity";
import { BlobServiceClient } from "@azure/storage-blob";

const blobServiceClient = (accountName: string) =>
  new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net`,
    new DefaultAzureCredential()
  );

const getDefaultBlobServiceClient = (accountName: string) => {
  if (!accountName) {
    throw new Error("accountName is required");
  }
  return blobServiceClient(accountName);
};

const getDefaultCosmosClient = (databaseEndpoint: string) => {
  if (!databaseEndpoint) {
    throw new Error("databaseEndpoint is required");
  }
  return new CosmosClient({
    endpoint: databaseEndpoint,
    aadCredentials: new DefaultAzureCredential()
  });
};

const getBlobServiceClient = (connectionString: string) => {
  if (!connectionString) {
    throw new Error("connectionString is required");
  }

  return BlobServiceClient.fromConnectionString(connectionString);
};

const getCosmosClient = (connectionString: string) => {
  if (!connectionString) {
    throw new Error("connectionString is required");
  }

  return new CosmosClient()
};

export {
  getDefaultBlobServiceClient,
  getDefaultCosmosClient,
  getBlobServiceClient
};
