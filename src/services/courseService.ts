import { equalTo, get, orderByChild, query as rtdbQuery, ref, set } from 'firebase/database';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
  setDoc,
} from 'firebase/firestore';
import { Course } from '../types/content';
import { SEED_COURSES } from '../content/courses/seedCourses';
import { readJson, STORAGE_KEYS, writeJson } from '../lib/storage';
import { getFirestoreDb, getRealtimeDb } from './firebase';

const COLLECTION = 'courses';

function getLocalCourseOverrides(): Course[] {
  return readJson<Course[]>(STORAGE_KEYS.editorCourseOverrides, []);
}

export function saveLocalCourseOverride(course: Course): void {
  const current = getLocalCourseOverrides().filter((c) => c.id !== course.id);
  current.push(course);
  writeJson(STORAGE_KEYS.editorCourseOverrides, current);
}

/**
 * Fetch all published courses.
 *
 * Design notes:
 * - Reads from Firebase Realtime Database (`rtdb`) first when configured,
 *   then Cloud Firestore (`db`), using one-time reads (`get` / `getDocs`)
 *   to stay comfortably inside Spark free-tier quotas.
 * - Falls back to and merges with the bundled seed curriculum so the platform
 *   is never empty.
 */
export async function fetchCourses(): Promise<Course[]> {
  const rtdb = getRealtimeDb();
  if (rtdb) {
    try {
      const q = rtdbQuery(
        ref(rtdb, COLLECTION),
        orderByChild('published'),
        equalTo(true)
      );
      const snapshot = await get(q);
      if (snapshot.exists()) {
        const val = snapshot.val() as Record<string, Course & { lessonsInOrder?: string[] }>;
        const remote = Object.entries(val).map(([id, data]) => ({
          ...data,
          id,
          lessonIds: data.lessonIds ?? data.lessonsInOrder ?? [],
        }));
        return applyCourseOverrides(mergeWithSeed(remote)).filter((c) => c.published);
      }
    } catch (error) {
      console.warn('[Aura] courseService: RTDB read fallback to seed courses.', error);
    }
  }

  const db = getFirestoreDb();
  if (db) {
    try {
      const q = query(
        collection(db, COLLECTION),
        where('published', '==', true),
        orderBy('order', 'asc'),
        limit(50)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const remote = snapshot.docs.map((d) => ({ ...(d.data() as Course), id: d.id }));
        return applyCourseOverrides(mergeWithSeed(remote)).filter((c) => c.published);
      }
    } catch (error) {
      console.warn('[Aura] courseService: Firestore read fallback to seed courses.', error);
    }
  }

  return applyCourseOverrides(sortCourses(SEED_COURSES)).filter((c) => c.published);
}

export async function fetchAllCoursesIncludingDrafts(): Promise<Course[]> {
  const rtdb = getRealtimeDb();
  if (rtdb) {
    try {
      const snap = await get(ref(rtdb, COLLECTION));
      if (snap.exists()) {
        const val = snap.val() as Record<string, Course & { lessonsInOrder?: string[] }>;
        const remote = Object.entries(val).map(([id, data]) => ({
          ...data,
          id,
          lessonIds: data.lessonIds ?? data.lessonsInOrder ?? [],
        }));
        return applyCourseOverrides(mergeWithSeed(remote));
      }
    } catch {
      // Fallback to published + local overrides
    }
  }
  const published = await fetchCourses();
  return applyCourseOverrides(mergeWithSeed(published));
}

export async function saveCourseToCloud(course: Course): Promise<{
  savedToRtdb: boolean;
  savedToFirestore: boolean;
}> {
  const updated: Course = {
    ...course,
    updatedAt: new Date().toISOString(),
  };
  saveLocalCourseOverride(updated);

  let savedToRtdb = false;
  let savedToFirestore = false;

  const rtdb = getRealtimeDb();
  if (rtdb) {
    try {
      await set(ref(rtdb, `${COLLECTION}/${updated.id}`), {
        ...updated,
        lessonsInOrder: updated.lessonIds ?? [],
      });
      savedToRtdb = true;
    } catch (err) {
      console.warn('[Aura] courseService: RTDB write failed.', err);
    }
  }

  const db = getFirestoreDb();
  if (db) {
    try {
      await setDoc(doc(db, COLLECTION, updated.id), {
        ...updated,
        lessonsInOrder: updated.lessonIds ?? [],
      });
      savedToFirestore = true;
    } catch (err) {
      console.warn('[Aura] courseService: Firestore write failed.', err);
    }
  }

  return { savedToRtdb, savedToFirestore };
}

export function validateCourseForPublish(course: Partial<Course>): string[] {
  const errors: string[] = [];
  if (!course.titleSi || course.titleSi.trim().length < 3) {
    errors.push('සිංහල පාඨමාලා මාතෘකාව (titleSi) අවම අකුරු 3 ක් විය යුතුයි.');
  }
  if (!course.titleEn || course.titleEn.trim().length < 3) {
    errors.push('ඉංග්‍රීසි පාඨමාලා මාතෘකාව (titleEn) අවම අකුරු 3 ක් විය යුතුයි.');
  }
  if (!course.slug || !/^[a-z0-9-]+$/.test(course.slug)) {
    errors.push('Slug එක කුඩා ඉංග්‍රීසි අකුරු, අංක සහ hyphen (-) පමණක් විය යුතුයි.');
  }
  if (!course.descriptionSi || course.descriptionSi.trim().length < 10) {
    errors.push('පාඨමාලා විස්තරය (descriptionSi) අවම අකුරු 10 ක් විය යුතුයි.');
  }
  return errors;
}

export async function fetchCourseBySlug(slug: string): Promise<Course | null> {
  const all = await fetchCourses();
  return all.find((course) => course.slug === slug) ?? null;
}

export async function fetchCourseById(id: string): Promise<Course | null> {
  const rtdb = getRealtimeDb();
  if (rtdb) {
    try {
      const snap = await get(ref(rtdb, `${COLLECTION}/${id}`));
      if (snap.exists()) {
        const data = snap.val() as Course & { lessonsInOrder?: string[] };
        return {
          ...data,
          id,
          lessonIds: data.lessonIds ?? data.lessonsInOrder ?? [],
        };
      }
    } catch (error) {
      console.warn('[Aura] courseService: RTDB get failed, using fallback.', error);
    }
  }

  const db = getFirestoreDb();
  if (db) {
    try {
      const snap = await getDoc(doc(db, COLLECTION, id));
      if (snap.exists()) {
        return { ...(snap.data() as Course), id: snap.id };
      }
    } catch (error) {
      console.warn('[Aura] courseService: Firestore getDoc failed, using seed data.', error);
    }
  }
  return applyCourseOverrides(SEED_COURSES).find((course) => course.id === id) ?? null;
}

function sortCourses(courses: Course[]): Course[] {
  return [...courses].sort((a, b) => a.order - b.order);
}

function applyCourseOverrides(courses: Course[]): Course[] {
  const overrides = getLocalCourseOverrides();
  if (overrides.length === 0) return sortCourses(courses);
  const byId = new Map(overrides.map((c) => [c.id, c]));
  const merged = courses.map((c) => byId.get(c.id) ?? c);
  for (const custom of overrides) {
    if (!merged.some((c) => c.id === custom.id)) {
      merged.push(custom);
    }
  }
  return sortCourses(merged);
}

/**
 * Merge remote courses with bundled seed courses. Remote data always wins for
 * a given id, but seed courses are preserved so the site is never empty.
 */
function mergeWithSeed(remote: Course[]): Course[] {
  const remoteById = new Map(remote.map((c) => [c.id, c]));
  const merged: Course[] = SEED_COURSES.map((seed) => remoteById.get(seed.id) ?? seed);
  for (const course of remote) {
    if (!merged.some((c) => c.id === course.id)) {
      merged.push(course);
    }
  }
  return sortCourses(merged);
}
