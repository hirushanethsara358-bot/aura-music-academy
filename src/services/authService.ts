import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  User,
} from 'firebase/auth';
import { get, ref, set } from 'firebase/database';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { readJson, removeKey, STORAGE_KEYS, writeJson } from '../lib/storage';
import { UserProfile } from '../types/content';
import {
  getFirebaseAuth,
  getFirestoreDb,
  getRealtimeDb,
  isFirebaseConfigured,
} from './firebase';

export interface AuraUser {
  uid: string;
  email: string;
  displayName: string;
  isAdmin: boolean;
  isLocal: boolean;
}

/**
 * Verified Firebase Auth UID and email for the primary bootstrapped project
 * administrator (`adminaura.hirusha@auramail.com`) on `auramusic-daa98`.
 */
export const BOOTSTRAPPED_ADMIN_UID = 'oPYN1fV1TrM7W7BcCdaU5wWOHln1';
export const BOOTSTRAPPED_ADMIN_EMAIL = 'adminaura.hirusha@auramail.com';

interface LocalUserRecord {
  uid: string;
  email: string;
  passwordHash: string;
  displayName: string;
  createdAt: string;
}

/**
 * Local password hashing.
 *
 * SECURITY NOTE — READ CAREFULLY:
 * Local Studio Mode is a fully offline development/preview convenience so the
 * whole platform can be explored without a Firebase project. It is NOT a
 * production authentication system and must never be treated as one. Hashes are
 * computed with the Web Crypto API purely so plaintext passwords are never
 * written to localStorage. Production deployments must configure Firebase
 * Authentication (see docs/FIREBASE_SETUP.md) — Firebase then handles password
 * hashing and storage server-side and no credential material ever reaches the
 * browser's persistent storage.
 */
async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(`aura-local::${password}`);
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const digest = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
  let hash = 0;
  for (let i = 0; i < data.length; i += 1) {
    hash = (hash << 5) - hash + data[i];
    hash |= 0;
  }
  return `fallback-${hash}`;
}

function localUsers(): LocalUserRecord[] {
  return readJson<LocalUserRecord[]>(STORAGE_KEYS.localUsers, []);
}

function saveLocalUsers(users: LocalUserRecord[]): void {
  writeJson(STORAGE_KEYS.localUsers, users);
}

function toAuraUser(record: LocalUserRecord): AuraUser {
  const isBootstrappedAdmin =
    record.uid === BOOTSTRAPPED_ADMIN_UID ||
    record.email.toLowerCase() === BOOTSTRAPPED_ADMIN_EMAIL;
  return {
    uid: record.uid,
    email: record.email,
    displayName: record.displayName,
    isAdmin: isBootstrappedAdmin,
    isLocal: true,
  };
}

export function friendlyAuthError(error: unknown): string {
  const code = (error as { code?: string })?.code ?? '';
  switch (code) {
    case 'auth/invalid-email':
      return 'ඊමේල් ලිපිනය වැරදියි. කරුණාකර නිවැරදි ලිපිනයක් ඇතුළත් කරන්න.';
    case 'auth/user-disabled':
      return 'මෙම ගිණුම අක්‍රීය කර ඇත. කරුණාකර සහාය අමතන්න.';
    case 'auth/user-not-found':
      return 'මෙම ඊමේල් ලිපිනයෙන් ගිණුමක් නොමැත. කරුණාකර ලියාපදිංචි වන්න.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'මුරපදය හෝ ඊමේල් ලිපිනය වැරදියි. කරුණාකර නැවත උත්සාහ කරන්න.';
    case 'auth/weak-password':
      return 'මුරපදය දුර්වලයි. අවම වශයෙන් අකුරු 6 ක් භාවිතා කරන්න.';
    case 'auth/email-already-in-use':
      return 'මෙම ඊමේල් ලිපිනයෙන් දැනටමත් ගිණුමක් ඇත. කරුණාකර පිවිසෙන්න.';
    case 'auth/too-many-requests':
      return 'උත්සාහ කිරීම් ඉතා වැඩියෙන් සිදු විය. කරුණාකර මඳ වේලාවකින් නැවත උත්සාහ කරන්න.';
    case 'auth/network-request-failed':
      return 'අන්තර්ජාල සම්බන්ධතාවේ ගැටලුවක් ඇත. කරුණාකර සම්බන්ධතාව පරීක්ෂා කරන්න.';
    case 'auth/requires-recent-login':
      return 'මෙම ක්‍රියාව සඳහා නැවත පිවිසීම අවශ්‍යයි.';
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'Google පිවිසුම් කවුළුව වසා දමන ලදී. කරුණාකර නැවත උත්සාහ කරන්න.';
    case 'auth/popup-blocked':
      return 'බ්‍රවුසරය මගින් Popup කවුළුව අවහිර කරන ලදී. කරුණාකර Popup සඳහා ඉඩ ලබා දෙන්න.';
    case 'auth/account-exists-with-different-credential':
      return 'මෙම ඊමේල් ලිපිනය වෙනත් පිවිසුම් ක්‍රමයකින් දැනටමත් ලියාපදිංචි කර ඇත.';
    case 'auth/unauthorized-domain':
      return 'මෙම වෙබ් ඩොමේනය Firebase Console → Authentication → Settings → Authorized domains වෙත එක් කරන්න.';
    default:
      return 'පිවිසීමේ දෝෂයක් ඇතිවිය. කරුණාකර නැවත උත්සාහ කරන්න.';
  }
}

async function syncUserProfileToCloud(
  uid: string,
  email: string,
  displayName: string
): Promise<void> {
  const nowIso = new Date().toISOString();
  const rtdb = getRealtimeDb();
  if (rtdb) {
    try {
      const existing = await get(ref(rtdb, `users/${uid}`));
      if (!existing.exists()) {
        await set(ref(rtdb, `users/${uid}`), {
          uid,
          email,
          displayName,
          lastVisitedLessonSlug: '',
          createdAt: nowIso,
          updatedAt: nowIso,
        });
      }
    } catch (err) {
      console.warn('[Aura] authService: RTDB profile sync warning.', err);
    }
  }

  const db = getFirestoreDb();
  if (db) {
    try {
      const existing = await getDoc(doc(db, 'users', uid));
      if (!existing.exists()) {
        await setDoc(doc(db, 'users', uid), {
          uid,
          email,
          displayName,
          lastVisitedLessonSlug: null,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    } catch (err) {
      console.warn('[Aura] authService: Firestore profile sync warning.', err);
    }
  }
}

export async function registerWithEmail(
  email: string,
  password: string,
  displayName: string
): Promise<AuraUser> {
  const trimmedEmail = email.trim();
  const name = displayName.trim() || trimmedEmail.split('@')[0];

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    throw new Error('කරුණාකර නිවැරදි ඊමේල් ලිපිනයක් ඇතුළත් කරන්න.');
  }
  if (password.length < 6) {
    throw new Error('මුරපදය අවම වශයෙන් අකුරු 6 ක් විය යුතුයි.');
  }

  const auth = getFirebaseAuth();
  if (auth) {
    const credential = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
    await updateProfile(credential.user, { displayName: name });
    await syncUserProfileToCloud(credential.user.uid, trimmedEmail, name);

    const isAdmin = await checkAdminClaim(credential.user);
    return {
      uid: credential.user.uid,
      email: trimmedEmail,
      displayName: name,
      isAdmin,
      isLocal: false,
    };
  }

  // ---- Local Studio Mode ----
  const users = localUsers();
  if (users.some((u) => u.email.toLowerCase() === trimmedEmail.toLowerCase())) {
    throw new Error('මෙම ඊමේල් ලිපිනයෙන් දැනටමත් ගිණුමක් ඇත. කරුණාකර පිවිසෙන්න.');
  }

  const record: LocalUserRecord = {
    uid: `local-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    email: trimmedEmail,
    passwordHash: await hashPassword(password),
    displayName: name,
    createdAt: new Date().toISOString(),
  };
  users.push(record);
  saveLocalUsers(users);
  writeJson(STORAGE_KEYS.sessionUid, record.uid);
  writeJson(STORAGE_KEYS.displayName, name);
  return toAuraUser(record);
}

export async function loginWithEmail(email: string, password: string): Promise<AuraUser> {
  const trimmedEmail = email.trim();
  const auth = getFirebaseAuth();
  if (auth) {
    const credential = await signInWithEmailAndPassword(auth, trimmedEmail, password);
    const displayName =
      credential.user.displayName ??
      (trimmedEmail.toLowerCase() === BOOTSTRAPPED_ADMIN_EMAIL
        ? 'Aura Admin (Hirusha)'
        : trimmedEmail.split('@')[0]);
    await syncUserProfileToCloud(
      credential.user.uid,
      credential.user.email ?? trimmedEmail,
      displayName
    );
    const isAdmin = await checkAdminClaim(credential.user);
    return {
      uid: credential.user.uid,
      email: credential.user.email ?? trimmedEmail,
      displayName,
      isAdmin,
      isLocal: false,
    };
  }

  // Local Studio Mode: support bootstrapped admin account for local testing
  if (
    trimmedEmail.toLowerCase() === BOOTSTRAPPED_ADMIN_EMAIL &&
    password === 'adminaura'
  ) {
    const users = localUsers();
    let adminRecord = users.find(
      (u) => u.email.toLowerCase() === BOOTSTRAPPED_ADMIN_EMAIL
    );
    if (!adminRecord) {
      adminRecord = {
        uid: BOOTSTRAPPED_ADMIN_UID,
        email: BOOTSTRAPPED_ADMIN_EMAIL,
        passwordHash: await hashPassword('adminaura'),
        displayName: 'Aura Admin (Hirusha)',
        createdAt: new Date().toISOString(),
      };
      users.push(adminRecord);
      saveLocalUsers(users);
    }
    writeJson(STORAGE_KEYS.sessionUid, adminRecord.uid);
    writeJson(STORAGE_KEYS.displayName, adminRecord.displayName);
    return toAuraUser(adminRecord);
  }

  const users = localUsers();
  const match = users.find((u) => u.email.toLowerCase() === trimmedEmail.toLowerCase());
  if (!match) {
    throw new Error('මෙම ඊමේල් ලිපිනයෙන් ගිණුමක් නොමැත. කරුණාකර ලියාපදිංචි වන්න.');
  }
  const hash = await hashPassword(password);
  if (hash !== match.passwordHash) {
    throw new Error('මුරපදය වැරදියි. කරුණාකර නැවත උත්සාහ කරන්න.');
  }
  writeJson(STORAGE_KEYS.sessionUid, match.uid);
  writeJson(STORAGE_KEYS.displayName, match.displayName);
  return toAuraUser(match);
}

/**
 * Sign in or register using Google Authentication (`GoogleAuthProvider`).
 */
export async function loginWithGoogle(): Promise<AuraUser> {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error(
      'Google ගිණුමෙන් පිවිසීම සඳහා Firebase Authentication සම්බන්ධ කර තිබිය යුතුයි.'
    );
  }

  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const credential = await signInWithPopup(auth, provider);
    const email = credential.user.email ?? '';
    const displayName =
      credential.user.displayName ?? (email.split('@')[0] || 'Aura ශිෂ්‍යයා');

    await syncUserProfileToCloud(credential.user.uid, email, displayName);
    const isAdmin = await checkAdminClaim(credential.user);

    return {
      uid: credential.user.uid,
      email,
      displayName,
      isAdmin,
      isLocal: false,
    };
  } catch (err) {
    throw new Error(friendlyAuthError(err));
  }
}

export async function logout(): Promise<void> {
  const auth = getFirebaseAuth();
  if (auth) {
    await signOut(auth);
    return;
  }
  removeKey(STORAGE_KEYS.sessionUid);
  removeKey(STORAGE_KEYS.displayName);
}

export async function requestPasswordReset(email: string): Promise<void> {
  const trimmed = email.trim();
  const auth = getFirebaseAuth();
  if (auth) {
    await sendPasswordResetEmail(auth, trimmed);
    return;
  }
  const users = localUsers();
  const exists = users.some((u) => u.email.toLowerCase() === trimmed.toLowerCase());
  if (!exists) {
    throw new Error('මෙම ඊමේල් ලිපිනයෙන් ගිණුමක් නොමැත.');
  }
  throw new Error(
    'දේශීය ප්‍රකාරයේ (Local Mode) ඊමේල් යැවිය නොහැක. මුරපද යළි සැකසීමට Firebase සම්බන්ධ කරන්න — docs/FIREBASE_SETUP.md බලන්න.'
  );
}

/**
 * Admin privilege check.
 *
 * SECURITY NOTE: Admin rights are derived from:
 *   1) The verified Firebase Auth UID of the bootstrapped administrator
 *      (`oPYN1fV1TrM7W7BcCdaU5wWOHln1` / `adminaura.hirusha@auramail.com`), OR
 *   2) A custom auth claim (`request.auth.token.admin == true`) set via Firebase Admin SDK, OR
 *   3) A console-only `/admins/{uid}` entry in Realtime Database / Firestore where client writes
 *      are unconditionally blocked (`".write": false` in database.rules.json and
 *      `allow write: if false` in firestore.rules).
 * A user profile field is NEVER consulted. Security rules independently enforce
 * every privileged write on the server.
 */
async function checkAdminClaim(user: User): Promise<boolean> {
  if (
    user.uid === BOOTSTRAPPED_ADMIN_UID ||
    (user.email ?? '').toLowerCase() === BOOTSTRAPPED_ADMIN_EMAIL
  ) {
    return true;
  }

  try {
    const token = await user.getIdTokenResult();
    if (token.claims.admin === true) {
      return true;
    }
  } catch {
    // Continue to console-only admins registry check
  }

  const rtdb = getRealtimeDb();
  if (rtdb) {
    try {
      const snap = await get(ref(rtdb, `admins/${user.uid}`));
      if (snap.exists() && snap.val() === true) {
        return true;
      }
    } catch {
      // Ignore permission denied or network error
    }
  }

  const db = getFirestoreDb();
  if (db) {
    try {
      const snap = await getDoc(doc(db, 'admins', user.uid));
      if (snap.exists()) {
        return true;
      }
    } catch {
      // Ignore permission denied or network error
    }
  }

  return false;
}

export async function getCurrentUser(): Promise<AuraUser | null> {
  const auth = getFirebaseAuth();
  if (auth) {
    const user = auth.currentUser;
    if (!user) return null;
    return {
      uid: user.uid,
      email: user.email ?? '',
      displayName: user.displayName ?? (user.email ?? '').split('@')[0],
      isAdmin: await checkAdminClaim(user),
      isLocal: false,
    };
  }

  const uid = readJson<string | null>(STORAGE_KEYS.sessionUid, null);
  if (!uid) return null;
  const record = localUsers().find((u) => u.uid === uid);
  return record ? toAuraUser(record) : null;
}

export function subscribeToAuthChanges(
  callback: (user: AuraUser | null) => void
): () => void {
  const auth = getFirebaseAuth();
  if (!auth) {
    void getCurrentUser().then(callback);
    return () => undefined;
  }

  return onAuthStateChanged(auth, async (user) => {
    if (!user) {
      callback(null);
      return;
    }
    callback({
      uid: user.uid,
      email: user.email ?? '',
      displayName: user.displayName ?? (user.email ?? '').split('@')[0],
      isAdmin: await checkAdminClaim(user),
      isLocal: false,
    });
  });
}

export async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  const rtdb = getRealtimeDb();
  if (rtdb) {
    try {
      const snap = await get(ref(rtdb, `users/${uid}`));
      if (snap.exists()) {
        return snap.val() as UserProfile;
      }
    } catch (error) {
      console.warn('[Aura] authService: RTDB profile read failed.', error);
    }
  }

  const db = getFirestoreDb();
  if (db) {
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      if (snap.exists()) return snap.data() as UserProfile;
    } catch (error) {
      console.warn('[Aura] authService: Firestore profile read failed.', error);
    }
  }

  const record = localUsers().find((u) => u.uid === uid);
  if (!record) return null;
  return {
    uid: record.uid,
    email: record.email,
    displayName: record.displayName,
    lastVisitedLessonSlug: readJson<string | null>(`${STORAGE_KEYS.lastVisited}::${uid}`, null),
    createdAt: record.createdAt,
    updatedAt: record.createdAt,
  };
}

export function usingFirebaseAuth(): boolean {
  return isFirebaseConfigured();
}
