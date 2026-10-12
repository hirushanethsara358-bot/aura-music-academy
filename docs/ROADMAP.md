# Aura Music Academy — Development Roadmap & Milestone Tracker

This document tracks the incremental delivery of **Aura Music Academy** across GitHub milestones and branches.

## Milestone Status Summary

| Milestone | GitHub Issue | Branch | Status | Summary |
| :--- | :--- | :--- | :--- | :--- |
| **Milestone 0 — Discovery** | #1 | `main` | Completed | Repository setup, environment verification, Firebase Spark free-tier audit, architecture & roadmap docs. |
| **Milestone 1 — Foundation** | #2 | `feat/foundation` | Planned | React + TS (strict) + Vite setup, DAW-inspired dark/light theme, Sinhala Unicode typography, responsive layout & navigation. |
| **Milestone 2 — Curriculum** | #3 | `feat/curriculum` | Planned | 9-level curriculum schema, Sinhala-first lessons across all 9 levels, prerequisite links, search, and bilingual glossary. |
| **Milestone 3 — Music Lab** | #4 | `feat/music-lab` | Planned | Web Audio Virtual Piano, Scale Explorer, Chord Explorer, Chord Progression Builder, Lookahead Metronome, Ear Training. |
| **Milestone 4 — Student Platform** | #5 | `feat/student-platform` | Planned | Firebase Auth + local fallback, Student Dashboard, bookmarks, progress calculation, and multi-type Quiz Engine. |
| **Milestone 5 — Admin CMS** | #6 | `feat/admin-cms` | Planned | Trusted admin authorization, course/lesson/quiz authoring, validation, reordering, preview, and publishing. |
| **Milestone 6 — Audio Eng Labs** | #7 | `feat/audio-labs` | Planned | Real-time Waveform & FFT Spectrum Visualizer, 3-band Web Audio Parametric EQ Lab, and Local Audio File Analyzer. |
| **Milestone 7 — Security & QA** | #8 | `feat/security-tests` | Planned | Production `firestore.rules`, security rules tests, unit/integration test suite, GitHub Actions CI, full documentation. |
| **Milestone 8 — Release & Deploy** | #9 | `main` | Planned | Production build verification, `firebase.json` hosting setup, smoke tests, and live preview verification. |

---

## Curriculum Expansion Roadmap

### Release 1.0 (Current Repository Scope)
- Complete 9-Level Learning Path architecture covering:
  - **Level 1**: Music Foundations (සංගීත මූලධර්ම)
  - **Level 2**: Western Music Theory (බටහිර සංගීත න්‍යාය)
  - **Level 3**: Composition & Songwriting (සංගීත නිර්මාණය සහ ගීත රචනය)
  - **Level 4**: Arrangement (සංගීත සංයෝජනය)
  - **Level 5**: Music Production & DAW Workflow (සංගීත නිෂ්පාදනය සහ DAW භාවිතය)
  - **Level 6**: Audio Engineering Foundations (ශබ්ද ඉංජිනේරු මූලධර්ම)
  - **Level 7**: Mixing (ශබ්ද මිශ්‍රණය - Mixing)
  - **Level 8**: Mastering (අවසාන නිමාව - Mastering)
  - **Level 9**: Advanced Practice & Capstone Projects (උසස් ප්‍රායෝගික අභ්‍යාස)
- Complete, fully authored original Sinhala lessons across all 9 levels (20 comprehensive, multi-section lessons with notation, formulas, step-by-step examples, practical exercises, and linked quizzes).
- Planned expansion lessons (42 additional topic slots to reach the full 62-lesson target catalogue) are explicitly documented in `docs/CURRICULUM.md` as planned and can be authored directly through the built-in **Admin CMS** or seed files. Never are planned lessons misrepresented as completed.

### Future Releases (Post-1.0)
- **Release 1.1**: MIDI controller hardware input (`navigator.requestMIDIAccess`) for the Virtual Piano and Ear Training modules.
- **Release 1.2**: Printable SVG staff notation worksheet generator for offline classroom use in Sri Lankan schools.
- **Release 1.3**: Peer composition feedback board using moderated Firestore submissions.
