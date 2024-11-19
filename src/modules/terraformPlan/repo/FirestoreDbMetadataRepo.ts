import { Firestore, CollectionReference } from "@google-cloud/firestore";
import { IMetadataRepository, RepositoryErrors } from "@lib/repository";
import {
  TerraformPlan,
  TerraformPlanFirestoreMapper
} from "@modules/terraformPlan";

export class FirestoreDBMetadataRepo implements IMetadataRepository {
  private mapper = new TerraformPlanFirestoreMapper();
  private collection: CollectionReference;

  constructor(
    private firestore: Firestore, 
    collectionName: string, 
    gcpCredentials: {
      client_email?: string;
      private_key?: string;
    }
  ) {
    this.collection = this.firestore.collection(collectionName);
    this.firestore.settings({
      credentials: gcpCredentials
    });
  }

  public async loadByCommit(
    owner: string,
    repo: string,
    component: string,
    stack: string,
    commitSHA: string
  ): Promise<TerraformPlan> {
    const snapshot = await this.collection
      .where("repoOwner", "==", owner)
      .where("repoName", "==", repo)
      .where("commitSHA", "==", commitSHA)
      .where("component", "==", component)
      .where("stack", "==", stack)
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

    if (snapshot.empty) {
      throw new RepositoryErrors.PlanNotFoundError(component, stack, commitSHA);
    }

    return this.mapper.toDomain(snapshot.docs[0].data());
  }

  public async loadLatestForPR(
    owner: string,
    repo: string,
    component: string,
    stack: string,
    pr: number
  ): Promise<TerraformPlan> {
    const snapshot = await this.collection
      .where("repoOwner", "==", owner)
      .where("repoName", "==", repo)
      .where("pr", "==", pr)
      .where("component", "==", component)
      .where("stack", "==", stack)
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

    if (snapshot.empty) {
      throw new RepositoryErrors.PlanNotFoundError(
        component,
        stack,
        undefined,
        pr
      );
    }

    return this.mapper.toDomain(snapshot.docs[0].data());
  }

  public async save(plan: TerraformPlan): Promise<void> {
    const item = this.mapper.toPersistence(plan);
    await this.collection.add(item);
  }
}
