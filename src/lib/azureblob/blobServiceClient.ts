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
  return new CosmosClient({
    endpoint: databaseEndpoint,
    aadCredentials: new DefaultAzureCredential()
  });
};

const getCosmosClient = (connectionString: string) => {
  return new CosmosClient(connectionString);
};

const getCosmosDBContainer = (
  endpoint: string,
  container: string,
  database: string,
  connectionString?: string
) => {
  const client = connectionString
    ? getCosmosClient(connectionString)
    : getDefaultCosmosClient(endpoint);
  return client.database(database).container(container);
};

const getBlobServiceClient = (connectionString: string) => {
  if (!connectionString) {
    throw new Error("connectionString is required");
  }

  return BlobServiceClient.fromConnectionString(connectionString);
};

export {
  getCosmosDBContainer,
  getDefaultBlobServiceClient,
  getDefaultCosmosClient,
  getBlobServiceClient
};
