<!-- markdownlint-disable -->

## Inputs

| Name | Description | Default | Required |
|------|-------------|---------|----------|
| action | which action to perform. Valid values are: 'storePlan', 'getPlan', 'taintPlan' | storePlan | true |
| blobAccountName | the name of the Azure Blob Storage account to store the plan file | N/A | false |
| blobContainerName | the name of the Azure Blob Storage container to store the plan file | N/A | false |
| bucketName | the name of the S3 bucket to store the plan file | terraform-plan-storage | false |
| commitSHA | Commit SHA to use for fetching plan |  | false |
| component | the name of the component corresponding to the plan file | N/A | false |
| cosmosConnectionString | the connection string to the CosmosDB account to store the metadata | N/A | false |
| cosmosContainerName | the name of the CosmosDB container to store the metadata | N/A | false |
| cosmosDatabaseName | the name of the CosmosDB database to store the metadata | N/A | false |
| cosmosEndpoint | the endpoint of the CosmosDB account to store the metadata | N/A | false |
| failOnMissingPlan | Fail if plan is missing | true | false |
| metadataRepositoryType | the type of repository where the plan file is stored. Valid values are: 'dynamo', 'cosmodb' | dynamo | false |
| planPath | path to the Terraform plan file. Required for 'storePlan' and 'getPlan' actions | N/A | false |
| planRepositoryType | the type of repository where the metadata is stored. Valid values are: 's3', 'azureblob' | s3 | false |
| stack | the name of the stack corresponding to the plan file | N/A | false |
| tableName | the name of the dynamodb table to store metadata | terraform-plan-storage | false |


## Outputs

| Name | Description |
|------|-------------|
<!-- markdownlint-restore -->
