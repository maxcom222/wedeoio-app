import * as functions from 'firebase-functions';
import regionalFunctions from '../regionalFunctions';
import { algoliaSearch } from '../config';

const indexing = (index, change) => {
  const oldData = change.before;
  const newData = change.after;
  const data = newData.data();
  const objectID = newData.id;

  if (!oldData.exists && newData.exists) {
    return index.saveObject({ ...data, objectID });
  } else if (!newData.exists && oldData.exists) {
    return index.deleteObject(objectID);
  } else {
    return index.saveObject({ ...data, objectID });
  }
};

export const algoliaAssetsSync = regionalFunctions.firestore
  .document('/files/{assetId}')
  .onWrite(async (change) => {
    const index = algoliaSearch.initIndex(`assets`);
    indexing(index, change);
    return;
  });

export const algoliaProjectsSync = regionalFunctions.firestore
  .document('/projects/{projectId}')
  .onWrite(async (change) => {
    const index = algoliaSearch.initIndex(`projects`);
    indexing(index, change);
    return;
  });

export const search = regionalFunctions.https.onCall(
  async ({ query, teamIds }, context) => {
    if (!context?.auth?.token?.email) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'Must be logged with an email address'
      );
    }

    const filters = teamIds.map((teamId) => `teamId:${teamId}`).join(` OR `);

    const queries = [
      { indexName: 'projects', query, params: { filters } },
      { indexName: 'assets', query, params: { filters } },
    ];

    const res = await algoliaSearch.multipleQueries(queries);

    return res;
  }
);
