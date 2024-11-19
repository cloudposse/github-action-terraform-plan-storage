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
    const databaseId = 'terraform-plan-metadata';
    // Initialize Firestore with database name
    this.firestore = new Firestore({
      projectId: projectId,
      credentials: gcpCredentials,
      databaseId: databaseId, // Explicitly specify default database
      ignoreUndefinedProperties: true
    });

    // Initialize collection with full path
    this.collection = this.firestore.collection(`projects/${projectId}/databases/${databaseId}/documents/${collectionName}`);
    
    console.log('Initializing Firestore with:', {
      projectId,
      collectionName,
      hasCredentials: !!gcpCredentials,
      collectionPath: this.collection.path
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
      
      // Ensure createdAt is a Firestore timestamp
      if (!item.createdAt) {
        item.createdAt = Timestamp.now();
      }

      // Create a new document with auto-generated ID
      const batch = this.firestore.batch();
      const docRef = this.collection.doc();
      
      console.log('Attempting to save document with path:', docRef.path);
      
      batch.set(docRef, {
        ...item,
        _id: docRef.id, // Add document ID to the data
        _createdAt: Timestamp.now() // Add server timestamp
      });

      await batch.commit();
      
      console.log('Successfully saved document with ID:', docRef.id);
      
    } catch (error: any) {
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        stack: error.stack,
        collectionPath: this.collection.path
      });
      
      // Add more specific error handling
      if (error.code === 5) { // NOT_FOUND
        console.error('Collection or document not found. Verify collection path and permissions.');
      }
      
      throw error;
    }
  }
}
