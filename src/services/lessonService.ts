import { collection, doc, getDoc, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { Lesson } from '../types/content';
import { ALL_SEED_LESSONS } from '../content/lessons';
import { readJson, STORAGE_KEYS, writeJson } from '../lib/storage';
import { getFirestoreDb } from './firebase';

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

function applyOverrides(lessons: Lesson[]): Lesson[] {
  const overrides = getEditorOverrides();
  if (overrides.length === 0) return lessons;
  const byId = new Map(overrides.map((o) => [o.lessonId, o]));
  return lessons.map((lesson) => {
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
 * One-time `getDocs` only — no real-time listeners are used.
 */
export async function fetchPublishedLessons(): Promise<Lesson[]> {
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
        return applyOverrides(mergeWithSeed(remote));
      }
    } catch (error) {
      console.warn('[Aura] lessonService: falling back to seed lessons.', error);
    }
  }
  return applyOverrides(seedSorted());
}

export async function fetchAllLessonsIncludingDrafts(): Promise<Lesson[]> {
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
  for (const draft of draftOverrides) {
    if (!all.has(draft.lessonId)) {
      const seed = seedSorted().find((l) => l.id === draft.lessonId);
      if (seed) all.set(seed.id, applyOverrides([seed])[0]);
    }
  }

  return Array.from(all.values()).sort((a, b) => a.level - b.level || a.order - b.order);
}

export async function fetchLessonBySlug(slug: string): Promise<Lesson | null> {
  const all = await fetchPublishedLessons();
  return all.find((lesson) => lesson.slug === slug) ?? null;
}

export async function fetchLessonById(id: string): Promise<Lesson | null> {
  const db = getFirestoreDb();
  if (db) {
    try {
      const snap = await getDoc(doc(db, COLLECTION, id));
      if (snap.exists()) {
        return applyOverrides([{ ...(snap.data() as Lesson), id: snap.id }])[0];
      }
    } catch (error) {
      console.warn('[Aura] lessonService: getDoc failed, using seed data.', error);
    }
  }
  const seed = ALL_SEED_LESSONS.find((lesson) => lesson.id === id);
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
