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
    databaseName: string,
  ) {
    // Initialize Firestore
    this.firestore = new Firestore({
      projectId: projectId,
      databaseId: databaseName, // Specify your database ID
      ignoreUndefinedProperties: true
    });

    // Initialize collection (use simple path)
    this.collection = this.firestore.collection(collectionName);

    // Replace createCompositeIndexes with checkIndexes
    this.checkIndexes(collectionName);

    console.log('Initializing Firestore with:', {
      projectId,
      collectionName,
      collectionPath: this.collection.path,
      databaseId: databaseName
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

      // Create a new document with auto-generated ID
      const docRef = this.collection.doc();
      console.log('Attempting to save document with path:', docRef.path);
      
      await docRef.set({
        ...item,
        _id: docRef.id,
        _createdAt: Timestamp.now(),
        ttl: Timestamp.fromDate(new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)))
      });
      
      console.log('Successfully saved document with ID:', docRef.id);
      
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

  private async checkIndexes(collectionName: string) {
    try {
      // Test queries that require indexes
      const testQueries = [
        this.collection
          .where("repoOwner", "==", "test")
          .where("repoName", "==", "test")
          .where("commitSHA", "==", "test")
          .where("component", "==", "test")
          .where("stack", "==", "test")
          .orderBy("createdAt", "desc")
          .limit(1),
        
        this.collection
          .where("repoOwner", "==", "test")
          .where("repoName", "==", "test")
          .where("pr", "==", 1)
          .where("component", "==", "test")
          .where("stack", "==", "test")
          .orderBy("createdAt", "desc")
          .limit(1)
      ];

      await Promise.all(testQueries.map(q => q.get()));
      console.log('All required indexes are available');
    } catch (error: any) {
      // Check both error codes that Firestore might return
      if (error.code === 9 || error.code === 'failed-precondition') {
        const indexUrl = error.details?.match(/https:\/\/console\.firebase\.google\.com[^\s]*/)?.[0] || '';
        console.warn(`
Missing required indexes. Please create them using one of these methods:

1. Using Firebase Console (click this link):
${indexUrl}

2. Or using CLI with firestore.indexes.json:
{
  "indexes": [
    {
      "collectionGroup": "${collectionName}",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "repoOwner", "order": "ASCENDING" },
        { "fieldPath": "repoName", "order": "ASCENDING" },
        { "fieldPath": "commitSHA", "order": "ASCENDING" },
        { "fieldPath": "component", "order": "ASCENDING" },
        { "fieldPath": "stack", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "${collectionName}",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "repoOwner", "order": "ASCENDING" },
        { "fieldPath": "repoName", "order": "ASCENDING" },
        { "fieldPath": "pr", "order": "ASCENDING" },
        { "fieldPath": "component", "order": "ASCENDING" },
        { "fieldPath": "stack", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    }
  ],
  "fieldOverrides": [
    {
      "collectionGroup": "${collectionName}",
      "fieldPath": "ttl",
      "ttl": true,
      "indexes": [
        {
          "order": "ASCENDING",
          "queryScope": "COLLECTION"
        },
        {
          "order": "DESCENDING",
          "queryScope": "COLLECTION"
        },
        {
          "arrayConfig": "CONTAINS",
          "queryScope": "COLLECTION"
        }
      ]
    }
  ]
}

3. Deploy using: firebase deploy --only firestore:indexes
`);
        // Don't throw the error, just warn
        return;
      }
      console.error('Unexpected error checking indexes:', error);
    }
  }
}
