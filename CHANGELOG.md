# Changelog

All notable changes to Aura Music Academy are recorded here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/);
versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned
- Admin CMS: author brand-new lessons entirely in the browser.
- Web MIDI input for the Virtual Piano and Ear Training modules.
- Printable SVG staff-notation worksheet generator for classroom use.
- Remaining 53 curriculum lesson slots (see `docs/CURRICULUM.md`).

---

## [1.1.0] — 2026-10-13

### Added
- **Firebase Realtime Database (`firebase/database`) first-class integration** alongside Cloud Firestore (`https://auramusic-daa98-default-rtdb.asia-southeast1.firebasedatabase.app/`), across `firebase.ts`, `authService.ts`, `courseService.ts`, `lessonService.ts`, `progressService.ts` and `quizService.ts`.
- **Production-ready Realtime Database Security Rules (`firebase/database.rules.json`)** with root default-deny (`".read": false`, `".write": false`), query-constrained public reads on `/courses` and `/lessons`, strict per-UID isolation on `/users`, `/userProgress`, `/userBookmarks` and `/quizAttempts`, immutable quiz attempts, and a console-only `/admins/{uid}` registry (`".write": false`) alongside Firebase Auth custom claims (`admin: true`).
- **Mirrored Realtime Database Rules Simulator (`src/lib/rtdbRulesSimulator.ts`)** and automated security test suite in `src/test/securityRules.test.ts` (55 security tests total across Firestore and Realtime Database rules).
- **Interactive Firebase & Security Rules Center (`src/features/admin/FirebaseRulesPanel.tsx`)** embedded in `/about#firebase-rules` and `/admin`, with one-click copy buttons for `database.rules.json` and `firestore.rules`, signed-in UID copy, and runtime Firebase connection settings.
- **Realtime Database curriculum seeding script (`scripts/seed-rtdb.mjs` / `npm run seed:rtdb`)** and one-click Admin CMS seeding button; seeded all 9 courses, 24 lessons and 24 quizzes into `https://auramusic-daa98-default-rtdb.asia-southeast1.firebasedatabase.app/`.
- **Full Lesson Creation & Course Management in Admin CMS (`src/features/admin/AdminCmsPage.tsx`)**: admins can now create complete new lessons and edit courses directly in the browser, persisting to Firebase Realtime Database, Firestore, and local storage.
- **3 new original Sinhala lessons & quizzes** (`lesson-104` Piano Fingering & Enharmonics, `lesson-204` Modes of the Major Scale, `lesson-703` Vocal & Drum Bus Mixing / Parallel Compression), bringing the authored curriculum to **24 lessons and 24 quizzes**.

---

## [1.0.0] — 2026-10-12

First functional release: a working Sinhala-first music education platform, not a
mockup.

### Milestone 0 — Discovery
- Verified GitHub repository access, environment limits (Node 20.20.2, npm 10.8.2,
  21 GB disk, 1.9 GB RAM) and the Firebase Spark free-tier quotas.
- Created the repository and filed GitHub Issues #1–#9, one per milestone.
- Authored `docs/ARCHITECTURE.md` (system diagram, directory map, free-tier
  engineering decisions) and `docs/ROADMAP.md`.
- **Deliberate design decision:** exclude Cloud Functions and Cloud Storage by
  using browser-side audio analysis, so the platform stays entirely inside Spark.

### Milestone 1 — Foundation
- Scaffolded React 18 + TypeScript 5 (strict) + Vite 6, with React Router 6.
- Built a design-token system with DAW-inspired dark and warm-off-white light
  themes, Sinhala-capable typography stack, and reduced-motion support.
- Built the responsive shell: header with search/theme/account controls, 12-item
  primary navigation, mobile drawer, footer, skip link.
- Added an original vector logo, error boundary, loading skeletons, empty states
  and status banners.
- Added route-level code splitting plus manual vendor chunking, isolating the
  Firebase SDK into its own cacheable chunk so the core bundle stays small.

### Milestone 2 — Curriculum
- Define the complete 9-level curriculum schema in `src/types/content.ts`,
  keeping content as typed data with presentation fully separated.
- Authored **21 original Sinhala lessons** across all nine levels, each with
  objectives, prerequisites, multi-section teaching bodies, English term chips,
  formula/diagram blocks, worked examples, practical exercises, a summary and
  further practice.
- Added **21 quizzes with 71 questions**, covering every authored lesson across
  eight question types.
- Added a **17-term bilingual glossary** spanning every category.
- Implemented Sinhala-aware full-text search across titles, bodies, objectives
  and key terms.
- Added prerequisite links, lesson-to-lesson navigation and honest
  published-vs-planned lesson counts on the learning paths page.

### Milestone 3 — Interactive Music Lab
- **Virtual Piano:** selectable octave range up to 3 octaves, four waveforms,
  mouse/touch/computer-keyboard input, per-key labels, and a stuck-note guard
  that releases voices on blur, visibility change and unmount.
- **Scale Explorer:** eight scale types, semitone structure, degree table with
  live frequency calculation, and keyboard highlighting.
- **Chord Explorer:** eight chord qualities (four triads + four seventh chords),
  inversions with slash-chord naming, and diatonic roman-numeral context, each
  verified by unit tests.
- **Chord Progression Builder:** add/reorder/remove chords, five musically valid
  presets, cadence analysis, tempo and beats-per-chord control, local draft save.
- **Metronome:** true Web Audio lookahead scheduler driven by
  `AudioContext.currentTime` instead of `setInterval`, with accented downbeats.
- **Ear Training:** note, interval, major/minor chord and rhythm drills with
  scoring and per-answer explanations.
- Added 49 music-theory unit tests covering every calculation these tools rely on.

### Milestone 4 — Student Platform
- Firebase Authentication (email/password + password reset) with **graceful Local
  Studio Mode** fallback when configuration is absent.
- All authentication errors translated into Sinhala, with no raw SDK strings
  reaching the learner.
- Student dashboard with progress derived at runtime from published lessons and
  recorded completions — never hardcoded, never assumed to be 100%.
- Per-level progress breakdown, bookmarks, last-visited lesson, and study stats.
- Reusable quiz engine with all eight question types, immediate feedback, correct
  answer explanations, retry, optional randomised order and attempt history.
- Explicit statement that browser-side grading is for self-study, not certification.

### Milestone 5 — Admin CMS
- Trusted admin authorisation via Firebase Auth custom claim (`admin: true`),
  never a user-editable profile field.
- Lesson editing, reordering, publish/unpublish, search, filtering by status and
  course, and an in-page preview.
- Required-field validation with Sinhala error messages; invalid lessons cannot be
  published.
- Explicit warning to signed-in non-admins explaining that hiding UI is not a
  security control, plus links to the bootstrap procedure.

### Milestone 6 — Audio Engineering Labs
- **Audio Visualizer:** waveform and FFT spectrum with a logarithmic frequency
  axis, `requestAnimationFrame` rendering, and optional microphone input that is
  never recorded, never uploaded and never routed to the speakers.
- **Parametric EQ Lab:** three real `BiquadFilterNode`s (±12 dB, 20 Hz–20 kHz)
  with a conceptual response-curve overlay and a reference table of frequency bands.
- **Local Audio File Analyzer:** duration, sample rate, channels, peak/RMS dBFS,
  crest factor, DC offset, clipped-sample count, downsampled waveform and
  estimated band energy — entirely in-browser, with object URLs revoked on release.
- Documented explicitly which measurements are exact and which are estimates.

### Milestone 7 — Security and QA
- Wrote default-deny Firestore Security Rules with strict per-UID isolation,
  length-bounded and key-allow-listed payloads, immutable quiz attempts, and a
  catch-all deny.
- Added **48 security tests** over a rules mirror, including four distinct
  privilege-escalation attempts, plus static assertions parsing the real rules file.
- Added **45 UI and route tests** and **44 grading/progress/storage tests**:
  **186 tests in total, all passing.**
- Added a GitHub Actions pipeline (install, typecheck, lint, test, build, secret
  scan) that needs no secrets and works on forks.
- Completed the documentation set: architecture, curriculum, Firebase setup,
  security, testing, deployment, content authoring, roadmap.

### Milestone 8 — Release Quality
- Verified the full quality gate: typecheck 0 errors, lint 0 warnings, 186 tests
  passing, production build succeeding (1657 modules, ~5–6 s).
- Confirmed the initial payload is ~245 kB gzipped with the Firebase SDK split
  into its own lazily cached chunk.
- Documented **all** known limitations in the README and on the About page rather
  than omitting them.

### Security
- No Admin SDK credentials, service-account keys or private keys exist anywhere in
  the repository; `.gitignore` blocks the common filename patterns and CI scans for them.
- Microphone access is opt-in, analyser-only, and released on stop and unmount.
- User audio files never leave the browser.
- Firestore Security Rules deny unspecified access by default.

### Known Issues
- Curriculum is 21 of 74 planned lessons (28%).
- Admin CMS cannot create brand-new lessons yet.
- Firestore rules are verified via a hand-maintained mirror rather than the
  Firebase Emulator Suite, because the emulator requires a Java runtime that is
  not guaranteed on the low-spec machines this project targets.
- No offline cloud synchronisation exists, and none is claimed.
- `docs/DEPLOYMENT.md` describes the procedure; no live production URL is
  verified in this changelog entry.
