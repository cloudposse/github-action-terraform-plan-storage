import { BlobServiceClient } from "@azure/storage-blob";
import { IPlanRepository, RepositoryErrors } from "@lib/repository";
import { TerraformPlan } from "@modules/terraformPlan";

const getKey = (
  repoOwner: string,
  repoName: string,
  commitSHA: string,
  component: string,
  stack: string
) => `${repoOwner}/${repoName}/${commitSHA}/${component}/${stack}.tfplan`;

export class AzureBlobPlanRepo implements IPlanRepository {
  constructor(
    private blobClient: BlobServiceClient,
    private containerName: string
  ) {}

  public async load(
    repoOwner: string,
    repoName: string,
    component: string,
    stack: string,
    commitSHA: string
  ): Promise<Uint8Array> {
    const blobName = getKey(repoOwner, repoName, commitSHA, component, stack);
    const containerClient = this.blobClient.getContainerClient(
      this.containerName
    );
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const response = await blockBlobClient.downloadToBuffer();

    if (response?.length < 1) {
      throw new RepositoryErrors.PlanNotFoundError(commitSHA, component, stack);
    }

    return response;
  }

  public async save(plan: TerraformPlan): Promise<void> {
    const { repoOwner, repoName, commitSHA, component, contents, stack } = plan;
    const blobName = getKey(repoOwner, repoName, commitSHA, component, stack);

    const containerClient = this.blobClient.getContainerClient(
      this.containerName
    );
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(contents);
  }
}
