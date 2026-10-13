#!/usr/bin/env node
/**
 * Aura Music Academy — Firebase Realtime Database curriculum seeding script.
 *
 * Uploads the bundled seed curriculum (courses, lessons, quizzes) into
 * Firebase Realtime Database (`https://auramusic-daa98-default-rtdb.asia-southeast1.firebasedatabase.app/`).
 *
 * Strictly follows Product Principle #7 & Section 4:
 *   - Seeds ONLY public curriculum catalogue (`courses`, `lessons`, `quizzes`).
 *   - NEVER populates invented student records, fake profiles, or fake achievements.
 *
 * USAGE
 *   node scripts/seed-rtdb.mjs --dry-run   # inspect payload without writing
 *   node scripts/seed-rtdb.mjs             # write courses, lessons, quizzes to RTDB
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

const DRY_RUN = process.argv.includes('--dry-run');
const DEFAULT_DB_URL =
  process.env.VITE_FIREBASE_DATABASE_URL ||
  'https://auramusic-daa98-default-rtdb.asia-southeast1.firebasedatabase.app';

async function loadSeedModules() {
  const { build } = await import('esbuild');
  const result = await build({
    entryPoints: [
      path.join(repoRoot, 'src/content/courses/seedCourses.ts'),
      path.join(repoRoot, 'src/content/lessons/index.ts'),
      path.join(repoRoot, 'src/content/quizzes/seedQuizzes.ts'),
    ],
    bundle: true,
    format: 'esm',
    platform: 'node',
    write: false,
    outdir: 'out',
  });

  const modules = {};
  for (const file of result.outputFiles) {
    const name = path.basename(file.path).replace(/\.js$/, '');
    const code = file.text;
    const namespace = `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`;
    modules[name] = await import(namespace);
  }
  return {
    SEED_COURSES: modules.seedCourses.SEED_COURSES,
    ALL_SEED_LESSONS: modules.index.ALL_SEED_LESSONS,
    SEED_QUIZZES: modules.seedQuizzes.SEED_QUIZZES,
  };
}

async function putNode(baseUrl, nodePath, payload) {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const authQuery = process.env.FIREBASE_DB_AUTH_TOKEN
    ? `?auth=${encodeURIComponent(process.env.FIREBASE_DB_AUTH_TOKEN)}`
    : '';
  const url = `${cleanBase}/${nodePath}.json${authQuery}`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HTTP ${response.status} on PUT /${nodePath}.json: ${text}`);
  }
}

async function main() {
  const { SEED_COURSES, ALL_SEED_LESSONS, SEED_QUIZZES } = await loadSeedModules();

  console.log('Aura Music Academy — Realtime Database Curriculum Seed');
  console.log(`  Target DB : ${DEFAULT_DB_URL}`);
  console.log(`  Courses   : ${SEED_COURSES.length}`);
  console.log(`  Lessons   : ${ALL_SEED_LESSONS.length}`);
  console.log(`  Quizzes   : ${SEED_QUIZZES.length}`);

  const coursesMap = {};
  for (const course of SEED_COURSES) {
    coursesMap[course.id] = {
      ...course,
      lessonsInOrder: course.lessonIds ?? [],
    };
  }

  const lessonsMap = {};
  for (const lesson of ALL_SEED_LESSONS) {
    lessonsMap[lesson.id] = { ...lesson };
  }

  const quizzesMap = {};
  for (const quiz of SEED_QUIZZES) {
    quizzesMap[quiz.id] = { ...quiz };
  }

  if (DRY_RUN) {
    console.log('\n--- DRY RUN: no writes performed ---');
    console.log(`Would write /courses (${Object.keys(coursesMap).length} items)`);
    console.log(`Would write /lessons (${Object.keys(lessonsMap).length} items)`);
    console.log(`Would write /quizzes (${Object.keys(quizzesMap).length} items)`);
    return;
  }

  await putNode(DEFAULT_DB_URL, 'courses', coursesMap);
  console.log(`  ✓ /courses seeded (${Object.keys(coursesMap).length} courses)`);

  await putNode(DEFAULT_DB_URL, 'lessons', lessonsMap);
  console.log(`  ✓ /lessons seeded (${Object.keys(lessonsMap).length} lessons)`);

  await putNode(DEFAULT_DB_URL, 'quizzes', quizzesMap);
  console.log(`  ✓ /quizzes seeded (${Object.keys(quizzesMap).length} quizzes)`);

  console.log(
    '\nDone! Public curriculum is now live in Firebase Realtime Database.\n' +
      'IMPORTANT: Next, paste firebase/database.rules.json into Firebase Console → Realtime Database → Rules → Publish\n' +
      'to lock down all writes to authorized admins and isolate per-student progress.'
  );
}

main().catch((error) => {
  console.error('\nRTDB seeding failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});
