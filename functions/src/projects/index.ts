import regionalFunctions from '../regionalFunctions';
import { db } from '../config';

export const onProjectDelete = regionalFunctions.firestore
  .document('/projects/{documentId}')
  .onDelete(async (snap) => {
    const files = await (
      await db
        .collection('files')
        .where('projectId', '==', snap.id)
        .where('parentId', '==', '')
        .get()
    ).docs;
    for await (const file of files) {
      await db.collection('files').doc(file.id).delete();
    }

    return { status: 'success' };
  });
