#!/usr/bin/env node
/**
 * Aura Music Academy — Firestore curriculum seeding script.
 *
 * Uploads the bundled seed curriculum (courses, lessons, quizzes) into
 * Cloud Firestore so the Admin CMS has real documents to manage.
 *
 * PREREQUISITES
 *   export GOOGLE_APPLICATION_CREDENTIALS=/secure/path/service-account.json
 *   npm install firebase-admin --no-save
 *
 * USAGE
 *   node scripts/seed-firestore.mjs --dry-run   # print the writes, do nothing
 *   node scripts/seed-firestore.mjs             # perform the writes
 *
 * SECURITY NOTES
 *   - Requires an Admin SDK service account. NEVER commit that key and NEVER
 *     place it in a build environment that produces client code.
 *   - This script is idempotent: it uses setDoc() with stable document ids, so
 *     re-running it updates rather than duplicates.
 *   - Writes are batched to stay well inside the Spark free tier's 20,000
 *     writes/day allowance. A full seed costs roughly 70 writes.
 */

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

const DRY_RUN = process.argv.includes('--dry-run');

/* ------------------------------------------------------------------ */
/* Load the TypeScript curriculum sources without a build step         */
/* ------------------------------------------------------------------ */

/**
 * The seed data lives in .ts files. Rather than pulling in a transpiler, we
 * strip TypeScript type annotations conservatively: the content files use only
 * `interface`-free object literals and a handful of `import` / `export`
 * statements, so a small, well-understood transform is reliable here.
 *
 * If this ever becomes fragile, replace it with `esbuild` or `tsx`.
 */
async function loadSeedModules() {
  const { build } = await import('esbuild').catch(() => ({ build: null }));

  if (build) {
    const result = await build({
      entryPoints: [
        path.join(repoRoot, 'src/content/courses/seedCourses.ts'),
        path.join(repoRoot, 'src/content/lessons/index.ts'),
        path.join(repoRoot, 'src/content/quizzes/index.ts'),
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
      SEED_QUIZZES: modules.index.SEED_QUIZZES,
    };
  }

  console.error(
    'esbuild is required to read the TypeScript seed data.\n' +
      'Install it temporarily with:\n\n  npm install esbuild --no-save\n'
  );
  process.exit(1);
}

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */

async function main() {
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.error(
      'GOOGLE_APPLICATION_CREDENTIALS is not set.\n\n' +
        'This script needs a Firebase Admin SDK service account to write to Firestore.\n' +
        'It CANNOT run with only the public web config — that would defeat the security model.\n\n' +
        '  export GOOGLE_APPLICATION_CREDENTIALS=/secure/path/service-account.json\n\n' +
        'See docs/FIREBASE_SETUP.md section 8.'
    );
    process.exit(1);
  }

  const credentialPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!existsSync(credentialPath)) {
    console.error(`Service account file not found: ${credentialPath}`);
    process.exit(1);
  }

  const { SEED_COURSES, ALL_SEED_LESSONS, SEED_QUIZZES } = await loadSeedModules();

  console.log('Curriculum loaded from the repository:');
  console.log(`  courses : ${SEED_COURSES.length}`);
  console.log(`  lessons : ${ALL_SEED_LESSONS.length}`);
  console.log(`  quizzes : ${SEED_QUIZZES.length}`);

  /** Strip client-only fields and normalise for storage. */
  function toCourseDoc(course) {
    const { id, ...rest } = course;
    const { lessonIds, ...fields } = rest;
    return { ...fields, lessonsInOrder: lessonIds ?? [], id };
  }

  function toLessonDoc(lesson) {
    return { ...lesson };
  }

  function toQuizDoc(quiz) {
    return { ...quiz };
  }

  const operations = [
    ...SEED_COURSES.map((c) => ({ collection: 'courses', id: c.id, data: toCourseDoc(c) })),
    ...ALL_SEED_LESSONS.map((l) => ({ collection: 'lessons', id: l.id, data: toLessonDoc(l) })),
    ...SEED_QUIZZES.map((q) => ({ collection: 'quizzes', id: q.id, data: toQuizDoc(q) })),
  ];

  const totalWrites = operations.length;
  const warningThreshold = 15000;
  if (totalWrites > warningThreshold) {
    console.error(
      `Refusing to write ${totalWrites} documents in one run — that risks the Spark daily write quota.\n` +
        'Split the seed into smaller batches.'
    );
    process.exit(1);
  }

  if (DRY_RUN) {
    console.log('\n--- DRY RUN: no writes will be performed ---\n');
    for (const op of operations) {
      console.log(`SET ${op.collection}/${op.id}`);
    }
    console.log(`\nWould write ${totalWrites} documents. Re-run without --dry-run to apply.`);
    return;
  }

  const { initializeApp, cert } = await import('firebase-admin/app');
  const { getFirestore, FieldValue } = await import('firebase-admin/firestore');

  const serviceAccount = JSON.parse(readFileSync(credentialPath, 'utf8'));
  initializeApp({ credential: cert(serviceAccount) });
  const db = getFirestore();

  console.log(`\nWriting to project: ${serviceAccount.project_id}`);

  let written = 0;
  const BATCH_SIZE = 400; // Firestore hard limit is 500.

  for (let i = 0; i < operations.length; i += BATCH_SIZE) {
    const batch = db.batch();
    const slice = operations.slice(i, i + BATCH_SIZE);
    for (const op of slice) {
      batch.set(
        db.collection(op.collection).doc(op.id),
        { ...op.data, seededAt: FieldValue.serverTimestamp() },
        { merge: true }
      );
    }
    await batch.commit();
    written += slice.length;
    console.log(`  committed ${written}/${totalWrites}`);
  }

  console.log(
    `\nDone. ${written} documents written.\n` +
      `Estimated write cost: ${written} of the 20,000/day Spark allowance.\n\n` +
      'Next: set the first admin custom claim (docs/FIREBASE_SETUP.md section 9), then\n' +
      'sign in and open /admin to manage the content.'
  );
}

main().catch((error) => {
  console.error('\nSeeding failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});
