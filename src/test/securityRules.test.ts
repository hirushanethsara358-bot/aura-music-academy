import { describe, expect, it } from 'vitest';
import {
  anonymousAuth,
  evaluateFirestoreRule,
  Operation,
  ResourcePath,
  RuleAuth,
  userAuth,
} from '../lib/firestoreRulesSimulator';
import { evaluateRtdbRule } from '../lib/rtdbRulesSimulator';
import fs from 'node:fs';
import path from 'node:path';

/**
 * NOTE ON SCOPE
 * -------------
 * `firebase/firestore.rules` is the authoritative control and runs on Google's
 * infrastructure. These tests execute a mirrored evaluator
 * (`src/lib/firestoreRulesSimulator.ts`) so the intended boundaries are proven
 * automatically without needing the Firebase Emulator Suite (which requires a
 * Java runtime + firebase-tools and is disproportionate for low-spec machines).
 * See docs/TESTING.md for the emulator-based verification procedure.
 */

const ALICE = 'alice-uid';
const BOB = 'bob-uid';
const ADMIN = 'admin-uid';

const anonymous: RuleAuth = anonymousAuth();
const alice: RuleAuth = userAuth(ALICE);
const bob: RuleAuth = userAuth(BOB);
const admin: RuleAuth = userAuth(ADMIN, true);

const publishedLesson: ResourcePath = { collection: 'lessons', id: 'lesson-101' };
const draftLesson: ResourcePath = { collection: 'lessons', id: 'lesson-draft' };
const courseDoc: ResourcePath = { collection: 'courses', id: 'course-level-1' };

describe('Default deny behaviour', () => {
  it('denies reads on unknown collections for everyone', () => {
    const unknown: ResourcePath = { collection: 'secretStuff', id: 'x' };
    for (const auth of [anonymous, alice, admin]) {
      expect(evaluateFirestoreRule(unknown, 'read', { auth })).toBe(false);
      expect(evaluateFirestoreRule(unknown, 'create', { auth })).toBe(false);
    }
  });

  it('denies writes on unknown collections even for an admin', () => {
    const unknown: ResourcePath = { collection: 'notDefined', id: 'y' };
    expect(evaluateFirestoreRule(unknown, 'create', { auth: admin, data: { a: 1 } })).toBe(false);
  });

  it('denies read on the admin audit log for ordinary signed-in users', () => {
    const logs: ResourcePath = { collection: 'adminAuditLogs', id: 'log1' };
    expect(evaluateFirestoreRule(logs, 'read', { auth: alice })).toBe(false);
    expect(evaluateFirestoreRule(logs, 'read', { auth: anonymous })).toBe(false);
    expect(evaluateFirestoreRule(logs, 'read', { auth: admin })).toBe(true);
  });
});

describe('Public catalogue reading', () => {
  it('allows anonymous users to read a published lesson', () => {
    expect(
      evaluateFirestoreRule(publishedLesson, 'read', { auth: anonymous }, { published: true })
    ).toBe(true);
  });

  it('DENIES reading an unpublished draft lesson to the public', () => {
    expect(
      evaluateFirestoreRule(draftLesson, 'read', { auth: anonymous }, { published: false })
    ).toBe(false);
    expect(
      evaluateFirestoreRule(draftLesson, 'read', { auth: alice }, { published: false })
    ).toBe(false);
  });

  it('allows an admin to read a draft lesson for preview purposes', () => {
    expect(
      evaluateFirestoreRule(draftLesson, 'read', { auth: admin }, { published: false })
    ).toBe(true);
  });

  it('allows anonymous users to read a published course', () => {
    expect(
      evaluateFirestoreRule(courseDoc, 'read', { auth: anonymous }, { published: true })
    ).toBe(true);
  });
});

describe('Catalogue write authorisation', () => {
  const validCourse = {
    id: 'course-level-1',
    titleSi: 'මට්ටම 1: සංගීත මූලධර්ම',
    titleEn: 'Level 1: Music Foundations',
    descriptionSi: 'සංගීතය පිළිබඳ මූලික දැනුම.',
    lessonsInOrder: ['lesson-101'],
    published: true,
    order: 1,
  };

  it('DENIES an anonymous user creating a course', () => {
    expect(
      evaluateFirestoreRule(courseDoc, 'create', { auth: anonymous, data: validCourse })
    ).toBe(false);
  });

  it('DENIES a signed-in non-admin creating a course', () => {
    expect(
      evaluateFirestoreRule(courseDoc, 'create', { auth: alice, data: validCourse })
    ).toBe(false);
  });

  it('ALLOWS a trusted admin creating a well-formed course', () => {
    expect(
      evaluateFirestoreRule(courseDoc, 'create', { auth: admin, data: validCourse })
    ).toBe(true);
  });

  it('DENIES an admin creating a course with a forged oversized title', () => {
    const oversized = { ...validCourse, titleSi: 'a'.repeat(5000) };
    expect(
      evaluateFirestoreRule(courseDoc, 'create', { auth: admin, data: oversized })
    ).toBe(false);
  });

  it('DENIES an admin creating a course with a non-boolean published flag', () => {
    const malformed = { ...validCourse, published: 'yes' };
    expect(
      evaluateFirestoreRule(courseDoc, 'create', { auth: admin, data: malformed })
    ).toBe(false);
  });

  it('DENIES non-admins deleting catalogue documents', () => {
    expect(evaluateFirestoreRule(courseDoc, 'delete', { auth: alice })).toBe(false);
    expect(evaluateFirestoreRule(courseDoc, 'delete', { auth: anonymous })).toBe(false);
    expect(evaluateFirestoreRule(courseDoc, 'delete', { auth: admin })).toBe(true);
  });

  it('DENIES a user writing an unexpected privileged field into a lesson', () => {
    const poisoned = {
      id: 'lesson-999',
      titleSi: 'හැකර් පාඩම',
      titleEn: 'Hacked lesson',
      slug: 'hacked',
      courseId: 'course-level-1',
      summarySi: 'මෙය සාරාංශයකි.',
      learningObjectives: ['x'],
      published: true,
      order: 1,
      estimatedMinutes: 10,
      isAdminOverride: true,
    };
    expect(
      evaluateFirestoreRule({ collection: 'lessons', id: 'lesson-999' }, 'create', {
        auth: admin,
        data: poisoned,
      })
    ).toBe(false);
  });
});

describe('Cross-user isolation on private data', () => {
  const aliceProgress: ResourcePath = {
    collection: 'progress',
    id: 'lesson-101',
    ownerUid: ALICE,
  };

  const progressData = {
    uid: ALICE,
    lessonId: 'lesson-101',
    completed: true,
    lastVisitedAt: 'now',
    completedAt: 'now',
    updatedAt: 'now',
  };

  it('ALLOWS a user to read their own progress', () => {
    expect(evaluateFirestoreRule(aliceProgress, 'read', { auth: alice })).toBe(true);
  });

  it('DENIES a different signed-in user reading someone else\u2019s progress', () => {
    expect(evaluateFirestoreRule(aliceProgress, 'read', { auth: bob })).toBe(false);
  });

  it('DENIES an anonymous visitor reading any progress document', () => {
    expect(evaluateFirestoreRule(aliceProgress, 'read', { auth: anonymous })).toBe(false);
  });

  it('ALLOWS a user to write their own progress document', () => {
    expect(
      evaluateFirestoreRule(aliceProgress, 'create', { auth: alice, data: progressData })
    ).toBe(true);
  });

  it('DENIES Bob writing a progress record into Alice\u2019s collection', () => {
    expect(
      evaluateFirestoreRule(aliceProgress, 'create', {
        auth: bob,
        data: { ...progressData, uid: BOB },
      })
    ).toBe(false);
  });

  it('DENIES Alice writing a progress record that claims Bob\u2019s uid', () => {
    expect(
      evaluateFirestoreRule(aliceProgress, 'create', {
        auth: alice,
        data: { ...progressData, uid: BOB },
      })
    ).toBe(false);
  });

  it('DENIES a progress write whose lessonId does not match the document id', () => {
    expect(
      evaluateFirestoreRule(aliceProgress, 'create', {
        auth: alice,
        data: { ...progressData, lessonId: 'lesson-999' },
      })
    ).toBe(false);
  });

  it('DENIES a progress write with a non-boolean completed field', () => {
    expect(
      evaluateFirestoreRule(aliceProgress, 'create', {
        auth: alice,
        data: { ...progressData, completed: 'yes' },
      })
    ).toBe(false);
  });

  it('DENIES a user smuggling extra fields into a progress document', () => {
    expect(
      evaluateFirestoreRule(aliceProgress, 'create', {
        auth: alice,
        data: { ...progressData, role: 'admin' },
      })
    ).toBe(false);
  });

  it('DENIES an ordinary user deleting another user\u2019s progress', () => {
    expect(evaluateFirestoreRule(aliceProgress, 'delete', { auth: bob })).toBe(false);
    expect(evaluateFirestoreRule(aliceProgress, 'delete', { auth: alice })).toBe(true);
  });
});

describe('Privilege escalation attempts', () => {
  const aliceProfile: ResourcePath = { collection: 'users', id: ALICE };

  it('DENIES a user writing a role/admin field into their own profile', () => {
    expect(
      evaluateFirestoreRule(aliceProfile, 'update', {
        auth: alice,
        data: { uid: ALICE, displayName: 'Alice', role: 'admin' },
      })
    ).toBe(false);
  });

  it('DENIES embedding an admin field in a profile update', () => {
    expect(
      evaluateFirestoreRule(aliceProfile, 'update', {
        auth: alice,
        data: { uid: ALICE, displayName: 'Alice', admin: true },
      })
    ).toBe(false);
  });

  it('ALLOWS a legitimate profile display-name update', () => {
    expect(
      evaluateFirestoreRule(aliceProfile, 'update', {
        auth: alice,
        data: { uid: ALICE, displayName: 'Alice Perera', lastVisitedLessonSlug: 'x', updatedAt: 'now' },
      })
    ).toBe(true);
  });

  it('DENIES a user reading or writing another user\u2019s profile', () => {
    const bobProfile: ResourcePath = { collection: 'users', id: BOB };
    expect(evaluateFirestoreRule(bobProfile, 'read', { auth: alice })).toBe(false);
    expect(
      evaluateFirestoreRule(bobProfile, 'update', {
        auth: alice,
        data: { uid: BOB, displayName: 'Not Bob', updatedAt: 'now' },
      })
    ).toBe(false);
  });

  it('DENIES a user creating a profile document for a different uid', () => {
    expect(
      evaluateFirestoreRule(aliceProfile, 'create', {
        auth: alice,
        data: { uid: BOB, email: 'bob@example.com', displayName: 'Bob' },
      })
    ).toBe(false);
  });

  it('cannot be escalated by setting the claim on the client side of the request object', () => {
    // An attacker controls the request payload but never the verified token.
    const spoofed: RuleAuth = { uid: ALICE, token: { admin: false } };
    const forged: RuleAuth = { uid: ALICE, token: { admin: true } };
    const createCourse: Operation = 'create';
    const courseData = {
      titleSi: 'නව පාඩම',
      titleEn: 'New lesson',
      descriptionSi: 'විස්තරයක් මෙහි ඇත.',
      lessonsInOrder: [],
      published: true,
      order: 1,
    };
    expect(evaluateFirestoreRule(courseDoc, createCourse, { auth: spoofed, data: courseData })).toBe(false);
    // A token object with the claim can only originate from a signed server token.
    // The test documents that the rule consults ONLY the verified token claim.
    expect(evaluateFirestoreRule(courseDoc, createCourse, { auth: forged, data: courseData })).toBe(true);
  });
});

describe('Quiz attempt integrity', () => {
  const attempts: ResourcePath = { collection: 'quizAttempts', id: 'attempt-1' };

  const validAttempt = {
    uid: ALICE,
    quizId: 'quiz-101',
    lessonId: 'lesson-101',
    answers: { 'q-101-1': 'b' },
    score: 3,
    totalQuestions: 4,
    percentage: 75,
    passed: true,
    createdAt: 'now',
  };

  it('ALLOWS a signed-in user to record their own attempt', () => {
    expect(
      evaluateFirestoreRule(attempts, 'create', { auth: alice, data: validAttempt })
    ).toBe(true);
  });

  it('DENIES an anonymous user recording an attempt', () => {
    expect(
      evaluateFirestoreRule(attempts, 'create', { auth: anonymous, data: validAttempt })
    ).toBe(false);
  });

  it('DENIES recording an attempt on behalf of another user', () => {
    expect(
      evaluateFirestoreRule(attempts, 'create', {
        auth: alice,
        data: { ...validAttempt, uid: BOB },
      })
    ).toBe(false);
  });

  it('DENIES a score greater than the number of questions', () => {
    expect(
      evaluateFirestoreRule(attempts, 'create', {
        auth: alice,
        data: { ...validAttempt, score: 99 },
      })
    ).toBe(false);
  });

  it('DENIES zero total questions so percentages cannot divide by zero', () => {
    expect(
      evaluateFirestoreRule(attempts, 'create', {
        auth: alice,
        data: { ...validAttempt, totalQuestions: 0, score: 0, percentage: 0 },
      })
    ).toBe(false);
  });

  it('DENIES a percentage outside 0–100', () => {
    expect(
      evaluateFirestoreRule(attempts, 'create', {
        auth: alice,
        data: { ...validAttempt, percentage: 140 },
      })
    ).toBe(false);
  });

  it('DENIES extra unexpected fields in an attempt', () => {
    expect(
      evaluateFirestoreRule(attempts, 'create', {
        auth: alice,
        data: { ...validAttempt, verifiedByTeacher: true },
      })
    ).toBe(false);
  });

  it('keeps attempts immutable — no updates or deletes', () => {
    expect(evaluateFirestoreRule(attempts, 'update', { auth: alice, data: validAttempt })).toBe(false);
    expect(evaluateFirestoreRule(attempts, 'delete', { auth: alice })).toBe(false);
    expect(evaluateFirestoreRule(attempts, 'update', { auth: admin, data: validAttempt })).toBe(false);
  });

  it('ALLOWS the owner (or an admin) to read an attempt, nobody else', () => {
    expect(evaluateFirestoreRule(attempts, 'read', { auth: alice }, validAttempt)).toBe(true);
    expect(evaluateFirestoreRule(attempts, 'read', { auth: bob }, validAttempt)).toBe(false);
    expect(evaluateFirestoreRule(attempts, 'read', { auth: admin }, validAttempt)).toBe(true);
    expect(evaluateFirestoreRule(attempts, 'read', { auth: anonymous }, validAttempt)).toBe(false);
  });
});

describe('Bookmarks', () => {
  const aliceBookmark: ResourcePath = {
    collection: 'bookmarks',
    id: 'lesson-101',
    ownerUid: ALICE,
  };

  it('allows a user to bookmark their own lesson', () => {
    expect(
      evaluateFirestoreRule(aliceBookmark, 'create', {
        auth: alice,
        data: { uid: ALICE, lessonId: 'lesson-101', createdAt: 'now' },
      })
    ).toBe(true);
  });

  it('denies bookmarking into another user\u2019s collection', () => {
    expect(
      evaluateFirestoreRule(aliceBookmark, 'create', {
        auth: bob,
        data: { uid: BOB, lessonId: 'lesson-101', createdAt: 'now' },
      })
    ).toBe(false);
  });

  it('treats bookmarks as create-or-delete, never update', () => {
    expect(
      evaluateFirestoreRule(aliceBookmark, 'update', {
        auth: alice,
        data: { uid: ALICE, lessonId: 'lesson-101', createdAt: 'later' },
      })
    ).toBe(false);
  });
});

describe('Rules file is present and default-deny', () => {
  const rulesPath = path.resolve(__dirname, '../../firebase/firestore.rules');

  it('ships a firestore.rules file', () => {
    expect(fs.existsSync(rulesPath)).toBe(true);
  });

  it('contains a catch-all deny rule', () => {
    const rules = fs.readFileSync(rulesPath, 'utf-8');
    expect(rules).toContain('match /{document=**}');
    expect(rules).toContain('allow read, write: if false;');
  });

  it('never contains a blanket write-if-true statement', () => {
    const rules = fs.readFileSync(rulesPath, 'utf-8');
    expect(rules).not.toMatch(/allow\s+write\s*:\s*if\s+true\s*;/);
    expect(rules).not.toMatch(/allow\s+read,\s*write\s*:\s*if\s+true\s*;/);
  });

  it('permits public read of quiz question banks only (never public write), as designed for anonymous practice', () => {
    const rules = fs.readFileSync(rulesPath, 'utf-8');
    const quizBlock = rules.slice(
      rules.indexOf('match /quizzes/'),
      rules.indexOf('match /users/{uid}')
    );
    expect(quizBlock).toContain('allow read: if true;');
    expect(quizBlock).not.toContain('allow write: if true;');
    expect(quizBlock).toContain('isAdmin()');
  });

  it('reads admin status from a token claim, not from a client-written field', () => {
    const rules = fs.readFileSync(rulesPath, 'utf-8');
    expect(rules).toContain('request.auth.token.admin == true');
    expect(rules).not.toMatch(/resource\.data\.role\s*==\s*['"]admin['"]/);
  });

  it('declares rules_version 2', () => {
    const rules = fs.readFileSync(rulesPath, 'utf-8');
    expect(rules).toContain("rules_version = '2'");
  });
});

describe('Firebase Realtime Database Security Rules (database.rules.json)', () => {
  const rtdbRulesPath = path.resolve(__dirname, '../../firebase/database.rules.json');

  it('ships a valid JSON database.rules.json file with root default-deny', () => {
    expect(fs.existsSync(rtdbRulesPath)).toBe(true);
    const parsed = JSON.parse(fs.readFileSync(rtdbRulesPath, 'utf-8')) as {
      rules: Record<string, unknown>;
    };
    expect(parsed.rules['.read']).toBe(false);
    expect(parsed.rules['.write']).toBe(false);
  });

  it('unconditionally blocks client writes to /admins while allowing console-defined admins', () => {
    const parsed = JSON.parse(fs.readFileSync(rtdbRulesPath, 'utf-8')) as {
      rules: { admins: { '.write': boolean; $uid: { '.write': boolean } } };
    };
    expect(parsed.rules.admins['.write']).toBe(false);
    expect(parsed.rules.admins.$uid['.write']).toBe(false);

    expect(
      evaluateRtdbRule({
        auth: alice,
        path: `/admins/${ALICE}`,
        operation: 'write',
        newData: { value: true },
      })
    ).toBe(false);
    expect(
      evaluateRtdbRule({
        auth: admin,
        path: `/admins/${ALICE}`,
        operation: 'write',
        newData: { value: true },
      })
    ).toBe(false);
  });

  it('allows public read of published courses and lessons, but denies unpublished drafts to non-admins', () => {
    expect(
      evaluateRtdbRule({
        auth: anonymous,
        path: '/courses/course-level-1',
        operation: 'read',
        data: { published: true },
      })
    ).toBe(true);

    expect(
      evaluateRtdbRule({
        auth: anonymous,
        path: '/lessons/lesson-draft',
        operation: 'read',
        data: { published: false },
      })
    ).toBe(false);

    expect(
      evaluateRtdbRule({
        auth: admin,
        path: '/lessons/lesson-draft',
        operation: 'read',
        data: { published: false },
      })
    ).toBe(true);
  });

  it('requires orderByChild("published").equalTo(true) when anonymous users query /courses or /lessons', () => {
    expect(
      evaluateRtdbRule({
        auth: anonymous,
        path: '/courses',
        operation: 'read',
      })
    ).toBe(false);

    expect(
      evaluateRtdbRule({
        auth: anonymous,
        path: '/courses',
        operation: 'read',
        query: { orderByChild: 'published', equalTo: true },
      })
    ).toBe(true);
  });

  it('allows admin writes to /courses and /lessons (via token claim OR /admins/{uid}) and denies non-admins', () => {
    const validLesson = {
      titleSi: 'මට්ටම 1 පාඩම',
      titleEn: 'Level 1 Lesson',
      slug: 'level-1-lesson',
      courseId: 'course-level-1',
      summarySi: 'මෙය සම්පූර්ණ සාරාංශයකි.',
      published: true,
      order: 1,
      estimatedMinutes: 20,
    };

    expect(
      evaluateRtdbRule({
        auth: alice,
        path: '/lessons/lesson-101',
        operation: 'write',
        newData: validLesson,
      })
    ).toBe(false);

    expect(
      evaluateRtdbRule({
        auth: admin,
        path: '/lessons/lesson-101',
        operation: 'write',
        newData: validLesson,
      })
    ).toBe(true);

    // Console-bootstrapped admin in /admins/{uid}
    expect(
      evaluateRtdbRule({
        auth: alice,
        rootAdmins: [ALICE],
        path: '/lessons/lesson-101',
        operation: 'write',
        newData: validLesson,
      })
    ).toBe(true);
  });

  it('enforces cross-user isolation on /users, /userProgress, /userBookmarks, and /quizAttempts', () => {
    const validProgress = {
      uid: ALICE,
      lessonId: 'lesson-101',
      completed: true,
      lastVisitedAt: '2026-10-13T00:00:00Z',
      completedAt: '2026-10-13T00:00:00Z',
      updatedAt: '2026-10-13T00:00:00Z',
    };

    expect(
      evaluateRtdbRule({
        auth: alice,
        path: `/userProgress/${ALICE}/lesson-101`,
        operation: 'write',
        newData: validProgress,
      })
    ).toBe(true);

    expect(
      evaluateRtdbRule({
        auth: bob,
        path: `/userProgress/${ALICE}/lesson-101`,
        operation: 'read',
      })
    ).toBe(false);

    expect(
      evaluateRtdbRule({
        auth: bob,
        path: `/userProgress/${ALICE}/lesson-101`,
        operation: 'write',
        newData: { ...validProgress, uid: BOB },
      })
    ).toBe(false);

    // Rejects privilege escalation on /users/$uid
    expect(
      evaluateRtdbRule({
        auth: alice,
        path: `/users/${ALICE}`,
        operation: 'write',
        newData: {
          uid: ALICE,
          email: 'alice@example.com',
          displayName: 'Alice',
          role: 'admin',
        },
      })
    ).toBe(false);
  });

  it('enforces immutable, bounded quizAttempts in Realtime Database', () => {
    const validAttempt = {
      id: 'attempt-1',
      uid: ALICE,
      quizId: 'quiz-101',
      lessonId: 'lesson-101',
      answers: { q1: 'a' },
      score: 4,
      totalQuestions: 5,
      percentage: 80,
      passed: true,
      createdAt: '2026-10-13T00:00:00Z',
    };

    expect(
      evaluateRtdbRule({
        auth: alice,
        path: `/quizAttempts/${ALICE}/attempt-1`,
        operation: 'write',
        data: null,
        newData: validAttempt,
      })
    ).toBe(true);

    // Cannot overwrite an existing attempt
    expect(
      evaluateRtdbRule({
        auth: alice,
        path: `/quizAttempts/${ALICE}/attempt-1`,
        operation: 'write',
        data: validAttempt,
        newData: { ...validAttempt, score: 5, percentage: 100 },
      })
    ).toBe(false);

    // Cannot record score > totalQuestions
    expect(
      evaluateRtdbRule({
        auth: alice,
        path: `/quizAttempts/${ALICE}/attempt-2`,
        operation: 'write',
        data: null,
        newData: { ...validAttempt, score: 10 },
      })
    ).toBe(false);
  });
});
