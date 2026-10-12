# Aura Music Academy — System Architecture

## 1. Overview

**Aura Music Academy** (`ඔරා සංගීත ඇකඩමිය`) is a Sinhala-first, free-first educational web platform for learning Western Music Theory, Composition, Arrangement, Music Production (DAW Workflow), Audio Engineering, Mixing, and Mastering from Level 1 (Foundations) to Level 9 (Advanced Practice).

The architecture is designed around four core engineering constraints:

1. **Sinhala-First Pedagogical Clarity**: Every lesson, tool, quiz, and authentication message is written in clear, natural Sinhala while preserving standard English technical terminology (`Melody`, `Harmony`, `Compression`, `Equalization (EQ)`, `LUFS`, `True Peak`, etc.).
2. **Low-Spec PC & Mobile Optimization**: Zero heavy UI frameworks, zero local AI models, zero bloated audio sample packs. All sound synthesis, metronome scheduling, frequency filtering, and spectral visualization use native **Web Audio API** and HTML5 `<canvas>` / `<svg>`.
3. **Free-First Infrastructure (Firebase Spark Plan Compatible)**: Operates completely within the Firebase Spark no-cost tier (Authentication + Cloud Firestore + Firebase Hosting) with no paid APIs and no mandatory Cloud Functions or Cloud Storage.
4. **Graceful Local Studio Fallback**: When Firebase environment variables are not configured, the service layer seamlessly falls back to deterministic local storage + seed curriculum data so every lesson, quiz, student dashboard, and interactive lab works out of the box.

---

## 2. High-Level Architecture Diagram

```
+-----------------------------------------------------------------------------------+
|                           CLIENT BROWSER (React 18 + TS + Vite)                   |
|                                                                                   |
|  +---------------------------+  +--------------------------+  +----------------+  |
|  |   Curriculum & Lessons    |  |  Interactive Music Lab   |  | Audio Eng Labs |  |
|  | - 9 Progressive Levels    |  | - Virtual Piano (3 Oct)  |  | - Waveform/FFT |  |
|  | - Sinhala + EN Glossary   |  | - Scale & Chord Explorer |  | - 3-Band EQ    |  |
|  | - Prerequisites & Search  |  | - Progression Builder    |  | - Local File   |  |
|  | - Quizzes & Checklists    |  | - Lookahead Metronome    |  |   DSP Analyzer |  |
|  |                           |  | - Ear Training Studio    |  |                |  |
|  +-------------+-------------+  +------------+-------------+  +--------+-------+  |
|                |                             |                         |          |
|                v                             v                         v          |
|  +-----------------------------------------------------------------------------+  |
|  |                    DOMAIN & AUDIO ENGINE LAYER (src/lib/)                   |  |
|  |  - musicTheory.ts (MIDI/Hz, Scales, Intervals, Chords, Roman Numerals)      |  |
|  |  - webAudioEngine.ts (Polyphonic Synth, Lookahead Metronome, Biquad EQ,     |  |
|  |    AnalyserNode FFT, Local AudioBuffer Peak/RMS/Crest Factor Analysis)      |  |
|  |  - firestoreRulesSimulator.ts (Deterministic Rule Evaluator for QA)         |  |
|  +-----------------------------------------------------------------------------+  |
|                                        |                                          |
|                                        v                                          |
|  +-----------------------------------------------------------------------------+  |
|  |                     SERVICE ABSTRACTION LAYER (src/services/)               |  |
|  |   authService.ts | courseService.ts | lessonService.ts | progressService.ts |  |
|  |   quizService.ts | adminService.ts                                          |  |
|  +--------------------+-----------------------------------+--------------------+  |
+-----------------------|-----------------------------------|-----------------------+
                        |                                   |
        [When VITE_FIREBASE_* Configured]     [When Unconfigured / Local Mode]
                        |                                   |
                        v                                   v
+-----------------------------------------------+ +---------------------------------+
|         FIREBASE CLOUD (Spark Free Tier)      | |   LOCAL STUDIO MODE (Browser)   |
| - Firebase Authentication (Email/Password)    | | - Seed Curriculum (9 Levels)    |
| - Cloud Firestore (Courses, Lessons, Quizzes, | | - LocalStorage Persistence      |
|   User Progress, Bookmarks, Quiz Attempts)    | |   (Progress, Bookmarks,         |
| - Firestore Security Rules (Default-Deny,     | |    Quiz Attempts, Draft CMS)    |
|   Strict UID Isolation & Trusted Admin Guard) | |                                 |
+-----------------------------------------------+ +---------------------------------+
```

---

## 3. Directory Structure

```
src/
  app/
    App.tsx                 # Application providers, error boundary, layout shell
    router.tsx              # React Router v6 route definitions
  components/
    layout/                 # Header, Sidebar/Drawer navigation, Footer, PageLayout
    navigation/             # Breadcrumbs, Level/Category pills, SearchBar
    lessons/                # LessonCard, SectionRenderer, GlossaryTooltip, NotationView
    forms/                  # Validated accessible form controls
    feedback/               # ErrorBoundary, EmptyState, StatusBanner, LoadingState
  features/
    auth/                   # Login, Register, Password Reset, AuthContext, ProtectedRoute
    courses/                # Home, LearningPaths, CategoryView, CourseCatalogue
    lessons/                # LessonDetailView, GlossaryPage
    quizzes/                # QuizEngine (single, multi, note/chord/interval, numeric, checklist)
    progress/               # StudentDashboard (My Learning), Bookmarks, Progress stats
    admin/                  # AdminCMS (Courses, Lessons, Quizzes, Preview, Reorder, Validation)
    music-lab/              # VirtualPiano, ScaleExplorer, ChordExplorer, ProgressionBuilder,
                            # Metronome, EarTraining
    audio-tools/            # AudioVisualizer, ParametricEqLab, LocalAudioAnalyzer
  services/
    firebase.ts             # Firebase client initialization & mode detection
    authService.ts          # Authentication operations + Sinhala error localization
    courseService.ts        # Course CRUD and filtering
    lessonService.ts        # Lesson CRUD, slug lookup, search, publishing
    progressService.ts      # Student completion, bookmarks, progress calculation
    quizService.ts          # Quiz lookup, grading, attempt storage
  hooks/
    useAuth.ts              # Auth state & admin privilege hook
    useProgress.ts          # Student progress & bookmark synchronization hook
  lib/
    musicTheory.ts          # Pure, unit-tested music theory & acoustic calculations
    webAudioEngine.ts       # Web Audio API synth, scheduler, filter & analyzer engine
    firestoreRulesSimulator.ts # Verification engine mirroring firebase/firestore.rules
  types/
    music.ts                # Pitch, Scale, Chord, Interval, Progression types
    content.ts              # Course, Lesson, Quiz, Progress, User, Admin types
  content/
    courses/
      seedCourses.ts        # All 9 Curriculum Levels & Courses
    lessons/
      seedLessons.ts        # Comprehensive Sinhala-first lessons across all 9 levels
      glossary.ts           # Bilingual Sinhala-English music & audio glossary
    quizzes/
      seedQuizzes.ts        # Interactive assessments linked to lessons
  styles/
    tokens.css              # Design tokens (DAW dark/light palettes, Sinhala typography)
    global.css              # Reset, accessibility, layout utilities, component styles
  test/
    setup.ts                # Vitest + Testing Library + Web Audio mock setup
    musicTheory.test.ts     # Theory, scale, interval, chord, progression unit tests
    quizAndProgress.test.ts # Quiz grading, progress percentage, validation tests
    securityRules.test.ts   # Firestore security rules & authorization boundary tests
    app.test.tsx            # Component & route integration tests
firebase/
  firestore.rules           # Production-ready default-deny Firestore Security Rules
  firestore.indexes.json    # Required composite indexes
docs/
  ARCHITECTURE.md
  CURRICULUM.md
  FIREBASE_SETUP.md
  SECURITY.md
  TESTING.md
  DEPLOYMENT.md
  CONTENT_AUTHORING.md
  ROADMAP.md
```

---

## 4. Firebase Free-Tier (Spark Plan) Constraints & Engineering Decisions

| Service | Spark Free Quota (Verified) | Architectural Decision |
| :--- | :--- | :--- |
| **Firebase Auth** | 50,000 MAUs (Email/Password free) | Use Email/Password auth. Phone SMS auth is excluded because it requires Blaze billing. |
| **Cloud Firestore** | 1 GiB storage, 50,000 reads/day, 20,000 writes/day, 20,000 deletes/day | Use one-time queries (`getDocs`/`getDoc`) instead of persistent `onSnapshot` listeners. Cache static seed lessons locally and only read/write incremental student progress and CMS updates. |
| **Firebase Hosting** | 10 GB storage, 360 MB/day transfer | Keep bundle size compact (< 300 KB gzipped) with zero heavy media assets. Synthesize audio at runtime via Web Audio API. |
| **Cloud Functions** | Not included on Spark (requires Blaze) | Do **not** depend on Cloud Functions. Enforce authorization strictly in `firebase/firestore.rules` via custom claims (`request.auth.token.admin == true`) or server-locked `admins/{uid}` documents created in Firebase Console. |
| **Cloud Storage** | Not included on Spark (requires Blaze) | Do **not** upload user audio files to Cloud Storage. All audio file analysis in the Audio Engineering Lab executes 100% locally in the user's browser via `FileReader` and `AudioContext.decodeAudioData`. |
