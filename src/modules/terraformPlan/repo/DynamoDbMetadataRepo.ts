import {
  DynamoDBDocumentClient,
  ScanCommandInput,
  ScanCommand,
  QueryCommandInput,
  PutCommand,
  PutCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { IMetadataRepository, RepositoryErrors } from "@lib/repository";
import {
  TerraformPlan,
  TerraformPlanDynamoDBMapper,
} from "@modules/terraformPlan";

const projectionExpression =
  "id, branch, commitSHA, component, contentsHash, repoOwner, pr, repoName, stack, tainted, createdAt";

export class DynamoDBMetadataRepo implements IMetadataRepository {
  private mapper = new TerraformPlanDynamoDBMapper();
  constructor(
    private dynamo: DynamoDBDocumentClient,
    private tableName: string
  ) {}

  public async loadByCommit(
    component: string,
    stack: string,
    commitSHA: string
  ): Promise<TerraformPlan> {
    const params: ScanCommandInput = {
      TableName: this.tableName,
      FilterExpression:
        "#commitSHA = :commitSHA and #component = :component and #stack = :stack",
      ExpressionAttributeNames: {
        "#commitSHA": "commitSHA",
        "#component": "component",
        "#stack": "stack",
      },
      ExpressionAttributeValues: {
        ":commitSHA": commitSHA,
        ":component": component,
        ":stack": stack,
      },
      ProjectionExpression: projectionExpression,
    };

    const command = new ScanCommand(params);
    const response = await this.dynamo.send(command);

    if (!response.Items || response.Items.length === 0) {
      throw new RepositoryErrors.PlanNotFoundError(component, stack, commitSHA);
    }

    const itemsReturned = response.Items.length;

    return this.mapper.toDomain(response.Items[itemsReturned - 1]);
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
        ":pr": pr,
        ":component": component,
        ":stack": stack,
      },
      ProjectionExpression: projectionExpression,
      Limit: 1,
      IndexName: "id-createdAt-index",
      ScanIndexForward: false,
    };

    const command = new ScanCommand(params);
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
    const params: PutCommandInput = {
      TableName: this.tableName,
      Item: item,
    };

    const command = new PutCommand(params);
    await this.dynamo.send(command);
  }
}
