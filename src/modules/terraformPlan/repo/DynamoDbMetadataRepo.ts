import {
  DynamoDBClient,
  PutItemCommand,
  PutItemCommandInput,
  QueryCommand,
  QueryCommandInput,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { IMetadataRepository, RepositoryErrors } from "@lib/repository";
import {
  TerraformPlan,
  TerraformPlanDynamoDBMapper,
} from "@modules/terraformPlan";

const projectionExpression =
  "branch, commit, component, hash, owner, pr, repository, stack, tainted";

export class DynamoDBMetadataRepo implements IMetadataRepository {
  private mapper = new TerraformPlanDynamoDBMapper();
  constructor(private dynamo: DynamoDBClient, private tableName: string) {}

  public async loadByCommit(
    component: string,
    stack: string,
    commit: string
  ): Promise<TerraformPlan> {
    const params: QueryCommandInput = {
      TableName: this.tableName,
      FilterExpression:
        "#commit = :commit and #component = :component and #stack = :stack",
      ExpressionAttributeNames: {
        "#commit": "commit",
        "#component": "component",
        "#stack": "stack",
      },
      ExpressionAttributeValues: {
        ":commit": { S: commit },
        ":component": { S: component },
        ":stack": { S: stack },
      },
      ProjectionExpression: projectionExpression,
      Limit: 1,
    };

    const command = new ScanCommand(params);
    const response = await this.dynamo.send(command);

    if (!response.Items || response.Items.length === 0) {
      throw new RepositoryErrors.PlanNotFoundError(component, stack, commit);
    }

    return this.mapper.toDomain(response.Items[0]);
  }

  public async loadLatestForPR(
    component: string,
    stack: string,
    pr: number
  ): Promise<TerraformPlan> {
    const params: QueryCommandInput = {
      TableName: this.tableName,
      FilterExpression:
        "#pr = :pr and #component = :component and #stack = :stack",
      ExpressionAttributeNames: {
        "#pr": "pr",
        "#component": "component",
        "#stack": "stack",
      },
      ExpressionAttributeValues: {
        ":pr": { N: `${pr}` },
        ":component": { S: component },
        ":stack": { S: stack },
      },
      ProjectionExpression: projectionExpression,
      Limit: 1,
      IndexName: "id-timestamp-index",
      ScanIndexForward: false,
    };

    const command = new QueryCommand(params);
    const response = await this.dynamo.send(command);

    if (!response.Items || response.Items.length === 0) {
      throw new RepositoryErrors.PlanNotFoundError(
        component,
        stack,
        undefined,
        pr
      );
    }

    return this.mapper.toDomain(response.Items[0]);
  }

  public async save(plan: TerraformPlan): Promise<void> {
    const item = this.mapper.toPersistence(plan);
    const params: PutItemCommandInput = {
      TableName: this.tableName,
      Item: item,
    };

    const command = new PutItemCommand(params);
    await this.dynamo.send(command);
  }
}