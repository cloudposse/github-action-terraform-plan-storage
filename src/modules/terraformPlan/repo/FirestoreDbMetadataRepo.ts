import { Firestore, CollectionReference, Timestamp } from "@google-cloud/firestore";
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
      credentials: gcpCredentials,
      ignoreUndefinedProperties: true
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
    try {
      const item = this.mapper.toPersistence(plan);
      
      // Add timestamp if not present
      if (!item.createdAt) {
        item.createdAt = Timestamp.now();
      }

      // Log the item being saved (for debugging)
      console.log('Attempting to save item:', JSON.stringify(item, null, 2));
      
      // Add document to collection
      const docRef = await this.collection.add(item);
      console.log('Document written with ID:', docRef.id);
      
    } catch (error: any) {
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        stack: error.stack
      });
      throw error;
    }
  }
}
