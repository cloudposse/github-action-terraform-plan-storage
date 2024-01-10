import * as core from "@actions/core";
import { Container } from "@azure/cosmos";
import { IMetadataRepository, RepositoryErrors } from "@lib/repository";
import {
  TerraformPlan,
  TerraformPlanCosmosDBMapper
} from "@modules/terraformPlan";

export class CosmosDBMetadataRepo implements IMetadataRepository {
  private mapper = new TerraformPlanCosmosDBMapper();

  constructor(private container: Container) {}

  public async loadByCommit(
    owner: string,
    repo: string,
    component: string,
    stack: string,
    commitSHA: string
  ): Promise<TerraformPlan> {
    const query = `SELECT * FROM c WHERE c.repoOwner='${owner}' AND c.repoName='${repo}' AND c.commitSHA='${commitSHA}' AND c.component='${component}' AND c.stack='${stack}' ORDER BY c.createdAt DESC OFFFSET 0 LIMIT 1`;
    core.debug(`running query ${query}`);
    const { resources } = await this.container.items.query(query).fetchAll();

    if (resources.length === 0) {
      throw new RepositoryErrors.PlanNotFoundError(component, stack, commitSHA);
    }

    return this.mapper.toDomain(resources[0]);
  }

  public async loadLatestForPR(
    owner: string,
    repo: string,
    component: string,
    stack: string,
    pr: number
  ): Promise<TerraformPlan> {
    const query = `SELECT * FROM c WHERE c.repoOwner='${owner}' AND c.repoName='${repo}' AND c.pr='${pr}' AND c.component='${component}' AND c.stack='${stack}' ORDER BY c.createdAt DESC OFFSET 0 LIMIT 1`;
    const { resources } = await this.container.items.query(query).fetchAll();

    if (resources.length === 0) {
      throw new RepositoryErrors.PlanNotFoundError(
        component,
        stack,
        undefined,
        pr
      );
    }

    return this.mapper.toDomain(resources[0]);
  }

  public async save(plan: TerraformPlan): Promise<void> {
    const item = this.mapper.toPersistence(plan);
    await this.container.items.create(item);
  }
}
