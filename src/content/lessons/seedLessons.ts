import { Lesson } from '../../types/content';

const UPDATED_AT = '2026-10-12T00:00:00.000Z';

export const SEED_LESSONS: Lesson[] = [
  // =====================================================================================
  // LEVEL 1 — MUSIC FOUNDATIONS
  // =====================================================================================
  {
    id: 'lesson-101',
    slug: 'what-is-music-and-sound',
    courseId: 'course-level-1',
    titleSi: 'සංගීතය යනු කුමක්ද? — ශබ්දයේ මූලික ගුණාංග',
    titleEn: 'What is Music? — Fundamental Properties of Sound',
    descriptionSi:
      'සංගීතය ඇතිවන ආකාරය, ස්වරයක උස්-පහත් බව (Pitch), ශබ්දයේ ප්‍රබලතාව (Dynamics), ස්වර වර්ණය (Timbre) සහ කාලය (Rhythm) පිළිබඳ පළමු පාඩම.',
    category: 'music-foundations',
    level: 1,
    prerequisites: [],
    estimatedMinutes: 14,
    learningObjectives: [
      'ශබ්දය යනු කුමක්ද සහ සංගීතය බවට පත්වන්නේ කෙසේද යන්න පැහැදිලි කිරීම.',
      'Pitch, Rhythm, Tempo, Dynamics සහ Timbre යන මූලික අංග 5 හඳුනා ගැනීම.',
      'එකම Pitch එකේ Piano සහ Guitar වෙනස් ලෙස ඇසෙන්නේ ඇයිදැයි (Timbre) පැහැදිලි කිරීම.',
    ],
    sections: [
      {
        id: 's-101-1',
        headingSi: 'ශබ්දය සහ සංගීතය අතර වෙනස',
        headingEn: 'Sound versus Music',
        bodySi:
          'සංගීතය යනු සංවිධානය කරන ලද ශබ්දයයි. වාතයේ ඇතිවන කම්පන (Vibrations) අපගේ කන් තුළට ගමන් කර ස්නායු සංඥා බවට පත්වීමෙන් අපි ශබ්දය අසමු. එහෙත් වාහන නාදය, කෑගැසීම් වැනි අහඹු ශබ්ද සංගීතය නොවේ. කාලය, උස්-පහත් බව සහ ප්‍රබලතාව අනුව නිශ්චිත රටාවකට සංවිධානය වූ විට එය සංගීතය බවට පත්වේ. සංගීතය භාෂාවක් මෙනි. ස්වර යනු අකුරු වන අතර රිද්මය යනු ව්‍යාකරණයයි.',
        keyTerms: [
          {
            termEn: 'Sound Vibration',
            termSi: 'ශබ්ද කම්පනය',
            definitionSi: 'වාතය හරහා සංචාරය කරන පීඩන තරංග මගින් ඇතිවන කම්පනය.',
          },
          {
            termEn: 'Music',
            termSi: 'සංගීතය',
            definitionSi: 'කාලය හා ස්වර උස්-පහත් බව අනුව සංවිධානය කරන ලද ශබ්දය.',
          },
        ],
      },
      {
        id: 's-101-2',
        headingSi: 'සංගීතයේ මූලික අංග 5',
        headingEn: 'The Five Fundamental Elements of Music',
        bodySi:
          'සංගීතයක් ගොඩනැගෙන්නේ මූලික අංග පහක් මතය. මේවා අවබෝධ කර ගැනීමෙන් ඕනෑම ගීතයක් ගැඹුරින් විශ්ලේෂණය කළ හැක.',
        keyTerms: [
          {
            termEn: 'Pitch',
            termSi: 'තාරතාව',
            definitionSi: 'ස්වරයේ උස් හෝ පහත් බව (සංඛ්‍යාතය අනුව).',
          },
          {
            termEn: 'Rhythm',
            termSi: 'රිද්මය',
            definitionSi: 'කාලයත් සමඟ ස්වර පිහිටන රටාව.',
          },
          {
            termEn: 'Dynamics',
            termSi: 'ප්‍රබලතාව',
            definitionSi: 'ශබ්දයේ මෘදු බව හෝ ඝෝෂාකාරී බව (Soft to Loud).',
          },
          {
            termEn: 'Timbre',
            termSi: 'ස්වර වර්ණය',
            definitionSi: 'එකම ස්වරය වුවද එය වාදනය කරන භාණ්ඩය අනුව ඇසෙන වෙනස් ස්වභාවය.',
          },
          {
            termEn: 'Tempo',
            termSi: 'ලය / වේගය',
            definitionSi: 'සංගීතය ගමන් කරන වේගය (BPM මගින් මනිනු ලැබේ).',
          },
        ],
        bulletPointsSi: [
          'Pitch — කම්පනයේ සංඛ්‍යාතය (Frequency) වැඩි විට ස්වරය ඉහළ යයි. අඩු විට පහළ යයි.',
          'Dynamics — මෘදු (p / pianissimo) සිට ප්‍රබල (f / fortissimo) දක්වා.',
          'Timbre — සංඛ්‍යාතයේ සහජ ගුණාකාර (Harmonics / Overtones) මිශ්‍රණය අනුව තීරණය වේ.',
        ],
      },
      {
        id: 's-101-3',
        headingSi: 'Timbre — එකම ස්වරය වුවද වෙනස් ශබ්ද ඇසෙන්නේ ඇයි?',
        headingEn: 'Why the Same Pitch Sounds Different on Different Instruments',
        bodySi:
          'පියානෝවක A4 ස්වරයක් වාදනය කරන විට එහි මූලික සංඛ්‍යාතය 440 Hz වේ. ගිටාරයක එම A4 ස්වරයම වාදනය කරන විටද 440 Hz ම ඇසේ. එහෙත් ඒවා වෙනස් ලෙස ඇසේ. හේතුව, ගිටාරය සහ පියානෝව 440 Hz සමඟ එකට නිකුත් කරන අතිරේක සංඛ්‍යාත (880 Hz, 1320 Hz, 1760 Hz ආදී Harmonics) වල ප්‍රබලතා වෙනස් වීමයි. මේ නිසා ඇතිවන වර්ණයට Timbre යැයි කියනු ලැබේ.',
        keyTerms: [
          {
            termEn: 'Harmonics / Overtones',
            termSi: 'සහජ සංඛ්‍යාත',
            definitionSi: 'මූලික සංඛ්‍යාතයේ නිශ්චිත ගුණාකාර වන අතිරේක සංඛ්‍යාත (2x, 3x, 4x...).',
          },
        ],
        formulaOrDiagram: 'Fundamental f0 = 440 Hz → Harmonics: 880 Hz (2f0), 1320 Hz (3f0), 1760 Hz (4f0)',
      },
    ],
    examples: [
      {
        id: 'ex-101-1',
        titleSi: 'මූලික C Major Melody එකක් ඇසීම',
        titleEn: 'Listening to a Basic C Major Melody',
        descriptionSi:
          'පහත අනුපිළිවෙලින් ස්වර වාදනය කරන්න. මෙය මූලික Tonic (C) සිට Dominant (G) හරහා නැවත Tonic (C) වෙත එන සරල තනුවකි.',
        notationOrSteps: 'C4 → E4 → G4 → C5 → G4 → E4 → C4',
        synthPreviewNotes: [60, 64, 67, 72, 67, 64, 60],
        synthType: 'melody',
      },
    ],
    exercises: [
      {
        id: 'exer-101-1',
        titleSi: 'ශ්‍රවණ නිරීක්ෂණ අභ්‍යාසය',
        instructionsSi: 'ඔබ අසන ප්‍රියතම ගීතයක් ගෙන පහත කරුණු 5 විශ්ලේෂණය කරන්න.',
        stepsSi: [
          'ගීතයේ ප්‍රධාන තනුව (Melody) ගායනා කරන්න හෝ Whistle කරන්න උත්සාහ කරන්න.',
          'බෙර රටාව (Rhythm) අතින් ගසා රිද්මය වෙන් කරන්න.',
          'ගීතයේ මන්දගාමී හා වේගවත් කොටස් (Tempo වෙනස්කම්) සටහන් කරන්න.',
          'මෘදු කොටස් හා ප්‍රබල කොටස් (Dynamics) සටහන් කරන්න.',
          'භාවිතා කරන ලද වාද්‍ය භාණ්ඩ ලැයිස්තුගත කර ඒවායේ Timbre වෙනස්කම් විස්තර කරන්න.',
        ],
        linkedLabTab: 'piano',
      },
    ],
    exerciseIds: ['exer-101-1'],
    quizIds: ['quiz-101'],
    summarySi:
      'සංගීතය යනු සංවිධානය කරන ලද ශබ්දයයි. Pitch (තාරතාව), Rhythm (රිද්මය), Tempo (ලය), Dynamics (ප්‍රබලතාව) සහ Timbre (ස්වර වර්ණය) යන මූලික අංග 5 සංගීතයට ජීවය ලබා දෙයි.',
    furtherPracticeSi: [
      'පියානෝවේ C4 සහ C5 වාදනය කර ඔක්ටේව් පරතරයේ ඇති සමාන බව හඳුනා ගන්න.',
      'පියානෝවේ එකම ස්වරයක් Sine සහ Square waveform වලින් වාදනය කර Timbre වෙනස සසඳන්න.',
    ],
    published: true,
    order: 1,
    updatedAt: UPDATED_AT,
  },
  {
    id: 'lesson-102',
    slug: 'musical-alphabet-and-piano-keyboard',
    courseId: 'course-level-1',
    titleSi: 'සංගීත හෝඩිය සහ පියානෝ යතුරු පුවරුව (A B C D E F G)',
    titleEn: 'The Musical Alphabet and Piano Keyboard',
    descriptionSi:
      'A සිට G දක්වා සංගීත අකුරු 7, කළු යතුරු (Sharps # / Flats b), ඔක්ටේව් සහ පියානෝ යතුරු පුවරුවේ රටාව හඳුනා ගැනීම.',
    category: 'music-foundations',
    level: 1,
    prerequisites: ['what-is-music-and-sound'],
    estimatedMinutes: 18,
    learningObjectives: [
      'A, B, C, D, E, F, G සංගීත අකුරු අනුපිළිවෙල පිළිබඳ පූර්ණ දැනුමක් ලබා ගැනීම.',
      'කළු යතුරු මගින් නිර්මාණය වන Sharp (#) සහ Flat (b) ස්වර හඳුනා ගැනීම.',
      'පියානෝ යතුරු පුවරුවේ සිටින කළු යතුරු කාණ්ඩ (2 සහ 3) භාවිතයෙන් ඕනෑම ස්වරයක් ක්ෂණිකව සොයා ගැනීම.',
    ],
    sections: [
      {
        id: 's-102-1',
        headingSi: 'සංගීත හෝඩිය — A සිට G දක්වා',
        headingEn: 'The Musical Alphabet: A to G',
        bodySi:
          'බටහිර සංගීතයේ අකුරු 7 ක් පමණක් ඇත: A, B, C, D, E, F, G. G ට පසුව නැවත A ලා එයි. සාමාන්‍ය ඉංග්‍රීසි හෝඩියේ මෙන් H යන අකුර සංගීතයේ නොමැත. මෙම අකුරු 7 නැවත නැවත ගමන් කරන චක්‍රයක් ගොඩනගයි.',
        keyTerms: [
          {
            termEn: 'Natural Notes',
            termSi: 'ස්වාභාවික ස්වර',
            definitionSi: 'කිසිදු Sharp හෝ Flat ලකුණක් නොමැති A සිට G දක්වා ස්වර 7.',
          },
          {
            termEn: 'Musical Alphabet Cycle',
            termSi: 'සංගීත අකුරු චක්‍රය',
            definitionSi: 'A→B→C→D→E→F→G→A ලෙස නැවත නැවත ගමන් කරන අනුපිළිවෙල.',
          },
        ],
        formulaOrDiagram: 'A → B → C → D → E → F → G → (A again)',
      },
      {
        id: 's-102-2',
        headingSi: 'පියානෝ යතුරු පුවරුවේ රහස — කළු යතුරු කාණ්ඩ 2 සහ 3',
        headingEn: 'The Keyboard Secret: Groups of 2 and 3 Black Keys',
        bodySi:
          'පියානෝ යතුරු පුවරුවක් මුලින් බැලූ විට සංකීර්ණ බවක් පෙනේ. නමුත් සැබවින්ම එය ඉතා සරල රටාවක් අනුගමනය කරයි. කළු යතුරු සැමවිටම කාණ්ඩ දෙකකට (2 Keys) සහ කාණ්ඩ තුනකට (3 Keys) බෙදී පවතී.',
        bulletPointsSi: [
          'කළු යතුරු 2 ක කාණ්ඩයේ වම්පස සිටින සුදු යතුර C ස්වරයයි.',
          'කළු යතුරු 3 ක කාණ්ඩයේ වම්පස සිටින සුදු යතුර F ස්වරයයි.',
          'C ස්වරය හමු වූ පසු සුදු යතුරු පමණක් ගණන් කරමින් D, E, F, G, A, B යන ස්වර ඉතා පහසුවෙන් සොයාගත හැක.',
        ],
        keyTerms: [
          {
            termEn: 'Keyboard Pattern',
            termSi: 'යතුරු පුවරු රටාව',
            definitionSi: 'කළු යතුරු කාණ්ඩ 2-3 රටාව මගින් ඕනෑම ස්වරයක පිහිටීම තීරණය කිරීම.',
          },
        ],
      },
      {
        id: 's-102-3',
        headingSi: 'කළු යතුරු — Sharp (#) සහ Flat (b)',
        headingEn: 'Black Keys: Sharps and Flats',
        bodySi:
          'කළු යතුරු නිශ්චිත නමක් නොමැතිව කළු පැහැයෙන් පවතින්නේ නැත. ඒවාට නම් දෙකක් ඇත. යතුරක උඩ පිහිටි කළු යතුර එම ස්වරයේ Sharp (#) එකයි. ඊට පහළ පිහිටි කළු යතුර එම ස්වරයේ Flat (b) එකයි. එනිසා C# සහ Db යනු යතුරු පුවරුවේ එකම කළු යතුරයි.',
        keyTerms: [
          {
            termEn: 'Sharp (#)',
            termSi: 'ෂාර්ප්',
            definitionSi: 'ස්වරයක් අර්ධ ස්වරයකින් (Semitone) ඉහළ නැංවීම.',
          },
          {
            termEn: 'Flat (b)',
            termSi: 'ෆ්ලැට්',
            definitionSi: 'ස්වරයක් අර්ධ ස්වරයකින් පහත් කිරීම.',
          },
          {
            termEn: 'Enharmonic Equivalent',
            termSi: 'සමාන ශබ්ද ස්වර',
            definitionSi: 'එකම සංඛ්‍යාතය ඇති නමුත් වෙනස් නම් දෙකකින් හැඳින්වෙන ස්වර (උදා: C# = Db).',
          },
        ],
        formulaOrDiagram: 'C# = Db | D# = Eb | F# = Gb | G# = Ab | A# = Bb  (E# = F සහ B# = C)',
      },
    ],
    examples: [
      {
        id: 'ex-102-1',
        titleSi: 'C කළු යතුරු කාණ්ඩය සහ බිත්තියේ රටාව',
        titleEn: 'Finding C and the Keyboard Pattern',
        descriptionSi:
          'කළු යතුරු දෙකේ කාණ්ඩය සොයා එහි වම්පස ඇති සුදු යතුර C ලෙස හඳුනාගන්න. පසුව සුදු යතුරු 8 ක් දක්වා ගණන් කරන්න. එය C ඔක්ටේව් එකකි.',
        notationOrSteps: 'C4 (යතුරු 8 ක්) → C5',
        synthPreviewNotes: [60, 62, 64, 65, 67, 69, 71, 72],
        synthType: 'melody',
      },
    ],
    exercises: [
      {
        id: 'exer-102-1',
        titleSi: 'ස්වර නාමකරණ අභ්‍යාසය',
        instructionsSi:
          'අන්තර්ක්‍රියාකාරී Virtual Piano යොදාගෙන පහත කාර්යයන් ඉටු කරන්න.',
        stepsSi: [
          'පියානෝවේ C4 ස්වරය සොයා වාදනය කරන්න.',
          'C4 සිට ඉහළට D4, E4, F4, G4, A4, B4, C5 අනුපිළිවෙලින් වාදනය කරන්න.',
          'C4, C#4, D4, D#4, E4, F4, F#4, G4, G#4, A4, A#4, B4 සියලු Chromatic ස්වර වාදනය කරන්න.',
          'C#4 සහ Db4 සමාන බව (සමාන ශබ්දය) පරීක්ෂා කරන්න.',
        ],
        linkedLabTab: 'piano',
      },
    ],
    exerciseIds: ['exer-102-1'],
    quizIds: ['quiz-102'],
    summarySi:
      'සංගීත අකුරු 7 ක් (A–G) පමණක් ඇත. කළු යතුරු Sharp (#) සහ Flat (b) ස්වර නිර්මාණය කරයි. කළු යතුරු කාණ්ඩ 2 සහ 3 රටාව භාවිතයෙන් ඕනෑම ස්වරයක් ඉතා ඉක්මනින් හඳුනාගත හැක.',
    furtherPracticeSi: [
      'ඔබේ ප්‍රියතම ගීතයක තනුව වාදනය කිරීමට උත්සාහ කරන්න.',
      'පියානෝවේ වම්පස සිට දකුණට සියලුම C ස්වර (C1...C6) සොයා වාදනය කරන්න.',
    ],
    published: true,
    order: 2,
    updatedAt: UPDATED_AT,
  },
  {
    id: 'lesson-103',
    slug: 'staff-notation-rhythm-and-time-signatures',
    courseId: 'course-level-1',
    titleSi: 'සංගීත සටහන් කියවීම (Staff, Note Values, Time Signatures සහ Rests)',
    titleEn: 'Reading Staff Notation, Note Values and Time Signatures',
    descriptionSi:
      'Treble Clef සහ Bass Clef, Staff රේඛා 5, Note Values (Whole, Half, Quarter, Eighth), Rests සහ 4/4 Time Signature පිළිබඳ සම්පූර්ණ ඉගෙනුම.',
    category: 'music-foundations',
    level: 1,
    prerequisites: ['musical-alphabet-and-piano-keyboard'],
    estimatedMinutes: 22,
    learningObjectives: [
      'Staff රේඛා 5 සහ ඒවායේ හිස්තැන් මත Treble Clef ස්වර කියවීම.',
      'Quarter, Half සහ Whole Note වල කාල අගයන් ගණනය කිරීම.',
      '4/4 සහ 3/4 Time Signatures හඳුනාගෙන Rhythm කියවීම.',
      'Crotchet, Minim, Semibreve යන ඉංග්‍රීසි සහ සිංහල සංගීත යෙදුම් සම්බන්ධ කිරීම.',
    ],
    sections: [
      {
        id: 's-103-1',
        headingSi: 'Staff සහ Clefs (රේඛා 5 සහ සංගීත යතුර)',
        headingEn: 'The Staff and Clefs',
        bodySi:
          'සංගීතය ලිවීමට යොදාගන්නා තිරස් රේඛා 5 ට Staff යැයි කියනු ලැබේ. මෙම රේඛා මත සහ අතරෙහි ස්වර සටහන් වේ. ප්‍රධාන වශයෙන් Clef දෙකක් ඇත: Treble Clef (ඉහළ ස්වර සඳහා - Flute, Violin, ගැහැණු හඬ) සහ Bass Clef (පහළ ස්වර සඳහා - Bass, Cello, පිරිමි හඬ).',
        keyTerms: [
          {
            termEn: 'Staff',
            termSi: 'සංගීත සටහන් රේඛාව',
            definitionSi: 'සංගීත සටහන් ලියන තිරස් රේඛා 5.',
          },
          {
            termEn: 'Treble Clef (G Clef)',
            termSi: 'ට්‍රෙබල් ක්ලෙෆ්',
            definitionSi: 'ඉහළ ස්වර සඳහා යොදන දෙවන රේඛාවේ G ස්වරය පිහිටන සංගීත යතුර.',
          },
          {
            termEn: 'Bass Clef (F Clef)',
            termSi: 'බේස් ක්ලෙෆ්',
            definitionSi: 'පහළ ස්වර සඳහා යොදන සිව්වන රේඛාවේ F ස්වරය පිහිටන සංගීත යතුර.',
          },
        ],
        formulaOrDiagram: 'Treble Clef Lines (පහළ සිට ඉහළට): E – G – B – D – F\nTreble Clef Spaces (පහළ සිට ඉහළට): F – A – C – E\nBass Clef Lines (පහළ සිට ඉහළට): G – B – D – F – A\nBass Clef Spaces (පහළ සිට ඉහළට): A – C – E – G',
      },
      {
        id: 's-103-2',
        headingSi: 'Note Values සහ Rests (කාල අගයන් සහ නිහඬතා)',
        headingEn: 'Note Values and Rests',
        bodySi:
          'සෑම සංගීත සටහනකටම නිශ්චිත කාල අගයක් ඇත. සම්පූර්ණ සටහනක් (Semibreve / Whole Note) බාර් එකක් පුරා විහිදේ. Rests යනු නිශ්චිත කාලයක් සංගීතය නිහඬව තබන සංකේතයි. නිහඬතාවද සංගීතයේ වැදගත් කොටසකි.',
        bulletPointsSi: [
          'Whole Note (Semibreve) = Beat 4 ක් — \u25CB',
          'Half Note (Minim) = Beat 2 ක් — \u2669',
          'Quarter Note (Crotchet) = Beat 1 ක් — ♩',
          'Eighth Note (Quaver) = Beat ½ ක් — ♪',
          'Sixteenth Note (Semiquaver) = Beat ¼ ක්',
        ],
        keyTerms: [
          {
            termEn: 'Whole Note / Semibreve',
            termSi: 'සම්පූර්ණ සටහන',
            definitionSi: '4/4 Time එකේ Beat 4 ක් පවතින දිගම මූලික සටහන.',
          },
          {
            termEn: 'Quarter Note / Crotchet',
            termSi: 'Quarter සටහන',
            definitionSi: '4/4 Time එකේ Beat 1 ක් පවතින මූලික තාල සටහන.',
          },
          {
            termEn: 'Rest',
            termSi: 'නිහඬතා සංකේතය',
            definitionSi: 'නිශ්චිත කාලයක් සංගීතය නිහඬව තබන සංකේතය.',
          },
        ],
      },
      {
        id: 's-103-3',
        headingSi: 'Time Signatures (4/4 සහ 3/4)',
        headingEn: 'Understanding Time Signatures',
        bodySi:
          'Time Signature එකක් ඉහළ අංකයෙන් බාර් එකකට ඇති Beat ගණන ද, පහළ අංකයෙන් කුමන Note Value එකක් Beat එකක් ලෙස ගණන් ගන්නේද යන්නද දක්වයි. 4/4 යනු බාර් එකකට Quarter Note 4 ක් ඇති ලෝකයේ වඩාත් බහුල Time Signature එකයි. 3/4 යනු Waltz රිද්මයයි.',
        keyTerms: [
          {
            termEn: 'Time Signature',
            termSi: 'කාල මානය',
            definitionSi: 'බාර් එකකට ඇති Beat ගණන සහ Beat එකේ අගය දක්වන සංඛ්‍යා දෙකක සංකේතය.',
          },
          {
            termEn: 'Bar / Measure',
            termSi: 'සංගීත බාර්',
            definitionSi: 'නිශ්චිත Beat ගණනක් එකතු වන කොටස (Vertical Line වලින් වෙන් කරයි).',
          },
        ],
        formulaOrDiagram: '4/4 = බාර් එකකට ♩ x 4  (වඩාත් බහුලයි)\n3/4 = බාර් එකකට ♩ x 3  (Waltz)\n2/4 = බාර් එකකට ♩ x 2  (March)',
      },
    ],
    examples: [
      {
        id: 'ex-103-1',
        titleSi: '4/4 රිද්ම රටාවක් ගණන් කිරීම',
        titleEn: 'Counting a 4/4 Rhythm Pattern',
        descriptionSi:
          'පහත රටාව 1 - 2 - 3 - 4 ලෙස ගණන් කරමින් අත්පුඩි ගසන්න. 4 ට පසු නැවත 1 ට එන්න.',
        notationOrSteps: 'Beat 1: ♩ (C4) | Beat 2: ♩ (E4) | Beat 3: ♩ (G4) | Beat 4: ♩ (E4)',
        synthPreviewNotes: [60, 64, 67, 64],
        synthType: 'melody',
      },
    ],
    exercises: [
      {
        id: 'exer-103-1',
        titleSi: 'Metronome සමඟ Rhythm කියවීම',
        instructionsSi:
          'Literature Lab එකේ Metronome එක 80 BPM සහ 4/4 ලෙස සකසා පහත Rhythm වාදනය කරන්න.',
        stepsSi: [
          'Metronome එක BPM 80 ට සකසන්න.',
          '4/4 Time Signature එක තෝරන්න.',
          'Virtual Piano හි C4 භාවිතයෙන් සෑම Beat එකකට වරක් වාදනය කරන්න (Quarter Notes 4).',
          'Beat 1 සහ 3 ට පමණක් වාදනය කර Half Notes රිද්මය පුහුණු වන්න.',
          'අවසානයේ Beat 1 ට පමණක් වාදනය කර Whole Notes පුහුණු වන්න.',
        ],
        linkedLabTab: 'metronome',
      },
    ],
    exerciseIds: ['exer-103-1'],
    quizIds: ['quiz-103'],
    summarySi:
      'Staff රේඛා 5 මත ස්වර සටහන් වේ. Treble Clef ඉහළ ස්වර සඳහාද Bass Clef පහළ ස්වර සඳහාද යොදා ගනී. Note Values මගින් කාලය මනින අතර Time Signature මගින් බාර් එකකට ඇති Beat ගණන තීරණය කරයි.',
    furtherPracticeSi: [
      'Bass Clef ස්වර (G2 සිට A3 දක්වා) Virtual Piano මත වාදනය කර ඔබේ කියවීමේ වේගය වැඩි කරගන්න.',
      'C4 සිට C5 දක්වා Treble Clef Scale එකක් අත්පුඩි ගසමින් කියවන්න.',
    ],
    published: true,
    order: 3,
    updatedAt: UPDATED_AT,
  },
];
