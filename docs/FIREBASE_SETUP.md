# Firebase Setup Guide (Spark Free Tier)

This guide walks through configuring Firebase for Aura Music Academy entirely
within the **Spark (no-cost) plan**. No credit card is required at any point.

> ### You do not need Firebase to run or develop the platform.
> With no `VITE_FIREBASE_*` variables set, the app runs in **Local Studio
> Mode**: every lesson, all nine labs, quizzes, progress, bookmarks and CMS
> editing work, persisted in the browser. Configure Firebase when you want
> accounts, cross-device progress and a real CMS backend.

---

## 1. Spark Plan Limits (verified October 2026)

| Resource | Spark free allowance | What it means for Aura |
| :--- | :--- | :--- |
| **Authentication** | 50,000 monthly active users | Far beyond any plausible early-stage need. Email/password is free. |
| **Firestore reads** | 50,000 / day | The catalogue is read once per session (~25 documents). Roughly 2,000 full catalogue loads/day. |
| **Firestore writes** | 20,000 / day | ~6,600 lesson completions, or ~4,000 quiz attempts, per day. |
| **Firestore deletes** | 20,000 / day | Bookmark removals. |
| **Firestore storage** | 1 GiB | The curriculum JSON is well under 2 MB. |
| **Firestore egress** | 10 GiB / month | Catalogue payload is a few hundred KB per session. |
| **Hosting storage** | 10 GB | The built `dist/` is under 2 MB. |
| **Hosting transfer** | 360 MB / day | ~1,500 page loads/day at ~245 kB each. |
| **Cloud Functions** | ❌ Not available | Aura is designed to need zero Cloud Functions. |
| **Cloud Storage** | ❌ Not available | Aura never uploads files; audio analysis is fully client-side. |
| **Phone (SMS) auth** | ❌ Not available | Aura uses email/password only. |

**When a quota is exceeded on Spark, the service stops serving rather than
charging you.** There is no surprise bill. Plan a graceful message if you
approach the read limit — see §8.

---

## 2. Create the Project

1. Open <https://console.firebase.google.com> and sign in with a Google account.
2. **Add project** → give it a name such as `aura-music-academy`.
3. Google Analytics is optional; turn it **off** — Aura deliberately collects no analytics.
4. Wait for provisioning, then continue to the console.

No billing account is needed and none should be added for a Spark deployment.

---

## 3. Enable Authentication

1. **Build → Authentication → Get started**.
2. **Sign-in method** tab → enable **Email/Password** (leave "Email link"
   disabled).
3. **Settings → Authorized domains**: `localhost` is present by default. Add
   `your-project.web.app` and `your-project.firebaseapp.com` when you deploy.

Password policy, reset emails, hashing and rate limiting are all handled
server-side by Firebase. Aura never stores a credential.

---

## 4. Create Firestore

1. **Build → Firestore Database → Create database**.
2. Choose **Production mode** (not test mode). Test mode opens the database to
   the world for 30 days — Aura ships correct rules, so start locked.
3. Pick a region close to your learners (for South Asia, `asia-south1` or
   `asia-southeast1`).

> Firestore rules are enforced server-side and are the **only** thing standing
> between your data and the internet. Deploy them (§6) before inviting anyone.

---

## 5. Register the Web App and Configure the Client

1. **Project settings (⚙) → General → Your apps → Add app → Web (`</>`)**.
2. Register a nickname such as `aura-web`. **Do not** enable Firebase Hosting here.
3. Copy the `firebaseConfig` object into `.env.local`:

```dotenv
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=auramusic-daa98.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://auramusic-daa98-default-rtdb.asia-southeast1.firebasedatabase.app
VITE_FIREBASE_PROJECT_ID=auramusic-daa98
VITE_FIREBASE_STORAGE_BUCKET=auramusic-daa98.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=466766006378
VITE_FIREBASE_APP_ID=1:466766006378:web:5e2012d6c26d623a9d6213
VITE_FIREBASE_MEASUREMENT_ID=G-MLZFJ66C1V
VITE_USE_FIREBASE_EMULATORS=false
```

4. Put the project id in `.firebaserc`:

```json
{ "projects": { "default": "auramusic-daa98" } }
```

5. Restart `npm run dev`. The Local Studio Mode banner disappears and the app connects to Firebase Realtime Database (`https://auramusic-daa98-default-rtdb.asia-southeast1.firebasedatabase.app/`) and Firebase Auth.

### Step-by-Step: Applying Realtime Database Rules (`firebase/database.rules.json`)

1. Open **Firebase Console → Build → Realtime Database → Rules** (or visit `/about#firebase-rules` in the app and click **Copy Realtime DB Rules**).
2. Paste the contents of [`firebase/database.rules.json`](../firebase/database.rules.json) and click **Publish**.
3. Alternatively, deploy via CLI:
   ```bash
   npx firebase-tools deploy --only database,firestore:rules,firestore:indexes
   ```
4. To seed or update the public curriculum in Realtime Database:
   ```bash
   npm run seed:rtdb
   ```

### Is it safe to have these values in the browser?

**Yes.** They identify your project; they do not authorise anything. Google
publishes them in every Firebase web app. What protects your data is
`firebase/firestore.rules`, which you can view in the console under
**Firestore → Rules**.

**Never** paste a service-account key or `firebase-adminsdk` JSON into `.env.local`,
`src/`, or a GitHub issue. `.gitignore` blocks the common filenames, but the
only real defence is not putting them there.

---

## 6. Deploy Rules and Indexes

```bash
npx firebase-tools login
npx firebase-tools use your-project

# Preview
npx firebase-tools deploy --only firestore:rules --dry-run

# Deploy
npx firebase-tools deploy --only firestore:rules,firestore:indexes
```

Confirm in **Firestore → Rules** that the deployed text matches
`firebase/firestore.rules` exactly. Then verify by hand that an anonymous
browser cannot read `users/<some-uid>/progress` — it should be permission denied.

---

## 7. Data Model

```
courses/{courseId}
  titleSi, titleEn, descriptionSi, category, level,
  lessonsInOrder: string[],  plannedTotalLessons, outcomesSi,
  published: boolean, order: number, updatedAt

lessons/{lessonId}
  slug, courseId, titleSi, titleEn, descriptionSi, category, level,
  prerequisites: string[], estimatedMinutes, learningObjectives: string[],
  sections: object[], examples: object[], exercises: object[],
  exerciseIds: string[], quizIds: string[],
  summarySi, furtherPracticeSi: string[],
  published: boolean, order: number, updatedAt

quizzes/{quizId}
  lessonId, titleSi, titleEn, descriptionSi,
  passingPercentage, questions: object[], updatedAt

users/{uid}
  uid, email, displayName, lastVisitedLessonSlug, createdAt, updatedAt

users/{uid}/progress/{lessonId}
  uid, lessonId, completed, lastVisitedAt, completedAt, updatedAt

users/{uid}/bookmarks/{lessonId}
  uid, lessonId, createdAt

quizAttempts/{attemptId}
  uid, quizId, lessonId, answers, score, totalQuestions,
  percentage, passed, createdAt

adminAuditLogs/{logId}   (optional, admin-only, append-only)
  actorUid, action, targetId, createdAt
```

**Design notes**

- Lesson content lives in `lessons`, never duplicated into user documents.
- Progress records use the lesson id as the document id, so a completion is a
  direct `setDoc` — one write, no query — and cannot be duplicated.
- `quizAttempts` uses auto-ids and is ordered by `createdAt` for attempt history.
- Composite indexes in `firebase/firestore.indexes.json` exist only for queries
  the application actually issues.
- All timestamps use `serverTimestamp()` so clocks cannot be spoofed.
- The services layer uses **one-time `getDocs` queries, never `onSnapshot`**, to
  stay well inside the Spark read quota.

---

## 8. Seeding Firestore with the Curriculum

The repository ships the curriculum as TypeScript data, which the app reads
directly. Firestore is only needed if you want to author content through the
CMS.

```bash
export GOOGLE_APPLICATION_CREDENTIALS=/secure/path/service-account.json
node scripts/seed-firestore.mjs
```

The script is **idempotent** (it `setDoc`s by stable id), **dry-run capable**
(`--dry-run` prints the writes without performing them), and **rate-aware** (it
batches writes to respect the 20,000 writes/day limit — a full seed costs ~70).

> Running it requires a service account, so it cannot run in a credential-free
> CI job. Do not add your key to GitHub Secrets for a routine build.

### Quota-exceeded behaviour

If the daily read limit is reached, Spark pauses Firestore access. Every Aura
service already falls back to the bundled seed data and logs a warning, so
lessons and labs stay usable — learners simply lose cloud progress saving until
the quota resets at midnight Pacific Time. Consider surfacing a banner if you
run near the limit.

---

## 9. Admin Bootstrap (Required Before Using the CMS)

The CMS is reachable only by users whose Firebase Auth token carries the
`admin: true` custom claim. Set it with a trusted administrative process:

```bash
export GOOGLE_APPLICATION_CREDENTIALS=/secure/path/service-account.json

node --input-type=module -e "
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { readFileSync } from 'node:fs';
initializeApp({ credential: cert(JSON.parse(readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS, 'utf8'))) });
const user = await getAuth().getUserByEmail('owner@example.com');
await getAuth().setCustomUserClaims(user.uid, { admin: true });
console.log('admin claim set for', user.uid);
"
```

Then sign out and back in (or call `user.getIdToken(true)`) so the refreshed
token carries the claim.

**Verified behaviour without the claim:** a signed-in non-admin visiting
`/admin` sees the Sinhala permission-denied screen, and any direct Firestore
write is rejected by the rules. Hiding the button was never the control.

Full rationale, alternatives and non-options: [`SECURITY.md`](SECURITY.md#4-admin-authorisation-and-bootstrap).

---

## 10. Using the Emulator (optional)

Requires **Java 11+**.

```bash
npm install -g firebase-tools
firebase emulators:start --only auth,firestore,hosting
```

`firebase.json` already configures Auth on `9099`, Firestore on `8080`, Hosting
on `5000` and the Emulator UI (enabled). To point the app at the emulators, add
to `.env.local`:

```dotenv
VITE_FIREBASE_PROJECT_ID=demo-aura
VITE_FIREBASE_API_KEY=demo-key
VITE_FIREBASE_AUTH_DOMAIN=demo-aura.firebaseapp.com
VITE_FIREBASE_APP_ID=1:0:web:demo
VITE_USE_FIREBASE_EMULATORS=true
```

Emulator state is not committed (`.gitignore` blocks `.firebase/` and
`emulator-data/`), so it cannot leak into the repository.

---

## 11. Deployment

```bash
npm run build
npx firebase-tools deploy --only hosting
```

`firebase.json` provides SPA rewrites for React Router, immutable caching for
hashed assets, and `X-Content-Type-Options`, `X-Frame-Options`,
`Referrer-Policy` and `Permissions-Policy` headers.

Details and alternative hosts: [`DEPLOYMENT.md`](DEPLOYMENT.md).

---

## 12. Troubleshooting

| Symptom | Cause | Fix |
| :--- | :--- | :--- |
| Banner still says Local Studio Mode | Env vars missing or incomplete | All four of API key, auth domain, project id and app id are required. Restart the dev server after editing `.env.local`. |
| `auth/unauthorized-domain` | Domain not allow-listed | Authentication → Settings → Authorized domains → add it. |
| `Missing or insufficient permissions` | Rules not deployed, or writing to a path you don't own | Deploy rules; confirm the path and payload `uid` both match your `request.auth.uid`. |
| `The query requires an index` | A composite index is missing | Follow the console's link, or add it to `firestore.indexes.json` and redeploy. |
| `auth/email-already-in-use` | Account exists | Use sign-in, or the reset flow. |
| Lessons show but progress never saves | Writing under a different uid, or offline | Check the Network tab for `PERMISSION_DENIED`; confirm you are signed in. |
| CMS says saved, but content did not change after reload | Local Studio Mode writes to `localStorage` only | Configure Firebase so CMS writes go to Firestore. |
| Reset email never arrives | Local Studio Mode cannot send email | Aura now says so explicitly rather than pretending success. Configure Firebase. |
