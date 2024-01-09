console.log("Hello, World!");

import {
  BlobServiceClient,
  StorageSharedKeyCredential
} from "@azure/storage-blob";

async function uploadFileToBlobStorage(
  accountName: string,
  accountKey: string,
  containerName: string,
  blobName: string,
  filePath: string
) {
  // Create a BlobServiceClient
  const sharedKeyCredential = new StorageSharedKeyCredential(
    accountName,
    accountKey
  );
  const blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net`,
    sharedKeyCredential
  );

  // Get a reference to a container
  const containerClient = blobServiceClient.getContainerClient(containerName);

  // Get a reference to a block blob
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  // Upload data to the blob
  const uploadBlobResponse = await blockBlobClient.uploadFile(filePath);
  console.log(
    `Upload block blob ${blobName} successfully`,
    uploadBlobResponse.requestId
  );
}

// Use the function
uploadFileToBlobStorage(
  "<your_account_name>",
  "<your_account_key>",
  "<your_container_name>",
  "example.txt",
  "path/to/your/file.txt"
);
