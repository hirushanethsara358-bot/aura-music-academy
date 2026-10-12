import { Lesson } from '../../types/content';
import { SEED_LESSONS } from './seedLessons';
import { SEED_LESSONS_THEORY_COMPOSITION } from './seedLessonsAdvanced';
import { SEED_LESSONS_AUDIO } from './seedLessonsAudio';
import { SEED_LESSONS_COMPLETION } from './seedLessonsPersonal';

/**
 * Complete seed curriculum across all 9 learning levels.
 * Lessons are ordered by their `order` field within each course.
 */
export const ALL_SEED_LESSONS: Lesson[] = [
  ...SEED_LESSONS,
  ...SEED_LESSONS_THEORY_COMPOSITION,
  ...SEED_LESSONS_AUDIO,
  ...SEED_LESSONS_COMPLETION,
];

export { GLOSSARY_TERMS } from './glossary';
