/**
 * Firebase Realtime Database Security Rules simulator.
 *
 * WHY THIS EXISTS
 * ---------------
 * The authoritative Realtime Database security control for Aura Music Academy
 * is `firebase/database.rules.json`, enforced server-side by Google on
 * `https://auramusic-daa98-default-rtdb.asia-southeast1.firebasedatabase.app/`.
 *
 * This module is a faithful, hand-maintained evaluator of the same JSON rule
 * tree so our automated test suite (`src/test/securityRules.test.ts`) proves
 * every read, write, validation, cross-user isolation, and privilege-escalation
 * boundary without requiring a local Java runtime for the Firebase Emulator.
 */

import { RuleAuth } from './firestoreRulesSimulator';

export interface RtdbQuery {
  orderByChild?: string;
  equalTo?: string | number | boolean;
}

export interface RtdbEvalRequest {
  auth: RuleAuth;
  /** Path such as '/courses/course-level-1' or '/userProgress/alice-uid/lesson-101' */
  path: string;
  operation: 'read' | 'write';
  /** Existing data at `path` prior to write (or during read). */
  data?: Record<string, unknown> | null;
  /** New data being written (`null` for delete). */
  newData?: Record<string, unknown> | null;
  /** Query parameters when reading a collection path such as '/courses' or '/lessons'. */
  query?: RtdbQuery;
  /** Optional list of uids present in `/admins/{uid}: true` in the root tree. */
  rootAdmins?: string[];
}

function isSignedIn(auth: RuleAuth): boolean {
  return typeof auth.uid === 'string' && auth.uid.length > 0;
}

function isAdmin(auth: RuleAuth, rootAdmins: string[] = []): boolean {
  if (!isSignedIn(auth)) return false;
  if (auth.token.admin === true) return true;
  return auth.uid !== null && rootAdmins.includes(auth.uid);
}

function isOwner(auth: RuleAuth, uid: string): boolean {
  return isSignedIn(auth) && auth.uid === uid;
}

function boundedString(value: unknown, maxLength: number): boolean {
  return typeof value === 'string' && value.length > 0 && value.length <= maxLength;
}

function hasOnlyKeys(data: Record<string, unknown>, allowed: string[]): boolean {
  return Object.keys(data).every((key) => allowed.includes(key));
}

export function evaluateRtdbRule(req: RtdbEvalRequest): boolean {
  const segments = req.path.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);
  const { auth, operation, data, newData, query, rootAdmins = [] } = req;
  const admin = isAdmin(auth, rootAdmins);

  // Root-level read/write is unconditionally denied.
  if (segments.length === 0) {
    return false;
  }

  const [top, second, third, fourth] = segments;
  if (fourth !== undefined) {
    return false;
  }

  // ------------------------------------------------------------------
  // /admins and /admins/$uid — never writable by any client
  // ------------------------------------------------------------------
  if (top === 'admins') {
    if (operation === 'write') return false;
    if (!second) return admin;
    return isOwner(auth, second) || admin;
  }

  // ------------------------------------------------------------------
  // /courses and /courses/$courseId
  // ------------------------------------------------------------------
  if (top === 'courses') {
    if (!second) {
      if (operation === 'write') return false;
      const isPublishedQuery =
        query?.orderByChild === 'published' && query?.equalTo === true;
      return isPublishedQuery || admin;
    }

    if (operation === 'read') {
      return data?.published === true || admin;
    }

    if (!admin) return false;
    if (newData === null || newData === undefined) return true; // admin delete

    return (
      boundedString(newData.titleSi, 200) &&
      boundedString(newData.titleEn, 200) &&
      boundedString(newData.descriptionSi, 4000) &&
      typeof newData.published === 'boolean' &&
      typeof newData.order === 'number' &&
      Number.isFinite(newData.order)
    );
  }

  // ------------------------------------------------------------------
  // /lessons and /lessons/$lessonId
  // ------------------------------------------------------------------
  if (top === 'lessons') {
    if (!second) {
      if (operation === 'write') return false;
      const isPublishedQuery =
        query?.orderByChild === 'published' && query?.equalTo === true;
      return isPublishedQuery || admin;
    }

    if (operation === 'read') {
      return data?.published === true || admin;
    }

    if (!admin) return false;
    if (newData === null || newData === undefined) return true; // admin delete

    if ('isAdminOverride' in newData || 'admin' in newData || 'role' in newData) {
      return false;
    }

    return (
      boundedString(newData.titleSi, 300) &&
      boundedString(newData.titleEn, 300) &&
      boundedString(newData.slug, 200) &&
      boundedString(newData.courseId, 128) &&
      boundedString(newData.summarySi, 4000) &&
      typeof newData.published === 'boolean' &&
      typeof newData.order === 'number' &&
      typeof newData.estimatedMinutes === 'number' &&
      newData.estimatedMinutes > 0
    );
  }

  // ------------------------------------------------------------------
  // /quizzes and /quizzes/$quizId
  // ------------------------------------------------------------------
  if (top === 'quizzes') {
    if (operation === 'read') return true;
    if (!second) return false;
    if (!admin) return false;
    if (newData === null || newData === undefined) return true;
    return (
      boundedString(newData.titleSi, 300) &&
      boundedString(newData.lessonId, 128) &&
      newData.questions !== undefined
    );
  }

  // ------------------------------------------------------------------
  // /users/$uid
  // ------------------------------------------------------------------
  if (top === 'users') {
    if (!second || third) return false;
    const targetUid = second;
    if (operation === 'read') return isOwner(auth, targetUid) || admin;

    if (!isOwner(auth, targetUid) && !admin) return false;
    if (newData === null || newData === undefined) return isOwner(auth, targetUid) || admin;

    if ('role' in newData || 'admin' in newData || 'isAdmin' in newData) {
      return false;
    }

    const allowed = [
      'uid',
      'email',
      'displayName',
      'lastVisitedLessonSlug',
      'createdAt',
      'updatedAt',
    ];
    return (
      hasOnlyKeys(newData, allowed) &&
      newData.uid === targetUid &&
      boundedString(newData.email, 320) &&
      boundedString(newData.displayName, 120)
    );
  }

  // ------------------------------------------------------------------
  // /userProgress/$uid and /userProgress/$uid/$lessonId
  // ------------------------------------------------------------------
  if (top === 'userProgress') {
    if (!second) return false;
    const targetUid = second;

    if (operation === 'read') {
      return isOwner(auth, targetUid) || admin;
    }

    if (!third) return false;
    const lessonId = third;
    if (!isOwner(auth, targetUid) && !admin) return false;
    if (newData === null || newData === undefined) return true;

    const allowed = [
      'uid',
      'lessonId',
      'completed',
      'lastVisitedAt',
      'completedAt',
      'updatedAt',
    ];
    return (
      hasOnlyKeys(newData, allowed) &&
      newData.uid === targetUid &&
      newData.lessonId === lessonId &&
      typeof newData.completed === 'boolean'
    );
  }

  // ------------------------------------------------------------------
  // /userBookmarks/$uid and /userBookmarks/$uid/$lessonId
  // ------------------------------------------------------------------
  if (top === 'userBookmarks') {
    if (!second) return false;
    const targetUid = second;

    if (operation === 'read') {
      return isOwner(auth, targetUid) || admin;
    }

    if (!third) return false;
    const lessonId = third;
    if (!isOwner(auth, targetUid) && !admin) return false;

    // Delete is allowed when newData is null
    if (newData === null || newData === undefined) return true;

    // Update of an existing bookmark is denied (!data.exists())
    if (data !== null && data !== undefined) return false;

    const allowed = ['uid', 'lessonId', 'createdAt'];
    return (
      hasOnlyKeys(newData, allowed) &&
      newData.uid === targetUid &&
      newData.lessonId === lessonId &&
      newData.createdAt !== undefined
    );
  }

  // ------------------------------------------------------------------
  // /quizAttempts/$uid and /quizAttempts/$uid/$attemptId
  // ------------------------------------------------------------------
  if (top === 'quizAttempts') {
    if (!second) return false;
    const targetUid = second;

    if (operation === 'read') {
      return isOwner(auth, targetUid) || admin;
    }

    if (!third) return false;
    // Attempts are immutable: must not already exist and must not be deleted
    if (!isOwner(auth, targetUid)) return false;
    if (data !== null && data !== undefined) return false;
    if (newData === null || newData === undefined) return false;

    const allowed = [
      'id',
      'uid',
      'quizId',
      'lessonId',
      'answers',
      'score',
      'totalQuestions',
      'percentage',
      'passed',
      'createdAt',
    ];
    const score = newData.score as number;
    const total = newData.totalQuestions as number;
    const percentage = newData.percentage as number;

    return (
      hasOnlyKeys(newData, allowed) &&
      newData.uid === targetUid &&
      boundedString(newData.quizId, 128) &&
      boundedString(newData.lessonId, 128) &&
      typeof score === 'number' &&
      score >= 0 &&
      typeof total === 'number' &&
      total > 0 &&
      score <= total &&
      typeof percentage === 'number' &&
      percentage >= 0 &&
      percentage <= 100 &&
      typeof newData.passed === 'boolean' &&
      newData.createdAt !== undefined
    );
  }

  // ------------------------------------------------------------------
  // /adminAuditLogs and /adminAuditLogs/$logId
  // ------------------------------------------------------------------
  if (top === 'adminAuditLogs') {
    if (operation === 'read') return admin;
    if (!second || third) return false;
    if (!admin) return false;
    if (data !== null && data !== undefined) return false;
    if (newData === null || newData === undefined) return false;
    return (
      boundedString(newData.action, 200) &&
      boundedString(newData.targetId, 200)
    );
  }

  return false;
}
