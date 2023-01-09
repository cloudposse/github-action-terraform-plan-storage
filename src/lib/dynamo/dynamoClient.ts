import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
// Set the AWS Region.
const REGION =
  process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || "us-east-1";

const dynamoClient = new DynamoDBClient({ region: REGION });
export { dynamoClient };
