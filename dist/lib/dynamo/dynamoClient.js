"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dynamoClient = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
// Set the AWS Region.
const REGION = process.env.AWS_REGION || "us-east-1";
const dynamoClient = new client_dynamodb_1.DynamoDBClient({ region: REGION });
exports.dynamoClient = dynamoClient;
