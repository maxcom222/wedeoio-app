import regionalFunctions from '../regionalFunctions';
import { db, storage } from '../config';

const bucket = storage.bucket();

export const onFileUpdate = regionalFunctions.firestore
  .document('/files/{documentId}')
  .onUpdate(async (change) => {
    if (change.before.data().name !== change.after.data().name) {
      const id = change.after.id;
      const name = change.after.data().name;
      await updateChildrenPath(id, { id, name });
    }

    return { status: 'success' };
  });

const updateChildrenPath = (id, data) => {
  return new Promise(async (resolve) => {
    const folders = await (
      await db
        .collection('files')
        .where('parentId', '==', id)
        .where('type', '==', 'folder')
        .get()
    ).docs;
    for await (const folder of folders) {
      const path = folder
        .data()
        .path.map((el) => (el.id === data.id ? data : el));
      await db.collection('files').doc(folder.id).update({ path });
      await updateChildrenPath(folder.id, data);
    }
    resolve(true);
  });
};

export const onFileDelete = regionalFunctions.firestore
  .document('/files/{documentId}')
  .onDelete(async (snap) => {
    const file = snap.data();

    switch (file.type) {
      case 'folder':
        await deleteChildren(snap.id);
        break;

      case 'file':
        await deleteSourceAndThumbnailInStorage(
          `assets/${file.storage.sourceName}`,
          `assets/${file.storage.thumbnailName}`
        );
        await deleteComments(snap.id);
        break;

      case 'youtube':
        await deleteComments(snap.id);
        break;

      default:
        break;
    }

    return { status: 'success' };
  });

const deleteSourceAndThumbnailInStorage = (source, thumbnail) => {
  return new Promise(async (resolve) => {
    await bucket.file(source).delete();
    await bucket.file(thumbnail).delete();
    resolve(true);
  });
};

const deleteChildren = (folderId) => {
  return new Promise(async (resolve) => {
    const files = await (
      await db.collection('files').where('parentId', '==', folderId).get()
    ).docs;
    for await (const file of files) {
      await db.collection('files').doc(file.id).delete();
    }
    resolve(true);
  });
};

const deleteComments = (fileId) => {
  return new Promise(async (resolve) => {
    const comments = await (
      await db.collection('comments').where('fileId', '==', fileId).get()
    ).docs;
    for await (const comment of comments) {
      await db.collection('comments').doc(comment.id).delete();
    }
    resolve(true);
  });
};
