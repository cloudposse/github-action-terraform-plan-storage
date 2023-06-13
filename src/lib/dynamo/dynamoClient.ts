import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

// Set the AWS Region.
const REGION =
  process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || "us-east-1";

const dynamoClient = new DynamoDBClient({ region: REGION });

// const marshallOptions = {
//   // Whether to automatically convert empty strings, blobs, and sets to `null`.
//   convertEmptyValues: false, // false, by default.
//   // Whether to remove undefined values while marshalling.
//   removeUndefinedValues: true, // false, by default.
//   // Whether to convert typeof object to map attribute.
//   convertClassInstanceToMap: false, // false, by default.
// };

// const unmarshallOptions = {
//   // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
//   wrapNumbers: false, // false, by default.
// };

// const dynamoDocClient = DynamoDBDocumentClient.from(dynamoClient, {
//   marshallOptions,
//   unmarshallOptions,
// });

const dynamoDocClient = DynamoDBDocumentClient.from(dynamoClient);

export { dynamoClient, dynamoDocClient };
