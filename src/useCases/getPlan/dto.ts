interface GetTerraformPlanDTO {
  commitSHA: string;
  component: string;
  isMergeCommit: boolean;
  planPath: string;
  pr?: number;
  repoName: string;
  repoOwner: string;
  stack: string;
}

export { GetTerraformPlanDTO };
