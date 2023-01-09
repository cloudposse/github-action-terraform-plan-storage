interface GetTerraformPlanDTO {
  commit: string;
  component: string;
  stack: string;
  planPath: string;
}

export { GetTerraformPlanDTO };
