import { get, ref, remove, set } from 'firebase/database';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { BookmarkItem, LessonProgress } from '../types/content';
import { readJson, STORAGE_KEYS, writeJson } from '../lib/storage';
import { getFirestoreDb, getRealtimeDb } from './firebase';

export interface ProgressStats {
  totalPublishedLessons: number;
  completedLessons: number;
  completionPercentage: number;
  bookmarkedLessons: number;
  lastVisitedLessonId: string | null;
  levelBreakdown: Array<{
    level: number;
    completed: number;
    total: number;
    percentage: number;
  }>;
}

function progressKey(uid: string): string {
  return `${STORAGE_KEYS.progress}::${uid}`;
}

function bookmarksKey(uid: string): string {
  return `${STORAGE_KEYS.bookmarks}::${uid}`;
}

function lastVisitedKey(uid: string): string {
  return `${STORAGE_KEYS.lastVisited}::${uid}`;
}

function readLocalProgress(uid: string): LessonProgress[] {
  return readJson<LessonProgress[]>(progressKey(uid), []);
}

function writeLocalProgress(uid: string, records: LessonProgress[]): void {
  writeJson(progressKey(uid), records);
}

/**
 * Load all progress records for a single user.
 *
 * Security: the query is always constrained to `uid == the signed-in user`, and
 * both `database.rules.json` (Realtime DB) and `firestore.rules` (Firestore)
 * independently reject any attempt to read another user's records.
 */
export async function fetchUserProgress(uid: string): Promise<LessonProgress[]> {
  const rtdb = getRealtimeDb();
  if (rtdb) {
    try {
      const snap = await get(ref(rtdb, `userProgress/${uid}`));
      if (snap.exists()) {
        const val = snap.val() as Record<string, LessonProgress>;
        const list = Object.entries(val).map(([lessonId, data]) => ({
          ...data,
          uid,
          lessonId,
        }));
        writeLocalProgress(uid, list);
        return list;
      }
    } catch (error) {
      console.warn('[Aura] progressService: RTDB read failed, using fallback.', error);
    }
  }

  const db = getFirestoreDb();
  if (db) {
    try {
      const q = query(collection(db, 'users', uid, 'progress'), limit(500));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map((d) => ({ ...(d.data() as LessonProgress), lessonId: d.id }));
      }
    } catch (error) {
      console.warn('[Aura] progressService: Firestore read failed, using local cache.', error);
    }
  }
  return readLocalProgress(uid);
}

export async function setLessonCompletion(
  uid: string,
  lessonId: string,
  completed: boolean
): Promise<LessonProgress> {
  const nowIso = new Date().toISOString();
  const existing = readLocalProgress(uid).find((p) => p.lessonId === lessonId);

  const record: LessonProgress = {
    uid,
    lessonId,
    completed,
    lastVisitedAt: nowIso,
    completedAt: completed ? (existing?.completedAt ?? nowIso) : null,
    updatedAt: nowIso,
  };

  const rtdb = getRealtimeDb();
  if (rtdb) {
    try {
      await set(ref(rtdb, `userProgress/${uid}/${lessonId}`), record);
    } catch (error) {
      console.warn('[Aura] progressService: RTDB write failed, saving locally.', error);
    }
  }

  const db = getFirestoreDb();
  if (db) {
    try {
      await setDoc(doc(db, 'users', uid, 'progress', lessonId), {
        uid,
        lessonId,
        completed,
        lastVisitedAt: serverTimestamp(),
        completedAt: completed ? serverTimestamp() : null,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.warn('[Aura] progressService: Firestore write failed, saving locally.', error);
    }
  }

  const records = readLocalProgress(uid).filter((p) => p.lessonId !== lessonId);
  records.push(record);
  writeLocalProgress(uid, records);
  return record;
}

export async function markLessonVisited(uid: string, lessonId: string): Promise<void> {
  const nowIso = new Date().toISOString();
  const records = readLocalProgress(uid);
  const existing = records.find((p) => p.lessonId === lessonId);

  const nextRecord: LessonProgress = existing
    ? { ...existing, lastVisitedAt: nowIso, updatedAt: nowIso }
    : {
        uid,
        lessonId,
        completed: false,
        lastVisitedAt: nowIso,
        completedAt: null,
        updatedAt: nowIso,
      };

  const updatedList = records.filter((p) => p.lessonId !== lessonId);
  updatedList.push(nextRecord);
  writeLocalProgress(uid, updatedList);
  writeJson(lastVisitedKey(uid), lessonId);

  const rtdb = getRealtimeDb();
  if (rtdb) {
    try {
      await set(ref(rtdb, `userProgress/${uid}/${lessonId}`), nextRecord);
    } catch (error) {
      console.warn('[Aura] progressService: RTDB visit write failed.', error);
    }
  }

  const db = getFirestoreDb();
  if (db) {
    try {
      await setDoc(
        doc(db, 'users', uid, 'progress', lessonId),
        {
          uid,
          lessonId,
          completed: existing?.completed ?? false,
          lastVisitedAt: serverTimestamp(),
          completedAt: existing?.completedAt ?? null,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (error) {
      console.warn('[Aura] progressService: Firestore visit write failed.', error);
    }
  }
}

export async function fetchBookmarks(uid: string): Promise<BookmarkItem[]> {
  const rtdb = getRealtimeDb();
  if (rtdb) {
    try {
      const snap = await get(ref(rtdb, `userBookmarks/${uid}`));
      if (snap.exists()) {
        const val = snap.val() as Record<string, BookmarkItem>;
        const list = Object.entries(val).map(([lessonId, data]) => ({
          ...data,
          uid,
          lessonId,
        }));
        writeJson(bookmarksKey(uid), list);
        return list;
      }
    } catch (error) {
      console.warn('[Aura] progressService: RTDB bookmark read failed.', error);
    }
  }

  const db = getFirestoreDb();
  if (db) {
    try {
      const q = query(collection(db, 'users', uid, 'bookmarks'), limit(500));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map((d) => ({ ...(d.data() as BookmarkItem), lessonId: d.id }));
      }
    } catch (error) {
      console.warn('[Aura] progressService: Firestore bookmark read failed, using local cache.', error);
    }
  }
  return readJson<BookmarkItem[]>(bookmarksKey(uid), []);
}

export async function toggleBookmark(
  uid: string,
  lessonId: string,
  currentlyBookmarked: boolean
): Promise<BookmarkItem[]> {
  const nowIso = new Date().toISOString();

  const rtdb = getRealtimeDb();
  if (rtdb) {
    try {
      if (currentlyBookmarked) {
        await remove(ref(rtdb, `userBookmarks/${uid}/${lessonId}`));
      } else {
        await set(ref(rtdb, `userBookmarks/${uid}/${lessonId}`), {
          uid,
          lessonId,
          createdAt: nowIso,
        });
      }
    } catch (error) {
      console.warn('[Aura] progressService: RTDB bookmark write failed.', error);
    }
  }

  const db = getFirestoreDb();
  if (db) {
    try {
      if (currentlyBookmarked) {
        await deleteDoc(doc(db, 'users', uid, 'bookmarks', lessonId));
      } else {
        await setDoc(doc(db, 'users', uid, 'bookmarks', lessonId), {
          uid,
          lessonId,
          createdAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.warn('[Aura] progressService: Firestore bookmark write failed.', error);
    }
  }

  const current = readJson<BookmarkItem[]>(bookmarksKey(uid), []);
  const next = currentlyBookmarked
    ? current.filter((b) => b.lessonId !== lessonId)
    : [...current, { uid, lessonId, createdAt: nowIso }];
  writeJson(bookmarksKey(uid), next);
  return next;
}

export function getLastVisitedLessonId(uid: string): string | null {
  return readJson<string | null>(lastVisitedKey(uid), null);
}

/**
 * Compute study statistics.
 *
 * IMPORTANT: the percentage is always derived from the *actual* number of
 * published lessons currently in the curriculum and the recorded completion
 * state. It is never hardcoded or assumed to be 100%.
 */
export function computeProgressStats(
  uid: string,
  publishedLessons: Array<{ id: string; level: number }>,
  progressRecords?: LessonProgress[],
  bookmarkCount?: number
): ProgressStats {
  const records = progressRecords ?? readLocalProgress(uid);
  const publishedIds = new Set(publishedLessons.map((l) => l.id));
  const completedIds = new Set(
    records.filter((r) => r.completed && publishedIds.has(r.lessonId)).map((r) => r.lessonId)
  );

  const totalPublishedLessons = publishedLessons.length;
  const completedLessons = completedIds.size;
  const completionPercentage =
    totalPublishedLessons === 0
      ? 0
      : Math.round((completedLessons / totalPublishedLessons) * 100);

  const levelMap = new Map<number, { completed: number; total: number }>();
  for (const lesson of publishedLessons) {
    const entry = levelMap.get(lesson.level) ?? { completed: 0, total: 0 };
    entry.total += 1;
    if (completedIds.has(lesson.id)) entry.completed += 1;
    levelMap.set(lesson.level, entry);
  }

  const levelBreakdown = Array.from(levelMap.entries())
    .map(([level, entry]) => ({
      level,
      completed: entry.completed,
      total: entry.total,
      percentage: entry.total === 0 ? 0 : Math.round((entry.completed / entry.total) * 100),
    }))
    .sort((a, b) => a.level - b.level);

  const bookmarks = bookmarkCount ?? readJson<BookmarkItem[]>(bookmarksKey(uid), []).length;

  return {
    totalPublishedLessons,
    completedLessons,
    completionPercentage,
    bookmarkedLessons: bookmarks,
    lastVisitedLessonId: getLastVisitedLessonId(uid),
    levelBreakdown,
  };
}
