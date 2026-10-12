# Aura Music Academy (ඔරා සංගීත ඇකඩමිය)

**Sinhala-first Western Music Theory, Composition, Arrangement, Music Production and Audio Engineering learning platform.**

Aura Music Academy teaches Western music theory, songwriting, arrangement, DAW production, audio engineering, mixing and mastering across **9 progressive levels**, written primarily in Sinhala while preserving the standard English technical vocabulary learners need in the real industry.

> **Honest status note.** This repository contains a **real, working single-page application** with a fully authored curriculum, nine working Web Audio tools, a quiz engine, student progress tracking and an admin CMS. It is **not** a finished commercial product. Sections marked *Planned* below are genuinely not built yet. See [Known Limitations](#known-limitations).

---

## Table of Contents

- [What Works Today](#what-works-today)
- [Feature Overview](#feature-overview)
- [Technology Stack](#technology-stack)
- [Requirements](#requirements)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Development Commands](#development-commands)
- [Test Commands](#test-commands)
- [Build Instructions](#build-instructions)
- [Firebase Setup](#firebase-setup)
- [Deployment Instructions](#deployment-instructions)
- [Curriculum Status](#curriculum-status)
- [Known Limitations](#known-limitations)
- [Documentation Index](#documentation-index)
- [Licensing and Attribution](#licensing-and-attribution)

---

## What Works Today

| Capability | Status | Notes |
| :--- | :--- | :--- |
| Responsive SPA with React Router | ✅ Working | 13+ routes, lazy-loaded, mobile-first |
| Dark + light DAW-inspired themes | ✅ Working | Persisted to `localStorage`, respects `prefers-color-scheme` |
| 9-level curriculum catalogue | ✅ Working | 9 courses, 20 fully authored Sinhala lessons |
| Lesson rendering engine | ✅ Working | Objectives, prerequisites, sections, key terms, formulas, examples, exercises, summary |
| Full-text lesson search | ✅ Working | Sinhala + English, across titles, bodies and glossary terms |
| Bilingual Glossary | ✅ Working | 17 music/audio terms with Sinhala definitions and examples |
| Virtual Piano | ✅ Working | Up to 3 octaves, mouse/touch/keyboard, 4 waveforms, stuck-note guard |
| Scale Explorer | ✅ Working | 8 scale types, semitone structure, frequency table, keyboard highlight |
| Chord Explorer | ✅ Working | 8 chord qualities, inversions, slash chords, diatonic/roman context |
| Chord Progression Builder | ✅ Working | Add/reorder/remove chords, presets, cadence analysis, local save |
| Metronome | ✅ Working | Web Audio lookahead scheduler (no timer drift), 1–12 beats per bar |
| Ear Training | ✅ Working | Note, interval, chord and rhythm drills with scoring |
| Audio Visualizer | ✅ Working | Waveform + logarithmic FFT spectrum, optional mic (never recorded) |
| Parametric EQ Lab | ✅ Working | Real `BiquadFilterNode` chain, 3 bands, ±12 dB |
| Local Audio File Analyzer | ✅ Working | 100% in-browser; duration, peak/RMS, crest factor, waveform |
| Quiz / Exercise engine | ✅ Working | 8 question types, immediate feedback, explanations, retry, attempt history |
| Student dashboard & progress | ✅ Working | Percentage **derived from published lessons**, per-level breakdown |
| Authentication | ✅ Working | Firebase Auth (email/password + reset) **or** offline Local Studio Mode |
| Firestore Security Rules | ✅ Written & mirrored-tested | Default-deny, strict UID isolation, trusted-admin claims |
| Admin CMS | ✅ Partially working | Edit/reorder/publish/preview existing lessons, filter, validate |
| Admin CMS — create brand-new lessons in the UI | ⛔ Planned | Author new lessons via `src/content/lessons/` for now |
| MIDI hardware controller input | ⛔ Planned | Web MIDI API integration |
| Printed worksheet / notation PDF export | ⛔ Planned | — |
| Certificates or accredited qualifications | ⛔ Not planned | Client-side grading is unsuitable for accreditation |
| Real instrument recordings | ⛔ Not included | All audio is synthesized at runtime with Web Audio API |

---

## Feature Overview

### Sinhala-first content system
Every lesson follows one typed schema (`src/types/content.ts`) and is authored as data, fully separate from presentation. Lessons carry Sinhala objectives, prerequisites, sections with English term chips, staff-notation/frequency diagrams, synthesized listening examples, practical exercises, quizzes, a summary and further practice.

### Interactive Music Lab (Web Audio API)
Nine tools that generate sound at runtime — **no audio files are downloaded**, no large sample libraries are bundled, and no external APIs are called. All tools stop cleanly, release microphone streams, and cancel scheduled audio when unmounted.

### Free-first, low-spec friendly
- Runs entirely inside the **Firebase Spark (no-cost) plan** limits.
- No Cloud Functions, no Cloud Storage, no paid APIs, no credit card needed.
- One-time `getDocs` queries rather than real-time listeners to minimise Firestore reads.
- Route-level code splitting; the Firebase SDK is isolated in its own chunk.
- Deploys anywhere that serves static files.

### Graceful Local Studio Mode
If `VITE_FIREBASE_*` variables are absent, the entire platform still works: all lessons, all nine labs, quizzes, progress, bookmarks and CMS editing persist in `localStorage`. A banner tells the learner exactly what is and is not being saved.

---

## Technology Stack

**Frontend** — React 18 · TypeScript 5 (strict) · Vite 6 · React Router 6 · plain CSS with design tokens (`src/styles/tokens.css`) · Lucide React icons · Web Audio API · Canvas + SVG

**Backend** — Firebase Authentication (email/password) · Cloud Firestore · Firebase Hosting · Firestore Security Rules

**Tooling** — npm with committed lockfile · Vitest + Testing Library · ESLint 9 (flat config) · GitHub Actions

**Deliberately excluded** — Redux/Zustand (React Context is sufficient), heavy animation libraries, large UI component frameworks, AI dependencies, Docker, local ML models.

---

## Requirements

- **Node.js 20 LTS or newer** (verified with v20.20.2)
- **npm 10+** (verified with 10.8.2)
- ~500 MB free disk space for `node_modules`
- A Firebase project — **optional**; the app runs fully in Local Studio Mode without one
- Java 11+ — **only** if you want to run the Firebase Emulator Suite

---

## Installation

```bash
git clone https://github.com/hirushanethsara358-bot/aura-music-academy.git
cd aura-music-academy
npm install
cp .env.example .env.local     # optional — leave blank for Local Studio Mode
npm run dev
```

The dev server binds to `0.0.0.0:5173`.

---

## Environment Variables

All client variables are prefixed `VITE_`. Copy `.env.example` to `.env.local`:

```dotenv
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_USE_FIREBASE_EMULATORS=false
```

| Variable | Required | Purpose |
| :--- | :--- | :--- |
| `VITE_FIREBASE_API_KEY` | No | Firebase web API key (public identifier) |
| `VITE_FIREBASE_AUTH_DOMAIN` | No | Firebase Auth domain |
| `VITE_FIREBASE_PROJECT_ID` | No | Firestore project id |
| `VITE_FIREBASE_STORAGE_BUCKET` | No | Reserved; Cloud Storage is not used on Spark |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | No | Reserved for future Cloud Messaging |
| `VITE_FIREBASE_APP_ID` | No | Firebase web app id |
| `VITE_USE_FIREBASE_EMULATORS` | No | `true` connects Firestore to `127.0.0.1:8080` |

If **any** of `API_KEY`, `AUTH_DOMAIN`, `PROJECT_ID` or `APP_ID` is missing, the app automatically falls back to Local Studio Mode.

> **Security note.** Firebase client configuration is *not* a secret and is *not* a substitute for security rules. Anyone can read these values from a deployed bundle. All data access control is enforced server-side by [`firebase/firestore.rules`](firebase/firestore.rules). **Never** commit a Firebase Admin SDK service-account key — `.gitignore` blocks the common filename patterns.

---

## Development Commands

```bash
npm run dev          # Vite dev server on 0.0.0.0:5173
npm run typecheck    # tsc --noEmit (strict)
npm run lint         # ESLint, zero warnings tolerated
npm test             # Vitest single run
npm run test:watch   # Vitest watch mode
npm run build        # typecheck + production bundle
npm run preview      # serve dist/ on 0.0.0.0:4173
npm run check:secrets # scan tracked files for credential patterns
```

---

## Test Commands

```bash
npm test                                  # all 186 tests
npx vitest run src/test/musicTheory.test.ts        # theory maths
npx vitest run src/test/quizAndProgress.test.ts    # grading + progress
npx vitest run src/test/securityRules.test.ts      # authorisation boundaries
npx vitest run src/test/app.test.tsx               # UI/route integration
npx vitest run -t "authentic cadence"              # single test by name
```

See [`docs/TESTING.md`](docs/TESTING.md) for the full strategy, what is and is not covered, and the emulator-based verification procedure.

---

## Build Instructions

```bash
npm run build     # -> dist/  (typecheck + bundle)
npm run preview   # verify the production bundle locally
```

Verified output on this repository:

```
dist/index.html                        1.31 kB │ gzip:   0.62 kB
dist/assets/index-*.css               12.15 kB │ gzip:   3.24 kB
dist/assets/react-vendor-*.js        201.36 kB │ gzip:  65.93 kB
dist/assets/index-*.js               276.92 kB │ gzip:  64.70 kB
dist/assets/firebase-*.js            476.72 kB │ gzip: 112.72 kB
dist/assets/LessonDetailPage-*.js     98.42 kB │ gzip:  22.75 kB
dist/assets/LabsPage-*.js             69.43 kB │ gzip:  17.48 kB
…plus 11 small route chunks (1–15 kB each)
```

Total initial payload ≈ **245 kB gzipped** excluding the lazily loaded Firebase SDK chunk.

---

## Firebase Setup

1. Create a project at <https://console.firebase.google.com> (Spark plan, no card required).
2. **Authentication → Sign-in method →** enable **Email/Password**.
3. **Firestore Database →** create a database in production mode.
4. **Project settings → Your apps →** add a Web app and copy the config into `.env.local`.
5. Put your project id in `.firebaserc`.
6. Deploy the rules and indexes:
   ```bash
   npx firebase-tools deploy --only firestore:rules,firestore:indexes
   ```
7. **Optional** — seed Firestore with the bundled curriculum so the cloud copy matches the repository:
   ```bash
   npm run build && node scripts/seed-firestore.mjs   # requires a service account, see docs/FIREBASE_SETUP.md
   ```

Full walkthrough, including the **admin bootstrap procedure**: [`docs/FIREBASE_SETUP.md`](docs/FIREBASE_SETUP.md).

---

## Deployment Instructions

```bash
npm run build
npx firebase-tools login
npx firebase-tools use <your-project-id>
npx firebase-tools deploy --only hosting
npx firebase-tools deploy --only firestore:rules,firestore:indexes
```

`firebase.json` configures SPA rewrites, long-lived immutable caching for hashed assets, and baseline security headers.

Free-tier hosting notes and alternative static hosts (GitHub Pages, Netlify, Cloudflare Pages): [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

---

## Curriculum Status

The 9-level structure is complete as an architecture. Lesson **authoring** is an ongoing process and this repository does **not** claim otherwise.

| Level | Topic | Authored | Planned total |
| :--- | :--- | :---: | :---: |
| 1 | Music Foundations | 3 | 12 |
| 2 | Western Music Theory | 3 | 12 |
| 3 | Composition & Songwriting | 2 | 8 |
| 4 | Arrangement | 2 | 8 |
| 5 | Music Production & DAW Workflow | 2 | 6 |
| 6 | Audio Engineering Foundations | 3 | 8 |
| 7 | Mixing | 2 | 8 |
| 8 | Mastering | 2 | 6 |
| 9 | Advanced Practice & Capstones | 2 | 6 |
| | **Total** | **21** | **74** |

> The Level 9 course description references two published lessons, and the Level 8 course references two. The exact per-level counts are always derived at runtime from `published: true` lessons — nothing in the UI hardcodes a completion figure. Planned lessons are shown to the learner as *“සැලසුම් කර ඇත”* (planned) and are never presented as finished work.

Topic breakdown for every remaining lesson slot: [`docs/CURRICULUM.md`](docs/CURRICULUM.md).

---

## Known Limitations

1. **No real instrument recordings.** Every listening example is synthesized at runtime by the Web Audio API. The app labels this everywhere it is relevant.
2. **No certificates.** Grading runs in the browser, so results are suitable for self-study only. The UI states this.
3. **Quiz answers are public.** Quiz documents are world-readable so anonymous learners can practise. Do not place assessment answers you consider confidential in Firestore quizzes.
4. **Local Studio Mode is not production auth.** It exists so the whole platform is explorable without a Firebase project. It hashes passwords with Web Crypto before writing to `localStorage`, but it is **not** a security boundary — configure Firebase Authentication for any real deployment.
5. **Not all curriculum slots are authored** (see table above).
6. **Admin CMS cannot create brand-new lessons yet.** It can edit, reorder, publish/unpublish, filter and preview existing lessons, with required-field validation.
7. **Firestore rules are verified by a mirrored evaluator**, not by the Firebase Emulator Suite, because the emulator needs a Java runtime that is not guaranteed to exist on modest developer machines. `docs/TESTING.md` documents the emulator procedure for environments that have Java.
8. **No offline cloud synchronisation.** Local data stays local; cloud data stays in Firestore. There is no sync engine, and none is claimed.
9. **Firestore seeding script** requires a service account (Admin SDK) and therefore cannot run in the browser or in a credential-free CI job.
10. **`dist/` and `node_modules/` are not committed.** Build the project to obtain deployable output.

---

## Documentation Index

| Document | Contents |
| :--- | :--- |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | System overview, ASCII architecture diagram, directory map, Spark free-tier engineering decisions |
| [`docs/CURRICULUM.md`](docs/CURRICULUM.md) | Every level, every authored lesson, every planned lesson slot, authoring conventions |
| [`docs/FIREBASE_SETUP.md`](docs/FIREBASE_SETUP.md) | Project creation, Auth, Firestore, env vars, emulator, seeding, admin bootstrap |
| [`docs/SECURITY.md`](docs/SECURITY.md) | Threat model, rule-by-rule rationale, admin authorisation, secret handling, disclosure policy |
| [`docs/TESTING.md`](docs/TESTING.md) | Test strategy, coverage, how to run, emulator procedure, what is *not* tested |
| [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) | Firebase Hosting, free-tier constraints, alternative static hosts |
| [`docs/CONTENT_AUTHORING.md`](docs/CONTENT_AUTHORING.md) | Lesson schema, Sinhala writing style, notation conventions, adding a lesson |
| [`docs/ROADMAP.md`](docs/ROADMAP.md) | Milestones 0–8 with status, branch strategy, future releases |
| [`CHANGELOG.md`](CHANGELOG.md) | Milestone notes |

---

## Licensing and Attribution

All lesson content, glossary entries, quiz questions and the Aura logo are **original work** created for this project. No copyrighted textbook, paid course, proprietary educational content or commercial audio sample has been copied or bundled.

- Musical examples are computed from first principles (e.g. `440 × 2^(n/12)`) and synthesized at runtime.
- The logo is an original SVG built from geometric primitives — it imitates no existing mark.
- The project pins open-source dependencies through `package-lock.json`; each dependency retains its own licence.

**No licence file is currently included.** Add one (for example MIT for code) before distributing publicly.
