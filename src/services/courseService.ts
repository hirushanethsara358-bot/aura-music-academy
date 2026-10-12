import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { Course } from '../types/content';
import { SEED_COURSES } from '../content/courses/seedCourses';
import { getFirestoreDb } from './firebase';

const COLLECTION = 'courses';

/**
 * Fetch all published courses.
 *
 * Design notes:
 * - Uses one-time `getDocs` queries (never `onSnapshot`) to minimise Firestore
 *   reads and stay comfortably inside the Spark free tier.
 * - Falls back to the bundled seed curriculum when Firestore is not configured
 *   or when the collection has not been populated yet.
 */
export async function fetchCourses(): Promise<Course[]> {
  const db = getFirestoreDb();
  if (!db) return sortCourses(SEED_COURSES);

  try {
    const q = query(
      collection(db, COLLECTION),
      where('published', '==', true),
      orderBy('order', 'asc'),
      limit(50)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return sortCourses(SEED_COURSES);

    const remote = snapshot.docs.map((d) => ({ ...(d.data() as Course), id: d.id }));
    return mergeWithSeed(remote);
  } catch (error) {
    console.warn('[Aura] courseService: falling back to seed courses.', error);
    return sortCourses(SEED_COURSES);
  }
}

export async function fetchCourseBySlug(slug: string): Promise<Course | null> {
  const all = await fetchCourses();
  return all.find((course) => course.slug === slug) ?? null;
}

export async function fetchCourseById(id: string): Promise<Course | null> {
  const db = getFirestoreDb();
  if (db) {
    try {
      const snap = await getDoc(doc(db, COLLECTION, id));
      if (snap.exists()) {
        return { ...(snap.data() as Course), id: snap.id };
      }
    } catch (error) {
      console.warn('[Aura] courseService: getDoc failed, using seed data.', error);
    }
  }
  return SEED_COURSES.find((course) => course.id === id) ?? null;
}

function sortCourses(courses: Course[]): Course[] {
  return [...courses].sort((a, b) => a.order - b.order);
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
