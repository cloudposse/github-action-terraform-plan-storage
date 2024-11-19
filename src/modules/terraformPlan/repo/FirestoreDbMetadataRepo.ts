import { Firestore, CollectionReference, Timestamp } from "@google-cloud/firestore";
import { IMetadataRepository, RepositoryErrors } from "@lib/repository";
import {
  TerraformPlan,
  TerraformPlanFirestoreMapper
} from "@modules/terraformPlan";

export class FirestoreDBMetadataRepo implements IMetadataRepository {
  private mapper = new TerraformPlanFirestoreMapper();
  private collection: CollectionReference;
  private firestore: Firestore;

  constructor(
    projectId: string,
    collectionName: string, 
    gcpCredentials: {
      client_email?: string;
      private_key?: string;
    }
  ) {
    // Initialize Firestore
    this.firestore = new Firestore({
      projectId: projectId,
      credentials: gcpCredentials,
      ignoreUndefinedProperties: true
    });

    // Initialize collection
    this.collection = this.firestore.collection(collectionName);

    // Log initialization details
    console.log('Initializing Firestore with:', {
      projectId,
      collectionName,
      hasCredentials: !!gcpCredentials
    });

    // Test connection
    this.collection.limit(1).get()
      .then(() => console.log('Successfully connected to Firestore'))
      .catch(err => console.error('Failed to connect to Firestore:', err));
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

      console.log('Collection path:', this.collection.path);
      
      const docRef = this.collection.doc(item.id);
      await docRef.set(item);
      
      console.log('Document written with ID:', docRef.id);
      
    } catch (error: any) {
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        stack: error.stack,
        collectionPath: this.collection.path
      });
      throw error;
    }
  }
}
