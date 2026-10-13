/**
 * Safe localStorage helpers that never throw in restricted browser contexts
 * (private mode, storage disabled, SSR/test environments without storage).
 */
const PREFIX = 'aura::v1::';

function safeGet(key: string): string | null {
  try {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(PREFIX + key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(PREFIX + key, value);
  } catch {
    // Storage unavailable — silently degrade to in-memory behaviour.
  }
}

function safeRemove(key: string): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(PREFIX + key);
  } catch {
    // ignore
  }
}

export function readJson<T>(key: string, fallback: T): T {
  const raw = safeGet(key);
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJson<T>(key: string, value: T): void {
  try {
    safeSet(key, JSON.stringify(value));
  } catch {
    // Circular or un-serialisable value — ignore to keep the UI responsive.
  }
}

export function removeKey(key: string): void {
  safeRemove(key);
}

export const STORAGE_KEYS = {
  localUsers: 'local-users',
  sessionUid: 'session-uid',
  progress: 'progress',
  bookmarks: 'bookmarks',
  quizAttempts: 'quiz-attempts',
  lastVisited: 'last-visited',
  theme: 'theme',
  editorOverrides: 'editor-overrides',
  editorCourseOverrides: 'editor-course-overrides',
  editorLessonDrafts: 'editor-lesson-drafts',
  customLessons: 'custom-lessons',
  customCourses: 'custom-courses',
  displayName: 'display-name',
  localAdminUids: 'local-admin-uids',
  firebaseRuntimeConfig: 'firebase-runtime-config',
} as const;
