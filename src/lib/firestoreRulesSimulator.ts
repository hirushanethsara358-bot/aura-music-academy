/**
 * Firestore Security Rules simulator.
 *
 * WHY THIS EXISTS
 * ---------------
 * The authoritative security control for Aura Music Academy is
 * `firebase/firestore.rules`, executed by Google's servers. Ideally it is
 * verified with the Firebase Emulator Suite (`firebase emulators:exec`), but
 * that requires a Java runtime and a large `firebase-tools` install which is
 * not available in every development environment (and is explicitly avoided
 * for very low-spec machines).
 *
 * This module is a faithful, hand-maintained re-implementation of the same
 * decision logic. It lets the test suite prove — automatically and cheaply —
 * that the intended authorisation boundaries hold. It is a TEST AID, never a
 * runtime security control: the client never uses it to gate data access, and
 * `firestore.rules` remains the source of truth.
 *
 * When the emulator IS available, run:
 *   firebase emulators:exec --only firestore "npx vitest run"
 */

export interface RuleAuth {
  uid: string | null;
  token: {
    admin?: boolean;
  };
}

export interface RuleRequest {
  auth: RuleAuth;
  data?: Record<string, unknown>;
}

export type Operation = 'read' | 'create' | 'update' | 'delete';

export interface ResourcePath {
  collection: string;
  id: string;
  /** Path segments for sub-collections: users/{uid}/progress/{lessonId} */
  ownerUid?: string;
}

const ANONYMOUS: RuleAuth = { uid: null, token: {} };

function isSignedIn(auth: RuleAuth): boolean {
  return auth.uid !== null && auth.uid !== undefined && auth.uid.length > 0;
}

function isAdmin(auth: RuleAuth): boolean {
  return isSignedIn(auth) && auth.token.admin === true;
}

function isOwner(auth: RuleAuth, uid: string): boolean {
  return isSignedIn(auth) && auth.uid === uid;
}

function isValidId(id: string): boolean {
  return /^[A-Za-z0-9_.:-]+$/.test(id) && id.length >= 1 && id.length <= 128;
}

function boundedString(value: unknown, maxLength: number): boolean {
  return typeof value === 'string' && value.length > 0 && value.length <= maxLength;
}

function boundedStringList(value: unknown, maxItems: number, maxLength: number): boolean {
  return (
    Array.isArray(value) &&
    value.length <= maxItems &&
    value.reduce((sum: number, item) => sum + String(item).length, 0) <= maxItems * maxLength
  );
}

function hasOnlyKeys(data: Record<string, unknown>, allowed: string[]): boolean {
  return Object.keys(data).every((key) => allowed.includes(key));
}

const COURSE_ALLOWED_KEYS = [
  'id', 'slug', 'titleSi', 'titleEn', 'descriptionSi', 'category', 'level',
  'lessonIds', 'lessonsInOrder', 'plannedTotalLessons', 'outcomesSi',
  'published', 'order', 'updatedAt',
];

const LESSON_ALLOWED_KEYS = [
  'id', 'slug', 'courseId', 'titleSi', 'titleEn', 'descriptionSi', 'category',
  'level', 'prerequisites', 'estimatedMinutes', 'learningObjectives',
  'sections', 'examples', 'exercises', 'exerciseIds', 'quizIds',
  'summarySi', 'furtherPracticeSi', 'published', 'order', 'updatedAt',
];

const PROGRESS_ALLOWED_KEYS = [
  'uid', 'lessonId', 'completed', 'lastVisitedAt', 'completedAt', 'updatedAt',
];

const BOOKMARK_ALLOWED_KEYS = ['uid', 'lessonId', 'createdAt'];

const ATTEMPT_ALLOWED_KEYS = [
  'uid', 'quizId', 'lessonId', 'answers', 'score',
  'totalQuestions', 'percentage', 'passed', 'createdAt',
];

/**
 * Evaluate a single Firestore operation against the mirrored rules.
 * Returns `true` when the operation would be ALLOWED.
 */
export function evaluateFirestoreRule(
  path: ResourcePath,
  operation: Operation,
  request: RuleRequest,
  existing?: Record<string, unknown>
): boolean {
  const { auth } = request;
  const data = request.data ?? {};

  switch (path.collection) {
    case 'courses': {
      if (operation === 'read') {
        if (existing && existing.published === true) return true;
        return isAdmin(auth);
      }
      if (!isAdmin(auth)) return false;
      if (operation === 'delete') return true;
      return (
        isValidId(path.id) &&
        hasOnlyKeys(data, COURSE_ALLOWED_KEYS) &&
        boundedString(data.titleSi, 200) &&
        boundedString(data.titleEn, 200) &&
        boundedString(data.descriptionSi, 4000) &&
        boundedStringList(data.lessonsInOrder, 400, 128) &&
        typeof data.published === 'boolean' &&
        Number.isInteger(data.order)
      );
    }

    case 'lessons': {
      if (operation === 'read') {
        if (existing && existing.published === true) return true;
        return isAdmin(auth);
      }
      if (!isAdmin(auth)) return false;
      if (operation === 'delete') return true;
      return (
        isValidId(path.id) &&
        hasOnlyKeys(data, LESSON_ALLOWED_KEYS) &&
        boundedString(data.titleSi, 300) &&
        boundedString(data.titleEn, 300) &&
        boundedString(data.slug, 200) &&
        boundedString(data.courseId, 128) &&
        boundedString(data.summarySi, 4000) &&
        boundedStringList(data.learningObjectives, 40, 500) &&
        typeof data.published === 'boolean' &&
        Number.isInteger(data.order) &&
        Number.isInteger(data.estimatedMinutes)
      );
    }

    case 'quizzes': {
      if (operation === 'read') return true;
      if (!isAdmin(auth)) return false;
      if (operation === 'delete') return true;
      return (
        isValidId(path.id) &&
        boundedString(data.titleSi, 300) &&
        Array.isArray(data.questions) &&
        data.questions.length > 0 &&
        data.questions.length <= 100
      );
    }

    case 'users': {
      const targetUid = path.ownerUid ?? path.id;
      if (operation === 'read') return isOwner(auth, targetUid) || isAdmin(auth);
      if (operation === 'delete') return isOwner(auth, targetUid) || isAdmin(auth);

      if (!isOwner(auth, targetUid)) return false;
      if (data.uid !== targetUid) return false;

      if (operation === 'create') {
        return (
          hasOnlyKeys(data, [
            'uid', 'email', 'displayName', 'lastVisitedLessonSlug', 'createdAt', 'updatedAt',
          ]) &&
          boundedString(data.email, 320) &&
          boundedString(data.displayName, 120)
        );
      }

      // update: privilege-bearing fields are rejected outright.
      return (
        hasOnlyKeys(data, ['displayName', 'lastVisitedLessonSlug', 'updatedAt', 'uid']) &&
        boundedString(data.displayName, 120) &&
        !('role' in data) &&
        !('admin' in data)
      );
    }

    case 'progress': {
      const targetUid = path.ownerUid ?? '';
      if (operation === 'read') return isOwner(auth, targetUid) || isAdmin(auth);
      if (operation === 'delete') return isOwner(auth, targetUid) || isAdmin(auth);

      return (
        isOwner(auth, targetUid) &&
        data.uid === targetUid &&
        isValidId(path.id) &&
        hasOnlyKeys(data, PROGRESS_ALLOWED_KEYS) &&
        data.lessonId === path.id &&
        typeof data.completed === 'boolean'
      );
    }

    case 'bookmarks': {
      const targetUid = path.ownerUid ?? '';
      if (operation === 'read') return isOwner(auth, targetUid) || isAdmin(auth);
      if (operation === 'delete') return isOwner(auth, targetUid) || isAdmin(auth);
      if (operation === 'update') return false;

      return (
        isOwner(auth, targetUid) &&
        data.uid === targetUid &&
        hasOnlyKeys(data, BOOKMARK_ALLOWED_KEYS) &&
        data.lessonId === path.id
      );
    }

    case 'quizAttempts': {
      if (operation === 'read') {
        if (isAdmin(auth)) return true;
        return isSignedIn(auth) && existing?.uid === auth.uid;
      }
      if (operation === 'update' || operation === 'delete') return false;
      if (!isSignedIn(auth)) return false;

      const score = data.score as number;
      const total = data.totalQuestions as number;
      const percentage = data.percentage as number;

      return (
        data.uid === auth.uid &&
        hasOnlyKeys(data, ATTEMPT_ALLOWED_KEYS) &&
        boundedString(data.quizId, 128) &&
        Number.isInteger(score) &&
        score >= 0 &&
        Number.isInteger(total) &&
        total > 0 &&
        score <= total &&
        Number.isInteger(percentage) &&
        percentage >= 0 &&
        percentage <= 100 &&
        typeof data.passed === 'boolean'
      );
    }

    case 'adminAuditLogs': {
      if (operation === 'read') return isAdmin(auth);
      if (operation === 'update' || operation === 'delete') return false;
      return (
        isAdmin(auth) &&
        boundedString(data.action, 200) &&
        boundedString(data.targetId, 200)
      );
    }

    default:
      // Catch-all deny — identical to the `match /{document=**}` block.
      return false;
  }
}

export function anonymousAuth(): RuleAuth {
  return { ...ANONYMOUS };
}

export function userAuth(uid: string, admin = false): RuleAuth {
  return { uid, token: admin ? { admin: true } : {} };
}
