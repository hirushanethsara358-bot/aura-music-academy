import { equalTo, get, orderByChild, query as rtdbQuery, ref, set } from 'firebase/database';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import { Quiz, QuizAttempt, QuizQuestion } from '../types/content';
import { SEED_QUIZZES } from '../content/quizzes';
import { readJson, STORAGE_KEYS, writeJson } from '../lib/storage';
import { getFirestoreDb, getRealtimeDb } from './firebase';

export type AnswerValue = string | string[] | number;

export interface GradedQuestion {
  questionId: string;
  correct: boolean;
  correctAnswerSummarySi: string;
  userAnswerSummarySi: string;
  explanationSi: string;
}

export interface QuizGradeResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  graded: GradedQuestion[];
}

export async function fetchQuizByLessonId(lessonId: string): Promise<Quiz | null> {
  const rtdb = getRealtimeDb();
  if (rtdb) {
    try {
      const q = rtdbQuery(
        ref(rtdb, 'quizzes'),
        orderByChild('lessonId'),
        equalTo(lessonId)
      );
      const snap = await get(q);
      if (snap.exists()) {
        const val = snap.val() as Record<string, Quiz>;
        const firstEntry = Object.entries(val)[0];
        if (firstEntry) {
          const [id, data] = firstEntry;
          return { ...data, id, questions: data.questions ?? [] };
        }
      }
    } catch (error) {
      console.warn('[Aura] quizService: RTDB quiz read failed, using seed quiz.', error);
    }
  }

  const db = getFirestoreDb();
  if (db) {
    try {
      const q = query(
        collection(db, 'quizzes'),
        where('lessonId', '==', lessonId),
        limit(1)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const d = snapshot.docs[0];
        return { ...(d.data() as Quiz), id: d.id };
      }
    } catch (error) {
      console.warn('[Aura] quizService: Firestore quiz read failed, using seed quiz.', error);
    }
  }
  return SEED_QUIZZES.find((quiz) => quiz.lessonId === lessonId) ?? null;
}

export async function fetchQuizById(quizId: string): Promise<Quiz | null> {
  const rtdb = getRealtimeDb();
  if (rtdb) {
    try {
      const snap = await get(ref(rtdb, `quizzes/${quizId}`));
      if (snap.exists()) {
        const data = snap.val() as Quiz;
        return { ...data, id: quizId, questions: data.questions ?? [] };
      }
    } catch (error) {
      console.warn('[Aura] quizService: RTDB get failed.', error);
    }
  }

  const db = getFirestoreDb();
  if (db) {
    try {
      const snap = await getDoc(doc(db, 'quizzes', quizId));
      if (snap.exists()) return { ...(snap.data() as Quiz), id: snap.id };
    } catch (error) {
      console.warn('[Aura] quizService: Firestore getDoc failed.', error);
    }
  }
  return SEED_QUIZZES.find((quiz) => quiz.id === quizId) ?? null;
}

/**
 * Randomise question order for practice sessions.
 * Uses the Fisher–Yates shuffle.
 */
export function shuffleQuestions(
  questions: QuizQuestion[],
  seedRandom: () => number = Math.random
): QuizQuestion[] {
  const copy = [...questions];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(seedRandom() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Split a Sinhala prompt so the question body and stem read cleanly. */
export function summariseAnswer(question: QuizQuestion, answer: AnswerValue | undefined): string {
  if (answer === undefined || answer === null || answer === '') return 'පිළිතුරක් ලබා දී නැත';

  if (question.type === 'numeric') {
    return `${answer}${question.numericUnit ? ` ${question.numericUnit}` : ''}`;
  }

  if (question.type === 'checklist') {
    const ids = Array.isArray(answer) ? answer : [String(answer)];
    return ids
      .map((id) => question.checklistItems?.find((c) => c.id === id)?.labelSi ?? id)
      .join(', ');
  }

  const ids = Array.isArray(answer) ? answer : [String(answer)];
  return ids
    .map((id) => question.options?.find((o) => o.id === id)?.labelSi ?? id)
    .join(', ');
}

function correctAnswerSummary(question: QuizQuestion): string {
  if (question.type === 'numeric') {
    return `${question.correctNumber}${question.numericUnit ? ` ${question.numericUnit}` : ''}${
      question.numericTolerance ? ` (±${question.numericTolerance})` : ''
    }`;
  }
  if (question.type === 'checklist') {
    return (question.correctOptionIds ?? [])
      .map((id) => question.checklistItems?.find((c) => c.id === id)?.labelSi ?? id)
      .join(', ');
  }
  if (question.type === 'multiple-choice') {
    return (question.correctOptionIds ?? [])
      .map((id) => question.options?.find((o) => o.id === id)?.labelSi ?? id)
      .join(', ');
  }
  return question.options?.find((o) => o.id === question.correctOptionId)?.labelSi ?? '';
}

/**
 * Grade a completed quiz.
 *
 * SECURITY NOTE: Client-side grading is deliberately designed for low-stakes
 * practice only, never for certification. Answers live in the seeded/remote
 * quiz document and are visible to any client that can read the quiz. Do not
 * use this engine to issue credentials or grant privileges.
 */
export function gradeQuiz(
  quiz: Quiz,
  answers: Record<string, AnswerValue>
): QuizGradeResult {
  const graded: GradedQuestion[] = [];
  let score = 0;

  for (const question of quiz.questions) {
    const answer = answers[question.id];
    let correct = false;

    switch (question.type) {
      case 'single-choice':
      case 'note-identification':
      case 'chord-identification':
      case 'interval-identification':
      case 'rhythm-recognition': {
        correct = typeof answer === 'string' && answer === question.correctOptionId;
        break;
      }
      case 'multiple-choice':
      case 'checklist': {
        const expected = [...(question.correctOptionIds ?? [])].sort();
        const given = (Array.isArray(answer) ? [...answer] : []).sort();
        correct =
          expected.length > 0 &&
          expected.length === given.length &&
          expected.every((v, i) => v === given[i]);
        break;
      }
      case 'numeric': {
        const value = typeof answer === 'number' ? answer : Number(answer);
        const tolerance = question.numericTolerance ?? 0;
        correct =
          Number.isFinite(value) &&
          question.correctNumber !== undefined &&
          Math.abs(value - question.correctNumber) <= tolerance;
        break;
      }
      default:
        correct = false;
    }

    if (correct) score += 1;

    graded.push({
      questionId: question.id,
      correct,
      correctAnswerSummarySi: correctAnswerSummary(question),
      userAnswerSummarySi: summariseAnswer(question, answer),
      explanationSi: question.explanationSi,
    });
  }

  const totalQuestions = quiz.questions.length;
  const percentage = totalQuestions === 0 ? 0 : Math.round((score / totalQuestions) * 100);

  return {
    score,
    totalQuestions,
    percentage,
    passed: percentage >= quiz.passingPercentage,
    graded,
  };
}

export async function saveQuizAttempt(
  uid: string,
  quiz: Quiz,
  answers: Record<string, AnswerValue>,
  result: QuizGradeResult
): Promise<QuizAttempt> {
  const createdAt = new Date().toISOString();
  const attemptId = `attempt-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  const attempt: QuizAttempt = {
    id: attemptId,
    uid,
    quizId: quiz.id,
    lessonId: quiz.lessonId,
    answers,
    score: result.score,
    totalQuestions: result.totalQuestions,
    percentage: result.percentage,
    passed: result.passed,
    createdAt,
  };

  const rtdb = getRealtimeDb();
  if (rtdb) {
    try {
      await set(ref(rtdb, `quizAttempts/${uid}/${attemptId}`), attempt);
    } catch (error) {
      console.warn('[Aura] quizService: RTDB attempt write failed; keeping locally.', error);
    }
  }

  const db = getFirestoreDb();
  if (db) {
    try {
      const refDoc = await addDoc(collection(db, 'quizAttempts'), {
        uid,
        quizId: quiz.id,
        lessonId: quiz.lessonId,
        answers,
        score: result.score,
        totalQuestions: result.totalQuestions,
        percentage: result.percentage,
        passed: result.passed,
        createdAt: serverTimestamp(),
      });
      attempt.id = refDoc.id;
    } catch (error) {
      console.warn('[Aura] quizService: Firestore attempt write failed; keeping locally.', error);
    }
  }

  const local = readJson<QuizAttempt[]>(`${STORAGE_KEYS.quizAttempts}::${uid}`, []);
  local.push(attempt);
  writeJson(`${STORAGE_KEYS.quizAttempts}::${uid}`, local.slice(-100));
  return attempt;
}

export async function fetchQuizAttempts(uid: string): Promise<QuizAttempt[]> {
  const rtdb = getRealtimeDb();
  if (rtdb) {
    try {
      const snap = await get(ref(rtdb, `quizAttempts/${uid}`));
      if (snap.exists()) {
        const val = snap.val() as Record<string, QuizAttempt>;
        return Object.entries(val)
          .map(([id, data]) => ({ ...data, id }))
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      }
    } catch (error) {
      console.warn('[Aura] quizService: RTDB attempt read failed.', error);
    }
  }

  const db = getFirestoreDb();
  if (db) {
    try {
      const q = query(
        collection(db, 'quizAttempts'),
        where('uid', '==', uid),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map((d) => ({ ...(d.data() as QuizAttempt), id: d.id }));
      }
    } catch (error) {
      console.warn('[Aura] quizService: Firestore attempt read failed, using local cache.', error);
    }
  }
  return readJson<QuizAttempt[]>(`${STORAGE_KEYS.quizAttempts}::${uid}`, []);
}
