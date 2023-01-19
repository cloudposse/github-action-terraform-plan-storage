interface GetTerraformPlanDTO {
  commit?: string;
  component: string;
  isMergeCommit: boolean;
  planPath: string;
  pr?: number;
  repositoryName: string;
  repositoryOwner: string;
  stack: string;
}

export { GetTerraformPlanDTO };
