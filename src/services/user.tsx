import { db } from 'config/firebase';

export const getUser = (uid: string): any => {
  return db
    .collection('users')
    .doc(uid)
    .get()
    .then((doc) => doc.data());
};
