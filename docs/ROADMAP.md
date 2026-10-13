# Aura Music Academy — Development Roadmap

Tracks delivery against GitHub Milestones (Issues #1–#9).

| Milestone | Issue | Branch | Status |
| :--- | :--- | :--- | :--- |
| **0 — Discovery** | [#1](https://github.com/hirushanethsara358-bot/aura-music-academy/issues/1) | `main` | ✅ Completed |
| **1 — Foundation** | [#2](https://github.com/hirushanethsara358-bot/aura-music-academy/issues/2) | `feat/foundation` | ✅ Merged |
| **2 — Curriculum** | [#3](https://github.com/hirushanethsara358-bot/aura-music-academy/issues/3) | `feat/foundation` | ✅ Merged |
| **3 — Music Lab** | [#4](https://github.com/hirushanethsara358-bot/aura-music-academy/issues/4) | `feat/foundation` | ✅ Merged |
| **4 — Student Platform** | [#5](https://github.com/hirushanethsara358-bot/aura-music-academy/issues/5) | `feat/foundation` | ✅ Merged |
| **5 — Admin CMS** | [#6](https://github.com/hirushanethsara358-bot/aura-music-academy/issues/6) | `feat/foundation` | ✅ Merged |
| **6 — Audio Engineering Labs** | [#7](https://github.com/hirushanethsara358-bot/aura-music-academy/issues/7) | `feat/foundation` | ✅ Merged |
| **7 — Security, QA & Docs** | [#8](https://github.com/hirushanethsara358-bot/aura-music-academy/issues/8) | `feat/foundation` | ✅ Merged |
| **8 — Release Quality** | [#9](https://github.com/hirushanethsara358-bot/aura-music-academy/issues/9) | `main` | ✅ Quality gate verified |

### Note on branch naming

The original plan called for one branch per feature area. In practice the
milestones were delivered as a sequence of small, logically grouped commits on a
single integration branch, `feat/foundation`, and merged to `main` through
[Pull Request #10](https://github.com/hirushanethsara358-bot/aura-music-academy/pull/10).
This is recorded honestly here rather than presenting branches that were never
used. The conventional branch names below remain the strategy for **future**
work, and the long-lived branches have been created so contributors start from a
consistent base.

### Branch strategy for future work

| Branch | Purpose |
| :--- | :--- |
| `main` | Stable, released. Protected by required CI. |
| `feat/curriculum` | Authoring the remaining 53 lesson slots. |
| `feat/music-lab` | New lab tools, Web MIDI input, notation rendering. |
| `feat/student-platform` | Dashboards, study statistics, practice history. |
| `feat/admin-cms` | Full lesson creation in the browser, media handling. |
| `feat/security-tests` | Rules changes, emulator harness, security regression tests. |

### Commit conventions

`type(scope): summary (#issue)` — for example
`feat(curriculum): add Level 1 rhythm-reading lesson (#3)`.
Types: `feat`, `fix`, `docs`, `test`, `chore`, `refactor`, `perf`, `security`.

Every change must pass `npm run typecheck && npm run lint && npm test && npm run build`
before merge. Rules changes additionally require the review checklist in
`docs/TESTING.md`.

---

## Delivered in v1.1.0 (2026-10-13)

- **Firebase Realtime Database (`https://auramusic-daa98-default-rtdb.asia-southeast1.firebasedatabase.app/`) + Cloud Firestore Dual-Engine Support** across all services (`firebase.ts`, `authService.ts`, `courseService.ts`, `lessonService.ts`, `progressService.ts`, `quizService.ts`).
- **Realtime Database Security Rules (`firebase/database.rules.json`) + Simulator (`src/lib/rtdbRulesSimulator.ts`)** with default-deny root rules, query-enforced public reads, strict per-UID isolation, immutable quiz attempts, and console-only `/admins/{uid}` (`".write": false`) alongside Custom Claims.
- **Interactive Firebase & Security Rules Center (`FirebaseRulesPanel.tsx`)** in `/about#firebase-rules` and `/admin`.
- **Full Lesson Creation & Course Editing in Admin CMS** + one-click Realtime Database curriculum seeding (`npm run seed:rtdb`).
- **Expanded Curriculum**: 24 authored Sinhala lessons and 24 quizzes across all 9 levels.

---

## Delivered in v1.0.0

**Foundation** — React 18 + TypeScript strict + Vite 6, DAW-inspired dual theme,
Sinhala typography, responsive shell, original logo, route-level code splitting
with an isolated Firebase chunk, error boundaries and full loading/empty/error states.

**Curriculum** — 9-level architecture; 21 authored Sinhala lessons; 21 quizzes
with 71 questions across 8 types; a 17-term bilingual glossary; Sinhala + English
search; prerequisite graphs.

**Music Lab (9 tools)** — Virtual Piano, Scale Explorer, Chord Explorer,
Progression Builder, lookahead-scheduler Metronome, Ear Training, FFT Visualizer,
real 3-band Parametric EQ, in-browser Audio Analyzer. Nothing is downloaded;
everything is synthesized at runtime.

**Student Platform** — Firebase Auth plus a graceful offline fallback, dashboard
with runtime-derived progress, per-level breakdown, bookmarks, quiz attempts.

**Admin CMS** — trusted custom-claim authorisation, edit/reorder/publish/preview,
validation with Sinhala messages, content filtering.

**Security & QA** — default-deny Firestore rules, 186 automated tests, GitHub
Actions CI, and the full `docs/` suite.

---

## Roadmap Beyond 1.0.0

### 1.1 — Curriculum completion *(highest impact)*
Author the remaining 53 lesson slots, prioritised as: Level 1 → Level 2 →
Level 7 → Level 6 → the rest. Each new lesson follows
[`CONTENT_AUTHORING.md`](CONTENT_AUTHORING.md) and must pass the integrity suite.

### 1.2 — Admin CMS authoring depth
Create and delete lessons entirely in the browser, with a rich section editor,
draft autosave and a JSON content importer.

### 1.3 — Web MIDI support
`navigator.requestMIDIAccess()` for the Virtual Piano and Ear Training modules so
learners with a controller can practise on real hardware. Degrades silently when
unsupported.

### 1.4 — Classroom tools
A printable SVG staff-notation worksheet generator (public-domain material only)
for use in Sri Lankan schools, plus an offline-friendly printable lesson view.

### 1.5 — Listening library
Where licensing permits, add real instrument recordings **clearly labelled as
recordings** alongside the synthesized examples, with a documented source and
licence for each file. Spark has no Cloud Storage, so this would use a static
asset path or a free-tier external host.

### 1.6 — Security verification depth
Add an emulator-backed rules suite in a CI job that has Java, keeping the
mirror-based suite for environments without it, and reconcile the two.

### Deferred / not planned
- Certificates or accredited qualifications — client-side grading cannot support them honestly.
- Real-time collaboration — incompatible with the Spark write quota and unnecessary here.
- Paid APIs of any kind.
