# Content Authoring Guide

How to write and publish a new Aura Music Academy lesson.

---

## 1. Where Content Lives

```
src/content/
  courses/seedCourses.ts      # the 9 level definitions
  lessons/
    seedLessons.ts            # Levels 1–3
    seedLessonsAdvanced.ts    # Levels 2–5 (theory, composition, arrangement, production)
    seedLessonsAudio.ts       # Levels 6–8 (audio engineering, mixing, mastering)
    seedLessonsPersonal.ts    # Level 8 delivery + Level 9 advanced practice
    index.ts                  # combines them into ALL_SEED_LESSONS
    glossary.ts               # bilingual glossary terms
  quizzes/seedQuizzes.ts      # assessment banks
```

Content is **data**, never JSX. Components render it generically, which keeps
presentation changes from touching a hundred lesson files and keeps the
curriculum testable as plain objects.

---

## 2. Lesson Schema

Defined in `src/types/content.ts`:

```ts
interface Lesson {
  id: string;                    // stable, unique, e.g. 'lesson-104'
  slug: string;                  // URL-safe, unique, lowercase, hyphens
  courseId: string;              // must exist in seedCourses.ts
  titleSi: string;               // primary Sinhala title
  titleEn: string;               // English title
  descriptionSi: string;         // 1–3 sentence summary in Sinhala
  category: CurriculumCategory;  // must match the course category
  level: CurriculumLevel;        // 1–9
  prerequisites: string[];       // lesson SLUGS that must exist
  estimatedMinutes: number;      // > 0
  learningObjectives: string[];  // what the learner will be able to do
  sections: LessonSection[];     // the teaching body
  examples: LessonExample[];     // worked examples + optional audio
  exercises: PracticalExercise[];// hands-on tasks
  exerciseIds: string[];         // matching ids from `exercises`
  quizIds: string[];             // must exist in seedQuizzes.ts
  summarySi: string;             // recap
  furtherPracticeSi: string[];   // follow-up tasks
  published: boolean;            // false hides it from learners
  order: number;                 // position within the course
  updatedAt: string;             // ISO date
}
```

### `LessonSection`

```ts
{
  id: 's-104-1',
  headingSi: 'සිංහල උපසිරැසිය',
  headingEn: 'English Subheading',
  bodySi: '...',                // blank line separates paragraphs
  keyTerms?: [{ termEn, termSi, definitionSi }],   // optional
  bulletPointsSi?: string[],                        // optional
  formulaOrDiagram?: string,                        // optional, rendered in <pre>
}
```

### `LessonExample`

```ts
{
  id: 'ex-104-1',
  titleSi: '...',
  titleEn: '...',
  descriptionSi: '...',
  notationOrSteps: 'C4 → E4 → G4 → C5',
  synthPreviewNotes: [60, 64, 67, 72],  // MIDI numbers, optional
  synthType: 'melody',                  // 'melody' | 'chord'
}
```

Providing `synthPreviewNotes` renders a **"අසන්න (Synthesized)"** button that
plays the notes at runtime via Web Audio API. No audio file is created.

---

## 3. Writing Style

### Sinhala-first, English technical terms preserved

Write the explanation in natural, plain Sinhala. Keep the standard English
technical term — ideally with the Sinhala term on first use.

```ts
// ✅ Good
bodySi: 'වාද්‍ය භාණ්ඩ දෙකක් එකම සංඛ්‍යාත පරාසයේ තිබෙන විට එකක් අනෙකට මුවා වේ. මෙයට Frequency Masking කියනු ලැබේ.'

// ❌ Avoid — English term dropped, so the learner cannot read a real manual
bodySi: 'එකක් අනෙකට මුවා වීම ගැටලුවකි.'
```

### Rules of thumb

| Do | Don't |
| :--- | :--- |
| Short sentences. One idea per sentence. | Long, nested clauses. |
| Concrete numbers (`−18 dBFS`, `440 Hz`, `2:1`). | Vague hedges ("quite low", "fairly high"). |
| Name the units explicitly. | Assume the learner knows dB is logarithmic. |
| Explain *why*, not only *how*. | List settings with no rationale. |
| Use `keyTerms` for new vocabulary. | Bury definitions in prose. |
| Keep a technical term consistent throughout. | Alternate between `semitone` and `half step`. |
| Say when something is a **starting point**, not a rule. | Present one setting as universally correct. |

### Scientific accuracy is mandatory

The audio engineering curriculum is intended for real studio practice.

- State the 20 °C speed of sound as **343 m/s** when quoting wavelength figures.
- Use `λ = c / f`, and show the arithmetic when you give a number.
- Use `dynamicRange ≈ 6.02N + 1.76 dB` for bit depth.
- Nyquist is exactly half the sample rate.
- Amplitude doubling is **+6.02 dB**; power doubling is **+3.01 dB**.
- Distinguish **Phase** (a continuous time offset) from **Polarity** (a 180° flip).
- Distinguish **sample peak** from **true peak (dBTP)** — they differ because of inter-sample peaks.
- Never claim a fixed loudness target is universal; explain that it depends on the release platform and the music.

### Honesty requirements

Never claim something exists that does not:

- ❌ "listen to this recorded piano" — all audio is synthesized.
- ❌ "download the worksheet" unless the file exists in `public/`.
- ❌ "earn a certificate" — grading is client-side.
- ❌ Mark a lesson `published: true` when its sections are stubs.

The UI labels synthesized audio, states the certification position, and shows
planned lesson counts separately. Your content must agree with it.

### Copyright

Create original explanations and original musical examples. Do not copy
textbook prose, paid-course scripts, or commercial sample libraries. Short
public-domain melodies (such as a two-bar folk tune) are acceptable where
needed; note the source if you use one.

---

## 4. Adding a Lesson — Step by Step

**1. Choose the level file.** Level 4 belongs in `seedLessonsAdvanced.ts`.

**2. Pick an unused `id` and a unique `slug`.** Existing lessons use
`lesson-<level><nn>`. Check for collisions before you commit.

**3. Write the lesson object.** Start from this skeleton:

```ts
{
  id: 'lesson-403',
  slug: 'guitar-roles-in-modern-arrangements',
  courseId: 'course-level-4',
  titleSi: 'නවීන සංයෝජනවල ගිටාරයේ කාර්යභාරය',
  titleEn: 'Guitar Roles in Modern Arrangements',
  descriptionSi:
    'Acoustic සහ Electric ගිටාරය මෙන්ම Rhythm, Lead සහ Texture කාර්යයන් අතර වෙනස සහ ඒවා නිවැරදිව යොදා ගැනීම.',
  category: 'arrangement',
  level: 4,
  prerequisites: ['instrument-roles-and-registers'],
  estimatedMinutes: 22,
  learningObjectives: [
    'ගිටාරයේ කාර්යයන් 3 හඳුනා ගැනීම.',
    'Frequency Masking ඇති නොවන ලෙස ගිටාර් Register තෝරා ගැනීම.',
  ],
  sections: [
    {
      id: 's-403-1',
      headingSi: 'ගිටාරයේ කාර්යයන් තුන',
      headingEn: 'The Three Guitar Roles',
      bodySi: 'පළමු ඡේදය.\n\nදෙවන ඡේදය.',
      keyTerms: [
        { termEn: 'Rhythm Guitar', termSi: 'රිද්ම ගිටාරය', definitionSi: '...' },
      ],
      bulletPointsSi: ['...'],
      formulaOrDiagram: 'Rhythm : 80 Hz – 12 kHz',
    },
  ],
  examples: [
    {
      id: 'ex-403-1',
      titleSi: 'සරල රිද්ම රටාවක්',
      titleEn: 'A Basic Rhythm Pattern',
      descriptionSi: 'C, G, Am සහ F මත Rhythm ගිටාරය.',
      notationOrSteps: 'C → G → Am → F',
      synthPreviewNotes: [60, 64, 67, 67, 71, 74, 69, 72, 76, 65, 69, 72],
      synthType: 'chord',
    },
  ],
  exercises: [
    {
      id: 'exer-403-1',
      titleSi: 'ගිටාර් සංයෝජන සැලැස්මක්',
      instructionsSi: 'පියවර 4 කින් සැලැස්මක් සාදන්න.',
      stepsSi: ['පියවර 1', 'පියවර 2', 'පියවර 3', 'පියවර 4'],
    },
  ],
  exerciseIds: ['exer-403-1'],
  quizIds: [],                    // add a quiz id here once authored
  summarySi: 'සාරාංශය එක් වාක්‍ය දෙකකින්.',
  furtherPracticeSi: ['අමතර අභ්‍යාසයක්'],
  published: true,
  order: 3,
  updatedAt: '2026-10-12T00:00:00.000Z',
}
```

**4. Append it to the exported array** in that file.

**5. If the lesson completes a course listing**, update `lessonIds` in
`seedCourses.ts` — but never let the array exceed `plannedTotalLessons`.

**6. (Optional) Add a quiz** in `seedQuizzes.ts`, then reference its id from the
lesson's `quizIds`. Match the real quiz shape: every `q-NNN-N` needs a Sinhala
`explanationSi`, and the declared correct answer must exist among the options.

**7. Verify the content:**

```bash
npm test          # integrity tests catch broken references and duplicate ids
npm run dev       # read the lesson as a learner would
```

The integrity suite fails automatically if you point at a missing course,
prerequisite slug or quiz id, reuse an id or slug, exceed a planned total, or
ship a lesson with no sections, no objectives or an empty summary.

---

## 5. Quiz Authoring

Supported `type` values:

| Type | Grading | Required fields |
| :--- | :--- | :--- |
| `single-choice` | One correct option | `options`, `correctOptionId` |
| `multiple-choice` | Exact set match | `options`, `correctOptionIds` |
| `checklist` | Exact set match | `checklistItems`, `correctOptionIds` |
| `note-identification` | One correct option | `options`, `correctOptionId`, `audioPreviewMidi` |
| `chord-identification` | One correct option | same as above, `audioPreviewMode: 'chord'` |
| `interval-identification` | One correct option | same as above, `audioPreviewMode: 'interval'` |
| `rhythm-recognition` | One correct option | same as above, `audioPreviewMode: 'rhythm'` |
| `numeric` | Within `numericTolerance` | `correctNumber`, `numericUnit`, `numericTolerance` |

**Sound question design**

- Give the learner a replayable example before answering (`audioPreviewMidi`).
- Keep within a comfortable range — roughly MIDI 55–84.
- Distractors should be plausible, not absurd.
- Always provide a `numericTolerance` for measured quantities (e.g. ±25 Hz on an EQ suggestion) and say so in the explanation.
- Because quizzes are publicly readable for anonymous practice, never place genuinely confidential answers in a quiz document.

**Every question needs an `explanationSi`** that teaches the underlying
principle, not just restates the answer. The test suite enforces that one exists.

---

## 6. Glossary

Add to `GLOSSARY_TERMS` in `glossary.ts`:

```ts
{
  id: 'term-voice-leading',
  termEn: 'Voice Leading',
  termSi: 'හඬ මෙහෙයවීම',
  category: 'composition',
  definitionSi: 'වචන 2–3 කින් පැහැදිලි අර්ථ දැක්වීම.',
  exampleSi: 'එය භාවිත වන තත්ත්වයක්.',
}
```

Every `keyTerms` entry in a lesson should ideally have a matching glossary
entry, so a learner who follows a link lands somewhere useful.

---

## 7. Review Checklist Before You Commit

- [ ] `id` and `slug` are unique across all lessons.
- [ ] `courseId` matches an existing course and `category` matches that course.
- [ ] Every `prerequisites` slug exists.
- [ ] Every `quizIds` entry exists, and every quiz has a Sinhala explanation per question.
- [ ] `published: true` only if the lesson is genuinely complete.
- [ ] All Sinhala text renders correctly — no broken Unicode, no ZWJ artefacts.
- [ ] All numeric claims are scientifically correct, with units stated.
- [ ] No invented recordings, certificates, or review processes are claimed.
- [ ] Musical examples are original or safely sourced.
- [ ] `npm run typecheck && npm run lint && npm test` all pass.
- [ ] You have read the lesson in the running app, on a narrow viewport.
