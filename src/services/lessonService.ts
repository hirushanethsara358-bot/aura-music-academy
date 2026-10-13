import { equalTo, get, orderByChild, query as rtdbQuery, ref, set } from 'firebase/database';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { Lesson } from '../types/content';
import { ALL_SEED_LESSONS } from '../content/lessons';
import { SEED_COURSES } from '../content/courses/seedCourses';
import { SEED_QUIZZES } from '../content/quizzes';
import { readJson, STORAGE_KEYS, writeJson } from '../lib/storage';
import { getFirestoreDb, getRealtimeDb } from './firebase';

const COLLECTION = 'lessons';

interface LessonOverride {
  lessonId: string;
  published?: boolean;
  order?: number;
  titleSi?: string;
  titleEn?: string;
  descriptionSi?: string;
  updatedAt: string;
}

export function getEditorOverrides(): LessonOverride[] {
  return readJson<LessonOverride[]>(STORAGE_KEYS.editorOverrides, []);
}

export function saveEditorOverride(override: LessonOverride): void {
  const current = getEditorOverrides().filter((o) => o.lessonId !== override.lessonId);
  current.push(override);
  writeJson(STORAGE_KEYS.editorOverrides, current);
}

export function getCustomLessons(): Lesson[] {
  return readJson<Lesson[]>(STORAGE_KEYS.customLessons, []);
}

export function saveCustomLesson(lesson: Lesson): void {
  const current = getCustomLessons().filter((l) => l.id !== lesson.id);
  current.push(lesson);
  writeJson(STORAGE_KEYS.customLessons, current);
}

function applyOverrides(lessons: Lesson[]): Lesson[] {
  const overrides = getEditorOverrides();
  const custom = getCustomLessons();
  const byCustomId = new Map(custom.map((l) => [l.id, l]));
  const merged = lessons.map((l) => byCustomId.get(l.id) ?? l);
  for (const c of custom) {
    if (!merged.some((m) => m.id === c.id)) {
      merged.push(c);
    }
  }

  if (overrides.length === 0) return merged;
  const byId = new Map(overrides.map((o) => [o.lessonId, o]));
  return merged.map((lesson) => {
    const o = byId.get(lesson.id);
    if (!o) return lesson;
    return {
      ...lesson,
      published: o.published ?? lesson.published,
      order: o.order ?? lesson.order,
      titleSi: o.titleSi ?? lesson.titleSi,
      titleEn: o.titleEn ?? lesson.titleEn,
      descriptionSi: o.descriptionSi ?? lesson.descriptionSi,
      updatedAt: o.updatedAt ?? lesson.updatedAt,
    };
  });
}

/**
 * Fetch all published lessons.
 * Checks Firebase Realtime Database (`rtdb`) first when configured, then
 * Cloud Firestore (`db`), using one-time reads only.
 */
export async function fetchPublishedLessons(): Promise<Lesson[]> {
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
        const val = snapshot.val() as Record<string, Lesson>;
        const remote = Object.entries(val).map(([id, data]) => ({
          ...data,
          id,
          prerequisites: data.prerequisites ?? [],
          learningObjectives: data.learningObjectives ?? [],
          sections: data.sections ?? [],
          examples: data.examples ?? [],
          exercises: data.exercises ?? [],
          exerciseIds: data.exerciseIds ?? [],
          quizIds: data.quizIds ?? [],
          furtherPracticeSi: data.furtherPracticeSi ?? [],
        }));
        return applyOverrides(mergeWithSeed(remote)).filter((l) => l.published);
      }
    } catch (error) {
      console.warn('[Aura] lessonService: RTDB read fallback to seed lessons.', error);
    }
  }

  const db = getFirestoreDb();
  if (db) {
    try {
      const q = query(
        collection(db, COLLECTION),
        where('published', '==', true),
        orderBy('order', 'asc'),
        limit(200)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const remote = snapshot.docs.map((d) => ({ ...(d.data() as Lesson), id: d.id }));
        return applyOverrides(mergeWithSeed(remote)).filter((l) => l.published);
      }
    } catch (error) {
      console.warn('[Aura] lessonService: Firestore read fallback to seed lessons.', error);
    }
  }
  return applyOverrides(seedSorted()).filter((l) => l.published);
}

export async function fetchAllLessonsIncludingDrafts(): Promise<Lesson[]> {
  const rtdb = getRealtimeDb();
  if (rtdb) {
    try {
      const snap = await get(ref(rtdb, COLLECTION));
      if (snap.exists()) {
        const val = snap.val() as Record<string, Lesson>;
        const remote = Object.entries(val).map(([id, data]) => ({
          ...data,
          id,
          prerequisites: data.prerequisites ?? [],
          learningObjectives: data.learningObjectives ?? [],
          sections: data.sections ?? [],
          examples: data.examples ?? [],
          exercises: data.exercises ?? [],
          exerciseIds: data.exerciseIds ?? [],
          quizIds: data.quizIds ?? [],
          furtherPracticeSi: data.furtherPracticeSi ?? [],
        }));
        return applyOverrides(mergeWithSeed(remote)).sort(
          (a, b) => a.level - b.level || a.order - b.order
        );
      }
    } catch {
      // Non-admin or offline fallback
    }
  }

  const published = await fetchPublishedLessons();
  const draftOverrides = getEditorOverrides();
  const all = new Map<string, Lesson>();

  for (const lesson of seedSorted()) {
    const overridden = applyOverrides([lesson])[0];
    all.set(lesson.id, overridden);
  }
  for (const lesson of published) {
    all.set(lesson.id, lesson);
  }
  for (const custom of getCustomLessons()) {
    all.set(custom.id, applyOverrides([custom])[0]);
  }
  for (const draft of draftOverrides) {
    if (!all.has(draft.lessonId)) {
      const seed = seedSorted().find((l) => l.id === draft.lessonId);
      if (seed) all.set(seed.id, applyOverrides([seed])[0]);
    }
  }

  return Array.from(all.values()).sort((a, b) => a.level - b.level || a.order - b.order);
}

/**
 * Save a lesson (either edited or newly created) to local overrides + Firebase
 * Realtime Database and/or Cloud Firestore.
 */
export async function saveLessonToCloud(lesson: Lesson): Promise<{
  savedToRtdb: boolean;
  savedToFirestore: boolean;
}> {
  const updated: Lesson = {
    ...lesson,
    updatedAt: new Date().toISOString(),
  };

  saveCustomLesson(updated);
  saveEditorOverride({
    lessonId: updated.id,
    published: updated.published,
    order: updated.order,
    titleSi: updated.titleSi,
    titleEn: updated.titleEn,
    descriptionSi: updated.descriptionSi,
    updatedAt: updated.updatedAt,
  });

  let savedToRtdb = false;
  let savedToFirestore = false;

  const rtdb = getRealtimeDb();
  if (rtdb) {
    try {
      await set(ref(rtdb, `${COLLECTION}/${updated.id}`), updated);
      savedToRtdb = true;
    } catch (err) {
      console.warn('[Aura] lessonService: RTDB write failed.', err);
    }
  }

  const db = getFirestoreDb();
  if (db) {
    try {
      await setDoc(doc(db, COLLECTION, updated.id), updated);
      savedToFirestore = true;
    } catch (err) {
      console.warn('[Aura] lessonService: Firestore write failed.', err);
    }
  }

  return { savedToRtdb, savedToFirestore };
}

/**
 * Seed the bundled curriculum (courses, lessons, quizzes) into Firebase
 * Realtime Database from an authorized admin session.
 */
export async function seedCurriculumToRealtimeDb(): Promise<{
  coursesCount: number;
  lessonsCount: number;
  quizzesCount: number;
}> {
  const rtdb = getRealtimeDb();
  if (!rtdb) {
    throw new Error('Firebase Realtime Database සම්බන්ධ කර නොමැත.');
  }

  for (const course of SEED_COURSES) {
    await set(ref(rtdb, `courses/${course.id}`), {
      ...course,
      lessonsInOrder: course.lessonIds,
    });
  }

  for (const lesson of ALL_SEED_LESSONS) {
    await set(ref(rtdb, `lessons/${lesson.id}`), lesson);
  }

  for (const quiz of SEED_QUIZZES) {
    await set(ref(rtdb, `quizzes/${quiz.id}`), quiz);
  }

  return {
    coursesCount: SEED_COURSES.length,
    lessonsCount: ALL_SEED_LESSONS.length,
    quizzesCount: SEED_QUIZZES.length,
  };
}

export async function fetchLessonBySlug(slug: string): Promise<Lesson | null> {
  const all = await fetchPublishedLessons();
  return all.find((lesson) => lesson.slug === slug) ?? null;
}

export async function fetchLessonById(id: string): Promise<Lesson | null> {
  const rtdb = getRealtimeDb();
  if (rtdb) {
    try {
      const snap = await get(ref(rtdb, `${COLLECTION}/${id}`));
      if (snap.exists()) {
        return applyOverrides([{ ...(snap.val() as Lesson), id }])[0];
      }
    } catch (error) {
      console.warn('[Aura] lessonService: RTDB get failed, using fallback.', error);
    }
  }

  const db = getFirestoreDb();
  if (db) {
    try {
      const snap = await getDoc(doc(db, COLLECTION, id));
      if (snap.exists()) {
        return applyOverrides([{ ...(snap.data() as Lesson), id: snap.id }])[0];
      }
    } catch (error) {
      console.warn('[Aura] lessonService: Firestore getDoc failed, using seed data.', error);
    }
  }
  const seed = ALL_SEED_LESSONS.find((lesson) => lesson.id === id) ??
    getCustomLessons().find((lesson) => lesson.id === id);
  return seed ? applyOverrides([seed])[0] : null;
}

export async function fetchLessonsByCourse(courseId: string): Promise<Lesson[]> {
  const all = await fetchPublishedLessons();
  return all.filter((lesson) => lesson.courseId === courseId).sort((a, b) => a.order - b.order);
}

/**
 * Normalised search across Sinhala titles, English titles, descriptions,
 * key terms, learning objectives and glossary-style terminology.
 */
export function searchLessons(lessons: Lesson[], rawQuery: string): Lesson[] {
  const term = rawQuery.trim().toLowerCase();
  if (term.length === 0) return [];

  return lessons.filter((lesson) => {
    const haystack = [
      lesson.titleSi,
      lesson.titleEn,
      lesson.descriptionSi,
      lesson.summarySi,
      ...lesson.learningObjectives,
      ...lesson.sections.flatMap((s) => [
        s.headingSi,
        s.headingEn,
        s.bodySi,
        ...(s.keyTerms?.flatMap((k) => [k.termEn, k.termSi, k.definitionSi]) ?? []),
      ]),
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(term);
  });
}

function seedSorted(): Lesson[] {
  return [...ALL_SEED_LESSONS].sort((a, b) => a.level - b.level || a.order - b.order);
}

function mergeWithSeed(remote: Lesson[]): Lesson[] {
  const remoteById = new Map(remote.map((l) => [l.id, l]));
  const merged: Lesson[] = ALL_SEED_LESSONS.map((seed) => remoteById.get(seed.id) ?? seed);
  for (const lesson of remote) {
    if (!merged.some((l) => l.id === lesson.id)) {
      merged.push(lesson);
    }
  }
  return merged.sort((a, b) => a.level - b.level || a.order - b.order);
}

/**
 * Validate a lesson for publishing. Returns a list of human-readable
 * Sinhala validation messages; an empty array means the lesson is valid.
 */
export function validateLessonForPublish(lesson: Partial<Lesson>): string[] {
  const errors: string[] = [];
  if (!lesson.titleSi || lesson.titleSi.trim().length < 3) {
    errors.push('සිංහල මාතෘකාව (titleSi) අවම අකුරු 3 ක් විය යුතුයි.');
  }
  if (!lesson.titleEn || lesson.titleEn.trim().length < 3) {
    errors.push('ඉංග්‍රීසි මාතෘකාව (titleEn) අවම අකුරු 3 ක් විය යුතුයි.');
  }
  if (!lesson.slug || !/^[a-z0-9-]+$/.test(lesson.slug)) {
    errors.push('Slug එක අකුරු කුඩා ඉංග්‍රීසි, අංක සහ hyphen (-) පමණක් විය යුතුයි.');
  }
  if (!lesson.courseId) {
    errors.push('Course එකක් තෝරාගත යුතුයි.');
  }
  if (!lesson.descriptionSi || lesson.descriptionSi.trim().length < 10) {
    errors.push('සිංහල විස්තරය අවම අකුරු 10 ක් විය යුතුයි.');
  }
  if (!lesson.estimatedMinutes || lesson.estimatedMinutes <= 0) {
    errors.push('ඇස්තමේන්තුගත මිනිත්තු ගණන 0 ට වඩා වැඩි විය යුතුයි.');
  }
  if (!lesson.sections || lesson.sections.length === 0) {
    errors.push('අවම වශයෙන් එක් අංශයක් (Section) වත් තිබිය යුතුයි.');
  }
  if (!lesson.learningObjectives || lesson.learningObjectives.length === 0) {
    errors.push('අවම වශයෙන් එක් ඉගෙනුම් අරමුණක් වත් තිබිය යුතුයි.');
  }
  if (!lesson.summarySi || lesson.summarySi.trim().length < 10) {
    errors.push('සාරාංශයක් (Summary) අවශ්‍යයි.');
  }
  return errors;
}
