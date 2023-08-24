<!-- markdownlint-disable -->

## Inputs

| Name | Description | Default | Required |
|------|-------------|---------|----------|
| action | which action to perform. Valid values are: 'storePlan', 'getPlan', 'taintPlan' | storePlan | true |
| bucketName | the name of the S3 bucket to store the plan file | terraform-plan-storage | true |
| commitSHA | Commit SHA to use for fetching plan |  | false |
| component | the name of the component corresponding to the plan file | N/A | false |
| failOnMissingPlan | Fail if plan is missing | true | false |
| planPath | path to the Terraform plan file. Required for 'storePlan' and 'getPlan' actions | N/A | false |
| stack | the name of the stack corresponding to the plan file | N/A | false |
| tableName | the name of the dynamodb table to store metadata | terraform-plan-storage | true |


## Outputs

| Name | Description |
|------|-------------|
<!-- markdownlint-restore -->
