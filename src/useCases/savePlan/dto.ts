interface SaveTerraformPlanDTO {
  component: string;
  stack: string;
  owner: string;
  name: string;
  branch: string;
  commit: string;
  planPath: string;
}

export { SaveTerraformPlanDTO };
