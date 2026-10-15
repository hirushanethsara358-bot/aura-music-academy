import type { FirebaseConfig } from './firebase';

/**
 * Public Firebase web app configuration for the Aura Music Academy project
 * (auramusic-daa98). Used when no VITE_FIREBASE_* variables are provided.
 *
 * This is the browser client config shown in the Firebase console. It is shipped
 * to every visitor's browser and is NOT a secret — all data access is enforced by
 * `firebase/database.rules.json` and `firebase/firestore.rules`.
 */
export const AURA_FIREBASE_WEB_CONFIG: FirebaseConfig = {
  apiKey: 'AIzaSyDWJA8CA7qrx_L2_75fGKtsd0Gi2sykUuE',
  authDomain: 'auramusic-daa98.firebaseapp.com',
  databaseURL: 'https://auramusic-daa98-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'auramusic-daa98',
  storageBucket: 'auramusic-daa98.firebasestorage.app',
  messagingSenderId: '466766006378',
  appId: '1:466766006378:web:5e2012d6c26d623a9d6213',
  measurementId: 'G-MLZFJ66C1V',
};
