import { beforeEach, describe, expect, it } from 'vitest';
import { gradeQuiz, shuffleQuestions, summariseAnswer } from '../services/quizService';
import { computeProgressStats } from '../services/progressService';
import { validateLessonForPublish } from '../services/lessonService';
import { SEED_QUIZZES } from '../content/quizzes/seedQuizzes';
import { Quiz } from '../types/content';
import { friendlyAuthError } from '../services/authService';
import { readJson, removeKey, STORAGE_KEYS, writeJson } from '../lib/storage';

function buildQuiz(overrides: Partial<Quiz> = {}): Quiz {
  return {
    id: 'quiz-test',
    lessonId: 'lesson-test',
    titleSi: 'පරීක්ෂණ ප්‍රශ්නාවලිය',
    titleEn: 'Test Quiz',
    descriptionSi: 'පරීක්ෂණය සඳහා',
    passingPercentage: 60,
    questions: [],
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('Quiz grading — single choice', () => {
  const quiz = buildQuiz({
    questions: [
      {
        id: 'q1',
        type: 'single-choice',
        promptSi: 'C සිට D දක්වා පරතරය කුමක්ද?',
        promptEn: 'What is C to D?',
        options: [
          { id: 'a', labelSi: 'Semitone' },
          { id: 'b', labelSi: 'Whole Tone' },
        ],
        correctOptionId: 'b',
        explanationSi: 'එය පූර්ණ ස්වරයකි.',
      },
      {
        id: 'q2',
        type: 'single-choice',
        promptSi: 'A4 සංඛ්‍යාතය කුමක්ද?',
        promptEn: 'A4 frequency?',
        options: [
          { id: 'a', labelSi: '440 Hz' },
          { id: 'b', labelSi: '220 Hz' },
        ],
        correctOptionId: 'a',
        explanationSi: 'A4 = 440 Hz.',
      },
    ],
  });

  it('scores a fully correct attempt at 100% and marks it passed', () => {
    const result = gradeQuiz(quiz, { q1: 'b', q2: 'a' });
    expect(result.score).toBe(2);
    expect(result.percentage).toBe(100);
    expect(result.passed).toBe(true);
  });

  it('scores a half-correct attempt at 50% and marks it failed', () => {
    const result = gradeQuiz(quiz, { q1: 'b', q2: 'b' });
    expect(result.score).toBe(1);
    expect(result.percentage).toBe(50);
    expect(result.passed).toBe(false);
  });

  it('treats an unanswered question as incorrect rather than crashing', () => {
    const result = gradeQuiz(quiz, {});
    expect(result.score).toBe(0);
    expect(result.totalQuestions).toBe(2);
    expect(result.graded[0].userAnswerSummarySi).toContain('පිළිතුරක් ලබා දී නැත');
  });

  it('always provides the correct answer and explanation for feedback', () => {
    const result = gradeQuiz(quiz, { q1: 'a', q2: 'a' });
    expect(result.graded[0].correct).toBe(false);
    expect(result.graded[0].correctAnswerSummarySi).toBe('Whole Tone');
    expect(result.graded[0].explanationSi.length).toBeGreaterThan(0);
  });
});

describe('Quiz grading — multiple choice and checklist', () => {
  const quiz = buildQuiz({
    passingPercentage: 50,
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        promptSi: 'සංගීත අංග තෝරන්න',
        promptEn: 'Select music elements',
        options: [
          { id: 'a', labelSi: 'Pitch' },
          { id: 'b', labelSi: 'Rhythm' },
          { id: 'c', labelSi: 'File Size' },
        ],
        correctOptionIds: ['a', 'b'],
        explanationSi: 'Pitch සහ Rhythm සංගීත අංග වේ.',
      },
      {
        id: 'q2',
        type: 'checklist',
        promptSi: 'පියවර තෝරන්න',
        promptEn: 'Select steps',
        checklistItems: [
          { id: 'c1', labelSi: 'පියවර 1' },
          { id: 'c2', labelSi: 'පියවර 2' },
        ],
        correctOptionIds: ['c1', 'c2'],
        explanationSi: 'පියවර දෙකම අවශ්‍යයි.',
      },
    ],
  });

  it('accepts an exact selection regardless of order', () => {
    const result = gradeQuiz(quiz, { q1: ['b', 'a'], q2: ['c2', 'c1'] });
    expect(result.score).toBe(2);
    expect(result.passed).toBe(true);
  });

  it('rejects a partial selection', () => {
    const result = gradeQuiz(quiz, { q1: ['a'], q2: ['c1', 'c2'] });
    expect(result.graded[0].correct).toBe(false);
  });

  it('rejects an over-selection containing the correct answers plus extras', () => {
    const result = gradeQuiz(quiz, { q1: ['a', 'b', 'c'], q2: ['c1', 'c2'] });
    expect(result.graded[0].correct).toBe(false);
  });
});

describe('Quiz grading — numeric answers', () => {
  const quiz = buildQuiz({
    passingPercentage: 50,
    questions: [
      {
        id: 'q1',
        type: 'numeric',
        promptSi: 'A5 සංඛ්‍යාතය කුමක්ද?',
        promptEn: 'Frequency of A5?',
        correctNumber: 880,
        numericTolerance: 1,
        numericUnit: 'Hz',
        explanationSi: 'A5 = 880 Hz.',
      },
    ],
  });

  it('accepts an exact numeric answer', () => {
    expect(gradeQuiz(quiz, { q1: 880 }).graded[0].correct).toBe(true);
  });

  it('accepts a value within the stated tolerance', () => {
    expect(gradeQuiz(quiz, { q1: 881 }).graded[0].correct).toBe(true);
    expect(gradeQuiz(quiz, { q1: 879 }).graded[0].correct).toBe(true);
  });

  it('rejects a value outside the tolerance', () => {
    expect(gradeQuiz(quiz, { q1: 883 }).graded[0].correct).toBe(false);
  });

  it('rejects non-numeric input safely', () => {
    expect(gradeQuiz(quiz, { q1: 'not a number' }).graded[0].correct).toBe(false);
    expect(gradeQuiz(quiz, { q1: Number.NaN }).graded[0].correct).toBe(false);
  });

  it('formats the numeric answer summary with its unit', () => {
    const result = gradeQuiz(quiz, { q1: 880 });
    expect(result.graded[0].userAnswerSummarySi).toBe('880 Hz');
  });

  it('always includes the tolerance in the correct-answer summary', () => {
    const result = gradeQuiz(quiz, { q1: 500 });
    expect(result.graded[0].correctAnswerSummarySi).toContain('±1');
  });
});

describe('Quiz grading — edge cases', () => {
  it('handles a quiz with zero questions without dividing by zero', () => {
    const result = gradeQuiz(buildQuiz(), {});
    expect(result.percentage).toBe(0);
    expect(result.totalQuestions).toBe(0);
    expect(Number.isNaN(result.percentage)).toBe(false);
  });

  it('honours a stricter passing percentage', () => {
    const quiz = buildQuiz({
      passingPercentage: 100,
      questions: [
        {
          id: 'q1',
          type: 'single-choice',
          promptSi: 'ප්‍රශ්නය',
          promptEn: 'Question',
          options: [
            { id: 'a', labelSi: 'A' },
            { id: 'b', labelSi: 'B' },
          ],
          correctOptionId: 'a',
          explanationSi: 'පැහැදිලි කිරීම',
        },
      ],
    });
    // A client-side grading quirk: 'a' is correct so this passes.
    expect(gradeQuiz(quiz, { q1: 'a' }).passed).toBe(true);
    expect(gradeQuiz(quiz, { q1: 'b' }).passed).toBe(false);
  });

  it('shuffles without losing or duplicating questions', () => {
    const questions = SEED_QUIZZES[0].questions;
    let seed = 42;
    const deterministic = () => {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      return seed / 2147483648;
    };
    const shuffled = shuffleQuestions(questions, deterministic);
    expect(shuffled).toHaveLength(questions.length);
    expect(new Set(shuffled.map((q) => q.id)).size).toBe(questions.length);
    expect(new Set(shuffled.map((q) => q.id))).toEqual(new Set(questions.map((q) => q.id)));
  });

  it('summarises unanswered multiple-choice questions safely', () => {
    const summary = summariseAnswer(
      {
        id: 'q',
        type: 'multiple-choice',
        promptSi: 'x',
        promptEn: 'x',
        options: [{ id: 'a', labelSi: 'A' }],
        explanationSi: 'x',
      },
      undefined
    );
    expect(summary).toContain('පිළිතුරක් ලබා දී නැත');
  });
});

describe('Real seeded quizzes are self-consistent', () => {
  it('marks a single declared correct option in every single-choice question', () => {
    for (const quiz of SEED_QUIZZES) {
      for (const question of quiz.questions) {
        if (
          question.type === 'single-choice' ||
          question.type === 'note-identification' ||
          question.type === 'chord-identification' ||
          question.type === 'interval-identification' ||
          question.type === 'rhythm-recognition'
        ) {
          expect(question.correctOptionId).toBeDefined();
          expect(question.options?.some((o) => o.id === question.correctOptionId)).toBe(true);
        }
      }
    }
  });

  it('gives every multi-answer question at least one correct option', () => {
    for (const quiz of SEED_QUIZZES) {
      for (const question of quiz.questions) {
        if (question.type === 'multiple-choice' || question.type === 'checklist') {
          expect(question.correctOptionIds?.length ?? 0).toBeGreaterThan(0);
        }
      }
    }
  });

  it('gives every numeric question a defined correct value', () => {
    for (const quiz of SEED_QUIZZES) {
      for (const question of quiz.questions) {
        if (question.type === 'numeric') {
          expect(typeof question.correctNumber).toBe('number');
        }
      }
    }
  });

  it('provides an explanation in Sinhala for every question', () => {
    for (const quiz of SEED_QUIZZES) {
      for (const question of quiz.questions) {
        expect(question.explanationSi.length).toBeGreaterThan(5);
      }
    }
  });

  it('awards full marks when every question is answered correctly', () => {
    for (const quiz of SEED_QUIZZES) {
      const answers: Record<string, string | string[] | number> = {};
      for (const q of quiz.questions) {
        if (q.type === 'numeric') answers[q.id] = q.correctNumber ?? 0;
        else if (q.type === 'multiple-choice' || q.type === 'checklist')
          answers[q.id] = [...(q.correctOptionIds ?? [])];
        else answers[q.id] = q.correctOptionId ?? '';
      }
      const result = gradeQuiz(quiz, answers);
      expect(result.score, `quiz ${quiz.id} should score full marks`).toBe(quiz.questions.length);
      expect(result.passed).toBe(true);
    }
  });
});

describe('Progress calculation', () => {
  const lessons = [
    { id: 'l1', level: 1 },
    { id: 'l2', level: 1 },
    { id: 'l3', level: 2 },
    { id: 'l4', level: 2 },
  ];

  beforeEach(() => {
    localStorage.clear();
  });

  it('returns 0% when nothing has been completed', () => {
    const stats = computeProgressStats('u1', lessons, [], 0);
    expect(stats.completionPercentage).toBe(0);
    expect(stats.completedLessons).toBe(0);
    expect(stats.totalPublishedLessons).toBe(4);
  });

  it('derives the percentage from actual published lessons, never a hardcoded value', () => {
    const stats = computeProgressStats(
      'u1',
      lessons,
      [
        { uid: 'u1', lessonId: 'l1', completed: true, lastVisitedAt: '', completedAt: '', updatedAt: '' },
        { uid: 'u1', lessonId: 'l2', completed: true, lastVisitedAt: '', completedAt: '', updatedAt: '' },
      ],
      0
    );
    expect(stats.completedLessons).toBe(2);
    expect(stats.completionPercentage).toBe(50);
    expect(stats.completionPercentage).not.toBe(100);
  });

  it('reaches exactly 100% only when every published lesson is complete', () => {
    const stats = computeProgressStats(
      'u1',
      lessons,
      lessons.map((l) => ({
        uid: 'u1',
        lessonId: l.id,
        completed: true,
        lastVisitedAt: '',
        completedAt: '',
        updatedAt: '',
      })),
      0
    );
    expect(stats.completionPercentage).toBe(100);
  });

  it('ignores completion records for lessons that are not published', () => {
    const stats = computeProgressStats(
      'u1',
      lessons,
      [
        { uid: 'u1', lessonId: 'deleted-lesson', completed: true, lastVisitedAt: '', completedAt: '', updatedAt: '' },
      ],
      0
    );
    expect(stats.completedLessons).toBe(0);
    expect(stats.completionPercentage).toBe(0);
  });

  it('counts a lesson as incomplete when completed is false', () => {
    const stats = computeProgressStats(
      'u1',
      lessons,
      [
        { uid: 'u1', lessonId: 'l1', completed: false, lastVisitedAt: '', completedAt: null, updatedAt: '' },
      ],
      0
    );
    expect(stats.completedLessons).toBe(0);
  });

  it('never divides by zero when the catalogue is empty', () => {
    const stats = computeProgressStats('u1', [], [], 0);
    expect(stats.completionPercentage).toBe(0);
    expect(Number.isNaN(stats.completionPercentage)).toBe(false);
  });

  it('builds a per-level breakdown summing to the total', () => {
    const stats = computeProgressStats(
      'u1',
      lessons,
      [
        { uid: 'u1', lessonId: 'l1', completed: true, lastVisitedAt: '', completedAt: '', updatedAt: '' },
      ],
      0
    );
    expect(stats.levelBreakdown).toHaveLength(2);
    expect(stats.levelBreakdown[0]).toMatchObject({ level: 1, completed: 1, total: 2, percentage: 50 });
    expect(stats.levelBreakdown[1]).toMatchObject({ level: 2, completed: 0, total: 2, percentage: 0 });
  });

  it('reports the bookmark count that is passed in', () => {
    const stats = computeProgressStats('u1', lessons, [], 3);
    expect(stats.bookmarkedLessons).toBe(3);
  });
});

describe('Lesson publishing validation', () => {
  const valid = {
    titleSi: 'සංගීත මූලධර්ම',
    titleEn: 'Music Foundations',
    slug: 'music-foundations',
    courseId: 'course-level-1',
    descriptionSi: 'මෙය සම්පූර්ණ විස්තරයකි.',
    estimatedMinutes: 15,
    sections: [{ id: 's1', headingSi: 'අංශය', headingEn: 'Section', bodySi: 'අන්තර්ගතය' }],
    learningObjectives: ['ඉගෙන ගැනීම'],
    summarySi: 'මෙය සාරාංශයකි.',
  };

  it('accepts a fully populated lesson', () => {
    expect(validateLessonForPublish(valid)).toHaveLength(0);
  });

  it('rejects a missing Sinhala title', () => {
    const errors = validateLessonForPublish({ ...valid, titleSi: '' });
    expect(errors.some((e) => e.includes('සිංහල මාතෘකාව'))).toBe(true);
  });

  it('rejects a slug containing uppercase or spaces', () => {
    expect(validateLessonForPublish({ ...valid, slug: 'Bad Slug' })).toHaveLength(1);
  });

  it('rejects a lesson with no sections', () => {
    expect(validateLessonForPublish({ ...valid, sections: [] })).toHaveLength(1);
  });

  it('rejects a zero-minute lesson', () => {
    expect(validateLessonForPublish({ ...valid, estimatedMinutes: 0 })).toHaveLength(1);
  });

  it('reports every problem at once rather than only the first', () => {
    const errors = validateLessonForPublish({
      titleSi: '',
      titleEn: '',
      slug: 'BAD',
      descriptionSi: 'x',
      estimatedMinutes: 0,
      sections: [],
      learningObjectives: [],
      summarySi: '',
    });
    expect(errors.length).toBeGreaterThanOrEqual(6);
  });
});

describe('Authentication error localisation', () => {
  it('translates known Firebase error codes into Sinhala', () => {
    expect(friendlyAuthError({ code: 'auth/wrong-password' })).toContain('මුරපදය');
    expect(friendlyAuthError({ code: 'auth/user-not-found' })).toContain('ගිණුමක් නොමැත');
    expect(friendlyAuthError({ code: 'auth/invalid-email' })).toContain('ඊමේල්');
    expect(friendlyAuthError({ code: 'auth/too-many-requests' })).toContain('උත්සාහ');
  });

  it('falls back to a generic Sinhala message for unknown codes', () => {
    const message = friendlyAuthError({ code: 'auth/some-new-code' });
    expect(message).toContain('දෝෂයක්');
  });

  it('never leaks raw English Firebase text to the learner', () => {
    expect(friendlyAuthError({ code: 'auth/network-request-failed' })).not.toContain('network');
  });
});

describe('Local storage safety', () => {
  it('round-trips JSON values', () => {
    writeJson('test-key', { a: 1, b: 'two' });
    expect(readJson('test-key', null)).toEqual({ a: 1, b: 'two' });
  });

  it('returns the fallback for a missing key', () => {
    expect(readJson('missing-key', 'fallback')).toBe('fallback');
  });

  it('returns the fallback when stored data is corrupt', () => {
    localStorage.setItem('aura::v1::corrupt', '{not valid json');
    expect(readJson('corrupt', 'fallback')).toBe('fallback');
  });

  it('removes keys cleanly', () => {
    writeJson('temp', 1);
    removeKey('temp');
    expect(readJson('temp', null)).toBeNull();
  });

  it('namespaces keys so unrelated stored data cannot collide', () => {
    writeJson(STORAGE_KEYS.theme, 'dark');
    expect(localStorage.getItem('aura::v1::theme')).toBe('"dark"');
  });
});
