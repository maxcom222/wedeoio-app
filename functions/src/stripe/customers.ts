import regionalFunctions from '../regionalFunctions';
import { db, stripe } from '../config';

/**
 * When a user deletes their account, clean up after them
 */
export const cleanupUser = regionalFunctions.auth
  .user()
  .onDelete(async (user) => {
    const firebaseUser = await getUser(user.uid);
    await stripe.customers.del(firebaseUser?.stripeCustomerId);
    await db.collection('users').doc(user.uid).delete();
    return;
  });

/**
 *  Use this function to read the user document from Firestore
 */
export const getUser = async (uid: string): Promise<any> => {
  return await db
    .collection('users')
    .doc(uid)
    .get()
    .then((doc) => doc.data());
};

/**
 *  Convenience method to get customer ID
 */
export const getCustomerId = async (uid: string): Promise<any> => {
  const user = await getUser(uid);
  return user.stripeCustomerId;
};

/**
 *  Use this function to read the user document from Firestore
 */
export const getUserByStripeId = async (
  stripeCustomerId: string
): Promise<any> => {
  return await db
    .collection('users')
    .where('stripeCustomerId', '==', stripeCustomerId)
    .get()
    .then((querySnapshot) => {
      let user;
      querySnapshot.forEach((doc) => (user = doc.data()));
      return user;
    });
};
