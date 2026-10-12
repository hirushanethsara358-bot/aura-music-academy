import { Lesson } from '../../types/content';

const UPDATED_AT = '2026-10-12T00:00:00.000Z';

/**
 * Levels 2–5 lessons: Western Music Theory, Composition, Arrangement, Production.
 */
export const SEED_LESSONS_THEORY_COMPOSITION: Lesson[] = [
  // =====================================================================================
  // LEVEL 2 — WESTERN MUSIC THEORY
  // =====================================================================================
  {
    id: 'lesson-201',
    slug: 'semitones-major-and-minor-scales',
    courseId: 'course-level-2',
    titleSi: 'අර්ධ ස්වර (Semitones) සහ Major–Minor ස්වර මාලා',
    titleEn: 'Semitones, Whole Tones and Major–Minor Scales',
    descriptionSi:
      'Whole Tone සහ Semitone පරතර හඳුනාගැනීම, Major Scale හි T-T-S-T-T-T-S සූත්‍රය, Natural / Harmonic / Melodic Minor සහ Scale Degrees පිළිබඳ න්‍යායාත්මක පදනම.',
    category: 'music-theory',
    level: 2,
    prerequisites: ['staff-notation-rhythm-and-time-signatures'],
    estimatedMinutes: 24,
    learningObjectives: [
      'Whole Tone (පූර්ණ ස්වර) සහ Semitone (අර්ධ ස්වර) පරතර ගණනය කිරීම.',
      'ඕනෑම ස්වරයකින් Major Scale එකක් T-T-S-T-T-T-S සූත්‍රය ඇසුරින් නිර්මාණය කිරීම.',
      'Natural, Harmonic සහ Melodic Minor අතර ඇති වෙනස පැහැදිලි කිරීම.',
      'ඕනෑම Major Scale එකකින් ස්වර මාලාවේ් 7 ස්වරය නැවත Tonic වෙත ඇද ගන්නා ආකාරය (Leading Tone) තේරුම් ගැනීම.',
    ],
    sections: [
      {
        id: 's-201-1',
        headingSi: 'Semitone සහ Whole Tone — සංගීතයේ මිනුම් දණ්ඩ',
        headingEn: 'Semitones and Whole Tones as Musical Rulers',
        bodySi:
          'බටහිර සංගීතයේ ස්වර දෙකක් අතර ඇති කුඩාම පරතරය Semitone (අර්ධ ස්වරය) එකයි. Semitone දෙකක් එකතු වීමෙන් Whole Tone (පූර්ණ ස්වරය) සෑදේ. පියානෝ යතුරු පුවරුවේ යාබද යතුරු දෙකක් අතර (සුදු හෝ කළු වේවා) දුර සැමවිටම Semitone 1 කි. එනිසා E → F සහ B → C අතර කළු යතුරක් නැති බැවින් ඒවා ද Semitone 1 කි.',
        keyTerms: [
          {
            termEn: 'Semitone / Half Step',
            termSi: 'අර්ධ ස්වරය',
            definitionSi: 'බටහිර සංගීතයේ කුඩාම සම්මත පරතරය (උදා: C → C#).',
          },
          {
            termEn: 'Whole Tone / Whole Step',
            termSi: 'පූර්ණ ස්වරය',
            definitionSi: 'Semitone දෙකක එකතුව (උදා: C → D).',
          },
        ],
        formulaOrDiagram: 'Semitone = 1 | Whole Tone = 2\nC →(1)→ C# →(1)→ D →(1)→ D# →(1)→ E →(1)→ F  [E→F අර්ධ ස්වරයකි!]',
      },
      {
        id: 's-201-2',
        headingSi: 'Major Scale එකේ සූත්‍රය — T T S T T T S',
        headingEn: 'The Major Scale Formula: T T S T T T S',
        bodySi:
          'ඕනෑම Major Scale එකක් එකම පරතර රටාව අනුගමනය කරයි: පූර්ණ, පූර්ණ, අර්ධ, පූර්ණ, පූර්ණ, පූර්ණ, අර්ධ. මෙම රටාව නිසා ස්වරයක් ඇසූ විට කනට එහි "මේජර්" ස්වභාවය හඳුනාගත හැක. C Major Scale එකේ කිසිදු කළු යතුරක් නොමැති බැවින් එය ඉගෙනීමට පහසුම ආකාරයයි. නමුත් D සිට Major Scale එකක් ගොඩනැගීමට F# සහ C# අවශ්‍ය වේ.',
        keyTerms: [
          {
            termEn: 'Major Scale',
            termSi: 'මේජර් ස්වර මාලාව',
            definitionSi: 'T-T-S-T-T-T-S රටාව අනුගමනය කරන ස්වර 7 ක ස්වර මාලාව.',
          },
          {
            termEn: 'Tonic',
            termSi: 'ටොනික් (මූලික ස්වරය)',
            definitionSi: 'ස්වර මාලාවේ ප්‍රථම සහ වඩාත් ස්ථාවර ස්වරය.',
          },
        ],
        bulletPointsSi: [
          'C Major: C D E F G A B C (කළු යතුරු 0)',
          'D Major: D E F# G A B C# D (කළු යතුරු 2)',
          'F Major: F G A Bb C D E F (කළු යතුරු 1)',
          'G Major: G A B C D E F# G (කළු යතුරු 1)',
          'A Major: A B C# D E F# G# A (කළු යතුරු 3)',
        ],
      },
      {
        id: 's-201-3',
        headingSi: 'Minor ස්වර මාලා වර්ග 3',
        headingEn: 'The Three Minor Scales',
        bodySi:
          'Minor ස්වර මාලා වර්ග තුනක් ප්‍රධාන වශයෙන් භාවිතා වේ. Natural Minor එකේ 3, 6, 7 ස්වර පහත් (b3, b6, b7) වේ. Harmonic Minor එකේ 7 වන ස්වරය උස් කර (7) G# වන විට E Major කෝඩ් එකක් නිර්මාණය වී වඩාත් ප්‍රබල Tension එකක් ලබා දෙයි. Melodic Minor එකේ Ascending විට 6 සහ 7 ස්වර දෙකම උස් කරයි.',
        keyTerms: [
          {
            termEn: 'Natural Minor (Aeolian)',
            termSi: 'ස්වාභාවික මයිනර්',
            definitionSi: 'Major Scale එකේ 3, 6, 7 ස්වර අර්ධ ස්වරයකින් පහත් කිරීමෙන් ලැබෙන ස්වර මාලාව.',
          },
          {
            termEn: 'Harmonic Minor',
            termSi: 'හාමොනික් මයිනර්',
            definitionSi: 'Natural Minor හි 7 වන ස්වරය උස් කර ප්‍රබල Leading Tone එකක් ලබාගන්නා ස්වර මාලාව.',
          },
          {
            termEn: 'Melodic Minor',
            termSi: 'මෙලොඩික් මයිනර්',
            definitionSi: 'හාමොනික් මයිනර් හි ලොකු පරතරය සුමට කිරීමට 6 සහ 7 දෙකම උස් කරන ස්වර මාලාව.',
          },
          {
            termEn: 'Leading Tone',
            termSi: 'ප්‍රධාන ඇදීමේ ස්වරය',
            definitionSi: 'Tonic ස්වරයට Semitone 1 ක් පහළින් පිහිටා Tonic වෙත තදින් ඇදී යන ස්වරය.',
          },
        ],
        formulaOrDiagram:
          'A Natural Minor: A B C D E F G A  (1 2 b3 4 5 b6 b7)\nA Harmonic Minor: A B C D E F G# A  (1 2 b3 4 5 b6 7)\nA Melodic Minor (Asc): A B C D E F# G# A  (1 2 b3 4 5 6 7)',
      },
      {
        id: 's-201-4',
        headingSi: 'Scale Degrees සහ ඒවායේ නම්',
        headingEn: 'Scale Degrees and Their Names',
        bodySi:
          'ස්වර මාලාවේ සෑම ස්වරයකටම විශේෂ නමක් ඇත. මෙය Harmonic Function තේරුම් ගැනීමට අත්‍යවශ්‍ය වේ.',
        keyTerms: [
          { termEn: 'Tonic (1)', termSi: 'ටොනික්', definitionSi: 'නිවහන - ස්ථාවරත්වයේ ස්වරය.' },
          { termEn: 'Supertonic (2)', termSi: 'සුපර්ටොනික්', definitionSi: 'Tonic ට ඉහළින් පිහිටන දෙවන ස්වරය.' },
          { termEn: 'Mediant (3)', termSi: 'මීඩියන්ට්', definitionSi: 'Major/Minor ස්වභාවය තීරණය කරන 3 වන ස්වරය.' },
          { termEn: 'Subdominant (4)', termSi: 'සබ්ඩොමිනන්ට්', definitionSi: 'Departure - ගමනක් ආරම්භ කරන ස්වරය.' },
          { termEn: 'Dominant (5)', termSi: 'ඩොමිනන්ට්', definitionSi: 'Tonic වෙත විසඳීමට ප්‍රබල ආතතියක් ඇති කරන ස්වරය.' },
          { termEn: 'Submediant (6)', termSi: 'සබ්මීඩියන්ට්', definitionSi: 'සම්බන්ධිත Major/Minor හැඟීම ලබා දෙන ස්වරය.' },
        ],
      },
    ],
    examples: [
      {
        id: 'ex-201-1',
        titleSi: 'D Major Scale එක ගොඩනැගීම',
        titleEn: 'Building the D Major Scale Step by Step',
        descriptionSi:
          'D සිට T-T-S-T-T-T-S රටාව යොදමු: D →(T)→ E →(T)→ F# →(S)→ G →(T)→ A →(T)→ B →(T)→ C# →(S)→ D.',
        notationOrSteps: 'D – E – F# – G – A – B – C# – D',
        synthPreviewNotes: [62, 64, 66, 67, 69, 71, 73, 74],
        synthType: 'melody',
      },
      {
        id: 'ex-201-2',
        titleSi: 'A Natural Minor සහ A Harmonic Minor සංසන්දනය',
        titleEn: 'Comparing A Natural Minor and A Harmonic Minor',
        descriptionSi:
          'පළමුව A Natural Minor ඇසුරින් ස්වරයන් අසන්න. පසුව 7 වන ස්වරය F සිට F# (G#) දක්වා ඉහළ නැංවීමෙන් Harmonic Minor හි දැනෙන ආතතිය හඳුනාගන්න.',
        notationOrSteps: 'Natural: A B C D E F G A | Harmonic: A B C D E F G# A',
        synthPreviewNotes: [57, 59, 60, 62, 64, 65, 68, 69],
        synthType: 'melody',
      },
    ],
    exercises: [
      {
        id: 'exer-201-1',
        titleSi: 'Scale Explorer භාවිතයෙන් ස්වර මාලා ගොඩනැගීම',
        instructionsSi: 'Scale Explorer Lab එක භාවිතයෙන් පහත ස්වර මාලා 3 ගොඩනගා අසන්න.',
        stepsSi: [
          'Root: G, Type: Major ලෙස තෝරා ස්වර වාදනය කරන්න. F# ඇත්තේ ඇයිදැයි සිතන්න.',
          'Root: E, Type: Natural Minor තෝරා අසන්න. G Natural විය යුතුද?',
          'Root: A, Type: Harmonic Minor තෝරා G# හඳුනාගන්න.',
          'සෑම ස්වර මාලාවකම Semitone පරතර කොහේදැයි (Yellow Arrow) සටහන් කරන්න.',
        ],
        linkedLabTab: 'scale',
      },
    ],
    exerciseIds: ['exer-201-1'],
    quizIds: ['quiz-201'],
    summarySi:
      'Semitone සහ Whole Tone යනු සංගීතයේ මිනුම් ඒකකයි. Major Scale එක T-T-S-T-T-T-S සූත්‍රය අනුගමනය කරයි. Minor ස්වර මාලා වර්ග 3 ක් ඇති අතර Harmonic සහ Melodic Minor මගින් Leading Tone එක ඉහළ නංවා ප්‍රබල Harmonic ආතතියක් ලබා දෙයි.',
    furtherPracticeSi: [
      'B Major Scale එකේ කළු යතුරු කීයක් තිබේද? A, B, C#, D, E, F#, G# — කළු යතුරු 5 කි.',
      'Circle of Fifths මත D Major සිට A Major වෙත මාරු වන විට කළු යතුරු කොපමණ වැඩි වේදැයි පිරික්සන්න.',
    ],
    published: true,
    order: 1,
    updatedAt: UPDATED_AT,
  },
  {
    id: 'lesson-202',
    slug: 'intervals-and-chord-construction',
    courseId: 'course-level-2',
    titleSi: 'Intervals සහ කෝඩ් නිර්මාණය (Triads, Seventh Chords, Inversions)',
    titleEn: 'Intervals and Chord Construction: Triads, Sevenths and Inversions',
    descriptionSi:
      'Major, Minor, Perfect, Augmented සහ Diminished Intervals ගණනය කිරීම; Major / Minor / Diminished / Augmented Triads සහ Major 7, Minor 7, Dominant 7, m7b5 කෝඩ් නිර්මාණය කිරීම; Inversions පිළිබඳ ප්‍රායෝගික දැනුම.',
    category: 'music-theory',
    level: 2,
    prerequisites: ['semitones-major-and-minor-scales'],
    estimatedMinutes: 26,
    learningObjectives: [
      'Interval එකක ගුණය (Quality) සහ අගය (Number) නිවැරදිව ගණනය කිරීම.',
      'Triad වර්ග 4 සහ Seventh Chord වර්ග 4 ගොඩනැගීම.',
      'Chord Inversion (පෙරළුම) මගින් Bass Note එක වෙනස් වන ආකාරය තේරුම් ගැනීම.',
      'Slash Chords (උදා: C/E) කියවීම සහ නිර්මාණය කිරීම.',
    ],
    sections: [
      {
        id: 's-202-1',
        headingSi: 'Intervals — පරතර ගණනය කිරීම',
        headingEn: 'Intervals: Calculating Distance Between Notes',
        bodySi:
          'Interval එකකට කොටස් දෙකක් ඇත: අගය (Number) සහ ගුණය (Quality). අගය යනු ස්වරයන් ගණන් කිරීමයි (C සිට E දක්වා Third). ගුණය යනු Semitone ගණනයි (Major Third = Semitone 4, Minor Third = Semitone 3). මෙම දෙක එකට ගත් විට නිශ්චිත Interval එක හඳුනාගත හැක.',
        keyTerms: [
          { termEn: 'Perfect Intervals', termSi: 'පූර්ණ පරතර', definitionSi: 'Unison (0), 4th (5), 5th (7), Octave (12) — ස්ථාවර සහ ශක්තිමත් පරතර.' },
          { termEn: 'Major / Minor Intervals', termSi: 'මේජර් සහ මයිනර් පරතර', definitionSi: '2nd, 3rd, 6th, 7th යන පරතර Major (වැඩි) හෝ Minor (අඩු) විය හැක.' },
          { termEn: 'Tritone', termSi: 'ට්‍රයිටෝන්', definitionSi: 'Semitone 6 ක පරතරය. අස්ථාවර සහ නාට්‍යමය පරතරයකි.' },
        ],
        formulaOrDiagram:
          'Semitones → Interval\n0 → Perfect Unison | 1 → Minor 2nd | 2 → Major 2nd | 3 → Minor 3rd\n4 → Major 3rd | 5 → Perfect 4th | 6 → Tritone | 7 → Perfect 5th\n8 → Minor 6th | 9 → Major 6th | 10 → Minor 7th | 11 → Major 7th | 12 → Octave',
      },
      {
        id: 's-202-2',
        headingSi: 'Triads — ත්‍රිත්ව ස්වර වර්ග 4',
        headingEn: 'The Four Triad Qualities',
        bodySi:
          'Triad එකක් සෑදෙන්නේ Root, Third සහ Fifth ස්වරයෙනි. Third සහ Fifth අතර ඇති දුර වෙනස් කිරීමෙන් කෝඩ් එකේ ස්වභාවය සම්පූර්ණයෙන්ම වෙනස් වේ. Major 3rd + Perfect 5th = Major Triad. Minor 3rd + Perfect 5th = Minor Triad. Minor 3rd + Diminished 5th = Diminished Triad.',
        bulletPointsSi: [
          'Major Triad = Root + 4 semitones + 7 semitones  →  C E G',
          'Minor Triad = Root + 3 semitones + 7 semitones  →  C Eb G',
          'Diminished Triad = Root + 3 semitones + 6 semitones  →  C Eb Gb',
          'Augmented Triad = Root + 4 semitones + 8 semitones  →  C E G#',
        ],
        keyTerms: [
          { termEn: 'Root (1)', termSi: 'මූලික ස්වරය', definitionSi: 'කෝඩ් එකේ නම ලබා දෙන පහළම ස්වරය (උදා: C කෝඩ් එකේ C).' },
          { termEn: 'Inversion', termSi: 'පෙරළුම', definitionSi: 'කෝඩ් එකේ ස්වරය වෙනස් නොකර ස්වර පිහිටීම (Bass Note) වෙනස් කිරීම.' },
        ],
      },
      {
        id: 's-202-3',
        headingSi: 'Seventh Chords — ස්වරය 4 ක කෝඩ්',
        headingEn: 'Seventh Chords',
        bodySi:
          'ත්‍රිත්ව ස්වරයට සිව්වන ස්වරයක් (7th) එකතු කිරීමෙන් Seventh Chords සෑදේ. මේවා Jazz, Pop, R&B සහ සිනමා සංගීතයේ අත්‍යවශ්‍ය වේ. Dominant 7th එකේ ඇති Tritone පරතරය නිසා එය Tonic කෝඩ් එක වෙත ඉතා ශක්තිමත්ව විසඳේ.',
        keyTerms: [
          { termEn: 'Major 7th (Cmaj7)', termSi: 'මේජර් සෙවන්ත්', definitionSi: 'C E G B — උණුසුම්, සුමට සහ Jazz වර්ණයක් ලබා දෙයි.' },
          { termEn: 'Dominant 7th (G7)', termSi: 'ඩොමිනන්ට් සෙවන්ත්', definitionSi: 'G B D F — Tritone නිසා Tonic වෙත විසඳීමට ප්‍රබල ආතතියක් ඇති කරයි.' },
          { termEn: 'Minor 7th (Dm7)', termSi: 'මයිනර් සෙවන්ත්', definitionSi: 'D F A C — සුමට සහ ගැඹුරු ශබ්දයක් ලබා දෙයි.' },
          { termEn: 'Half-Diminished (Bm7b5)', termSi: 'හාෆ් ඩිමිනිෂ්ඩ්', definitionSi: 'B D F A — Minor Key එකක ii°7 කෝඩ් එක ලෙස බහුලව යෙදේ.' },
        ],
        formulaOrDiagram:
          'Cmaj7 = C E G B   (1 - 3 - 5 - 7)\nDm7   = D F A C   (1 - b3 - 5 - b7)\nG7    = G B D F   (1 - 3 - 5 - b7)\nBm7b5 = B D F A   (1 - b3 - b5 - b7)',
      },
      {
        id: 's-202-4',
        headingSi: 'Inversions සහ Slash Chords',
        headingEn: 'Inversions and Slash Chords',
        bodySi:
          'කෝඩ් එකක් සැමවිටම Root Note එකෙන් පහළින් ආරම්භ කළ යුතු නැත. C කෝඩ් එක E අකුරින් පහළින් ආරම්භ වුවහොත් එය C/E පළමු පෙරළුමයි. Inversion භාවිතයෙන් Bass Line එක සුමට වන අතර කෝඩ් මාරුවීම් පැහැදිලි වේ.',
        keyTerms: [
          { termEn: 'Root Position', termSi: 'මූල පිහිටීම', definitionSi: 'Root ස්වරය පහළම කොටසේ තිබීම (C-E-G).' },
          { termEn: '1st Inversion', termSi: 'පළමු පෙරළුම', definitionSi: 'Third එක පහළම තිබීම (E-G-C = C/E).' },
          { termEn: '2nd Inversion', termSi: 'දෙවන පෙරළුම', definitionSi: 'Fifth එක පහළම තිබීම (G-C-E = C/G).' },
        ],
      },
    ],
    examples: [
      {
        id: 'ex-202-1',
        titleSi: 'Major සහ Minor කෝඩ් අතර වෙනස ඇසීම',
        titleEn: 'Hearing the Difference Between Major and Minor',
        descriptionSi:
          'පළමුව C Major ඇසීමෙන් පසුව C Minor අසන්න. Third ස්වරය Semitone 1 කින් පහත වීමෙන් දීප්තිමත් ස්වභාවය සංවේදී (Sad) ස්වභාවයට පත්වන ආකාරය අවධානය කරන්න.',
        notationOrSteps: 'Major: C E G  |  Minor: C Eb G',
        synthPreviewNotes: [60, 64, 67, 63, 67],
        synthType: 'chord',
      },
      {
        id: 'ex-202-2',
        titleSi: 'ii – V – I යන Jazz විසඳුම',
        titleEn: 'The ii–V–I Jazz Resolution',
        descriptionSi:
          'Dm7 → G7 → Cmaj7 යන කෝඩ් 3 අසන්න. G7 හි Tritone (B සහ F) හේතුවෙන් Cmaj7 වෙත විසඳෙන ආතතිය හඳුනාගන්න.',
        notationOrSteps: 'Dm7 (D F A C) → G7 (G B D F) → Cmaj7 (C E G B)',
        synthPreviewNotes: [62, 65, 69, 72, 67, 71, 74, 77, 60, 64, 67, 71],
        synthType: 'chord',
      },
    ],
    exercises: [
      {
        id: 'exer-202-1',
        titleSi: 'Chord Explorer භාවිතයෙන් කෝඩ් විශ්ලේෂණය',
        instructionsSi: 'Chord Explorer Lab එක භාවිතයෙන් පහත කාර්යයන් සිදු කරන්න.',
        stepsSi: [
          'Root C සහ Quality Major තෝරා C-E-G ස්වර තහවුරු කරගන්න.',
          'Inversion 1 සහ 2 තෝරා Bass Note එක වෙනස් වන ආකාරය නිරීක්ෂණය කරන්න.',
          'Root A සහ Quality Minor තෝරා A-C-E අසන්න.',
          'G7 කෝඩ් එකේ Tritone (B සහ F) හඳුනාගන්න.',
        ],
        linkedLabTab: 'chord',
      },
    ],
    exerciseIds: ['exer-202-1'],
    quizIds: ['quiz-202'],
    summarySi:
      'Interval එකකට අගය සහ ගුණය යන අංශ 2 ක් ඇත. Triads වර්ග 4 ක් සහ Seventh Chords වර්ග 4 ක් ප්‍රධාන වේ. Inversions මගින් සුමට Bass Line නිර්මාණය කරන අතර Slash Chord අංකනයෙන් (C/E) එය දක්වයි.',
    furtherPracticeSi: [
      'Chord Explorer හි Chord Formula බලා Eb මයිනර් කෝඩ් එක ගොඩනගන්න.',
      'Cmaj7, Am7, Fmaj7, G7 යන කෝඩ් 4 එකින් එක වාදනය කර Jazz ගීතයක් සඳහා Chord Progression එකක් සාදන්න.',
    ],
    published: true,
    order: 2,
    updatedAt: UPDATED_AT,
  },
  {
    id: 'lesson-203',
    slug: 'diatonic-harmony-roman-numerals-and-circle-of-fifths',
    courseId: 'course-level-2',
    titleSi: 'Diatonic Harmony, Roman Numerals සහ Circle of Fifths',
    titleEn: 'Diatonic Harmony, Roman Numerals and the Circle of Fifths',
    descriptionSi:
      'Major සහ Minor Key එකක Diatonic කෝඩ් 7, Roman Numeral Analysis (I, ii, iii, IV, V, vi, vii°), Functional Harmony (Tonic–Subdominant–Dominant), Cadences සහ Circle of Fifths භාවිතයෙන් Transposition.',
    category: 'music-theory',
    level: 2,
    prerequisites: ['intervals-and-chord-construction'],
    estimatedMinutes: 25,
    learningObjectives: [
      'ඕනෑම Major හෝ Minor Key එකක Diatonic කෝඩ් 7 ලැයිස්තුගත කිරීම.',
      'Roman Numeral අංකනය මගින් ගීතයක කෝඩ් විශ්ලේෂණය කිරීම.',
      'Authentic, Plagal, Half සහ Deceptive Cadences හඳුනා ගැනීම.',
      'Circle of Fifths භාවිතයෙන් ඕනෑම Key එකකට Transpose කිරීම.',
    ],
    sections: [
      {
        id: 's-203-1',
        headingSi: 'C Major Key එකේ Diatonic කෝඩ් 7',
        headingEn: 'The Seven Diatonic Chords of C Major',
        bodySi:
          'C Major Scale එකේ ස්වරවලින් පමණක් කෝඩ් ගොඩනැගූ විට Roman Numerals මගින් හඳුන්වන කෝඩ් 7 ක් ලැබේ. කුඩා අකුරු (ii, iii, vi) මගින් Minor කෝඩ්ද, විශාල අකුරු (I, IV, V) මගින් Major කෝඩ්ද, ° සංකේතයෙන් Diminished කෝඩ්ද දක්වයි.',
        formulaOrDiagram:
          'C Major: I=C  ii=Dm  iii=Em  IV=F  V=G  vi=Am  vii°=Bdim\nA Minor: i=Am  ii°=Bdim  III=C  iv=Dm  v=Em  VI=F  VII=G',
        keyTerms: [
          { termEn: 'Diatonic', termSi: 'ඩයටොනික්', definitionSi: 'Key එකේ ස්වර මාලාවේ ස්වර පමණක් භාවිතයෙන් ගොඩනගන ලද කෝඩ්.' },
          { termEn: 'Roman Numeral Analysis', termSi: 'රෝමන් අංක විශ්ලේෂණය', definitionSi: 'කෝඩ්, Key එකට සාපේක්ෂව (I සිට VII දක්වා) අංකනය කිරීම.' },
        ],
      },
      {
        id: 's-203-2',
        headingSi: 'Functional Harmony — ටොනික්, සබ්ඩොමිනන්ට් සහ ඩොමිනන්ට්',
        headingEn: 'Functional Harmony: Tonic, Subdominant and Dominant',
        bodySi:
          'සෑම කෝඩ් එකකටම නිශ්චිත කාර්යයක් (Function) ඇත. Tonic (I, vi) — නිවහන සහ ස්ථාවරත්වය. Subdominant (IV, ii) — ගමනක් ආරම්භ කිරීම. Dominant (V, vii°) — නැවත Tonic වෙත ඇදී යන ආතතිය. සංගීතයේ ගමන මෙසේය: Tonic → Subdominant → Dominant → Tonic.',
        keyTerms: [
          { termEn: 'Tonic Function', termSi: 'ටොනික් කාර්යය', definitionSi: 'ස්ථාවරත්වය සහ නිවහනේ හැඟීම ලබා දෙන කාර්යය (I, vi, iii).' },
          { termEn: 'Subdominant Function', termSi: 'සබ්ඩොමිනන්ට් කාර්යය', definitionSi: 'ගමනක් හෝ වෙනසක් ඇති කරන කාර්යය (IV, ii).' },
          { termEn: 'Dominant Function', termSi: 'ඩොමිනන්ට් කාර්යය', definitionSi: 'ප්‍රබල ආතතියක් ඇති කර Tonic වෙත විසඳීමට ඉල්ලා සිටින කාර්යය (V, vii°).' },
        ],
      },
      {
        id: 's-203-3',
        headingSi: 'Cadences — සංගීත වාක්‍ය අවසානයන්',
        headingEn: 'Cadences: Musical Punctuation',
        bodySi:
          'Cadence එකක් යනු ලිඛිත භාෂාවේ තිතක් හෝ ප්‍රශ්න ලකුණක් වැනිය. සංගීත කොටසක් අවසන් වන්නේ කෙසේද යන්න Cadence එකෙන් තීරණය වේ.',
        bulletPointsSi: [
          'Authentic Cadence (V → I) — සම්පූර්ණ විරාමය. (තිත)',
          'Plagal Cadence (IV → I) — මෘදු, "ආමෙන්" විසඳුම.',
          'Half Cadence (? → V) — අර්ධ විරාමය. (කොමාව)',
          'Deceptive Cadence (V → vi) — අපේක්ෂා නොකළ විසඳුම. (ආಶ්චර්යය)',
        ],
        keyTerms: [
          { termEn: 'Cadence', termSi: 'විසඳුම් රටාව', definitionSi: 'සංගීත කොටසක් අවසන් කරන කෝඩ් ගමන් මග.' },
        ],
      },
      {
        id: 's-203-4',
        headingSi: 'Circle of Fifths සහ Transposition',
        headingEn: 'The Circle of Fifths and Transposition',
        bodySi:
          'Circle of Fifths යනු Key අතර ඇති සම්බන්ධතාව පෙන්වන වෘත්තාකාර රූප සටහනයි. දක්ෂිණාවර්තව ගමන් කරන විට (C → G → D → A) Sharp එකක් එකතු වේ. වාමාවර්තව ගමන් කරන විට (C → F → Bb → Eb) Flat එකක් එකතු වේ.',
        keyTerms: [
          { termEn: 'Circle of Fifths', termSi: 'පස්වැනි ස්වර චක්‍රය', definitionSi: 'Perfect 5th පරතරයෙන් Key එකින් එක සම්බන්ධ කරන චක්‍රය.' },
          { termEn: 'Transposition', termSi: 'ස්වර මාරු කිරීම', definitionSi: 'ගීතයක් සම්පූර්ණයෙන්ම තවත් Key එකකට ගෙනයාම.' },
          { termEn: 'Key Signature', termSi: 'යතුරු ලකුණු', definitionSi: 'Staff එකේ ආරම්භයේ Sharp හෝ Flat ලෙස දක්වන Key එකේ ස්වර.' },
        ],
        formulaOrDiagram:
          'Sharp දිශාව:  C(0) → G(1#) → D(2#) → A(3#) → E(4#) → B(5#)\nFlat දිශාව:   C(0) → F(1b) → Bb(2b) → Eb(3b) → Ab(4b) → Db(5b)',
      },
    ],
    examples: [
      {
        id: 'ex-203-1',
        titleSi: 'I - V - vi - IV රෝමන් විශ්ලේෂණය',
        titleEn: 'Roman Numeral Analysis of I–V–vi–IV',
        descriptionSi:
          'C Major Key එකේ I=C, V=G, vi=Am, IV=F වේ. ලෝකයේ වඩාත් ජනප්‍රිය Pop කෝඩ් රටාව මෙයයි.',
        notationOrSteps: 'C → G → Am → F',
        synthPreviewNotes: [60, 64, 67, 67, 71, 74, 69, 72, 76, 65, 69, 72],
        synthType: 'chord',
      },
    ],
    exercises: [
      {
        id: 'exer-203-1',
        titleSi: 'Progressions Builder භාවිතයෙන් Cadence අභ්‍යාසය',
        instructionsSi: 'Chord Progression Builder භාවිතයෙන් පහත අභ්‍යාසය සිදු කරන්න.',
        stepsSi: [
          'Key: C Major ලෙස තෝරා Pop Axis (I-V-vi-IV) රටාව Load කරන්න.',
          'අවසාන කෝඩ් එක V (G) ලෙස වෙනස් කර Half Cadence එකක් සාදන්න.',
          'නැවත vi (Am) දමා Deceptive Cadence එකක් අසන්න.',
          'අවසානයේ I (C) දමා Authentic Cadence එක සම්පූර්ණ කරන්න.',
        ],
        linkedLabTab: 'progression',
      },
    ],
    exerciseIds: ['exer-203-1'],
    quizIds: ['quiz-203'],
    summarySi:
      'Diatonic Harmony මගින් Key එකක කෝඩ් 7 ලබා දෙයි. Roman Numerals මගින් ඒවායේ කාර්යය (Tonic, Subdominant, Dominant) පෙන්නුම් කරයි. Cadences මගින් සංගීත වාක්‍ය අවසන් වන ආකාරය තීරණය වේ. Circle of Fifths භාවිතයෙන් Transposition පහසු වේ.',
    furtherPracticeSi: [
      'G Major Key එකේ Diatonic කෝඩ් 7 ලැයිස්තුගත කරන්න. (G Am Bm C D Em F#dim)',
      'ඔබේ ප්‍රියතම ගීතයක කෝඩ් Roman Numerals වලට පරිවර්තනය කරන්න.',
    ],
    published: true,
    order: 3,
    updatedAt: UPDATED_AT,
  },

  // =====================================================================================
  // LEVEL 3 — COMPOSITION AND SONGWRITING
  // =====================================================================================
  {
    id: 'lesson-301',
    slug: 'motifs-phrases-and-melody-contour',
    courseId: 'course-level-3',
    titleSi: 'Motifs, Phrases සහ Melody Contour — සංගීත අදහසක් වර්ධනය කිරීම',
    titleEn: 'Motifs, Phrases and Melody Contour',
    descriptionSi:
      'කෙටි සංගීත අදහසක් (Motif) නිර්මාණය කර එය Repetition, Sequence සහ Variation මගින් සම්පූර්ණ තනුවක් බවට වර්ධනය කිරීමේ ක්‍රමවේදය.',
    category: 'composition',
    level: 3,
    prerequisites: ['diatonic-harmony-roman-numerals-and-circle-of-fifths'],
    estimatedMinutes: 24,
    learningObjectives: [
      'Motif, Phrase සහ Period අතර වෙනස පැහැදිලි කිරීම.',
      'Melody Contour (තනුවේ හැඩය) වර්ග 4 හඳුනා ගැනීම.',
      'Repetition සහ Contrast සමබරව යොදා තනුවක් ලිවීම.',
      'Antecedent (ප්‍රශ්නය) සහ Consequent (පිළිතුර) ලෙස Phrase දෙකක් ගොඩනැගීම.',
    ],
    sections: [
      {
        id: 's-301-1',
        headingSi: 'Motif — සංගීතයේ කුඩාම අර්ථවත් ඒකකය',
        headingEn: 'The Motif: Music’s Smallest Meaningful Unit',
        bodySi:
          'Motif එකක් යනු භාෂාවේ වචනයක් හා සමාන කුඩාම සංගීත අදහසයි. බීතෝවන්ගේ 5 වන සිම්ෆොනියේ මුල් ස්වර 4 ලෝකයේ වඩාත් ප්‍රසිද්ධ Motif එකයි. Motif එකකට ස්වර 2 සිට 7 දක්වා ප්‍රමාණවත් වේ.',
        keyTerms: [
          { termEn: 'Motif', termSi: 'සංගීත මෝටිෆ්', definitionSi: 'තනුවක් ගොඩනැගීමට පදනම වන කෙටි, මතකයේ රැඳෙන ස්වර රටාවක්.' },
          { termEn: 'Phrase', termSi: 'සංගීත වාක්‍යය', definitionSi: 'Motif එකක් හෝ කිහිපයක් එකතු වූ සම්පූර්ණ අර්ථයක් ඇති කොටස (සාමාන්‍යයෙන් Bars 2–4).' },
          { termEn: 'Period', termSi: 'සංගීත ඡේදය', definitionSi: 'Phrase දෙකක් (Antecedent + Consequent) එකතු වීමෙන් සෑදෙන සම්පූර්ණ කොටස.' },
        ],
      },
      {
        id: 's-301-2',
        headingSi: 'Melody Contour — තනුවේ හැඩය',
        headingEn: 'Melody Contour: The Shape of a Melody',
        bodySi:
          'තනුවක් ග්‍රාෆ් එකක් මත ඇඳිය හැකි නම් එහි හැඩය (Contour) දැකගත හැක. හොඳ තනුවක් සැමවිටම එකම දිශාවට ගමන් නොකර විවිධ හැඩ භාවිතා කරයි. සංගීතයේ ඉහළම ස්ථානය (Climax) අවසානයට ආසන්නව තැබීමෙන් හැඟීම්බර බව වැඩි වේ.',
        bulletPointsSi: [
          'Arch (චාපය) — ක්‍රමයෙන් ඉහළ ගොස් නැවත පහළ ඒම. (වඩාත් බහුලයි)',
          'Ascending (ආරෝහණ) — ක්‍රමයෙන් ඉහළ යාම. උද්යෝගය වර්ධනය කරයි.',
          'Descending (අවරෝහණ) — පහළ යාම. නිහඬ, සන්සුන් හැඟීමක් ලබා දෙයි.',
          'Wavelike (තරංගාකාර) — ඉහළ පහළ දෙකම මිශ්‍ර වීම.',
        ],
        keyTerms: [
          { termEn: 'Climax', termSi: 'උච්චතම අවස්ථාව', definitionSi: 'තනුවේ වඩාත් ඉහළම හෝ ප්‍රබලතම ස්ථානය.' },
          { termEn: 'Contour', termSi: 'හැඩය', definitionSi: 'තනුවක් ඉහළ-පහළ ගමන් කරන ආකාරයේ සමස්ත හැඩය.' },
        ],
      },
      {
        id: 's-301-3',
        headingSi: 'Repetition, Sequence සහ Variation',
        headingEn: 'Repetition, Sequence and Variation',
        bodySi:
          'මිනිස් මොළය කැමති දේ නැවත නැවත ඇසීමටයි (Repetition). නමුත් සම්පූර්ණයෙන්ම පුනරාවර්තනය වුවහොත් ඒකාකාරී වේ. එහෙයින් Sequence (එකම රටාව ඉහළින් හෝ පහළින් නැවත ගොඩනැගීම) සහ Variation (රටාව වෙනස් කිරීම) භාවිතා කළ යුතුය.',
        keyTerms: [
          { termEn: 'Sequence', termSi: 'අනුක්‍රමික පුනරාවර්තනය', definitionSi: 'එකම හෝ සමාන රටාව ඉහළ හෝ පහළ ස්ථානයක නැවත ගොඩනැගීම.' },
          { termEn: 'Variation', termSi: 'විචලනය', definitionSi: 'මූලික අදහස පිළිගත හැකි ලෙස රිද්මය හෝ ස්වර වෙනස් කිරීම.' },
        ],
      },
      {
        id: 's-301-4',
        headingSi: 'Antecedent සහ Consequent — ප්‍රශ්නය සහ පිළිතුර',
        headingEn: 'Antecedent and Consequent: Question and Answer',
        bodySi:
          'හොඳම තනු ස්වභාවික භාෂාවේ ප්‍රශ්නයක් හා පිළිතුරක් මෙන් ක්‍රියා කරයි. පළමු Phrase එක (Antecedent) Tonic වලින් ආරම්භ වී අස්ථාවර ස්වරයකින් (V හෝ ii) අවසන් වේ. දෙවන Phrase එක (Consequent) එම රිද්මයම භාවිතා කර ස්ථාවර Tonic ස්වරයෙන් අවසන් වේ.',
        keyTerms: [
          { termEn: 'Antecedent Phrase', termSi: 'ප්‍රශ්න වාක්‍යය', definitionSi: 'අස්ථාවර ස්වරයකින් අවසන් වී "ප්‍රශ්නයක්" ඇති කරන Phrase එක.' },
          { termEn: 'Consequent Phrase', termSi: 'පිළිතුරු වාක්‍යය', definitionSi: 'Tonic ස්වරයෙන් අවසන් වී ප්‍රශ්නයට "පිළිතුරු" දෙන Phrase එක.' },
        ],
        formulaOrDiagram: 'Antecedent (Bars 1-4): C E G A | G - - -   (අස්ථාවර — G මත අවසන්)\nConsequent (Bars 5-8): C E G A | C - - -   (ස්ථාවර — C මත අවසන්)',
      },
    ],
    examples: [
      {
        id: 'ex-301-1',
        titleSi: 'Motif එකක් Sequence මගින් වර්ධනය කිරීම',
        titleEn: 'Developing a Motif Through Sequence',
        descriptionSi:
          'මූලික Motif: C-D-E. ඉන්පසු එම රටාවම ඉහළින් (D-E-F) සහ තවත් ඉහළින් (E-F-G) යොදන්න. මෙය Sequence එකකි.',
        notationOrSteps: 'Motif: C D E | Sequence 1: D E F | Sequence 2: E F G',
        synthPreviewNotes: [60, 62, 64, 62, 64, 65, 64, 65, 67],
        synthType: 'melody',
      },
      {
        id: 'ex-301-2',
        titleSi: 'Antecedent–Consequent Phrase දෙකක්',
        titleEn: 'Antecedent and Consequent Phrases',
        descriptionSi:
          'පළමු Phrase එක Dominant (G) මත නතර වන අතර දෙවන Phrase එක Tonic (C) මත අවසන් වේ. ප්‍රශ්නය සහ පිළිතුර අතර ඇති වෙනස අවධානය කරන්න.',
        notationOrSteps: 'Q: C-D-E-G → G (Hold) | A: C-D-E-G → C (Hold)',
        synthPreviewNotes: [60, 62, 64, 67, 67, 60, 62, 64, 67, 72],
        synthType: 'melody',
      },
    ],
    exercises: [
      {
        id: 'exer-301-1',
        titleSi: 'ඔබේ ප්‍රථම Motif නිර්මාණය',
        instructionsSi: 'Virtual Piano භාවිතයෙන් මෙම සම්පූර්ණ ව්‍යාපෘතිය සිදු කරන්න.',
        stepsSi: [
          'ස්වර 4 කින් සරල Motif එකක් වාදනය කරන්න (උදා: E-G-A-G).',
          'එම Motif එකම Semitone 2 ක් ඉහළින් නැවත වාදනය කරන්න (Sequence).',
          'Antecedent Phrase එකක් G ස්වරයෙන් අවසන් කරන්න.',
          'Consequent Phrase එකක් C ස්වරයෙන් අවසන් කරන්න.',
          'ඔබේ තනුව C → Am → F → G යන කෝඩ් රටාව සමඟ ගයන්න.',
        ],
        linkedLabTab: 'piano',
      },
    ],
    exerciseIds: ['exer-301-1'],
    quizIds: ['quiz-301'],
    summarySi:
      'Motif එකක් යනු සංගීතයේ කුඩාම අර්ථවත් ඒකකයයි. Repetition, Sequence සහ Variation මගින් එය වර්ධනය කරයි. Antecedent Phrase එක අස්ථාවරව අවසන් වී Consequent Phrase එක එය Tonic ස්වරයෙන් විසඳයි.',
    furtherPracticeSi: [
      'ඔබේ ප්‍රියතම සිංහල ගීතයක මුල් ස්වර 4 ලියා එය Motif එකක් ලෙස හඳුනාගන්න.',
      'Arch Contour එකක් සහිත ස්වර 8 ක තනුවක් නිර්මාණය කරන්න.',
    ],
    published: true,
    order: 1,
    updatedAt: UPDATED_AT,
  },
  {
    id: 'lesson-302',
    slug: 'song-forms-and-chord-progressions',
    courseId: 'course-level-3',
    titleSi: 'ගීත ආකෘති (Song Forms) සහ Chord Progression නිර්මාණය',
    titleEn: 'Song Forms and Designing Chord Progressions',
    descriptionSi:
      'Verse–Chorus, AB, ABA සහ Bridge සහිත නූතන ගීත ආකෘති, Harmonic Rhythm, Tension & Resolution, Voice Leading සහ Bass Line රචනය.',
    category: 'composition',
    level: 3,
    prerequisites: ['motifs-phrases-and-melody-contour'],
    estimatedMinutes: 26,
    learningObjectives: [
      'Verse–Chorus සහ AB/ABA ආකෘති හඳුනාගෙන ඒවායේ අරමුණ පැහැදිලි කිරීම.',
      'Harmonic Rhythm (කෝඩ් මාරුවීමේ වේගය) පාලනය කිරීම.',
      'Slash Chord සහ Inversion භාවිතයෙන් සුමට Bass Line ලිවීම.',
      'Pre-Chorus මගින් ආතතිය ගොඩනගා Chorus එකේදී එය මුදා හරින ආකාරය සැලසුම් කිරීම.',
    ],
    sections: [
      {
        id: 's-302-1',
        headingSi: 'නූතන ගීත ආකෘතිය — Intro, Verse, Pre-Chorus, Chorus, Bridge',
        headingEn: 'Modern Song Form: Intro, Verse, Pre-Chorus, Chorus, Bridge',
        bodySi:
          'නවීන Pop ගීතයක සම්මත කොටස්: Intro (හැඳින්වීම) → Verse (කතාව) → Pre-Chorus (ආතතිය ගොඩනැගීම) → Chorus (ප්‍රධාන අදහස) → Verse 2 → Chorus → Bridge (නව දිශාවක්) → Final Chorus → Outro. Verse කොටස පිරිසිදුව හා සරලව තබා Chorus කොටස භාණ්ඩ එක් කර පූර්ණ ශක්තියෙන් ගොඩනැගීම සම්මතයයි.',
        keyTerms: [
          { termEn: 'Verse', termSi: 'ගීත පද කොටස', definitionSi: 'කතාව ගෙන යන, පද වෙනස් වන නමුත් තනුව සමාන වන කොටස.' },
          { termEn: 'Chorus', termSi: 'ගීත රංගන කොටස', definitionSi: 'ගීතයේ ප්‍රධාන අදහස සහ වඩාත් මතකයේ රැඳෙන කොටස.' },
          { termEn: 'Bridge', termSi: 'සේතුව', definitionSi: 'නව Harmonic වර්ණයක් ලබා දෙන, සාමාන්‍යයෙන් එක් වරක් පමණක් එන කොටස.' },
          { termEn: 'Pre-Chorus', termSi: 'පෙර-රංගනය', definitionSi: 'Chorus එකට පෙර ආතතිය ගොඩනගන කෙටි කොටස.' },
        ],
        formulaOrDiagram:
          'Intro → Verse 1 → Pre-Chorus → Chorus → Verse 2 → Chorus → Bridge → Final Chorus → Outro',
      },
      {
        id: 's-302-2',
        headingSi: 'Harmonic Rhythm — කෝඩ් මාරුවීමේ වේගය',
        headingEn: 'Harmonic Rhythm',
        bodySi:
          'Harmonic Rhythm යනු එක් කෝඩ් එකක් කොපමණ කාලයක් පවතින්නේද යන්නයි. Chorus එකේදී කෝඩ් ඉක්මනින් මාරු වන අතර Verse එකේදී සමානව පවතී. එකම බාර් එකක කෝඩ් 2 ක් දැමීමෙන් ගමන් වේගවත් බවක් දැනේ.',
        keyTerms: [
          { termEn: 'Harmonic Rhythm', termSi: 'හාමොනික් රිද්මය', definitionSi: 'කෝඩ් එකිනෙක මාරුවන වේගය (සාමාන්‍යයෙන් බාර් 1, 2 හෝ 4 කින්).' },
          { termEn: 'Tension and Resolution', termSi: 'ආතතිය සහ විසඳුම', definitionSi: 'අස්ථාවර කෝඩ් (V, vii°) මගින් ආතතියක් සාදා ස්ථාවර කෝඩ් (I) මගින් එය විසඳීම.' },
        ],
      },
      {
        id: 's-302-3',
        headingSi: 'Voice Leading — සුමට කෝඩ් සම්බන්ධතාව',
        headingEn: 'Voice Leading: Smooth Chord Connections',
        bodySi:
          'හොඳ Voice Leading හි රන් නීතිය: එක් කෝඩ් එකක සිට ඊළඟට මාරු වන විට එක් එක් ස්වරය අවම දුරකින් ගමන් කරවන්න. C (C-E-G) සිට F (F-A-C) වෙත යන විට C ස්වරය පොදුවේ තබා E→F සහ G→A ලෙස අර්ධ/පූර්ණ ස්වරයකින් ගමන් කළ හැක.',
        keyTerms: [
          { termEn: 'Voice Leading', termSi: 'හඬ මෙහෙයවීම', definitionSi: 'කෝඩ් මාරුවීමේදී එක් එක් ස්වරය අවම දුරකින් හා සුමටව ගමන් කරවීම.' },
          { termEn: 'Common Tone', termSi: 'පොදු ස්වරය', definitionSi: 'කෝඩ් දෙකකම එකවර පවතින ස්වරය (එය එලෙසම තබා ගැනීම සුමට බව ලබා දෙයි).' },
        ],
        formulaOrDiagram:
          'C (C-E-G) → F (F-A-C): E→F (+1), G→A (+2), C stays C (0) ✓\nC (C-E-G) → G (G-B-D): E→D (-2), G stays G (0), C→B (-1) ✓',
      },
      {
        id: 's-302-4',
        headingSi: 'Bass Line රචනය',
        headingEn: 'Writing a Bass Line',
        bodySi:
          'Bass Line එක ගීතයේ පදනමයි. එය Root Note පමණක් වාදනය නොකළ යුතුය. Inversions (Slash Chords), Passing Notes සහ Octave Jumps එක් කිරීමෙන් Bass Line එක රසවත් වේ. නමුත් සරල බව රැක ගැනීම වඩා වැදගත්ය.',
        keyTerms: [
          { termEn: 'Bass Line', termSi: 'බේස් තනුව', definitionSi: 'සංගීතයේ පහළම ස්වර පරාසයේ ගමන් කරන ස්වර රේඛාව.' },
          { termEn: 'Passing Note', termSi: 'සංක්‍රාමික ස්වරය', definitionSi: 'ප්‍රධාන ස්වර දෙකක් අතර ගමන් කරන, කෝඩ් එකට අයත් නොවන ස්වරය.' },
        ],
      },
    ],
    examples: [
      {
        id: 'ex-302-1',
        titleSi: 'Pre-Chorus මගින් Chorus එක ගොඩනැගීම',
        titleEn: 'Building the Chorus with a Pre-Chorus',
        descriptionSi:
          'Verse: Am → F → C → G (සන්සුන්). Pre-Chorus: Dm → Em → F → G (ක්‍රමයෙන් ආතතිය වැඩි වේ). Chorus: C → G → Am → F (මුදා හැරීම).',
        notationOrSteps: 'Am → F → C → G || Dm → Em → F → G || C → G → Am → F',
        synthPreviewNotes: [69, 65, 60, 67, 62, 64, 65, 67, 60, 67, 69, 65],
        synthType: 'chord',
      },
    ],
    exercises: [
      {
        id: 'exer-302-1',
        titleSi: 'සම්පූර්ණ ගීත ආකෘතියක් ගොඩනැගීම',
        instructionsSi: 'Progressions Builder සහ Virtual Piano භාවිතයෙන් සම්පූර්ණ ගීත ආකෘතියක් සාදන්න.',
        stepsSi: [
          'Verse සඳහා කෝඩ් 4 ක් තෝරන්න (සමාන Harmonic Rhythm එකක් සමඟ).',
          'Chorus සඳහා වෙනස් කෝඩ් 4 ක් තෝරන්න.',
          'Bridge එක සඳහා Relative Minor (vi) වෙත ගමන් කරන්න.',
          'සෑම කොටසකම Bass Line එක Inversion (Slash Chord) භාවිතයෙන් සුමට කරන්න.',
          'සම්පූර්ණ ගීතය Metronome එක සමඟ 90 BPM ට වාදනය කරන්න.',
        ],
        linkedLabTab: 'progression',
      },
    ],
    exerciseIds: ['exer-302-1'],
    quizIds: ['quiz-302'],
    summarySi:
      'නූතන ගීතයක් Intro, Verse, Pre-Chorus, Chorus, Bridge සහ Outro ලෙස ගොඩනැගේ. Harmonic Rhythm මගින් ගමන් වේගය පාලනය වන අතර Voice Leading මගින් සුමට බව ලැබේ. Bass Line එක පදනම වන අතර Inversion භාවිතයෙන් එය රසවත් කළ හැක.',
    furtherPracticeSi: [
      'ඔබේ ප්‍රියතම ගීතයක අවසාන Chorus එකට පෙර Bridge එකේ කෝඩ් හඳුනාගන්න.',
      'කෝඩ් 4 ක Verse එකක් සහ කෝඩ් 4 ක Chorus එකක් සහිත කෙටි ගීතයක් රචනා කරන්න.',
    ],
    published: true,
    order: 2,
    updatedAt: UPDATED_AT,
  },

  // =====================================================================================
  // LEVEL 4 — ARRANGEMENT
  // =====================================================================================
  {
    id: 'lesson-401',
    slug: 'instrument-roles-and-registers',
    courseId: 'course-level-4',
    titleSi: 'වාද්‍ය භාණ්ඩවල කාර්යභාරය සහ ස්වර පරාස (Instrument Roles & Registers)',
    titleEn: 'Instrument Roles and Registers in Arrangement',
    descriptionSi:
      'Composition, Arrangement සහ Production අතර වෙනස; Melody–Harmony–Bass–Rhythm යන කාර්යයන් 4; සංඛ්‍යාත පරාස (Frequency Ranges) අනුව වාද්‍ය භාණ්ඩ වෙන් කිරීම සහ Frequency Masking වළක්වා ගැනීම.',
    category: 'arrangement',
    level: 4,
    prerequisites: ['song-forms-and-chord-progressions'],
    estimatedMinutes: 24,
    learningObjectives: [
      'Composition, Arrangement සහ Production අතර වෙනස පැහැදිලි උදාහරණ සමඟ විස්තර කිරීම.',
      'Melody, Harmony, Bass සහ Rhythm යන කාර්යයන් 4 හඳුනා ගැනීම.',
      'සෑම වාද්‍ය භාණ්ඩයකම මූලික සංඛ්‍යාත පරාසය ලැයිස්තුගත කිරීම.',
      'Frequency Masking වළක්වා ගැනීමට Register බෙදා හැරීම.',
    ],
    sections: [
      {
        id: 's-401-1',
        headingSi: 'Composition, Arrangement සහ Production අතර වෙනස',
        headingEn: 'Composition versus Arrangement versus Production',
        bodySi:
          'මෙම පද 3 බොහෝ දෙනා එකට මිශ්‍ර කරයි. නමුත් ඒවා සම්පූර්ණයෙන්ම වෙනස් ක්‍රියාවලි වේ. Composition යනු තනුව (Melody) සහ මූලික Harmonic අදහස ලිවීමයි. Arrangement යනු එම අදහස කුමන භාණ්ඩවලින්, කුමන Register වලින්, කුමන කොටස්වලදී වාදනය වේද යන්න තීරණය කිරීමයි. Production යනු එය පටිගත කර (Recording) මිශ්‍ර කර (Mixing) අවසන් කිරීමයි.',
        keyTerms: [
          { termEn: 'Composition', termSi: 'සංගීත රචනය', definitionSi: 'තනුව, කෝඩ් සහ ගීත අදහස මූලිකව ලිවීම.' },
          { termEn: 'Arrangement', termSi: 'සංයෝජනය', definitionSi: 'රචනා කළ අදහස වාද්‍ය භාණ්ඩ අතර බෙදා හැර සම්පූර්ණ ව්‍යුහයක් නිර්මාණය කිරීම.' },
          { termEn: 'Production', termSi: 'නිෂ්පාදනය', definitionSi: 'පටිගත කිරීම, සංස්කරණය, මිශ්‍රණය සහ අවසන් කිරීමේ තාක්ෂණික ක්‍රියාවලිය.' },
        ],
      },
      {
        id: 's-401-2',
        headingSi: 'කාර්යයන් 4 — Melody, Harmony, Bass, Rhythm',
        headingEn: 'The Four Functions: Melody, Harmony, Bass and Rhythm',
        bodySi:
          'සංගීතයක් සමබර වන්නේ මෙම කාර්යයන් 4 හරියටම වෙන් වූ විටයි. කාර්යයන් එකම Register එකේ එකිනෙක අතිච්ඡාදනය වූ විට ශබ්දය මඩ වන (Muddy) අතර පැහැදිලි බව අහිමි වේ.',
        bulletPointsSi: [
          'Melody — ප්‍රධාන තනුව. සාමාන්‍යයෙන් 200 Hz – 4 kHz. ඉතා පැහැදිලිව ඇසිය යුතුය.',
          'Harmony — කෝඩ් සහ Pad. 150 Hz – 2 kHz. Melody එකට ඉඩ තැබිය යුතුය.',
          'Bass — පදනම. 40 Hz – 250 Hz. ගැඹුරු සහ ස්ථාවර.',
          'Rhythm — බෙර සහ පර්කෂන්. Kick (50–100 Hz), Snare (150 Hz–4 kHz), Hi-hat (6–16 kHz).',
        ],
        keyTerms: [
          { termEn: 'Register', termSi: 'ස්වර පරාසය', definitionSi: 'වාද්‍ය භාණ්ඩයක් හෝ හඬක් වාදනය කරන සංඛ්‍යාත පරාසය.' },
          { termEn: 'Frequency Masking', termSi: 'සංඛ්‍යාත අතිච්ඡාදනය', definitionSi: 'එකම සංඛ්‍යාත පරාසයේ භාණ්ඩ දෙකක් එකවර වාදනය වී එකක් අනෙක යටපත් කිරීම.' },
        ],
      },
      {
        id: 's-401-3',
        headingSi: 'සංඛ්‍යාත පරාස වගුව',
        headingEn: 'Instrument Frequency Range Reference Table',
        bodySi:
          'Arrangement සැලසුම් කිරීමේදී මෙම වගුව භාවිතා කර භාණ්ඩ එකිනෙක ගැටෙන දැයි පරීක්ෂා කරන්න. ගැටුමක් ඇත්නම් එක් භාණ්ඩයක් ඔක්ටේව් එකකින් ඉහළට හෝ පහළට ගෙනයන්න.',
        formulaOrDiagram:
          'Kick Drum        : 40 Hz – 8 kHz   (මූලික බර 50–80 Hz)\nBass Guitar      : 40 Hz – 5 kHz   (මූලික 60–150 Hz)\nPiano (මැද)      : 80 Hz – 6 kHz\nAcoustic Guitar  : 80 Hz – 12 kHz\nMale Vocal       : 100 Hz – 8 kHz\nFemale Vocal     : 200 Hz – 10 kHz\nStrings (Cello)  : 65 Hz – 6 kHz\nHi-hat / Cymbal  : 6 kHz – 16 kHz',
      },
      {
        id: 's-401-4',
        headingSi: 'Layering, Doubling සහ Rhythmic Density',
        headingEn: 'Layering, Doubling and Rhythmic Density',
        bodySi:
          'Layering යනු එකම කාර්යය සඳහා භාණ්ඩ 2 ක් හෝ වැඩි ගණනක් එකට යෙදීමයි (උදා: Strings + Synth Pad). මෙය ශබ්දය පූර්ණ කරයි. Rhythmic Density යනු එකකට එකක් ඇති රිද්මික ක්‍රියාකාරකම් ප්‍රමාණයයි. එකම වේලාවේ සියලුම භාණ්ඩ ඉතා ක්‍රියාශීලීව වාදනය වීම ගිනිගත් (Cluttered) ශබ්දයක් ඇති කරයි. එක් භාණ්ඩයක් ක්‍රියාශීලී නම් අනෙක කෙටි බවට (Sparse) තබන්න.',
        keyTerms: [
          { termEn: 'Layering', termSi: 'ස්තර ගැලපීම', definitionSi: 'එකම කාර්යය සඳහා භාණ්ඩ කිහිපයක් එකට යෙදීම.' },
          { termEn: 'Doubling', termSi: 'ද්විත්වකරණය', definitionSi: 'එකම තනුව භාණ්ඩ දෙකකින් එකවර (Octave එකකින් හෝ එකම ස්ථානයේ) වාදනය කිරීම.' },
          { termEn: 'Rhythmic Density', termSi: 'රිද්මික ඝනත්වය', definitionSi: 'නිශ්චිත කාලයක් තුළ වාදනය වන නෝට්ටු ප්‍රමාණය.' },
        ],
      },
    ],
    examples: [
      {
        id: 'ex-401-1',
        titleSi: 'වාද්‍ය භාණ්ඩ 4 ක Arrangement එකක්',
        titleEn: 'A Four-Instrument Arrangement Plan',
        descriptionSi:
          'Verse: Piano (Harmony) + Vocal (Melody) පමණයි. Chorus: Bass, Drums සහ Strings එකතු වේ. මෙසේ Dynamic සහ Register බෙදීමෙන් ගීතයට ඉහළ-පහළ ගමනක් ලැබේ.',
        notationOrSteps: 'Verse: Vocal + Piano\nPre-Chorus: + Bass + Light Percussion\nChorus: + Drums + Strings + Electric Guitar',
      },
    ],
    exercises: [
      {
        id: 'exer-401-1',
        titleSi: 'එකම තනුව ශෛලීන් දෙකකින් සංයෝජනය කිරීම',
        instructionsSi:
          'එකම කෝඩ් රටාව (C-G-Am-F) සහ එකම තනුව භාවිතයෙන් Arrangement දෙකක් සැලසුම් කරන්න.',
        stepsSi: [
          'Style A — Ballad: Piano + Soft Strings. 70 BPM. භාණ්ඩ අවමයි.',
          'Style B — Rock: Electric Guitar (Power Chords) + Drums + Bass. 120 BPM.',
          'එකම කෝඩ් 4 සහ තනුවම භාවිතා කරන්න.',
          'සෑම භාණ්ඩයකම Frequency Range ලියා ගැටුම් පරීක්ෂා කරන්න.',
          'ඔබේ සැලසුම් වගුවක් ලෙස ලියා තබා ගන්න.',
        ],
      },
    ],
    exerciseIds: ['exer-401-1'],
    quizIds: ['quiz-401'],
    summarySi:
      'Composition තනුව ලිවීමයි; Arrangement භාණ්ඩ බෙදා හැරීමයි; Production එය සැකසීමයි. Melody, Harmony, Bass සහ Rhythm යන කාර්යයන් 4 වෙන් කර තැබීමෙන් ශබ්දය පැහැදිලි වේ. Frequency Range වගුව භාවිතයෙන් Masking වළක්වන්න.',
    furtherPracticeSi: [
      'ඔබ අසන ගීතයක් ඇසීමේදී භාණ්ඩ ගණන් කර ඒවායේ කාර්යය (Melody / Harmony / Bass / Rhythm) නම් කරන්න.',
    ],
    published: true,
    order: 1,
    updatedAt: UPDATED_AT,
  },
  {
    id: 'lesson-402',
    slug: 'midi-programming-and-transitions',
    courseId: 'course-level-4',
    titleSi: 'MIDI Programming සහ Transitions (Risers, Fills, Breakdowns)',
    titleEn: 'MIDI Programming, Fills and Transitions',
    descriptionSi:
      'Drum Patterns, Bass Programming, String Pads, Fills, Risers සහ Breakdowns භාවිතයෙන් ගීත කොටස් අතර සුමට හා ආකර්ෂණීය මාරුවීම් නිර්මාණය කිරීම.',
    category: 'arrangement',
    level: 4,
    prerequisites: ['instrument-roles-and-registers'],
    estimatedMinutes: 22,
    learningObjectives: [
      'මූලික Drum Patterns (Four-on-the-Floor, Backbeat) MIDI මගින් වැඩසටහන්ගත කිරීම.',
      'Fill එකක් සහ Riser එකක් භාවිතයෙන් ගීත කොටසක් මාරු කිරීම.',
      'Breakdown එකක අරමුණ පැහැදිලි කිරීම.',
      'Velocity (ප්‍රබලතාව) භාවිතයෙන් MIDI වාදනයට මනුෂ්‍ය හැඟීමක් එක් කිරීම.',
    ],
    sections: [
      {
        id: 's-402-1',
        headingSi: 'Drum Patterns — MIDI සංඛ්‍යා භාවිතයෙන්',
        headingEn: 'Programming Drum Patterns with MIDI',
        bodySi:
          'General MIDI සම්මතයේ සෑම බෙර මාදිලියකටම නිශ්චිත MIDI සංඛ්‍යාවක් ඇත: 36 = Kick, 38 = Snare, 42 = Closed Hi-hat, 46 = Open Hi-hat. Four-on-the-Floor යනු සෑම Beat එකකට Kick එකක් යෙදීමයි (Dance/EDM). Backbeat යනු Beat 2 සහ 4 ට Snare එක යෙදීමයි (Pop/Rock).',
        keyTerms: [
          { termEn: 'Drum Fill', termSi: 'බෙර පිරවුම', definitionSi: 'කොටසක් අවසන් වන විට යොදන කෙටි බෙර රටාව.' },
          { termEn: 'Velocity', termSi: 'වාදන ප්‍රබලතාව', definitionSi: 'MIDI නෝට් එකක වාදනයේ ප්‍රබලතාව (0–127).' },
          { termEn: 'Quantization', termSi: 'කාල ග්‍රිඩ් ගැලපීම', definitionSi: 'MIDI නෝට් සමීපතම Grid රේඛාවට ස්වයංක්‍රීයව ගෙන ඒම.' },
        ],
        formulaOrDiagram:
          'General MIDI Drum Map:\n36 = Kick (C1)   | 38 = Snare (D1)  | 42 = Closed Hi-Hat (F#1)\n46 = Open Hi-Hat | 49 = Crash Cymbal | 51 = Ride Cymbal',
      },
      {
        id: 's-402-2',
        headingSi: 'Transitions — කොටස් අතර මාරුවීම්',
        headingEn: 'Transitions Between Song Sections',
        bodySi:
          'ගීත කොටසක් අනෙකකට මාරු වන විට හදිසි වෙනසක් ඇති වුවහොත් කනට අපහසු ලෙස දැනේ. Transitions මගින් එය සුමට කරයි. Riser එකක් (ක්‍රමයෙන් ඉහළ යන සංඛ්‍යාතයක්) ආතතිය ගොඩනගන අතර Crash Cymbal එකක් නව කොටසක් ආරම්භ වන බව සනිටුහන් කරයි.',
        keyTerms: [
          { termEn: 'Riser / Sweep', termSi: 'ඉහළ යන ශබ්දය', definitionSi: 'සංඛ්‍යාතය ක්‍රමයෙන් ඉහළ යන, කොටසක් ගොඩනගන ශබ්දය.' },
          { termEn: 'Breakdown', termSi: 'විරාම කොටස', definitionSi: 'භාණ්ඩ අඩු කර හෝ නතර කර පසුව යළි ගොඩනගන කොටස.' },
          { termEn: 'Pickup / Anacrusis', termSi: 'පෙර ස්වරය', definitionSi: 'නව කොටසක් ආරම්භ වීමට පෙර එන ස්වරය.' },
        ],
      },
      {
        id: 's-402-3',
        headingSi: 'අඩු පහසුකම් සහිත පරිගණකයක MIDI කළමනාකරණය',
        headingEn: 'Managing MIDI on Low-Spec Computers',
        bodySi:
          'Virtual Instruments බොහොමයක් CPU සහ RAM ඉතා වැඩියෙන් පරිභෝජනය කරයි. එනිසා අඩු පහසුකම් සහිත පරිගණකයක වැඩ කිරීමේදී MIDI Track එකක් Bounce හෝ Freeze කර Audio ලෙස පත් කරගැනීමෙන් ධාරිතාව අතිමහත් ලෙස ඉතිරි කර ගත හැක. Session එකක් ආරම්භ කිරීමට පෙර පවතින RAM සහ Disk ධාරිතාව පරීක්ෂා කරගන්න.',
        keyTerms: [
          { termEn: 'Freeze / Bounce', termSi: 'ශීත කිරීම / පත් කිරීම', definitionSi: 'MIDI හෝ Plugin ප්‍රතිදානය Audio ගොනුවක් ලෙස පත් කර CPU ධාරිතාව නිදහස් කිරීම.' },
          { termEn: 'Buffer Size', termSi: 'බෆර ප්‍රමාණය', definitionSi: 'Audio Interface එක මගින් ශබ්ද සැකසීමට ගන්නා කාලය. කුඩා නම් ප්‍රමාදය (Latency) අඩුයි; විශාල නම් CPU පැටවීම අඩුයි.' },
        ],
      },
    ],
    examples: [
      {
        id: 'ex-402-1',
        titleSi: 'Backbeat Drum Pattern එකක්',
        titleEn: 'A Basic Backbeat Drum Pattern',
        descriptionSi:
          '8th Note Hi-hat රටාවක් මත Kick (36) සහ Snare (38) Backbeat එකක්. Hi-hat Velocity 70/100 ලෙස මිශ්‍ර කිරීමෙන් මනුෂ්‍ය හැඟීමක් ලැබේ.',
        notationOrSteps:
          'Beat 1: Kick(36) + HiHat(42, vel 100)\nBeat 2: Snare(38) + HiHat(42, vel 70)\nBeat 3: Kick(36) + HiHat(42, vel 100)\nBeat 4: Snare(38) + HiHat(42, vel 70)',
      },
    ],
    exercises: [
      {
        id: 'exer-402-1',
        titleSi: 'Metronome සමඟ Drum Pattern පුහුණුව',
        instructionsSi: 'Metronome එක 100 BPM සහ 4/4 ට සකසා පහත පියවර අනුගමනය කරන්න.',
        stepsSi: [
          'Beat 1 සහ 3 ට පමණක් අතින් මේසය මත ගසා Kick එක අනුකරණය කරන්න.',
          'Beat 2 සහ 4 ට Snare එක අනුකරණය කරන්න (Backbeat).',
          'සියලු Beat වලට Hi-hat එක 8th Notes ලෙස කියන්න ("1-and-2-and").',
          'Fourth Bar එකේ අවසාන Beat 4 ට කෙටි Fill එකක් එක් කරන්න.',
          'සම්පූර්ණ රටාව Bars 4 ක් ලෙස කියන්න.',
        ],
        linkedLabTab: 'metronome',
      },
    ],
    exerciseIds: ['exer-402-1'],
    quizIds: ['quiz-402'],
    summarySi:
      'General MIDI Drum Map භාවිතයෙන් බෙර වැඩසටහන්ගත කරයි (36=Kick, 38=Snare, 42=Hi-hat). Fills සහ Risers මගින් ගීත කොටස් අතර මාරුවීම් සුමට කරයි. අඩු පහසුකම් සහිත පරිගණකයක Freeze/Bounce භාවිතය අතිශයින් වැදගත් වේ.',
    furtherPracticeSi: [
      'Four-on-the-Floor Dance Pattern එකක් සහ Backbeat Rock Pattern එකක් සසඳන්න.',
      'ඔබ අසන ගීතයක Rhythm කොටස අනුකරණය කරන්න.',
    ],
    published: true,
    order: 2,
    updatedAt: UPDATED_AT,
  },

  // =====================================================================================
  // LEVEL 5 — MUSIC PRODUCTION AND DAW WORKFLOW
  // =====================================================================================
  {
    id: 'lesson-501',
    slug: 'daw-fundamentals-tracks-buses-routing',
    courseId: 'course-level-5',
    titleSi: 'DAW මූලධර්ම — Tracks, Buses සහ Signal Routing',
    titleEn: 'DAW Fundamentals: Tracks, Buses and Signal Routing',
    descriptionSi:
      'DAW එකක් කරන කාර්යය, Audio සහ MIDI අතර වෙනස, Tempo සහ Grid, Recording සහ Editing, Track වර්ග (Audio, MIDI, Bus, Return), Sends සහ Signal Flow.',
    category: 'production',
    level: 5,
    prerequisites: ['midi-programming-and-transitions'],
    estimatedMinutes: 25,
    learningObjectives: [
      'DAW එකක ප්‍රධාන කාර්යයන් ලැයිස්තුගත කිරීම.',
      'Audio සහ MIDI වෙනස පැහැදිලි කිරීම.',
      'Track, Bus සහ Aux/Return Channel අතර වෙනස හඳුනා ගැනීම.',
      'සරල Signal Flow එකක් (Mic → Preamp → Interface → DAW → Bus → Master) අඳින්න.',
    ],
    sections: [
      {
        id: 's-501-1',
        headingSi: 'DAW එකක් කරන්නේ කුමක්ද?',
        headingEn: 'What Does a DAW Do?',
        bodySi:
          'DAW (Digital Audio Workstation) එකක් යනු ඩිජිටල් ශබ්ද වැඩබිමකි. එය ශබ්ද පටිගත කිරීම, MIDI සංස්කරණය, Virtual Instruments වාදනය, Effect යෙදීම, Mixing සහ Export කිරීම සියල්ල එකම තැනක කරයි. මෙය සංගීත නිෂ්පාදනයේ මධ්‍යම මෙවලමයි.',
        keyTerms: [
          { termEn: 'DAW', termSi: 'ශබ්ද වැඩබිම', definitionSi: 'ශබ්ද පටිගත කිරීම, MIDI, සංස්කරණය, Mixing සහ Export සියල්ල සිදු කරන මෘදුකාංගය.' },
          { termEn: 'Session / Project', termSi: 'ව්‍යාපෘතිය', definitionSi: 'එක් සංගීත නිර්මාණයක් සඳහා වන DAW ගොනුව සහ එහි සියලු මාර්ග.' },
          { termEn: 'Timeline / Arrangement', termSi: 'කාල රේඛාව', definitionSi: 'කාලය අනුව සංගීත කොටස් සකසන ප්‍රධාන දර්ශනය.' },
        ],
      },
      {
        id: 's-501-2',
        headingSi: 'Audio සහ MIDI අතර වෙනස',
        headingEn: 'Audio versus MIDI',
        bodySi:
          'නවකයන්ට වඩාත් වැදගත්ම වෙනසයි මෙය. Audio යනු සැබෑ පටිගත කළ ශබ්ද වෛවර්ණයයි (WAV, MP3). MIDI යනු ශබ්දයක් නොව උපදෙස් ලැයිස්තුවකි: "කුමන ස්වරය, කුමන වේලාවේදී, කුමන ප්‍රබලතාවයෙන්, කොපමණ කාලයක්". MIDI එකට ශබ්දයක් එක් නොකළහොත් නිහඬය. හෙයින් ස්වරයක් වැරදුණහොත් MIDI එකේ එය පහසුවෙන් වෙනස් කළ හැක. Audio නම් නැවත පටිගත කළ යුතුය.',
        keyTerms: [
          { termEn: 'Audio', termSi: 'ශබ්ද වෛවර්ණය', definitionSi: 'සැබෑ ශබ්දය ඩිජිටල් ලෙස පටිගත කරගත් ගොනුව (ස්වර වෙනස් කළ නොහැක).' },
          { termEn: 'MIDI', termSi: 'වාදන උපදෙස්', definitionSi: 'ශබ්දයක් නොව වාදන උපදෙස් (Note, Timing, Velocity) සටහන් වන ගොනුව.' },
          { termEn: 'Virtual Instrument (VSTi)', termSi: 'මායාගත වාද්‍ය භාණ්ඩය', definitionSi: 'MIDI උපදෙස් කියවා ශබ්දයක් උත්පාදනය කරන මෘදුකාංග වාද්‍ය භාණ්ඩය.' },
        ],
        formulaOrDiagram:
          'Audio : ශබ්දය → පටිගත → WAV ගොනුව  (ස්වරය වෙනස් කළ නොහැක)\nMIDI  : උපදෙස් → Virtual Instrument → ශබ්දය  (ස්වරය මුළුමනින්ම වෙනස් කළ හැක)',
      },
      {
        id: 's-501-3',
        headingSi: 'Tracks, Buses සහ Signal Flow',
        headingEn: 'Tracks, Buses and Signal Flow',
        bodySi:
          'Track එකක් යනු එක් ශබ්ද මූලාශ්‍රයක් සඳහා වන මාර්ගයයි. සියලුම Track පසුව Bus එකකට එකතු වී Master Out එකට යයි. Bus එකක් යනු එකට පැමිණෙන ශබ්ද කිහිපයක් එකවර සැකසීමට යොදන මාර්ගයයි (උදා: Drum Bus එකේ Kick + Snare + Hi-hat එකට Compression). Return/Aux Channel එකකින් Reverb වැනි Effect එකම භාණ්ඩ කිහිපයකට Send කළ හැකි අතර CPU ධාරිතාව ඉතිරි වේ.',
        keyTerms: [
          { termEn: 'Track', termSi: 'ශබ්ද මාර්ගය', definitionSi: 'එක් ශබ්ද මූලාශ්‍රයක් හෝ වාද්‍ය භාණ්ඩයක් සඳහා වන වෙන් වූ මාර්ගය.' },
          { termEn: 'Bus', termSi: 'එකතු කිරීමේ මාර්ගය', definitionSi: 'Track කිහිපයක් එකට ගෙන ඒමෙන් එකවර සැකසීමට යොදන මාර්ගය.' },
          { termEn: 'Send / Return', termSi: 'යැවීම සහ ආපසු ඒම', definitionSi: 'Track එකකින් Effect එකකට ශබ්දය යැවීම (Send) සහ එහි ප්‍රතිදානය නැවත ලබා ගැනීම (Return).' },
          { termEn: 'Master Out', termSi: 'ප්‍රධාන ප්‍රතිදානය', definitionSi: 'සියලුම ශබ්ද එකතු වන අවසාන ප්‍රතිදාන මාර්ගය.' },
        ],
        formulaOrDiagram:
          'Microphone → Preamp → Audio Interface → DAW (Track) → Bus → Master Out → Speakers',
      },
      {
        id: 's-501-4',
        headingSi: 'Project සංවිධානය සහ Backup',
        headingEn: 'Project Organisation and Backups',
        bodySi:
          'හොඳ නිෂ්පාදකයෙක් වන්නේ ව්‍යාපෘතිය පිරිසිදුව තබා ගන්නා අයයි. සෑම Track එකකටම නිශ්චිත නමක් දෙන්න. පැරණි අනුවාද Save As වලින් වෙන් කරන්න (Song_v01, Song_v02). සතියකට වරක් අවම වශයෙන් ස්ථාන 2 කට Backup ගන්න.',
        keyTerms: [
          { termEn: 'Versioning', termSi: 'අනුවාද කළමනාකරණය', definitionSi: 'ව්‍යාපෘතියේ විවිධ අවස්ථා වෙන වෙනම සුරැකීම (v01, v02, Final_v03).' },
          { termEn: 'Sample Rate', termSi: 'නියැදි වේගය', definitionSi: 'තත්පරයකට ශබ්දය මනින වාර ගණන (44,100 Hz හෝ 48,000 Hz).' },
          { termEn: 'Bit Depth', termSi: 'බිට් ගැඹුර', definitionSi: 'එක් නියැදියක් සටහන් කිරීමට යොදන Bits ගණන (16-bit, 24-bit).' },
        ],
      },
    ],
    examples: [
      {
        id: 'ex-501-1',
        titleSi: 'සරල DAW Signal Flow එකක් සැලසුම් කිරීම',
        titleEn: 'Planning a Simple DAW Signal Flow',
        descriptionSi:
          'ගායනයක් සහ Piano එකක් පටිගත කරන ගීතයක් සඳහා නිවැරදි Signal Flow එක මෙසේය.',
        notationOrSteps:
          'Vocal Mic → Audio Track 1 (Pan: Center)\nPiano DI → Audio Track 2 (Pan: L 20%)\nTrack 1 + Track 2 → Music Bus → Master Out\nReverb Send: Track 1 (30%) → Reverb Return → Master Out',
      },
    ],
    exercises: [
      {
        id: 'exer-501-1',
        titleSi: 'නිෂ්පාදන සැලසුමක් සකස් කිරීම',
        instructionsSi: 'පියවරෙන් පියවර ලිඛිතව නිෂ්පාදන සැලසුමක් සකස් කරන්න.',
        stepsSi: [
          'ඔබ නිර්මාණය කිරීමට බලාපොරොත්තු වන ගීතයේ භාණ්ඩ ලැයිස්තුගත කරන්න.',
          'සෑම භාණ්ඩයකටම Audio ද MIDI ද යන්න තීරණය කරන්න.',
          'Track නම් පිරිසිදුව ලියන්න (Vocal_Lead, Piano_L, Bass_DI).',
          'යොදන Bus (Drum Bus, Music Bus) සහ Send (Reverb, Delay) සටහන් කරන්න.',
          'Sample Rate සහ Bit Depth තෝරන්න (48 kHz / 24-bit නිර්දේශිතයි).',
          'Export වලට පෙර Peak mට්ටම -6 dBFS ට අඩු බව තහවුරු කර ගැනීමට සැලසුම් කරන්න.',
        ],
      },
    ],
    exerciseIds: ['exer-501-1'],
    quizIds: ['quiz-501'],
    summarySi:
      'DAW එකක් ශබ්ද පටිගත කිරීම, MIDI සංස්කරණය සහ Mixing සියල්ල එකට කරයි. Audio සහ MIDI අතර වෙනස තේරුම් ගැනීම අත්‍යවශ්‍යයි. Track → Bus → Master Out යන Signal Flow එක නිවැරදිව වටහා ගැනීමෙන් පැහැදිලි ව්‍යාපෘති ගොඩනැගිය හැක.',
    furtherPracticeSi: [
      'ඔබේ DAW එකේ Reaper, Cubase හෝ ඔබ කැමති මෘදුකාංගයේ මෙම Track නම් පිහිටුවා සරල Session එකක් සුරකින්න.',
      'ඔබේ ව්‍යාපෘතියේ අවම අනුවාද 3 ක් Backup ලෙස සුරකින්න.',
    ],
    published: true,
    order: 1,
    updatedAt: UPDATED_AT,
  },
  {
    id: 'lesson-502',
    slug: 'synthesizer-fundamentals-oscillators-filters-envelopes',
    courseId: 'course-level-5',
    titleSi: 'Synthesizer මූලධර්ම — Oscillators, Filters සහ ADSR Envelopes',
    titleEn: 'Synthesizer Fundamentals: Oscillators, Filters and ADSR Envelopes',
    descriptionSi:
      'Subtractive Synthesis, Waveform වර්ග 4 (Sine, Triangle, Sawtooth, Square), Filter (Cutoff, Resonance), LFO සහ ADSR Envelope (Attack, Decay, Sustain, Release) සහ Automation භාවිතය.',
    category: 'production',
    level: 5,
    prerequisites: ['daw-fundamentals-tracks-buses-routing'],
    estimatedMinutes: 26,
    learningObjectives: [
      'Waveform වර්ග 4 හඳුනාගෙන ඒවායේ Harmonic ප්‍රමාණය පැහැදිලි කිරීම.',
      'Filter Cutoff සහ Resonance පරාමිතීන් ශබ්දයට කරන බලපෑම විස්තර කිරීම.',
      'ADSR Envelope එකේ කොටස් 4 සහ ඒවා ශබ්දයේ හැඩයට කරන බලපෑම පැහැදිලි කිරීම.',
      'Automation භාවිතයෙන් කාලයත් සමඟ ශබ්දය වෙනස් කිරීම.',
    ],
    sections: [
      {
        id: 's-502-1',
        headingSi: 'Waveform වර්ග 4 සහ Harmonic ප්‍රමාණය',
        headingEn: 'The Four Basic Waveforms',
        bodySi:
          'Synthesizer එකක ශබ්දය ආරම්භ වන්නේ Oscillator එකකිනි. Sine තරංගයේ Harmonic නොමැති බැවින් ශබ්දය ඉතා පිරිසිදුය (Pure). Sawtooth තරංගයේ සියලුම Harmonic ඇති බැවින් ශබ්දය ඉතා පොහොසත් සහ උග්‍රය (Bright). Square තරංගයේ ඔත්තේ Harmonic පමණක් ඇති බැවින් හිස්-ලෝහමය ශබ්දයක් ලැබේ. Triangle තරංගය Sawtooth සහ Sine අතර පිහිටයි.',
        keyTerms: [
          { termEn: 'Oscillator', termSi: 'ශබ්ද උත්පාදකය', definitionSi: 'Synthesizer එකේ මූලික තරංගය උත්පාදනය කරන කොටස.' },
          { termEn: 'Harmonic Content', termSi: 'සහජ සංඛ්‍යාත ප්‍රමාණය', definitionSi: 'තරංගයක ඇති අතිරේක සංඛ්‍යාත ප්‍රමාණය (වැඩි නම් ශබ්දය දීප්තිමත්).' },
          { termEn: 'Subtractive Synthesis', termSi: 'අඩු කිරීමේ සංශ්ලේෂණය', definitionSi: 'පොහොසත් තරංගයකින් Filter මගින් සංඛ්‍යාත ඉවත් කර ශබ්දය හැඩගැස්වීම.' },
        ],
        formulaOrDiagram:
          'Sine     — Harmonic: මූලික එක පමණයි (ඉතා පිරිසිදු)\nTriangle — මූලික + දුර්වල ඔත්තේ Harmonic (මෘදු)\nSawtooth — සියලුම Harmonic (පොහොසත්, උග්‍ර)\nSquare   — මූලික + ප්‍රබල ඔත්තේ Harmonic (හිස්, ලෝහමය)',
      },
      {
        id: 's-502-2',
        headingSi: 'Filter — Cutoff සහ Resonance',
        headingEn: 'The Filter: Cutoff and Resonance',
        bodySi:
          'Filter එකෙන් නිශ්චිත සංඛ්‍යාතයකට ඉහළින් හෝ පහළින් සංඛ්‍යාත ඉවත් කරයි. Cutoff Frequency එකෙන් කපන ස්ථානය තීරණය වේ. Resonance (Q) එකෙන් කපන ස්ථානයේ සංඛ්‍යාතය උත්සන්න කරයි. ඉතා ඉහළ Resonance කනට අපහසු හෝ තියුණු ශබ්දයක් ඇති කළ හැක. Low-Pass Filter එකක් සරලව "ශබ්දය තද කිරීම" ලෙස ඉගෙන ගන්න - Cutoff පහත දමන විට ශබ්දය අඳුරු වේ.',
        keyTerms: [
          { termEn: 'Low-Pass Filter (LPF)', termSi: 'පහළ සංඛ්‍යාත පමණක් යැවීම', definitionSi: 'Cutoff ට වඩා ඉහළ සංඛ්‍යාත ඉවත් කරන Filter එක.' },
          { termEn: 'Cutoff Frequency', termSi: 'කැපුම් සංඛ්‍යාතය', definitionSi: 'ශබ්දය කැපීම ආරම්භ වන සංඛ්‍යාතය (Hz).' },
          { termEn: 'Resonance (Q)', termSi: 'අනුනාදය', definitionSi: 'Cutoff ස්ථානය ආසන්නයේ සංඛ්‍යාත උත්සන්න කිරීමේ ප්‍රමාණය.' },
        ],
      },
      {
        id: 's-502-3',
        headingSi: 'ADSR Envelope — ශබ්දයේ කාල හැඩය',
        headingEn: 'The ADSR Envelope',
        bodySi:
          'ADSR යනු ස්වරයක් ආරම්භ වී නිම වන තෙක් ශබ්දයේ ප්‍රබලතාව වෙනස් වන ආකාරයයි. Attack — 0 සිට උපරිමයට යාමට ගතවන කාලය. Decay — උපරිමයේ සිට Sustain මට්ටමට පහළ යාමට ගතවන කාලය. Sustain — ස්වරය තබාගෙන සිටින තාක් පවතින ප්‍රබලතාව. Release — ස්වරය නතර කළ පසු ශබ්දය නිම වීමට ගතවන කාලය. Pluck ශබ්දයකට (ගිටාරය) Attack ඉතා කෙටි වන අතර Pad ශබ්දයකට Attack දිගු වේ.',
        keyTerms: [
          { termEn: 'Attack', termSi: 'ආරම්භක කාලය', definitionSi: 'ස්වරය ආරම්භ වී උපරිම ප්‍රබලතාවට ළඟා වීමට ගතවන කාලය.' },
          { termEn: 'Decay', termSi: 'ක්ෂය කාලය', definitionSi: 'උපරිමයේ සිට Sustain මට්ටමට පහළ යාමට ගතවන කාලය.' },
          { termEn: 'Sustain', termSi: 'පවත්වා ගැනීමේ මට්ටම', definitionSi: 'ස්වරය තබාගෙන සිටින තාක් පවතින ශබ්ද මට්ටම.' },
          { termEn: 'Release', termSi: 'මුදා හැරීමේ කාලය', definitionSi: 'ස්වරය නතර කළ පසු ශබ්දය සම්පූර්ණයෙන් නිම වීමට ගතවන කාලය.' },
        ],
        formulaOrDiagram: 'ADSR:  A (0 → 100%) → D (100% → Sustain) → S (පවත්වා ගැනීම) → R (Sustain → 0%)',
      },
      {
        id: 's-502-4',
        headingSi: 'Automation සහ LFO',
        headingEn: 'Automation and LFO',
        bodySi:
          'Automation යනු කාලයත් සමඟ පරාමිතියක් ස්වයංක්‍රීයව වෙනස් කිරීමයි (උදා: Filter Cutoff එකෙන් කොටසක් ආරම්භයේ 200 Hz සිට Chorus එකේදී 8 kHz දක්වා වර්ධනය කිරීම). LFO (Low Frequency Modulation) යනු ඉතා මන්දගාමී තරංගයක් මගින් පරාමිතියක් නිරන්තරයෙන් චලනය කිරීමයි (Vibrato සහ Tremolo සඳහා).',
        keyTerms: [
          { termEn: 'Automation', termSi: 'ස්වයංක්‍රීය පාලනය', definitionSi: 'කාලයත් සමඟ පරාමිතීන් ස්වයංක්‍රීයව වෙනස් කිරීමේ ක්‍රියාවලිය.' },
          { termEn: 'LFO', termSi: 'මන්දගාමී තරංග මූලාශ්‍රය', definitionSi: 'නියත වේගයකින් පරාමිතියක් චලනය කරන ඉතා මන්දගාමී Oscillator එකක්.' },
          { termEn: 'Modulation', termSi: 'වෙනස්කම් කිරීම', definitionSi: 'එක් පරාමිතියක් තවත් සංඥාවකින් පාලනය කිරීම.' },
        ],
      },
    ],
    examples: [
      {
        id: 'ex-502-1',
        titleSi: 'Virtual Piano හි Waveform සංසන්දනය',
        titleEn: 'Comparing Waveforms on the Virtual Piano',
        descriptionSi:
          'Virtual Piano Lab එකේ Waveform තේරීමේ පහසුකම භාවිතයෙන් A4 ස්වරය Sine, Triangle, Sawtooth සහ Square ලෙස වාදනය කරන්න. Harmonic වෙනස හඳුනාගන්න.',
        notationOrSteps: 'එකම ස්වරය (A4 = 440 Hz): Sine → Triangle → Sawtooth → Square',
        synthPreviewNotes: [69],
        synthType: 'melody',
      },
    ],
    exercises: [
      {
        id: 'exer-502-1',
        titleSi: 'විවිධ ADSR සැකසුම් 3 ක් පරීක්ෂා කිරීම',
        instructionsSi: 'Virtual Piano භාවිතයෙන් Waveform හැඟීම සහ ADSR සැකසුම් පුහුණු වන්න.',
        stepsSi: [
          'Waveform: Sine තෝරා දිගු නෝට් එකක් වාදනය කරන්න (Pad හැඟීම).',
          'Waveform: Sawtooth තෝරා කෙටි නෝට් ගණනාවක් වාදනය කරන්න (Lead/Bass හැඟීම).',
          'Waveform: Square තෝරා අසන්න. එය ලෝහමය හැඟීමක් දෙන බව සටහන් කරගන්න.',
          'ඔබේ DAW එකේ සරල Synth එකක් විවෘත කර ADSR පරාමිතීන් 4 වෙනස් කර බලන්න.',
          'Drone/Bass සඳහා සහ Pad සඳහා වඩාත් සුදුසු සැකසුම් සටහන් කරගන්න.',
        ],
        linkedLabTab: 'piano',
      },
    ],
    exerciseIds: ['exer-502-1'],
    quizIds: ['quiz-502'],
    summarySi:
      'Oscillator එකෙන් මූලික තරංගය උත්පාදනය කරයි. Filter එකෙන් Harmonic ඉවත් කර ශබ්දය හැඩගස්වයි. ADSR Envelope එකෙන් ස්වරයේ කාල හැඩය තීරණය කරයි. Automation සහ LFO මගින් කාලයත් සමඟ ශබ්දය ජීවමාන කරයි.',
    furtherPracticeSi: [
      'Sawtooth තරංගයකින් String Pad එකක් අනුකරණය කිරීමට සුදුසු ADSR සැකසුමක් සිතා ලියන්න.',
      'ඔබේ DAW එකේ සරල Filter Automation එකක් අඳින්න.',
    ],
    published: true,
    order: 2,
    updatedAt: UPDATED_AT,
  },
];
