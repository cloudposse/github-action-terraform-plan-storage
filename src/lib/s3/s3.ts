import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

import { s3Client } from "./s3Client";

export const buildKey = (
  repository: string,
  branch: string,
  commit: string,
  hash: string
): string => [repository, branch, commit, hash].join("/");

export const storeInS3 = async (
  bucketName: string,
  key: string,
  body: string
) => {
  const params = {
    Bucket: bucketName,
    Key: key,
    Body: body,
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);
};

export const retrieveFromS3 = async (
  bucketName: string,
  key: string,
  body: string
): Promise<string | undefined> => {
  const params = {
    Bucket: bucketName,
    Key: key,
    Body: body,
  };

  const command = new GetObjectCommand(params);
  const result = await s3Client.send(command);
  const contents = await result?.Body?.transformToString();
  
  return contents;
};
