import { Lesson } from '../../types/content';

const UPDATED_AT = '2026-10-12T00:00:00.000Z';

/**
 * Remaining lessons: Level 8 delivery/metadata and Level 9 advanced harmony.
 */
export const SEED_LESSONS_COMPLETION: Lesson[] = [
  {
    id: 'lesson-802',
    slug: 'mastering-delivery-formats-metadata-and-archiving',
    courseId: 'course-level-8',
    titleSi: 'Mastering බෙදාහැරීම — ගොනු ආකෘති, Metadata සහ සුරැකීම',
    titleEn: 'Mastering Delivery: Formats, Metadata and Archiving',
    descriptionSi:
      'WAV, FLAC සහ AAC ආකෘති, Streaming සහ CD සඳහා සකස් කිරීම, Integrated LUFS ඉලක්ක, Metadata (ISRC, නම්), ගීත අනුපිළිවෙල (Sequencing) සහ දිගු කාලීන සුරැකීම.',
    category: 'mastering',
    level: 8,
    prerequisites: ['mastering-fundamentals-loudness-and-true-peak'],
    estimatedMinutes: 24,
    learningObjectives: [
      'WAV, FLAC සහ AAC ආකෘති අතර වෙනස හඳුනාගෙන සුදුසු එකක් තෝරා ගැනීම.',
      'බෙදාහැරීමේ වේදිකාව අනුව ගොනුව සකස් කරන ආකාරය පැහැදිලි කිරීම.',
      'Metadata සහ ISRC කේතයන්හි වැදගත්කම විස්තර කිරීම.',
      'ඇල්බමයක ගීත අනුපිළිවෙල (Sequencing) සකස් කිරීමේ මූලධර්ම දැන ගැනීම.',
      'දිගු කාලීනව සුරැකිය හැකි ගොනු ව්‍යුහයක් ගොඩනැගීම.',
    ],
    sections: [
      {
        id: 's-802-1',
        headingSi: 'ගොනු ආකෘති — WAV, FLAC සහ AAC',
        headingEn: 'Audio File Formats: WAV, FLAC and AAC',
        bodySi:
          'WAV — සම්පූර්ණයෙන්ම සම්පීඩනය නොකළ (Uncompressed) ශබ්දය. විශාලත්ය. නමුත් Mastering සහ සුරැකීම සඳහා මෙය සම්මතයයි. FLAC — සම්පූර්ණයෙන්ම නොවෙනස්ව (Lossless) සම්පීඩනය කරන ලද ගොනුවකි. WAV එකේ 50–60% ක ප්‍රමාණයක් වන අතර ශබ්දයේ ගුණාත්මක බව නොඅඩුය. AAC / MP3 — යම් ප්‍රමාණයක් ඉවත් කරන (Lossy) සම්පීඩනයකි. ප්‍රමාණය ඉතා කුඩායි. බෙදාහැරීමට සුදුසුයි. සුරැකීමට නුසුදුසුයි.',
        keyTerms: [
          { termEn: 'WAV (Uncompressed)', termSi: 'නොසම්පීඩිත ආකෘතිය', definitionSi: 'සියලු ශබ්ද තොරතුරු සුරකින විශාල ගොනු ආකෘතිය. Mastering සඳහා සම්මතයයි.' },
          { termEn: 'FLAC (Lossless)', termSi: 'නොවෙනස්ව සම්පීඩිත ආකෘතිය', definitionSi: 'ශබ්දය නොවෙනස්ව සම්පීඩනය කරන ලද, WAV එකට වඩා කුඩා ආකෘතිය.' },
          { termEn: 'AAC / MP3 (Lossy)', termSi: 'තොරතුරු ඉවත් කරන ආකෘතිය', definitionSi: 'ශබ්දයේ යම් කොටස් ඉවත් කර ප්‍රමාණය අඩු කරන ආකෘතිය.' },
          { termEn: 'Bitrate', termSi: 'දත්ත වේගය', definitionSi: 'තත්පරයකට ගොනුවේ ඇති දත්ත ප්‍රමාණය (kbps).' },
        ],
        formulaOrDiagram:
          'විනාඩි 4 ක ගීතයක්, 44.1 kHz / 16-bit Stereo:\n\nWAV   (Uncompressed) : ~40 MB\nFLAC  (Lossless, 5)  : ~22–26 MB\nAAC   (256 kbps)     : ~7.5 MB\n\n→ Mastering සඳහා  : 48 kHz / 24-bit WAV\n→ සුරැකීමට       : 48 kHz / 24-bit FLAC\n→ බෙදාහැරීමට    : ඉලක්ක ප්ලැට්ෆෝමයේ සම්මතය',
      },
      {
        id: 's-802-2',
        headingSi: 'LUFS ඉලක්ක සහ බෙදාහැරීමේ සම්මත',
        headingEn: 'Loudness Targets and Delivery Standards',
        bodySi:
          'විවිධ Streaming වේදිකා විවිධ Loudness සම්මත භාවිතා කරයි. එහෙයින් එකම ඉලක්කයක් සියලු වේදිකා සඳහා සුදුසු නොවේ. වඩාත් ආරක්ෂිත ක්‍රමවේදය නම් ඔබේ ගීතයට කිසිදු වේදිකාවක Loudness Normalization එකක් යෙදෙන විට එය අඩුවෙන් වෙනස් වන ලෙස අවම වශයෙන් Loudness මට්ටමක් භාවිතා කිරීමයි. බොහෝ විට −14 සිට −10 LUFS දක්වා ප්‍රායෝගික ප්‍රාස්තාවක් වන නමුත් එය ඔබේ සංගීතයේ ස්වභාවයට ගැළපිය යුතුය.',
        keyTerms: [
          { termEn: 'Loudness Normalisation', termSi: 'ප්‍රබලතා සමාන කිරීම', definitionSi: 'සියලු ගීත එකම ප්‍රබලතා මට්ටමකට ගෙන ඒමේ වේදිකා මගින් සිදු කරන ක්‍රියාවලිය.' },
          { termEn: 'Codec', termSi: 'සංකේතකය', definitionSi: 'ශබ්දය සම්පීඩනය කරන හෝ විවෘත කරන මෘදුකාංග ඇල්ගොරිතමය.' },
          { termEn: 'Transcoding', termSi: 'යළි සංකේතනය', definitionSi: 'එක් ආකෘතියක සිට තවත් එකකට පරිවර්තනය කිරීම (Lossy ගොනු සුරැකීමට නුසුදුසුයි).' },
        ],
        formulaOrDiagram:
          'Master Output සැකසුම් මූලධර්ම:\n\nSample Rate      : 44,100 Hz හෝ 48,000 Hz (ඔබේ ඉලක්කය අනුව)\nBit Depth        : 24-bit Master · 16-bit Delivery\nTrue Peak        : −1.0 dBTP ට අඩු (සුරක්ෂිත අගයක් ලෙස නිර්දේශිත)\nIntegrated LUFS  : ඔබේ සංගීතයට ගැළපෙන අගයක් තෝරන්න\nDithering        : 16-bit වෙත පමණක්, අවසන් පියවර ලෙස එක් වරක්',
      },
      {
        id: 's-802-3',
        headingSi: 'Metadata සහ ISRC',
        headingEn: 'Metadata and ISRC Codes',
        bodySi:
          'Metadata යනු ගොනුව තුළම ගබඩා වන තොරතුරුයි. ගීතයේ නම, කලාකරු, ඇල්බමය, වර්ෂය, කලා නිර්මාණය සහ ISRC කේතය මෙයට අයත් වේ. ISRC (International Standard Recording Code) යනු එක් එක් පටිගත කිරීමට ලබා දෙන අනන්‍ය හැඳුනුම් කේතයයි. එය රට (2 අකුරු), නිකුත් කරන්නා (3 අකුරු), වර්ෂය (2 අංක) සහ අනන්‍ය අංකය (5 අංක) ලෙස සමන්විතයි. නිවැරදි Metadata නොමැති නම් ඔබේ ගීතය සඳහා ලැබෙන ගාස්තු ඔබට නොලැබී යා හැක.',
        keyTerms: [
          { termEn: 'Metadata', termSi: 'ගොනු තොරතුරු', definitionSi: 'ගොනුව තුළම ගබඩා වන නම, කලාකරු, ඇල්බමය වැනි තොරතුරු.' },
          { termEn: 'ISRC', termSi: 'ජාත්‍යන්තර පටිගත කේතය', definitionSi: 'සෑම පටිගත කිරීමකටම ලබා දෙන අනන්‍ය වන දොළොස් අකුරු/අංක හැඳුනුම් කේතය.' },
          { termEn: 'IRSC Format', termSi: 'ISRC ආකෘතිය', definitionSi: 'CC-XXX-YY-NNNNN ලෙස රට (2), නිකුත් කරන්නා (3), වර්ෂය (2) සහ අනන්‍ය අංකය (5).' },
        ],
        formulaOrDiagram:
          'ISRC ආකෘතිය:  CC-XXX-YY-NNNNN\n\nCC    = රට කේතය (උදා: LK = ශ්‍රී ලංකාව)\nXXX   = නිකුත් කරන්නාගේ කේතය\nYY    = නිකුත් කිරීමේ වර්ෂය\nNNNNN = අනන්‍ය පටිගත අංකය\n\nඋදා: LK-ABC-26-00001',
      },
      {
        id: 's-802-4',
        headingSi: 'Track Sequencing සහ දිගු කාලීන සුරැකීම',
        headingEn: 'Track Sequencing and Long-Term Archiving',
        bodySi:
          'ඇල්බමයක් තනි ගීත එකතුවක් නොව සමස්ත කලා නිර්මාණයකි. ශක්තිමත් ගීතයකින් ආරම්භ කරන්න. එකම ශෛලියක ගීත දෙකක් එකිනෙක පසෙකින් තැබීමෙන් වළකින්න. චිත්තවේගීය ගමනක් ලෙස අනුපිළිවෙල සකස් කරන්න. අවසාන ගීතය සාමාන්‍යයෙන් සන්සුන් හෝ සම්පූර්ණ හැඟීමක් ලබා දෙන එකක් විය යුතුය. සුරැකීමේදී අවම වශයෙන් තැන් 2 කට (Local Drive + Cloud හෝ External Drive) පිටපත් තබන්න. සම්පූර්ණ DAW ව්‍යාපෘතිය, සියලු Stem, Master WAV සහ ලිඛිත සටහන් ඇතුළත් කරන්න.',
        bulletPointsSi: [
          'ශක්තිමත් ආරම්භයක් සහ තෘප්තිමත් අවසානයක් තෝරන්න.',
          'එකම ශෛලියේ ගීත දෙකක් එකවර නොතබන්න.',
          'ගීත අතර පරතරය (2–4 තත්පර) නියත වශයෙන්ම තබන්න.',
          'Mid-side, Takım සියලු ව්‍යාපෘති ගොනු සුරකින්න.',
          'Stem (දශම) ගොනු මගින් පසුව නැවත Mix කිරීමට අවශ්‍ය නම් ඉඩ තබන්න.',
          'සෑම ගොනුවකටම දිනය සහ අනුවාදය නමින් ඇතුළත් කරන්න.',
        ],
        keyTerms: [
          { termEn: 'Track Sequencing', termSi: 'ගීත අනුපිළිවෙල', definitionSi: 'ඇල්බමයක ගීත පිහිටුවන අනුපිළිවෙල සැලසුම් කිරීම.' },
          { termEn: 'Stem', termSi: 'කොටස් ගොනුව', definitionSi: 'සම්පූර්ණ Mix එකේ වෙන් වූ කොටස් (Drums, Bass, Music, Vocals) වෙන වෙනම අපනයනය කරන ලද ගොනු.' },
          { termEn: 'Archival Master', termSi: 'සුරැකුම් පිටපත', definitionSi: 'දිගු කාලීනව සුරැකීමට භාවිතා කරන උපරිම ගුණාත්මක ගොනුව (24-bit WAV/FLAC).' },
          { termEn: '3-2-1 Backup Rule', termSi: 'තුන්-දෙක-එක සුරැකුම් රීතිය', definitionSi: 'පිටපත් 3 ක්, මාධ්‍ය වර්ග 2 ක්, ඉන් 1 ක් බාහිර ස්ථානයක්.' },
        ],
      },
    ],
    examples: [
      {
        id: 'ex-802-1',
        titleSi: 'බෙදාහැරීම සඳහා ගොනු අපනයන සැලැස්මක්',
        titleEn: 'An Export Plan for Delivery',
        descriptionSi: 'එක් ගීතයක් සඳහා අවශ්‍ය ගොනු කට්ටලය පහත පරිදි සැකසිය හැක.',
        notationOrSteps:
          '1. Master 24-bit WAV (48 kHz)          — සුරැකීමට සහ සංරක්ෂණයට\n2. Master 24-bit FLAC                  — සුරැකීමට (කුඩා ප්‍රමාණය)\n3. Delivery 16-bit WAV (44.1 kHz)      — CD සහ බෙදාහැරීමට (Dither ON)\n4. Instrumental 24-bit WAV             — අවශ්‍ය නම් පමණක්\n5. Stems (Drums / Bass / Music / Vocals)— අනාගත නැවත Mix සඳහා\n6. Metadata ලේඛනය (TXT)               — ISRC, නම්, කලාකරු, වර්ෂය',
      },
    ],
    exercises: [
      {
        id: 'exer-802-1',
        titleSi: 'සුරැකුම් ව්‍යුහයක් සහ QC වාර්තාවක් සකස් කිරීම',
        instructionsSi: 'ඔබේ මිශ්‍රණය සුරැකීමට සහ නිකුත් කිරීමට පිරිසිදු ව්‍යුහයක් සකසන්න.',
        stepsSi: [
          'පහත ව්‍යුහයට Folder සාදන්න: 01_Projects, 02_Stems, 03_Masters, 04_Delivery, 05_Docs.',
          'ඔබේ DAW ව්‍යාපෘතිය 01_Projects වෙත පිටපත් කරන්න.',
          'Stem ගොනු 4 ක් 02_Stems වෙත අපනයනය කරන්න.',
          '24-bit Master එක 03_Masters වෙත සුරකින්න.',
          '16-bit Delivery ගොනුව 04_Delivery වෙත Dithering සමඟ අපනයනය කරන්න.',
          'Metadata සහ QC වාර්තාව 05_Docs වෙත TXT ලෙස ලියන්න.',
          'සම්පූර්ණ Folder එක බාහිර Drive එකකට සහ Cloud එකකට පිටපත් කරන්න.',
        ],
      },
    ],
    exerciseIds: ['exer-802-1'],
    quizIds: ['quiz-802'],
    summarySi:
      'WAV නොසම්පීඩිතයි; FLAC නොවෙනස්ව සම්පීඩිතයි; AAC තොරතුරු ඉවත් කරයි. සුරැකීමට WAV/FLAC සහ බෙදාහැරීමට Delivery ආකෘතිය භාවිතා කරන්න. නිවැරදි Metadata සහ ISRC අත්‍යවශ්‍යයි. ගීත අනුපිළිවෙල සහ දිගු කාලීන සුරැකුම් ව්‍යුහය හොඳ නිෂ්පාදකයෙකුගේ ලක්ෂණයයි.',
    furtherPracticeSi: [
      'ඔබේ ඇල්බමයක් සඳහා ගීත අනුපිළිවෙල සැලැස්මක් ලියන්න.',
      'ඔබ නැවත නිකුත් කිරීමට කැමති පැරණි ගොනුවක් සඳහා සුරැකුම් ව්‍යුහයක් සාදන්න.',
    ],
    published: true,
    order: 2,
    updatedAt: UPDATED_AT,
  },
  {
    id: 'lesson-901',
    slug: 'advanced-harmony-secondary-dominants-and-modal-interchange',
    courseId: 'course-level-9',
    titleSi: 'උසස් Harmony — Secondary Dominants, Modal Interchange සහ Extended Chords',
    titleEn: 'Advanced Harmony: Secondary Dominants, Modal Interchange and Extended Chords',
    descriptionSi:
      'Secondary Dominants (V/V, V/vi), Tritone Substitution, Modal Interchange (Borrowed Chords), 9th සහ 11th Extended Chords, Advanced Voice Leading සහ Modal Harmonic වර්ණ භාවිතය.',
    category: 'advanced-practice',
    level: 9,
    prerequisites: ['mastering-delivery-formats-metadata-and-archiving'],
    estimatedMinutes: 30,
    learningObjectives: [
      'Secondary Dominants නිර්මාණය කර ඒවා කුමන කෝඩ් එකට විසඳෙන්නේද යන්න පැහැදිලි කිරීම.',
      'Modal Interchange (Borrowed Chords) මගින් වර්ණය ලබා ගැනීම.',
      'Extended Chords (9th, 11th, 13th) සහ ඒවායේ වර්ණය තේරුම් ගැනීම.',
      'මෙම උසස් Harmonic මෙවලම් තනුවේ ප්‍රධානතම කොටස්වලට පමණක් වගකීමෙන් යොදා ගැනීම.',
    ],
    sections: [
      {
        id: 's-901-1',
        headingSi: 'Secondary Dominants — අනෙක් කෝඩ්වල Dominant',
        headingEn: 'Secondary Dominants',
        bodySi:
          'ඕනෑම Diatonic කෝඩ් එකකට එහිම Dominant එකක් තිබිය හැක. එය Secondary Dominant කියා කියයි. C Major Key එකේ Dm කෝඩ් එකට අයිති Dominant එක A7 යි (V/ii). එය Am සිට A7 ලෙස වෙනස් කිරීමෙන් Dm වෙත ප්‍රබල ඇදීමක් ලැබේ. එසේම C# dim7, Em වෙත ඇදී යයි (V/iii). මෙම ක්‍රමයෙන් Diatonic ශබ්දයට නව, ආකර්ෂණීය ගමන් මගක් එකතු වේ.',
        keyTerms: [
          { termEn: 'Secondary Dominant', termSi: 'ද්විතීයික ඩොමිනන්ට්', definitionSi: 'ප්‍රධාන Key එකේ Tonic හැර වෙනත් කෝඩ් එකකට අයත් Dominant කෝඩ් එක.' },
          { termEn: 'Applied Chord', termSi: 'යොදන ලද කෝඩ්', definitionSi: 'තාවකාලිකව වෙනත් Key එකකට අයත් ලෙස යොදන කෝඩ් එක (V/x ලෙස අංකනය වේ).' },
          { termEn: 'Chromatic Note', termSi: 'අර්ධ ස්වර අනුපිළිවෙල ස්වරය', definitionSi: 'Key එකේ නොමැති, ශබ්දය වර්ණවත් කිරීමට එකතු කරන ස්වරයක්.' },
        ],
        formulaOrDiagram:
          'C Major Key එකේ Secondary Dominants:\n\nV/ii  = A7  → Dm     (A C# E G)\nV/iii = B7  → Em     (B D# F# A)\nV/IV  = C7  → F      (C E G Bb)\nV/V   = D7  → G      (D F# A C)\nV/vi  = E7  → Am     (E G# B D)\n\nඋදා: C → E7 → Am → (F → G → C)',
      },
      {
        id: 's-901-2',
        headingSi: 'Modal Interchange සහ Borrowed Chords',
        headingEn: 'Modal Interchange and Borrowed Chords',
        bodySi:
          'Parallel Minor Key එකෙන් කෝඩ් ලබා ගැනීමට Modal Interchange කියනු ලැබේ. C Major Key එකේ සිටින නමුත් C Natural Minor එකෙන් ලබාගන්නා කෝඩ් වන Ab (bVI), Bb (bVII), Eb (bIII), Fm (iv) සහ Gm (v) යන කෝඩ් C Major ගීතයකට නාට්‍යමය, ගැඹුරු හැඟීමක් එක් කරයි. මෙය නවීන Pop, Rock සහ සිනමා සංගීතයේ ඉතා බහුලව යෙදේ.',
        keyTerms: [
          { termEn: 'Modal Interchange', termSi: 'මෝඩල් හුවමාරුව', definitionSi: 'සමාන (Parallel) තවත් මෝඩයකින් කෝඩ් ලබාගෙන භාවිතා කිරීම.' },
          { termEn: 'Borrowed Chord', termSi: 'ලබාගත් කෝඩ්', definitionSi: 'ප්‍රධාන Key එකට අයත් නොවන නමුත් වර්ණයක් ලබා දෙන කෝඩ් එක.' },
          { termEn: 'Parallel Minor', termSi: 'සමාන මයිනර්', definitionSi: 'එකම Root එක සහිත නමුත් Minor වන Key එක (උදා: C Major සඳහා C Minor).' },
        ],
        formulaOrDiagram:
          'C Major Key එකට C Minor එකෙන් ලබාගත හැකි කෝඩ්:\n\nbIII = Eb    iv  = Fm    v  = Gm\nbVI  = Ab     bVII = Bb\n\nඋදාහරණ රටාව: C → Ab → Bb → C  (සිනමාත්මක වර්ණය)\nඋදාහරණ රටාව: C → Eb → F → C   (සියුම් ගැඹුරු වර්ණය)',
      },
      {
        id: 's-901-3',
        headingSi: 'Extended Chords — 9th, 11th සහ 13th',
        headingEn: 'Extended Chords: 9ths, 11ths and 13ths',
        bodySi:
          'Seventh Chord එකකට තවත් ස්වර එකතු කිරීමෙන් Extended Chords සෑදේ. 9th (2 ස්වරයේ Octave එක), 11th (4 ස්වරයේ Octave එක) සහ 13th (6 ස්වරයේ Octave එක) මෙසේ නම් වේ. මේවා Jazz, Neo-Soul සහ නවීන Pop හි ඉතා බහුලයි. Extended Chords බොහෝ විට Voicing එලෙස (ස්වර පිහිටන ආකාරය) වැදගත් වේ. උදාහරණයක් ලෙස 9th ස්වරය ඉහළම Register එකේ පැතිරීමෙන් ඉතා මිහිරි ශබ්දයක් ලැබේ.',
        keyTerms: [
          { termEn: 'Extension', termSi: 'අතිරේක ස්වරය', definitionSi: 'Seventh Chord එකට එකතු කරන 9th, 11th හෝ 13th ස්වරය.' },
          { termEn: 'Voicing', termSi: 'ස්වර පිහිටීම', definitionSi: 'කෝඩ් එකේ ස්වර අතර ඇති පරතරය සහ පිහිටීම — මෙය ශබ්දයට වඩාත් බලපායි.' },
          { termEn: 'Tension', termSi: 'ආතති ස්වරය', definitionSi: 'කෝඩ් එකට ආතතියක් හෝ වර්ණයක් එක් කරන, පොදුවේ පිළිගැනීමට අපහසු ස්වරයක්.' },
        ],
        formulaOrDiagram:
          'Cmaj9   = C E G B D    (Root, 3rd, 5th, 7th, 9th)\nCm9     = C Eb G BbD   (1 - b3 - 5 - b7 - 9)\nFmaj9   = F A C E G\nG13     = G B D F A E  (13th = 6 වන ස්වරයේ Octave එක)\nDm11    = D F A C E G  (11th = 4 වන ස්වරයේ Octave එක)',
      },
      {
        id: 's-901-4',
        headingSi: 'උසස් මෙවලම් වගකීමෙන් යොදා ගැනීම',
        headingEn: 'Using Advanced Tools Responsibly',
        bodySi:
          'Secondary Dominants සහ Modal Interchange ඉතා ප්‍රබලයි. වගකීමෙන් යොදා නොගත් විට සංගීතය කැළඹිලි සහගත හා අස්වාභාවික බවට පත් වේ. සරල ක්‍රමය නම් මෙවලමක් යොදන්නේ ප්‍රධාන කොටස්වලට පමණක් වීමයි. එයින් ගීතයේ චිත්තවේගීය උච්චතම අවස්ථා වඩාත් ප්‍රබල වේ. එකම කොටසේ උසස් කෝඩ් බොහොමයක් එකතු කිරීමෙන් අර්ථය අහිමි වේ.',
        bulletPointsSi: [
          'Secondary Dominant එකක් Pre-Chorus එකේ අවසානයට හෝ Chorus එකට පෙර යොදන්න.',
          'Borrowed Chord එකක් Bridge එකට හෝ අවසාන Chorus එකට වෙන් කරන්න.',
          'එකම කොටසේ Extended Chords 2 කට වඩා නොයොදන්න.',
          'සෑම උසස් කෝඩ් එකකට පසුව සරල කෝඩ් එකකින් ඉඩ දෙන්න.',
          'තනුවේ Melody එකට හැමවිටම ප්‍රථම ස්ථානය දෙන්න — Harmony එයට සේවය කළ යුතුයි.',
        ],
        keyTerms: [
          { termEn: 'Harmonic Restraint', termSi: 'හාමොනික් සංයමය', definitionSi: 'උසස් මෙවලම් ප්‍රමාණවත් ලෙස පමණක් යොදා ගැනීමේ ශිල්පය.' },
          { termEn: 'Climax Point', termSi: 'උච්චතම අවස්ථාව', definitionSi: 'ගීතයේ වඩාත් ප්‍රබල හා චිත්තවේගීය අවස්ථාව — උසස් කෝඩ් යෙදීමට වඩාත් සුදුසු තැන.' },
        ],
      },
    ],
    examples: [
      {
        id: 'ex-901-1',
        titleSi: 'Secondary Dominant එකක් යොදා ගැනීම',
        titleEn: 'Applying a Secondary Dominant',
        descriptionSi:
          'සරල රටාවක් වන C → Am → F → G වෙතින් Am වෙත යන Dominant එක E7 ලෙස වෙනස් කරන්න. එවිට G# ස්වරය එක් වී මන්දගාමී වර්ණයක් ලැබේ.',
        notationOrSteps:
          'සරල    : C  → Am → F  → G → C\nඋසස්    : C  → E7 → Am → F → G → C\n\nE7 = E G# B D  (G# යනු C Major Key එකට අයත් නොවන ස්වරයකි)',
        synthPreviewNotes: [60, 64, 67, 64, 68, 71, 74, 65, 69, 72, 67, 71, 74, 60, 64, 67],
        synthType: 'chord',
      },
    ],
    exercises: [
      {
        id: 'exer-901-1',
        titleSi: 'ඔබේම උසස් කෝඩ් රටාවක් නිර්මාණය කිරීම',
        instructionsSi: 'Progressions Builder සහ Chord Explorer භාවිතයෙන් මෙම අභ්‍යාසය සිදු කරන්න.',
        stepsSi: [
          'Key: C Major ලෙස තෝරා සරල රටාවක් සාදන්න (C → Am → F → G).',
          'Am වෙත යන කෝඩ් එක E7 ලෙස වෙනස් කරන්න (V/vi).',
          'F වෙත යන කෝඩ් එක C7 ලෙස වෙනස් කරන්න (V/IV).',
          'Bridge එක සඳහා Ab (bVI) එකතු කරන්න (Modal Interchange).',
          'Cmaj9, Fmaj9 සහ G13 භාවිතයෙන් සරල කෝඩ් එකින් එක වර්ණවත් කරන්න.',
          'ඔබේ තෝරාගැනීම් සහ ඒවායේ හේතු ලිඛිතව සටහන් කරන්න.',
        ],
        linkedLabTab: 'progression',
      },
    ],
    exerciseIds: ['exer-901-1'],
    quizIds: ['quiz-901'],
    summarySi:
      'Secondary Dominants මගින් ඕනෑම කෝඩ් එකකට ප්‍රබල ඇදීමක් එක් කරයි. Modal Interchange මගින් Parallel Minor එකෙන් කෝඩ් ලබාගෙන නාට්‍යමය වර්ණයක් ලබා දෙයි. Extended Chords ශබ්දය පොහොසත් කරයි. මෙම මෙවලම් සංයමයෙන් යොදා ගැනීම උසස් සංගීත රචකයෙකුගේ ලක්ෂණයයි.',
    furtherPracticeSi: [
      'ඔබ අසන ගීතයකින් II7 (V/V) කෝඩ් එකක් හඳුනා ගැනීමට උත්සාහ කරන්න.',
      'Cmaj9, Am9 සහ Fmaj9 යොදා ගනිමින් සන්සුන් Neo-Soul රටාවක් සාදන්න.',
    ],
    published: true,
    order: 1,
    updatedAt: UPDATED_AT,
  },
];
