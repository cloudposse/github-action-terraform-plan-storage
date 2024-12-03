import { Storage } from "@google-cloud/storage";
import { IPlanRepository, RepositoryErrors } from "@lib/repository";
import { TerraformPlan } from "@modules/terraformPlan";

const getKey = (
  repoOwner: string,
  repoName: string,
  commitSHA: string,
  component: string,
  stack: string
) => `${repoOwner}/${repoName}/${commitSHA}/${component}/${stack}.tfplan`;

export class GcsPlanRepo implements IPlanRepository {
  constructor(
    private storage: Storage,
    private bucketName: string
  ) {}

  public async load(
    repoOwner: string,
    repoName: string,
    component: string,
    stack: string,
    commitSHA: string
  ): Promise<Uint8Array> {
    const blobName = getKey(repoOwner, repoName, commitSHA, component, stack);
    const bucket = this.storage.bucket(this.bucketName);
    const file = bucket.file(blobName);

    try {
      const [contents] = await file.download();
      
      if (!contents || contents.length < 1) {
        throw new RepositoryErrors.PlanNotFoundError(commitSHA, component, stack);
      }

      return new Uint8Array(contents);
    } catch (error) {
      throw new RepositoryErrors.PlanNotFoundError(commitSHA, component, stack);
    }
  }

  public async save(plan: TerraformPlan): Promise<void> {
    const { repoOwner, repoName, commitSHA, component, contents, stack } = plan;
    const blobName = getKey(repoOwner, repoName, commitSHA, component, stack);

    const bucket = this.storage.bucket(this.bucketName);
    const file = bucket.file(blobName);

    await file.save(contents);
  }
}
