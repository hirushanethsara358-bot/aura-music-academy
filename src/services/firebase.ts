import { FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Database, connectDatabaseEmulator, getDatabase } from 'firebase/database';
import { Firestore, connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { readJson, removeKey, STORAGE_KEYS, writeJson } from '../lib/storage';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL?: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

export interface FirebaseContext {
  configured: boolean;
  app: FirebaseApp | null;
  auth: Auth | null;
  db: Firestore | null;
  rtdb: Database | null;
  config: FirebaseConfig | null;
}

export const DEFAULT_AURA_RTDB_URL =
  'https://auramusic-daa98-default-rtdb.asia-southeast1.firebasedatabase.app';

function readConfig(): FirebaseConfig | null {
  const runtimeOverride = readJson<FirebaseConfig | null>(
    STORAGE_KEYS.firebaseRuntimeConfig,
    null
  );
  if (
    runtimeOverride &&
    runtimeOverride.apiKey?.trim() &&
    runtimeOverride.authDomain?.trim() &&
    runtimeOverride.projectId?.trim() &&
    runtimeOverride.appId?.trim()
  ) {
    const projectId = runtimeOverride.projectId.trim();
    const fallbackDbUrl =
      projectId === 'auramusic-daa98' ? DEFAULT_AURA_RTDB_URL : undefined;
    return {
      apiKey: runtimeOverride.apiKey.trim(),
      authDomain: runtimeOverride.authDomain.trim(),
      databaseURL: runtimeOverride.databaseURL?.trim() || fallbackDbUrl,
      projectId,
      storageBucket: runtimeOverride.storageBucket?.trim() ?? '',
      messagingSenderId: runtimeOverride.messagingSenderId?.trim() ?? '',
      appId: runtimeOverride.appId.trim(),
      measurementId: runtimeOverride.measurementId?.trim(),
    };
  }

  const env = import.meta.env as Record<string, string | undefined>;
  // During automated Vitest runs (`MODE === 'test'`), default to deterministic
  // Local Studio Mode unless a test explicitly opts into Firebase env loading.
  if (env.MODE === 'test' && env.VITE_ENABLE_FIREBASE_IN_TEST !== 'true') {
    return null;
  }

  const apiKey = env.VITE_FIREBASE_API_KEY?.trim();
  const authDomain = env.VITE_FIREBASE_AUTH_DOMAIN?.trim();
  const projectId = env.VITE_FIREBASE_PROJECT_ID?.trim();
  const appId = env.VITE_FIREBASE_APP_ID?.trim();

  if (!apiKey || !authDomain || !projectId || !appId) {
    return null;
  }

  const explicitDbUrl = env.VITE_FIREBASE_DATABASE_URL?.trim();
  const databaseURL =
    explicitDbUrl ||
    (projectId === 'auramusic-daa98' ? DEFAULT_AURA_RTDB_URL : undefined);

  return {
    apiKey,
    authDomain,
    databaseURL,
    projectId,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET?.trim() ?? '',
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID?.trim() ?? '',
    appId,
    measurementId: env.VITE_FIREBASE_MEASUREMENT_ID?.trim(),
  };
}

let cached: FirebaseContext | null = null;

/**
 * Initialise Firebase if (and only if) complete client configuration is present.
 * Supports BOTH Firebase Realtime Database (`rtdb`) and Cloud Firestore (`db`).
 * When configuration is missing the application runs in "Local Studio Mode":
 * all lessons, interactive labs, quizzes, progress and bookmarks work locally
 * in the browser so learners are never blocked by a missing cloud project.
 *
 * IMPORTANT: Firebase client config is public and is NOT a security mechanism.
 * All data access is enforced by `firebase/database.rules.json` (Realtime DB)
 * and `firebase/firestore.rules` (Cloud Firestore) on Google's servers.
 */
export function getFirebaseContext(): FirebaseContext {
  if (cached) return cached;

  const config = readConfig();
  if (!config) {
    cached = {
      configured: false,
      app: null,
      auth: null,
      db: null,
      rtdb: null,
      config: null,
    };
    return cached;
  }

  try {
    const existing = getApps();
    const app = existing.length > 0 ? existing[0] : initializeApp(config);
    const auth = getAuth(app);
    const db = getFirestore(app);
    let rtdb: Database | null = null;

    if (config.databaseURL) {
      try {
        rtdb = getDatabase(app, config.databaseURL);
      } catch (rtdbError) {
        console.warn('[Aura] Realtime Database init warning:', rtdbError);
      }
    }

    const useEmulators =
      (import.meta.env.VITE_USE_FIREBASE_EMULATORS as string | undefined) === 'true';
    if (useEmulators && typeof window !== 'undefined') {
      const globalFlag = '__AURA_EMULATORS_CONNECTED__' as const;
      const holder = window as unknown as Record<string, boolean>;
      if (!holder[globalFlag]) {
        holder[globalFlag] = true;
        try {
          connectFirestoreEmulator(db, '127.0.0.1', 8080);
          if (rtdb) {
            connectDatabaseEmulator(rtdb, '127.0.0.1', 9000);
          }
        } catch {
          // Emulator already connected or unavailable — continue with production config.
        }
      }
    }

    cached = { configured: true, app, auth, db, rtdb, config };
    return cached;
  } catch (error) {
    console.error('[Aura] Firebase initialisation failed. Falling back to Local Studio Mode.', error);
    cached = {
      configured: false,
      app: null,
      auth: null,
      db: null,
      rtdb: null,
      config: null,
    };
    return cached;
  }
}

export function resetFirebaseContext(): void {
  cached = null;
}

export function saveRuntimeFirebaseConfig(config: FirebaseConfig): void {
  writeJson(STORAGE_KEYS.firebaseRuntimeConfig, config);
  cached = null;
}

export function clearRuntimeFirebaseConfig(): void {
  removeKey(STORAGE_KEYS.firebaseRuntimeConfig);
  cached = null;
}

export function isFirebaseConfigured(): boolean {
  return getFirebaseContext().configured;
}

export function isRealtimeDbConfigured(): boolean {
  return getFirebaseContext().rtdb !== null;
}

export function getFirebaseAuth(): Auth | null {
  return getFirebaseContext().auth;
}

export function getFirestoreDb(): Firestore | null {
  return getFirebaseContext().db;
}

export function getRealtimeDb(): Database | null {
  return getFirebaseContext().rtdb;
}

export function getActiveFirebaseConfig(): FirebaseConfig | null {
  return getFirebaseContext().config;
}

export function getFirebaseBackendSummary(): {
  mode: 'rtdb+firestore' | 'firestore' | 'local';
  projectId: string | null;
  databaseURL: string | null;
} {
  const ctx = getFirebaseContext();
  if (!ctx.configured || !ctx.config) {
    return { mode: 'local', projectId: null, databaseURL: null };
  }
  return {
    mode: ctx.rtdb ? 'rtdb+firestore' : 'firestore',
    projectId: ctx.config.projectId,
    databaseURL: ctx.config.databaseURL ?? null,
  };
}
