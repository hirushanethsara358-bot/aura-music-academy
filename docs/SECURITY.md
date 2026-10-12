# Aura Music Academy — Security Model

## 1. Guiding Principle

> **Hiding a button in React is not security.**

Every authorisation decision that protects data is made by
[`firebase/firestore.rules`](../firebase/firestore.rules), executed on Google's
servers. The React application decides only what to *render*. If the client
were fully compromised — DevTools open, JavaScript patched, admin panel URL
guessed — the rules would still reject every unauthorised read and write.

---

## 2. Threat Model

| Threat | Mitigation |
| :--- | :--- |
| Anonymous visitor reads unpublished draft lessons | Rules require `resource.data.published == true` for public reads |
| Student reads another student's progress or bookmarks | Rules require `request.auth.uid == uid` on the path; cross-user reads are impossible at the rules layer |
| Student writes progress into another user's sub-collection | Rules require both path ownership **and** `request.resource.data.uid == uid` |
| Student submits a quiz attempt as somebody else | `create` requires `request.resource.data.uid == request.auth.uid` |
| Student falsifies a quiz score | `score <= totalQuestions`, `totalQuestions > 0`, `percentage` in 0–100, attempts immutable after creation |
| User grants themselves admin through the profile document | Admin privilege is read **only** from `request.auth.token.admin`; the allowed profile update fields exclude any privilege field |
| Attacker forges an admin token claim | ID tokens are signed by Firebase's private key; a browser cannot mint one |
| Storage abuse via huge payloads | Every string and every list is length-bounded in the rules |
| Smuggling unexpected fields into a document | `request.resource.data.keys().hasOnly([...])` allow-lists |
| Undefined or future collections silently exposed | `match /{document=**}` catch-all `allow read, write: if false;` |
| Admin SDK service-account key leaked to the client or repo | Keys never enter the frontend; `.gitignore` blocks `*service-account*.json`, `*firebase-adminsdk*.json`, `*.pem`, `*.key` |
| Malicious microphone capture | Microphone audio is connected to an `AnalyserNode` only, never recorded, never uploaded, and released on stop/unmount |
| Private audio files exfiltrated | Local Audio Analyzer uses `FileReader` + `decodeAudioData` entirely in the browser; no upload path exists |
| Denial of service by resource exhaustion in the UI | Audio visualiser uses `requestAnimationFrame` (throttled by the browser when backgrounded) and the analyser is disconnected on unmount |

---

## 3. Firestore Rules Walkthrough

### 3.1 Default deny

```javascript
match /{document=**} {
  allow read, write: if false;
}
```

Anything not explicitly permitted above this block is rejected. New
collections are therefore **private by default** — a developer must opt in
deliberately.

### 3.2 Public catalogue (`courses`, `lessons`)

```javascript
allow read: if resource.data.published == true;
```

Anonymous learners may read published lessons — this is the core educational
promise of the platform. **Unpublished (`draft`) documents are not readable by
the public**, which lets administrators prepare content safely.

Writes require `isAdmin()`, plus allow-listed keys, bounded string lengths and
type checks on `published`, `order` and `estimatedMinutes`.

### 3.3 Quizzes

```javascript
match /quizzes/{quizId} {
  allow read: if true;
  allow create, update: if isAdmin() && …;
}
```

**Deliberate design decision.** Quiz question banks are world-readable so
anonymous visitors can practise without an account — a core accessibility goal.
The consequence is that answers are not confidential. This is why the platform
states plainly that quizzes are **self-study practice, not accreditation**.
Reads are public; **writes are admin-only**.

### 3.4 User profiles

```javascript
allow update: if isOwner(uid)
  && keepsUid(uid)
  && changedOnly(['displayName', 'lastVisitedLessonSlug', 'updatedAt'])
  && boundedString(request.resource.data.displayName, 120);
```

The field allow-list is the privilege-escalation defence. `role`, `admin`,
`isAdmin`, `permissions` or any other privilege-bearing field is **not in the
list**, so a request attempting to write one is rejected. `keepsUid(uid)` stops
a user re-pointing a document at another identity.

### 3.5 Progress and bookmarks

```javascript
match /users/{uid}/progress/{lessonId} {
  allow read:  if isOwner(uid) || isAdmin();
  allow create, update: if isOwner(uid)
    && keepsUid(uid)
    && request.resource.data.lessonId == lessonId
    && request.resource.data.completed is bool;
  allow delete: if isOwner(uid) || isAdmin();
}
```

Two independent checks bind the record to reality: the **path** must belong to
the caller, and the **payload's `uid`** must also equal the caller. Bookmark
documents are create-or-delete only (`allow update: if false`) so their
timestamps cannot be rewritten.

### 3.6 Quiz attempts

```javascript
allow create: if isSignedIn()
  && request.resource.data.uid == request.auth.uid
  && … bounded score/percentage …
allow update, delete: if false;
```

Attempts are append-only and immutable. They cannot be attributed to another
user, and a score cannot exceed the number of questions.

### 3.7 Admin audit log

Optional `adminAuditLogs` collection: readable and appendable by admins only,
never updatable or deletable from a client, so an audit trail cannot be
rewritten after the fact.

---

## 4. Admin Authorisation and Bootstrap

Admin status is derived **only** from a Firebase Authentication custom claim:

```javascript
function isAdmin() {
  return isSignedIn() && request.auth.token.admin == true;
}
```

Custom claims are embedded in the cryptographically signed ID token issued by
Firebase. A browser cannot mint or edit one.

### Bootstrap procedure for the first admin

Because Cloud Functions are unavailable on the Spark plan, claims are set with
a trusted administrative process:

**Option A — Admin SDK script (recommended)**

```bash
# Never commit the service-account key. Keep it outside the repository.
export GOOGLE_APPLICATION_CREDENTIALS=/secure/path/service-account.json

node --input-type=module -e "
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { readFileSync } from 'node:fs';
initializeApp({ credential: cert(JSON.parse(readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS,'utf8'))) });
const user = await getAuth().getUserByEmail('owner@example.com');
await getAuth().setCustomUserClaims(user.uid, { admin: true });
console.log('admin claim set for', user.uid);
"
```

The user must sign out and sign in again (or force-refresh their token) for the
claim to appear.

**Option B — Google Cloud Console**

Cloud Console → IAM & Admin → the Firebase service account → grant a role that
permits `firebaseauth.users.update` → run the Admin SDK command above.

**Option C — Console-managed allow-list document**

Create `admins/{uid}` **directly in the Firebase Console** and change `isAdmin()`
to also accept `exists(/databases/$(database)/documents/admins/$(request.auth.uid))`.
Because rules can only *read* that document and never let a client *write* it,
this is safe — but it must be created in the Console, never by application code.

### Explicit non-options

- ❌ A `role: "admin"` field on the user profile — the user can edit their own profile.
- ❌ Reading admin status from a query parameter, `localStorage`, or a cookie.
- ❌ Trusting `request.resource.data.isAdmin`.
- ❌ Adding a Cloud Function "so we can check it properly" on the Spark plan.

---

## 5. Authentication Hardening

- Firebase Authentication handles password hashing, salting, rate limiting and
  resets server-side when configured.
- Errors are translated into Sinhala (`friendlyAuthError`) so learners get
  actionable messages, and the mapping **never leaks raw English SDK strings**.
- Registration enforces email format and a six-character minimum client-side,
  and Firebase enforces it server-side.
- Admin UI rendering consults `user.isAdmin`, which is resolved from
  `getIdTokenResult().claims.admin` — never from any mutable client state.

### Local Studio Mode (offline fallback)

When Firebase is not configured the app stores accounts in `localStorage`. This
is a **development and preview convenience**, not a security boundary:

- Passwords are hashed with Web Crypto SHA-256 before storage, so plaintext is
  never written — but a local attacker with the browser profile can still
  brute-force a weak password.
- The recovery flow **refuses to pretend** an email was sent; it explains that
  Firebase must be connected.
- Every auth screen displays a Local Studio Mode banner stating that data is
  confined to the browser.
- Code comments in `src/services/authService.ts` repeat this warning at the
  point of implementation.

---

## 6. Secret Handling

| Rule | Enforcement |
| :--- | :--- |
| Admin SDK keys never in the frontend | Not imported anywhere under `src/`; only `firebase/app`, `firebase/auth`, `firebase/firestore` |
| Service-account files never committed | `.gitignore` blocks `*service-account*.json`, `*firebase-adminsdk*.json`, `*.pem`, `*.key` |
| `.env` files never committed | `.gitignore` blocks `.env`, `.env.local`, `.env.*.local` |
| Only `.env.example` is tracked | Contains empty placeholders and explanatory comments |
| Emulator data never committed | `.gitignore` blocks `.firebase/`, `emulator-data/`, `*-debug.log` |
| Verified in review | `docs/TESTING.md` includes a secret-scanning checklist for releases |

Public Firebase client config **is** committed once configured — this is
expected and safe, because it identifies the project rather than authenticating
to it. What protects the data is the rules file.

---

## 7. Microphone, Camera and File Privacy

- **Camera and geolocation** are explicitly disabled in the Hosting
  `Permissions-Policy` header: `microphone=(self), camera=(), geolocation=()`.
- **Microphone** access is requested only after an explicit button press, only
  in the Audio Visualizer, and the stream is routed to an `AnalyserNode` that is
  **never** connected to `AudioContext.destination` (avoiding feedback loops and
  preventing any possibility of playback or capture).
- `track.stop()` is called for every track on stop and on unmount.
- **Audio files** are decoded with `decodeAudioData` in memory; object URLs are
  revoked and buffers are released when the learner clears the file.
- No analytics, no tracking pixels, no third-party scripts.

---

## 8. Verifying the Rules

Run the mirrored-rule test suite:

```bash
npx vitest run src/test/securityRules.test.ts
```

It asserts, among 48 cases, that: anonymous users cannot read drafts; users
cannot read or write each other's progress, bookmarks, profiles or attempts;
privilege-escalation fields are rejected; scores cannot exceed question counts;
attempts are immutable; the rules file contains a catch-all deny and no
`allow write: if true`; and admin status is read from a token claim rather than
a client-written field.

**Honest limitation:** this suite exercises
`src/lib/firestoreRulesSimulator.ts`, a faithful hand-maintained mirror of the
rules, **not** the Firebase Emulator Suite. The emulator path is documented in
`docs/TESTING.md` for environments with a Java runtime.

> Whenever `firebase/firestore.rules` changes, the mirror **must** change in the
> same commit, and the paired test must be updated to match.

---

## 9. Reporting a Vulnerability

Open a **private security advisory** on the GitHub repository (Security →
Advisories → Report a vulnerability) rather than a public issue. Include:

1. The affected route, service or rule.
2. Exact reproduction steps.
3. The impact you believe it has.
4. Whether the issue affects Local Studio Mode, configured Firebase, or both.

Please do not attempt to access, modify or delete other users' data while
testing.
