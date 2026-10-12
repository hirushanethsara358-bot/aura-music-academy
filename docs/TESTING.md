# Aura Music Academy — Testing Guide

## 1. Philosophy

Tests exist to catch real defects cheaply on modest hardware. This suite is
therefore **pure-logic-heavy**: music theory, audio mathematics, quiz grading,
progress calculation and authorisation rules are all deterministic functions
and are tested exhaustively. UI tests cover the paths where a bug would mislead
a learner.

Everything runs in under **15 seconds** on a 2 GB RAM machine. There is no
Docker requirement, no browser download, and no network access needed.

> **No fabricated results.** Every figure in this document was produced by
> running the commands shown, on this repository, at the commits described.

---

## 2. Running the Tests

```bash
npm test                                            # all suites
npm run test:watch                                  # watch mode
npx vitest run src/test/musicTheory.test.ts         # theory only
npx vitest run src/test/quizAndProgress.test.ts     # grading + progress
npx vitest run src/test/securityRules.test.ts       # authorisation
npx vitest run src/test/app.test.tsx                # UI + routes
npx vitest run -t "authentic cadence"               # one test by name
npx vitest run --reporter=verbose                   # per-test output
```

### Full quality gate

```bash
npm run typecheck   # tsc --noEmit, strict
npm run lint        # eslint src --max-warnings 0
npm test            # 186 tests
npm run build       # typecheck + production bundle
```

### Verified results

| Command | Result |
| :--- | :--- |
| `npm run typecheck` | **PASS** — 0 errors (strict mode, `noUnusedLocals`, `noUnusedParameters`) |
| `npm run lint` | **PASS** — 0 errors, 0 warnings |
| `npm test` | **PASS** — 4 files, **186 tests**, 0 failures |
| `npm run build` | **PASS** — 1657 modules, built in ~5–6 s |

Suite breakdown:

| Suite | Tests | Covers |
| :--- | ---: | :--- |
| `src/test/musicTheory.test.ts` | 49 | MIDI ↔ Hz, pitch naming, scales, intervals, chords, diatonic harmony, cadences, acoustic maths, seed curriculum integrity |
| `src/test/securityRules.test.ts` | 48 | Default deny, catalogue access, cross-user isolation, privilege escalation, attempt integrity, rules-file static checks |
| `src/test/quizAndProgress.test.ts` | 44 | All question types, edge cases, progress percentage derivation, publish validation, auth error localisation, storage safety |
| `src/test/app.test.tsx` | 45 | Shell, navigation, theme, all pages, quiz interaction, auth flows, route guards, lab tools, 404, console hygiene |
| **Total** | **186** | |

---

## 3. What Each Suite Proves

### `musicTheory.test.ts`

**MIDI and frequency.** A4 (MIDI 69) is exactly 440 Hz; one octave up doubles
the frequency. Round-trips MIDI 21 → 108 through Hz and back without drift.

**Pitch naming.** `C4`, `A4`, `A0`, `C8` resolve to the correct scientific
names. Enharmonic pairs (`C# / Db`) are exposed, and `parseScientificPitch`
handles accidentals, negative octaves, and rejects out-of-range or malformed
input such as `H4` and `C11`.

**Scales.** D major contains exactly two accidentals; the T-T-S-T-T-T-S pattern
holds for every one of the twelve major keys; A natural minor is verified as
absolute MIDI values; harmonic minor raises degree 7 by exactly one semitone;
melodic minor raises degrees 6 and 7; pentatonic scales contain five notes.

**Intervals.** The tritone at six semitones is identified as dissonant; perfect
fifth and major third short names are correct; calculation is direction
independent; compound intervals are labelled explicitly.

**Chords.** C major is `C-E-G` at MIDI 60/64/67; minor lowers the third by one
semitone; diminished and augmented land on the correct semitone offsets; each
inversion raises the lowest voice by an octave and produces the right slash
symbol (`C/E`); out-of-range inversion requests are clamped.

**Diatonic harmony.** C major yields `C Dm Em F G Am Bdim` with roman numerals
`I ii iii IV V vi vii°`. A natural minor yields `i ii° III iv v VI VII`.
Tonic / subdominant / dominant functions are attached to the right degrees.

**Cadences.** Authentic, plagal, half and deceptive cadences are each detected
from chord sequences. Non-diatonic chords are flagged as borrowed.

**Acoustic and digital maths.** dB conversion matches the 6.02 dB-per-doubling
rule; dB → amplitude round-trips; Nyquist is exactly half the sample rate;
PCM dynamic range follows `6.02N + 1.76` exactly, and the 8-bit difference
between 16- and 24-bit works out to 48.16 dB.

**Curriculum integrity.** Nine courses exist; every lesson id and slug is
unique; no lesson points at a missing course, a missing prerequisite slug or a
missing quiz; every published course ships populated lessons with objectives
and summaries; published lesson counts never exceed the planned totals.

### `quizAndProgress.test.ts`

**Grading.** Single choice, multiple choice, checklist and numeric questions are
all graded. Exact multi-selections pass regardless of order; partial and
over-selections fail. Numeric answers respect stated tolerances; `NaN` and
non-numeric input fail safely. Unanswered questions are counted wrong rather
than crashing. A zero-question quiz returns 0% without dividing by zero.

**Feedback quality.** Every graded question carries the user's answer, the
correct answer and a non-empty Sinhala explanation. The numeric correct-answer
summary always includes the tolerance.

**Real quiz banks.** All 21 seeded quizzes are checked: every single-answer
question declares exactly one correct option that exists in its option list;
every multi-answer question has at least one correct option; every numeric
question has a numeric answer; every question has a Sinhala explanation; and
answering every question correctly scores 100% and passes.

**Progress.** A new account reports 0%, never a fabricated figure. Two of four
completed lessons produce exactly 50%. 100% is reached **only** when every
published lesson is complete. Completion records for unpublished or deleted
lessons are ignored. `completed: false` does not count. An empty catalogue
returns 0% without `NaN`. The per-level breakdown sums to the total.

**Publish validation.** Valid lessons pass. Missing Sinhala titles, malformed
slugs, empty section arrays and zero-minute estimates are each rejected, and a
thoroughly broken lesson reports **all** problems at once rather than only the
first.

**Auth messages.** Known Firebase error codes map to Sinhala messages;
unknown codes fall back to a generic Sinhala message; raw English SDK text never
reaches the learner.

**Storage safety.** JSON round-trips work, missing keys return the fallback,
corrupt JSON returns the fallback instead of throwing, and keys are namespaced
under `aura::v1::`.

### `securityRules.test.ts`

Covers default deny on unknown collections, public read of published content,
denial of draft reads, admin-only catalogue writes, payload shape validation,
cross-user isolation on progress/bookmarks/profiles/attempts, four distinct
privilege-escalation attempts, quiz-attempt integrity (score ≤ total,
immutability, owner-only reads), and four static assertions against the real
`firebase/firestore.rules` file — including that no `allow write: if true`
exists and that admin status is read from a token claim.

> This suite exercises `src/lib/firestoreRulesSimulator.ts`, a hand-maintained
> mirror of the rules. See §5 for the emulator-based alternative and its
> limitation.

### `app.test.tsx`

**Shell.** Brand, primary navigation, footer and skip link render. The Local
Studio Mode banner appears when Firebase is unconfigured.

**Pages.** Home renders the hero and all nine levels, and discloses that audio
examples are synthesized. Learning paths lists nine entries. Level pages render
their lessons; level 42 shows a 404. Lesson pages render Sinhala content,
objectives, key terms and summary, and label synthesized examples honestly.
Glossary filters by search term and shows an empty state. Search results work
for Sinhala and English queries. Unknown slugs and routes show a friendly
Sinhala 404 with navigation options.

**Quiz interaction.** Clicking the correct option and submitting produces
per-question "නිවැරදියි" feedback with an explanation; anonymous learners are
told their score is not saved; the certification disclaimer is always present.

**Authentication.** Anonymous visitors are redirected away from `/my-learning`
and `/admin`. A full local registration reaches the dashboard. Mismatched and
short passwords are rejected with Sinhala messages. Unknown accounts produce a
Sinhala login error. The reset flow never claims an email was sent in local
mode.

**Progress.** A brand-new account shows `aria-valuenow="0"` on the progress
bar, and the explanation that the figure derives from published lessons is
visible.

**Labs.** All nine tools appear as tabs, the piano tab is selected by default,
and `?tab=metronome` deep-links correctly. The Virtual Piano renders focusable
labelled keys, states that audio will not autoplay, documents enharmonic
equivalents, and exposes a panic button for stuck notes. The Metronome shows
BPM and time-signature controls and documents its lookahead scheduler. The Scale
Explorer shows the T-T-S pattern and a frequency of `261.63` Hz for C4.

**Console hygiene.** Rendering the home page produces zero `console.error` calls.

---

## 4. Web Audio in Tests

jsdom implements no Web Audio API. `src/test/setup.ts` installs minimal mocks
for `AudioContext`, `OscillatorNode`, `GainNode`, `BiquadFilterNode`,
`AnalyserNode`, `MediaStreamAudioSourceNode` and `decodeAudioData`, plus
`matchMedia`, `requestAnimationFrame`, `scrollTo` and `URL.createObjectURL`.
This lets scheduling, start/stop and teardown logic be asserted without
producing sound. Audio *fidelity* is not — and cannot be — asserted in a unit
test; it is verified by listening in a browser.

---

## 5. Firestore Security Rules Verification

### 5.1 Mirrored evaluator (runs everywhere, no Java needed)

```bash
npx vitest run src/test/securityRules.test.ts
```

**Why this exists.** The emulator requires a Java runtime and a large
`firebase-tools` install. That is disproportionate for the modest developer
machines this project explicitly targets, and it would make the security suite
impossible to run in a credential-free CI job. The mirror is a faithful,
hand-maintained re-implementation of the decision logic in
`firebase/firestore.rules`.

**The honest limitation.** The mirror can drift from the rules file. Two
safeguards reduce the risk: static assertions parse the real rules file for
structural properties (catch-all deny present, no blanket write-allow, admin
check reads a token claim), and the review checklist below requires both files
to change together.

### 5.2 Firebase Emulator Suite (authoritative — run when Java is available)

```bash
# One-time
npm install -g firebase-tools

# Terminal 1
firebase emulators:start --only firestore

# Terminal 2 — point the app at the emulator
echo "VITE_FIREBASE_PROJECT_ID=demo-aura" >> .env.local
echo "VITE_FIREBASE_API_KEY=demo-key"          >> .env.local
echo "VITE_FIREBASE_AUTH_DOMAIN=demo-aura.firebaseapp.com" >> .env.local
echo "VITE_FIREBASE_APP_ID=1:0:web:demo"       >> .env.local
echo "VITE_USE_FIREBASE_EMULATORS=true"        >> .env.local
npm run dev
```

Then verify by hand that:

- An anonymous visitor can open `/lessons/what-is-music-and-sound` and read it.
- Writing a document directly to `users/<other-uid>/progress/x` from the
  browser console is **rejected**.
- Writing `{ uid: '<other-uid>', ... }` to your own progress is **rejected**.
- Writing `{ role: 'admin' }` to your own profile is **rejected**.
- Reading `users/<other-uid>` is **rejected**.

Record the emulator output in the pull request.

### 5.3 Rules review checklist

- [ ] `firebase/firestore.rules` and `src/lib/firestoreRulesSimulator.ts` changed in the same commit.
- [ ] A test exists for every newly permitted operation **and** for its denial counterpart.
- [ ] The catch-all `match /{document=**}` deny is still present and last.
- [ ] No `allow write: if true` or `allow read, write: if true` anywhere.
- [ ] Every new field is added to the relevant `hasOnly([...])` allow-list.
- [ ] Every new string is length-bounded.
- [ ] Admin checks still read `request.auth.token.admin`, never `resource.data`.

---

## 6. Manual QA Checklist (before a release)

**Build and run**
- [ ] `npm ci && npm run typecheck && npm run lint && npm test && npm run build` all pass.
- [ ] `npm run preview` serves the app and the browser console is free of errors.
- [ ] The app loads and is fully usable with **no** `.env.local` present.

**Audio**
- [ ] Piano: mouse click, touch tap, and `A W S E D F T G Y H U J K` all sound.
- [ ] Piano: switching browser tabs mid-note produces **no** stuck note.
- [ ] Metronome: at 120 BPM it stays aligned with a reference click for 60 seconds.
- [ ] Metronome: changing BPM while running takes effect without restarting.
- [ ] Visualizer: closing the tab stops the animation; the microphone indicator turns off after "නතර කරන්න".
- [ ] EQ Lab: −12 dB on the low band is audibly different from +12 dB.
- [ ] Analyzer: the file picker reports duration, peak dBFS and RMS dBFS for a real file.
- [ ] Analyzer: "ඉවත් කර සම්පත් නිදහස් කරන්න" clears all results.

**Security**
- [ ] With Firebase configured, the rules checklist in §5 passes.
- [ ] A normal signed-in user visiting `/admin` sees the permission-denied screen.
- [ ] DevTools → Application → Local Storage contains no plaintext password.
- [ ] No service-account key, `.env`, or `*-adminsdk*.json` file is tracked by git.

**Accessibility and responsiveness**
- [ ] Tab order reaches the skip link, header actions, navigation, and main content.
- [ ] Every interactive control shows a visible focus ring.
- [ ] All nine lab tabs are reachable and operable by keyboard alone.
- [ ] No horizontal scrolling at 320 px, 768 px, 1024 px and 1440 px.
- [ ] Both themes meet readable contrast.
- [ ] With OS "reduce motion" enabled, the skeleton pulse and spinner stop.

**Content honesty**
- [ ] No page claims a certificate, a recording, or a completed-but-unwritten lesson.
- [ ] Every synthesized example is labelled as synthesized.
- [ ] Planned lesson counts and published lesson counts are both visible and correct.

**Secrets scan**
```bash
git grep -nE "(serviceAccount|private_key|BEGIN PRIVATE KEY|firebase-adminsdk)" -- . || echo "clean"
git status --ignored --short | grep -E "\.env$" && echo "WARNING: .env present" || echo "no .env tracked"
```

---

## 7. What Is **Not** Tested

Stated plainly so no one over-trusts the suite:

1. **Audio fidelity.** Mocks cannot assert that a synthesised note sounds correct. Verified by ear.
2. **Visual regression.** No screenshot diffing; layout is checked by the manual checklist.
3. **Cross-browser behaviour.** jsdom is not a browser. Safari's Web Audio autoplay policy in particular needs manual verification.
4. **Real Firestore behaviour.** The mirror is not the emulator, and neither is production.
5. **Load and concurrency.** Correctness under many simultaneous users is unverified — Spark quota headroom is analysed in `docs/DEPLOYMENT.md` instead.
6. **Screen-reader output.** Semantics are asserted; actual VoiceOver/NVDA speech is not.
7. **Firestore query correctness against live data.** Service functions fall back to seed data on failure, so a broken remote query degrades silently. Remote behaviour needs the emulator or a staging project.
8. **Playwright end-to-end tests.** Acknowledged as desirable; not included because the browser download is disproportionate for the low-spec machines this project targets. If added, run them in GitHub Actions only.

---

## 8. Continuous Integration

`.github/workflows/ci.yml` runs on every push and pull request:

1. `npm ci` (cached, lockfile-exact)
2. `npm run typecheck`
3. `npm run lint`
4. `npm test`
5. `npm run build`

The job uses no secrets and no Firebase credentials, so it works on forks.
Firestore rules are **not** deployed from CI — rule deployment is a deliberate,
authorised manual step.
