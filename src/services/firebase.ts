import { FirebaseApp, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export interface FirebaseContext {
  configured: boolean;
  app: FirebaseApp | null;
  auth: Auth | null;
  db: Firestore | null;
}

function readConfig(): FirebaseConfig | null {
  const env = import.meta.env as Record<string, string | undefined>;
  const apiKey = env.VITE_FIREBASE_API_KEY?.trim();
  const authDomain = env.VITE_FIREBASE_AUTH_DOMAIN?.trim();
  const projectId = env.VITE_FIREBASE_PROJECT_ID?.trim();
  const appId = env.VITE_FIREBASE_APP_ID?.trim();

  if (!apiKey || !authDomain || !projectId || !appId) {
    return null;
  }

  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET?.trim() ?? '',
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID?.trim() ?? '',
    appId,
  };
}

let cached: FirebaseContext | null = null;

/**
 * Initialise Firebase if (and only if) complete client configuration is present.
 * When configuration is missing the application runs in "Local Studio Mode":
 * all lessons, interactive labs, quizzes, progress and bookmarks work locally
 * in the browser so learners are never blocked by a missing cloud project.
 *
 * IMPORTANT: Firebase client config is public and is NOT a security mechanism.
 * All data access is enforced by firebase/firestore.rules on the server.
 */
export function getFirebaseContext(): FirebaseContext {
  if (cached) return cached;

  const config = readConfig();
  if (!config) {
    cached = { configured: false, app: null, auth: null, db: null };
    return cached;
  }

  try {
    const app = initializeApp(config);
    const auth = getAuth(app);
    const db = getFirestore(app);

    const useEmulators =
      (import.meta.env.VITE_USE_FIREBASE_EMULATORS as string | undefined) === 'true';
    if (useEmulators && typeof window !== 'undefined') {
      const globalFlag = '__AURA_EMULATORS_CONNECTED__' as const;
      const holder = window as unknown as Record<string, boolean>;
      if (!holder[globalFlag]) {
        holder[globalFlag] = true;
        try {
          connectFirestoreEmulator(db, '127.0.0.1', 8080);
        } catch {
          // Emulator already connected or unavailable — continue with production config.
        }
      }
    }

    cached = { configured: true, app, auth, db };
    return cached;
  } catch (error) {
    console.error('[Aura] Firebase initialisation failed. Falling back to Local Studio Mode.', error);
    cached = { configured: false, app: null, auth: null, db: null };
    return cached;
  }
}

export function isFirebaseConfigured(): boolean {
  return getFirebaseContext().configured;
}

export function getFirebaseAuth(): Auth | null {
  return getFirebaseContext().auth;
}

export function getFirestoreDb(): Firestore | null {
  return getFirebaseContext().db;
}
