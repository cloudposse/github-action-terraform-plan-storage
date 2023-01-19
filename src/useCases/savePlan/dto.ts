interface SaveTerraformPlanDTO {
  branch: string;
  commit: string;
  component: string;
  planPath: string;
  pr: number;
  repositoryOwner: string;
  repositoryName: string;
  stack: string;
}

export { SaveTerraformPlanDTO };
