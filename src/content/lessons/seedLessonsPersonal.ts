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
  {
    id: 'lesson-104',
    slug: 'piano-posture-fingering-and-octave-navigation',
    courseId: 'course-level-1',
    titleSi: 'පියානෝ වාදන ඉරියව්, ඇඟිලි අංකනය (1–5 Fingering) සහ ඔක්ටේව් හැසිරවීම',
    titleEn: 'Piano Posture, 1–5 Fingering and Octave Navigation',
    descriptionSi:
      'නිවැරදි පියානෝ වාදන ඉරියව්, දකුණු සහ වම් අත් සඳහා සම්මත 1–5 ඇඟිලි අංකනය (Fingering), Thumb Under ක්‍රමවේදය, Enharmonic Notes සහ ඔක්ටේව් පරාස අතර සුමටව ගමන් කිරීම.',
    category: 'music-foundations',
    level: 1,
    prerequisites: ['staff-notation-rhythm-and-time-signatures'],
    estimatedMinutes: 22,
    learningObjectives: [
      'දකුණු සහ වම් අත් දෙකෙහිම 1 සිට 5 දක්වා සම්මත ඇඟිලි අංකනය (Finger Numbers) නිවැරදිව හඳුනා ගැනීම.',
      'Thumb Under සහ Finger Over ක්‍රමවේද භාවිතයෙන් C Major පංච-ස්වර සහ සම්පූර්ණ ඔක්ටේව් මාලාව වාදනය කිරීම.',
      'Enharmonic ස්වර (උදා: C# = Db, F# = Gb) යතුරු පුවරුව මත ක්ෂණිකව සොයා ගැනීම.',
      'Virtual Piano සහ DAW Piano Roll අතර සම්බන්ධතාව තේරුම් ගැනීම.',
    ],
    sections: [
      {
        id: 's-104-1',
        headingSi: 'සම්මත ඇඟිලි අංකනය (1–5 Piano Fingering)',
        headingEn: 'Standard 1–5 Piano Fingering',
        bodySi:
          'පියානෝ වාදනයේදී අත් දෙකෙහිම ඇඟිලි සඳහා ජාත්‍යන්තරව එකම අංක 1 සිට 5 දක්වා භාවිතා වේ. මහපට ඇඟිල්ල (Thumb) සැමවිටම 1 වන අතර, දබර ඇඟිල්ල 2, මැද ඇඟිල්ල 3, වෙද ඇඟිල්ල 4 සහ සුළැඟිල්ල (Pinky) 5 ලෙස අංකනය කෙරේ. මෙම අංක Sheet Music වල ස්වරවලට ඉහළින් හෝ පහළින් කුඩා ඉලක්කම් ලෙස දැක්වේ.',
        keyTerms: [
          { termEn: 'Fingering (1–5)', termSi: 'ඇඟිලි අංකනය', definitionSi: 'මහපට ඇඟිල්ලේ (1) සිට සුළැඟිල්ල (5) දක්වා සම්මත අංක කිරීම.' },
          { termEn: 'Thumb Under', termSi: 'මහපට ඇඟිල්ල යටින් ගෙන යාම', definitionSi: 'ස්වර 5 කට වඩා වැඩි මාලාවක් සුමටව වාදනය කිරීමට 3 වන ඇඟිල්ල යටින් 1 වන ඇඟිල්ල ගෙන යාම.' },
        ],
        formulaOrDiagram:
          'ඇඟිලි අංකනය (අත් දෙකටම පොදුයි):\n\n1 = මහපට ඇඟිල්ල (Thumb)\n2 = දබර ඇඟිල්ල (Index)\n3 = මැද ඇඟිල්ල (Middle)\n4 = වෙද ඇඟිල්ල (Ring)\n5 = සුළැඟිල්ල (Little / Pinky)\n\nC Major Scale (දකුණු අත ඉහළට):  C(1) - D(2) - E(3) - F(1) - G(2) - A(3) - B(4) - C(5)',
      },
      {
        id: 's-104-2',
        headingSi: 'Enharmonic Notes සහ ඔක්ටේව් අංකනය (C0–C8)',
        headingEn: 'Enharmonic Equivalents and Scientific Pitch Notation',
        bodySi:
          'පියානෝවේ එකම කළු යතුරකට නම් දෙකක් තිබිය හැක. C ට අර්ධ ස්වරයක් ඉහළින් ඇති යතුර C# (C Sharp) ලෙසත්, D ට අර්ධ ස්වරයක් පහළින් ඇති නිසා Db (D Flat) ලෙසත් හැඳින්වේ. ශබ්දය (Frequency) එකම වුවද, ගීතයේ Key Signature එක අනුව නිවැරදි නම තෝරා ගැනේ. එසේම Middle C ස්වරය Scientific Pitch Notation අනුව C4 (261.63 Hz) ලෙස හැඳින්වේ.',
        keyTerms: [
          { termEn: 'Enharmonic Equivalent', termSi: 'සම-ශබ්ද ස්වර', definitionSi: 'එකම සංඛ්‍යාතය ඇති නමුත් සංගීත න්‍යාය අනුව නම් දෙකකින් ලියන ස්වර (උදා: F# සහ Gb).' },
          { termEn: 'Scientific Pitch Notation', termSi: 'විද්‍යාත්මක ස්වර අංකනය', definitionSi: 'ස්වර නාමය සමඟ ඔක්ටේව් අංකය දැක්වීම (උදා: A4 = 440 Hz, C4 = Middle C).' },
        ],
      },
    ],
    examples: [
      {
        id: 'ex-104-1',
        titleSi: 'C4 සිට C5 දක්වා සම්පූර්ණ ඔක්ටේව් මාලාව',
        titleEn: 'Full Octave Scale C4 to C5',
        descriptionSi: '1-2-3-1-2-3-4-5 ඇඟිලි රටාව අනුව C4 සිට C5 දක්වා ස්වර 8 අසන්න.',
        notationOrSteps: 'C4(1) → D4(2) → E4(3) → F4(1) → G4(2) → A4(3) → B4(4) → C5(5)',
        synthPreviewNotes: [60, 62, 64, 65, 67, 69, 71, 72],
        synthType: 'melody',
      },
    ],
    exercises: [
      {
        id: 'exer-104-1',
        titleSi: 'Virtual Piano මත ඔක්ටේව් සහ Enharmonic පුහුණුව',
        instructionsSi: 'Virtual Piano Lab විවෘත කර පහත පියවර අනුගමනය කරන්න.',
        stepsSi: [
          'ආරම්භක ඔක්ටේව් C3 සහ C4 ලෙස මාරු කරමින් C4 (Middle C) හඳුනා ගන්න.',
          'C#4 / Db4 සහ F#4 / Gb4 යතුරු වාදනය කර ඒවායේ ශබ්දයට සවන් දෙන්න.',
          'C4 සිට G4 දක්වා පංච-ස්වර රටාව (C-D-E-F-G-F-E-D-C) සමාන වේගයකින් වාදනය කරන්න.',
        ],
        linkedLabTab: 'piano',
      },
    ],
    exerciseIds: ['exer-104-1'],
    quizIds: ['quiz-104'],
    summarySi:
      'පියානෝ ඇඟිලි අංකනයේදී මහපට ඇඟිල්ල 1 වන අතර සුළැඟිල්ල 5 වේ. Thumb Under ක්‍රමයෙන් සම්පූර්ණ ඔක්ටේව් මාලාවක් සුමටව වාදනය කළ හැක. එකම ශබ්දයට නම් දෙකක් තිබීම Enharmonic ලෙස හැඳින්වේ.',
    furtherPracticeSi: [
      'දකුණු අතෙන් C Major ඔක්ටේව් මාලාව ඉහළට සහ පහළට (5-4-3-2-1-3-2-1) පුහුණු වන්න.',
    ],
    published: true,
    order: 4,
    updatedAt: UPDATED_AT,
  },
  {
    id: 'lesson-204',
    slug: 'modes-of-the-major-scale-and-ear-training',
    courseId: 'course-level-2',
    titleSi: 'මේජර් ස්වර මාලාවේ Modes 7 (Ionian සිට Locrian දක්වා) සහ කන් පුහුණුව',
    titleEn: 'The Seven Modes of the Major Scale and Ear Training',
    descriptionSi:
      'Ionian, Dorian, Phrygian, Lydian, Mixolydian, Aeolian සහ Locrian යන Modes 7 හි සූත්‍ර, ඒවායේ ලාක්ෂණික ස්වර (Characteristic Notes) සහ ශ්‍රවණයෙන් හඳුනා ගැනීම.',
    category: 'music-theory',
    level: 2,
    prerequisites: ['diatonic-harmony-roman-numerals-and-circle-of-fifths'],
    estimatedMinutes: 26,
    learningObjectives: [
      'Major Scale එකේ ස්වර 7 මත ගොඩනැගෙන Modes 7 නිවැරදි පිළිවෙලින් නම් කිරීම.',
      'Major-type Modes (Ionian, Lydian, Mixolydian) සහ Minor-type Modes (Dorian, Phrygian, Aeolian) වෙන් කර හඳුනා ගැනීම.',
      'Dorian (#6 / natural 6) සහ Lydian (#4) වැනි ලාක්ෂණික ස්වර ශ්‍රවණයෙන් හඳුනා ගැනීම.',
    ],
    sections: [
      {
        id: 's-204-1',
        headingSi: 'Modes 7 යනු කුමක්ද?',
        headingEn: 'Understanding the Seven Diatonic Modes',
        bodySi:
          'C Major ස්වර මාලාවේ (C D E F G A B) සෑම ස්වරයක්ම ආරම්භක මධ්‍යස්ථානය (Tonal Center) ලෙස ගත් විට එකිනෙකට වෙනස් චිත්තවේගීය වර්ණ 7 ක් ලැබේ. මේවා Modes 7 ලෙස හැඳින්වේ. නවීන සිනමා සංගීතය, Jazz, Rock සහ Fusion නිර්මාණවල මෙම Modes ඉතා පුළුල්ව භාවිතා වේ.',
        keyTerms: [
          { termEn: 'Dorian Mode', termSi: 'ඩෝරියන් මෝඩය', definitionSi: '2 වන ස්වරයෙන් ඇරඹෙන Minor මෝඩය (1 - 2 - b3 - 4 - 5 - 6 - b7). Natural 6th ස්වරය නිසා දීප්තිමත් Minor හැඟීමක් දෙයි.' },
          { termEn: 'Lydian Mode', termSi: 'ලිඩියන් මෝඩය', definitionSi: '4 වන ස්වරයෙන් ඇරඹෙන Major මෝඩය (1 - 2 - 3 - #4 - 5 - 6 - 7). #4 ස්වරය සිහිනමය/සිනමාත්මක හැඟීමක් ලබා දෙයි.' },
          { termEn: 'Mixolydian Mode', termSi: 'මික්සොලිඩියන් මෝඩය', definitionSi: '5 වන ස්වරයෙන් ඇරඹෙන Major මෝඩය (1 - 2 - 3 - 4 - 5 - 6 - b7). Rock, Blues සහ ජන සංගීතයේ බහුලයි.' },
        ],
        formulaOrDiagram:
          'Modes 7 හි සූත්‍ර (Parallel සංසන්දනය):\n\n1. Ionian (Major)   : 1  2  3   4   5  6   7\n2. Dorian           : 1  2  b3  4   5  6   b7  (ලාක්ෂණික ස්වරය: Natural 6)\n3. Phrygian         : 1  b2 b3  4   5  b6  b7  (ලාක්ෂණික ස්වරය: b2)\n4. Lydian           : 1  2  3   #4  5  6   7   (ලාක්ෂණික ස්වරය: #4)\n5. Mixolydian       : 1  2  3   4   5  6   b7  (ලාක්ෂණික ස්වරය: b7)\n6. Aeolian (Minor)  : 1  2  b3  4   5  b6  b7\n7. Locrian          : 1  b2 b3  4   b5 b6  b7  (ලාක්ෂණික ස්වරය: b5)',
      },
    ],
    examples: [
      {
        id: 'ex-204-1',
        titleSi: 'D Dorian ස්වර මාලාව (D E F G A B C D)',
        titleEn: 'D Dorian Scale Preview',
        descriptionSi: 'Natural Minor එකට වඩා B (Natural 6th) ස්වරය නිසා ලැබෙන විශේෂ වර්ණයට සවන් දෙන්න.',
        notationOrSteps: 'D4 → E4 → F4 → G4 → A4 → B4 (Natural 6) → C5 → D5',
        synthPreviewNotes: [62, 64, 65, 67, 69, 71, 72, 74],
        synthType: 'melody',
      },
    ],
    exercises: [
      {
        id: 'exer-204-1',
        titleSi: 'Scale Explorer සහ Ear Training මගින් Modes පරීක්ෂාව',
        instructionsSi: 'Scale Explorer තුළ Dorian, Lydian සහ Mixolydian තෝරා ශබ්ද සංසන්දනය කරන්න.',
        stepsSi: [
          'Scale Explorer හි Root = C ලෙස තබා C Major (Ionian) සහ C Mixolydian අසන්න.',
          'C Natural Minor (Aeolian) සහ C Dorian අතර 6 වන ස්වරයේ වෙනස හඳුනා ගන්න.',
          'Ear Training Lab වෙත ගොස් Interval සහ Scale ශ්‍රවණ අභ්‍යාස 5 ක් සම්පූර්ණ කරන්න.',
        ],
        linkedLabTab: 'scales',
      },
    ],
    exerciseIds: ['exer-204-1'],
    quizIds: ['quiz-204'],
    summarySi:
      'Major Scale එකේ ස්වර 7 ඇසුරින් Ionian, Dorian, Phrygian, Lydian, Mixolydian, Aeolian සහ Locrian යන Modes 7 ගොඩනැගේ. එක් එක් Mode එකේ ලාක්ෂණික ස්වරය (උදා: Lydian හි #4, Dorian හි Natural 6) එහි අනන්‍ය හැඟීම තීරණය කරයි.',
    furtherPracticeSi: [
      'C Lydian (C D E F# G A B) ස්වර මාලාව භාවිතයෙන් කෙටි සිනමාත්මක තනුවක් නිර්මාණය කරන්න.',
    ],
    published: true,
    order: 4,
    updatedAt: UPDATED_AT,
  },
  {
    id: 'lesson-703',
    slug: 'vocal-and-drum-bus-mixing-parallel-compression',
    courseId: 'course-level-7',
    titleSi: 'Vocal සහ Drum Bus මිශ්‍රණය, De-essing සහ Parallel Compression',
    titleEn: 'Vocal & Drum Bus Mixing, De-essing and Parallel Compression',
    descriptionSi:
      'ප්‍රධාන ගායනය (Lead Vocal) පැහැදිලිව ඉදිරියට ගැනීම, Sibilance (4–9 kHz) පාලනයට De-esser භාවිතය, Serial Compression සහ Drums සඳහා Parallel (New York) Compression ක්‍රමවේදය.',
    category: 'mixing',
    level: 7,
    prerequisites: ['compression-reverb-and-stereo-imaging'],
    estimatedMinutes: 28,
    learningObjectives: [
      'Vocal Signal Chain එකක (HPF → Subtractive EQ → Compressor → De-esser → Send Effects) තාර්කික අනුපිළිවෙල පැහැදිලි කිරීම.',
      'Sibilance ("ස්", "ෂ්" ශබ්ද) 4 kHz – 9 kHz පරාසයේදී De-esser මගින් පාලනය කිරීම.',
      'Drum Bus එකක Transients විනාශ නොකර බලය වැඩි කිරීමට Parallel Compression යොදා ගැනීම.',
    ],
    sections: [
      {
        id: 's-703-1',
        headingSi: 'Lead Vocal Signal Chain සහ De-essing',
        headingEn: 'Lead Vocal Signal Chain and Sibilance Control',
        bodySi:
          'ගීතයක වඩාත්ම වැදගත් අංගය බොහෝ විට ප්‍රධාන ගායනයයි (Lead Vocal). පළමුව High-Pass Filter (80–100 Hz) මගින් අනවශ්‍ය ගැඹුරු ඝෝෂාව ඉවත් කරන්න. ඉන්පසු අනවශ්‍ය අනුනාද (Resonances) Subtractive EQ මගින් අඩු කර, Compressor මගින් Dynamic Range සමතුලිත කරන්න. "S" සහ "Sh" වැනි තියුණු Sibilance ශබ්ද බොහෝ විට 5 kHz සිට 8 kHz අතර පවතින අතර, De-esser එකක් මගින් එම සංඛ්‍යාතය පමණක් වැඩි වන මොහොතේදී 3–6 dB පමණ මෘදුව පාලනය කළ හැක.',
        keyTerms: [
          { termEn: 'Sibilance', termSi: 'තියුණු සිසිල් ශබ්ද (S/Sh)', definitionSi: 'ගායනයේදී 4 kHz – 9 kHz අතර ප්‍රබලව ඇසෙන තියුණු "ස්/ෂ්" ශබ්ද.' },
          { termEn: 'De-esser', termSi: 'ඩී-එසර්', definitionSi: 'Sibilance සංඛ්‍යාත පරාසයට පමණක් ක්‍රියාත්මක වන Frequency-dependent Compressor එකක්.' },
          { termEn: 'Parallel Compression', termSi: 'සමාන්තර සම්පීඩනය', definitionSi: 'සම්පීඩනය නොකළ මුල් සංඥාව (Dry) සමඟ දැඩි ලෙස සම්පීඩනය කළ සංඥාවක් (Wet) මිශ්‍ර කිරීම.' },
        ],
        formulaOrDiagram:
          'Vocal Chain ආදර්ශ පිළිවෙල:\n\nMic Input → Clip Gain → HPF (80–100 Hz) → Subtractive EQ → Compressor (3–5 dB GR) → De-esser (5–8 kHz) → Reverb/Delay Sends\n\nParallel Drum Compression:\nDrum Bus (Dry Transients) ──┬──► Mix Bus\n                            └──► Aux Send → Heavy Compressor (8:1, Fast Attack) ──▲ (Blend -12 dB)',
      },
    ],
    examples: [
      {
        id: 'ex-703-1',
        titleSi: 'Serial සහ Parallel Compression සංසන්දනය',
        titleEn: 'Serial vs Parallel Compression',
        descriptionSi: 'ප්‍රබල Peaks පාලනයට වේගවත් Compressor එකක් සහ සමස්ත මට්ටම සුමට කිරීමට දෙවන Compressor එකක් යෙදීම.',
        notationOrSteps:
          '1. 1st Compressor (Peak Catcher) : Ratio 4:1, Fast Attack (3 ms), Fast Release → 2–3 dB Gain Reduction\n2. 2nd Compressor (Leveller)     : Ratio 2:1, Medium Attack (20 ms), Auto Release → 2 dB Gain Reduction',
      },
    ],
    exercises: [
      {
        id: 'exer-703-1',
        titleSi: 'EQ Lab තුළ Vocal Sibilance සහ Air පරාස පරීක්ෂාව',
        instructionsSi: 'Parametric EQ Lab විවෘත කර ඉහළ මැද සංඛ්‍යාත පරාසයට සවන් දෙන්න.',
        stepsSi: [
          'High Band හෝ Mid Band භාවිතයෙන් 5 kHz – 7 kHz පරාසය +6 dB කින් වැඩි කර තියුණු බව හඳුනා ගන්න.',
          'එම පරාසය -3 dB කින් අඩු කර ශබ්දය මෘදු වන ආකාරය නිරීක්ෂණය කරන්න.',
        ],
        linkedLabTab: 'eq',
      },
    ],
    exerciseIds: ['exer-703-1'],
    quizIds: ['quiz-703'],
    summarySi:
      'Lead Vocal මිශ්‍රණයේදී HPF, Subtractive EQ, Compression සහ De-essing නිසි අනුපිළිවෙලට යෙදීමෙන් පැහැදිලි හඬක් ලැබේ. Parallel Compression මගින් මුල් Transients ආරක්ෂා කරමින්ම ශබ්දයේ ඝනත්වය (Density) වැඩි කළ හැක.',
    furtherPracticeSi: [
      'ඔබේ DAW එකේ Drum Bus එකට Aux Track එකක් හරහා Parallel Compressor එකක් යොදා Dry/Wet සමබරතාව පරීක්ෂා කරන්න.',
    ],
    published: true,
    order: 3,
    updatedAt: UPDATED_AT,
  },
];
