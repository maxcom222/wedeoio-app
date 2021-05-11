import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/functions';

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const app = firebase.app();
const auth = firebase.auth();
const _auth = firebase.auth;
const db = firebase.firestore();
const _db = firebase.firestore;
const now = firebase.firestore.Timestamp.now();
const storage = firebase.storage();
const functions = firebase.app().functions('asia-northeast3');

if (process.env.NODE_ENV === 'development') {
  // functions.useEmulator('http://localhost', 5001);
  // auth.useEmulator('http://localhost:9099');
  // db.useEmulator('http://localhost', 8080);
}

export { auth, db, functions, now, storage, _auth, _db, firebase };

console.log(
  app.name
    ? `Firebase ${
        process.env.NODE_ENV === 'development' ? 'Emulator ' : ''
      }Mode Activated!`
    : 'Firebase not working :('
);
