import * as functions from 'firebase-functions';

/**
 * catchErrors is a helper function to throw function errors
 * @param  {Promise<any>} promise
 */
export const catchErrors = async (promise: Promise<any>): Promise<any> => {
  try {
    return await promise;
  } catch (err) {
    console.error(err);
    throw new functions.https.HttpsError('unknown', err);
  }
};

/**
 * getUID is a helper function that validates and return the UID on callable functions
 * @param  {any} context
 */
export const getUID = (context: functions.https.CallableContext): string => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'function called without context.auth'
    );
  } else {
    return context.auth.uid;
  }
};
