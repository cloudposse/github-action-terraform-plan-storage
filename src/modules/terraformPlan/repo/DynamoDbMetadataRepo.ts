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

export class DynamoDBMetadataRepo implements IMetadataRepository {
  private mapper = new TerraformPlanDynamoDBMapper();
  constructor(private dynamo: DynamoDBClient, private tableName: string) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async load(
    commit: string,
    component: string,
    stack: string
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
      ProjectionExpression:
        "branch, commit, component, hash, owner, repository, stack, tainted",
    };

    const command = new ScanCommand(params);
    const response = await this.dynamo.send(command);

    if (!response.Items || response.Items.length === 0) {
      throw new RepositoryErrors.PlanNotFoundError(commit, component, stack);
    }

    console.log("*****", response.Items[0]);
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
