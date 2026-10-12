import { Lesson } from '../../types/content';

const UPDATED_AT = '2026-10-12T00:00:00.000Z';

/**
 * Levels 6–9 lessons: Audio Engineering, Mixing, Mastering, Advanced Practice.
 */
export const SEED_LESSONS_AUDIO: Lesson[] = [
  // =====================================================================================
  // LEVEL 6 — AUDIO ENGINEERING FOUNDATIONS
  // =====================================================================================
  {
    id: 'lesson-601',
    slug: 'sound-waves-frequency-and-amplitude',
    courseId: 'course-level-6',
    titleSi: 'ශබ්ද තරංග — Frequency, Wavelength, Phase සහ Amplitude',
    titleEn: 'Sound Waves: Frequency, Wavelength, Phase and Amplitude',
    descriptionSi:
      'ශබ්දය භෞතික තරංගයක් ලෙස; Frequency (Hz) සහ ප්‍රබලතාව (Amplitude); Wavelength ගණනය කිරීම (λ = c / f); Phase සහ Polarity අතර වෙනස; Harmonics මගින් Timbre තීරණය වන ආකාරය.',
    category: 'audio-engineering',
    level: 6,
    prerequisites: ['synthesizer-fundamentals-oscillators-filters-envelopes'],
    estimatedMinutes: 28,
    learningObjectives: [
      'ශබ්ද තරංගයක සංඛ්‍යාතය සහ තරංග ආයාමය අතර සම්බන්ධය ගණනය කිරීම.',
      'Phase සහ Polarity අතර ඇති වෙනස නිවැරදිව පැහැදිලි කිරීම.',
      'Amplitude මගින් ශබ්දයේ ප්‍රබලතාව තීරණය වන ආකාරය තේරුම් ගැනීම.',
      'Harmonic Series මගින් Timbre ගොඩනැගෙන ආකාරය විස්තර කිරීම.',
    ],
    sections: [
      {
        id: 's-601-1',
        headingSi: 'ශබ්දය තරංගයක් ලෙස',
        headingEn: 'Sound as a Wave',
        bodySi:
          'ශබ්දය යනු වාතයේ අණු එකිනෙක තල්ලු කර විරල කිරීමෙන් ඇතිවන පීඩන තරංගයකි (Longitudinal Pressure Wave). මෙම තරංගය තත්පරයකට ගමන් කරන දුර ප්‍රමාණය සෙල්සියස් අංශක 20 ක වායුගෝලයේදී දළ වශයෙන් 343 m/s වේ. එනම් තත්පරයකට මීටර් 343 කි.',
        keyTerms: [
          { termEn: 'Longitudinal Wave', termSi: 'දිගටි තරංගය', definitionSi: 'වාතයේ පීඩනය එකම දිශාවට වෙනස් කරමින් ගමන් කරන තරංගය.' },
          { termEn: 'Speed of Sound', termSi: 'ශබ්දයේ වේගය', definitionSi: 'සෙල්සියස් අංශක 20 ක වායුගෝලයේදී දළ වශයෙන් 343 m/s වේ.' },
        ],
      },
      {
        id: 's-601-2',
        headingSi: 'Frequency සහ Wavelength ගණනය කිරීම',
        headingEn: 'Calculating Frequency and Wavelength',
        bodySi:
          'Frequency (f) යනු තත්පරයකට තරංගයක් සම්පූර්ණ කරන වාර ගණනයි (Hz). Wavelength (λ) යනු එක් තරංග චක්‍රයක දිගයි (මීටර්). මේවා පහත සමීකරණයෙන් සම්බන්ධ වේ. සංඛ්‍යාතය ඉහළ යන විට තරංග ආයාමය අඩු වේ (විලෝම සම්බන්ධතාව - Inverse Relationship). මිනිස් කනට ඇසෙන පරාසය 20 Hz සිට 20,000 Hz දක්වා වේ. 20 Hz ට අඩු නම් Infrasound, 20 kHz ට වැඩි නම් Ultrasound.',
        keyTerms: [
          { termEn: 'Frequency (Hz)', termSi: 'සංඛ්‍යාතය', definitionSi: 'තත්පරයකට සම්පූර්ණ කරන තරංග චක්‍ර ගණන; Hertz (Hz) වලින් මනිනු ලැබේ.' },
          { termEn: 'Wavelength (λ)', termSi: 'තරංග ආයාමය', definitionSi: 'එක් තරංග චක්‍රයක දිග (මීටර් මගින්).' },
          { termEn: 'Inverse Relationship', termSi: 'විලෝම සම්බන්ධතාව', definitionSi: 'එකක් වැඩි වන විට අනෙක අඩු වන සම්බන්ධතාව (f × λ = නියතයක්).' },
        ],
        formulaOrDiagram:
          'λ = c / f      (λ = තරංග ආයාමය, c = 343 m/s, f = සංඛ්‍යාතය)\n\nඋදාහරණ:\nf = 343 Hz  →  λ = 343 / 343 = 1.0 m\nf = 1,000 Hz →  λ = 343 / 1000 = 0.343 m (343 mm)\nf = 100 Hz   →  λ = 343 / 100 = 3.43 m',
      },
      {
        id: 's-601-3',
        headingSi: 'Phase සහ Polarity — වෙනස හඳුනා ගැනීම',
        headingEn: 'Phase versus Polarity',
        bodySi:
          'මෙය නවකයන් බොහෝ විට වැරදියට වටහාගන්නා තැනකි. Polarity (අක්‍රමවත් බව) යනු තීරණයකි - Positive හෝ Negative (180° Invert). නමුත් Phase යනු කාලයට සාපේක්ෂව ඇති ලක්ෂ්‍යයයි, එය ඕනෑම අගයක් විය හැක (උදා: 90°, 45°). එකම ශබ්දය එකම කාලයේදී ශබ්ද වන දෙකක් එකට එකතු වන විට (In Phase) ප්‍රබලතාව දෙගුණයක් වේ (+6 dB). එකක් 180° කින් වෙනස් වූ විට (Out of Phase) ඒවා එකිනෙක අවලංගු කර ශබ්දය අතුරුදහන් විය හැක.',
        keyTerms: [
          { termEn: 'Phase', termSi: 'අවස්ථාව', definitionSi: 'තරංග චක්‍රයක නිශ්චිත ලක්ෂ්‍යය (අංශක 0° සිට 360° දක්වා).' },
          { termEn: 'Polarity', termSi: 'ධ්‍රැවතාව', definitionSi: 'තරංගයේ දිශාව කැරලි ගැසීම (Normal හෝ Inverted - අංශක 180°).' },
          { termEn: 'Phase Cancellation', termSi: 'අවස්ථා අවලංගු වීම', definitionSi: 'තරංග දෙකක් එකිනෙක අවලංගු කරමින් ශබ්දය දුර්වල කිරීම.' },
          { termEn: 'Comb Filtering', termSi: 'පීර Filter කිරීම', definitionSi: 'ශබ්දයක් සහ එහි ප්‍රමාදිත පිටපතක් එකතු වීමෙන් සංඛ්‍යාත කිහිපයක් ඉවත් වීම.' },
        ],
        formulaOrDiagram:
          'In Phase  (0°)   : Peak + Peak = +6 dB (ප්‍රබල වේ)\nOut of Phase (180°): Peak + Trough = සම්පූර්ණ අවලංගු වීම\nPartial Phase (90°): අර්ධ වශයෙන් අවලංගු වීම + Comb Filtering',
      },
      {
        id: 's-601-4',
        headingSi: 'Harmonics සහ Timbre',
        headingEn: 'Harmonics and Timbre',
        bodySi:
          'ඕනෑම ස්වරයක් තනි Sine තරංගයක් නොවේ. එය Fundamental Frequency (f0) සහ එහි ගුණාකාර වන Harmonics වල මිශ්‍රණයකි (2f0, 3f0, 4f0...). මෙම සංඛ්‍යාත මිශ්‍රණය අනුව එකම ස්වරය Piano එකකින් වෙනස් ලෙසද Violin එකකින් වෙනස් ලෙසද ඇසේ. එය Timbre එකයි.',
        keyTerms: [
          { termEn: 'Fundamental (f0)', termSi: 'මූලික සංඛ්‍යාතය', definitionSi: 'ශබ්දයේ පහළම සහ ප්‍රධාන සංඛ්‍යාතය (එයින් Pitch එක තීරණය වේ).' },
          { termEn: 'Harmonic Series', termSi: 'සහජ සංඛ්‍යාත මාලාව', definitionSi: 'f0, 2f0, 3f0, 4f0... ලෙස ගොඩනැගෙන ස්වාභාවික සංඛ්‍යාත මාලාව.' },
          { termEn: 'Timbre / Tone Colour', termSi: 'ස්වර වර්ණය', definitionSi: 'මූලික සංඛ්‍යාතයේ ගුණාකාර මිශ්‍රණය අනුව ඇතිවන වෙනස් ශබ්ද ස්වභාවය.' },
        ],
        formulaOrDiagram:
          'ස්වරය A2 = 110 Hz:\n2f0 = 220 Hz  3f0 = 330 Hz  4f0 = 440 Hz  5f0 = 550 Hz  6f0 = 660 Hz  ...\nප්‍රබල Harmonic 2, 3, 4 නම් ශබ්දය පොහොසත්ය; 2 වන Harmonic පමණක් ප්‍රබල නම් ශබ්දය මෘදුයි.',
      },
    ],
    examples: [
      {
        id: 'ex-601-1',
        titleSi: 'තරංග ආයාමය ගණනය කිරීම',
        titleEn: 'Calculating Wavelength Step by Step',
        descriptionSi:
          'සෙල්සියස් අංශක 20 ක වායුගෝලයේ ශබ්දයේ වේගය 343 m/s වේ. පහත සංඛ්‍යාත සඳහා තරංග ආයාමය ගණනය කරන්න.',
        notationOrSteps:
          '80 Hz (Kick)     → λ = 343 / 80  = 4.29 m\n440 Hz (A4)      → λ = 343 / 440 = 0.78 m\n1,000 Hz (Vocal) → λ = 343 / 1000 = 0.343 m\n10,000 Hz (Air)  → λ = 343 / 10000 = 0.0343 m (34.3 mm)',
      },
    ],
    exercises: [
      {
        id: 'exer-601-1',
        titleSi: 'Phase සහ Polarity පරීක්ෂණය',
        instructionsSi: 'Audio Engineering Lab හි Waveform දර්ශකය භාවිතයෙන් පහත අභ්‍යාසය සිදු කරන්න.',
        stepsSi: [
          'Test Tone එක 220 Hz (A3) ට සකසා Waveform එක නිරීක්ෂණය කරන්න.',
          'එකම සංඛ්‍යාතයේ සංඥා දෙකක් එකට එකතු කරන විට ප්‍රබලතාව +6 dB වැඩි වන බව සටහන් කරගන්න.',
          'එක් සංඥාවක් 180° කින් පෙරළූ විට (Polarity Invert) ඇතිවන අවලංගු වීම නිරීක්ෂණය කරන්න.',
          'ඔබේ DAW එකේ මයික්‍රෆෝන දෙකක් එකම දුරින් එකම මූලාශ්‍රයට තබා Comb Filtering ඇතිවන ආකාරය පරීක්ෂා කරන්න.',
        ],
        linkedLabTab: 'visualizer',
      },
    ],
    exerciseIds: ['exer-601-1'],
    quizIds: ['quiz-601'],
    summarySi:
      'ශබ්දය පීඩන තරංගයකි. Frequency සහ Wavelength විලෝමව සම්බන්ධයි (λ = c/f). Phase යනු කාල ලක්ෂ්‍යය වන අතර Polarity යනු 180° පෙරළීමයි. In Phase විට ශබ්දය ප්‍රබල වන අතර Out of Phase විට අවලංගු වේ.',
    furtherPracticeSi: [
      '5,000 Hz සංඛ්‍යාතයේ තරංග ආයාමය ගණනය කරන්න. (343/5000 = 0.0686 m = 68.6 mm)',
      'ඔබේ ස්ටීරියෝ ස්පීකර් දෙක අතර දුර මැන එය අඩක් තරංග ආයාමයක් වන සංඛ්‍යාතය සොයා ගන්න.',
    ],
    published: true,
    order: 1,
    updatedAt: UPDATED_AT,
  },
  {
    id: 'lesson-602',
    slug: 'decibels-digital-audio-and-gain-staging',
    courseId: 'course-level-6',
    titleSi: 'Decibels, ඩිජිටල් ශබ්දය සහ Gain Staging',
    titleEn: 'Decibels, Digital Audio Sampling and Gain Staging',
    descriptionSi:
      'Logarithmic Scale ලෙස Decibels; dBFS, Peak සහ RMS; Sample Rate සහ Nyquist Theorem; Bit Depth සහ Quantization Noise; Clipping සහ Headroom; නිවැරදි Gain Staging ක්‍රියාවලිය.',
    category: 'audio-engineering',
    level: 6,
    prerequisites: ['sound-waves-frequency-and-amplitude'],
    estimatedMinutes: 30,
    learningObjectives: [
      'Decibel පරිමාණය Logarithmic වීමේ වැදගත්කම පැහැදිලි කිරීම.',
      'dBFS, Peak සහ RMS අතර වෙනස හඳුනා ගැනීම.',
      'Nyquist Theorem භාවිතයෙන් ඕනෑම Sample Rate එකකට ගැළපෙන උපරිම සංඛ්‍යාතය ගණනය කිරීම.',
      'Clipping වළක්වා නිවැරදි Gain Staging පවත්වා ගැනීම.',
    ],
    sections: [
      {
        id: 's-602-1',
        headingSi: 'Decibel පරිමාණය — ඇයි Logarithmic?',
        headingEn: 'Why the Decibel Scale is Logarithmic',
        bodySi:
          'අපගේ කන ශබ්ද ප්‍රබලතාවය රේඛීයව (Linear) නොව ලඝුගණකීයව (Logarithmically) අසයි. එනම් ශබ්දය 10 ගුණයකින් වැඩි වූ විට කනට එය දෙගුණයක් ලෙස පමණක් දැනේ. එහෙයින් Linear පරිමාණයක් වෙනුවට Decibel පරිමාණය භාවිතා කරයි. එය අපගේ කනට සැබවින්ම ඇසෙන ආකාරයට වඩාත් සමීප වේ.',
        keyTerms: [
          { termEn: 'Decibel (dB)', termSi: 'ශබ්ද මට්ටම් ඒකකය', definitionSi: 'ශබ්ද ප්‍රබලතාව Logarithmic ලෙස මනින ඒකකය.' },
          { termEn: 'dBFS (Full Scale)', termSi: 'උපරිම ඩිජිටල් මට්ටම', definitionSi: 'ඩිජිටල් පද්ධතියේ උපරිම ශබ්ද මට්ටම (0 dBFS). එයට වඩා ඉහළ මට්ටමක් නොමැත.' },
          { termEn: 'Headroom', termSi: 'ඉතිරි මට්ටම', definitionSi: 'වර්තමාන මට්ටම සහ 0 dBFS අතර ඉතිරි ඉඩ.' },
        ],
        formulaOrDiagram:
          'dB = 20 × log10(Amplitude Ratio)   [Amplitude සඳහා]\ndB = 10 × log10(Power Ratio)      [Power/Energy සඳහා]\n\nප්‍රබලතාව × 2  → +6.02 dB\nප්‍රබලතාව ÷ 2  → −6.02 dB\nප්‍රබලතාව × 10 → +20 dB\nප්‍රබලතාව × 0.5 → −6.02 dB',
      },
      {
        id: 's-602-2',
        headingSi: 'Peak සහ RMS — මනින ආකාරය',
        headingEn: 'Peak versus RMS Measurement',
        bodySi:
          'Peak යනු ශබ්දයේ උපරිම ලක්ෂ්‍යයයි. RMS (Root Mean Square) යනු එම ශබ්දයේ සාමාන්‍ය ශක්තියයි. Peak සහ RMS අතර ඇති පරතරයට Crest Factor කියනු ලැබේ. එකම Peak මට්ටමක් තිබුණද Kick drum එකකට වඩා Pad එකකට වැඩි RMS අගයක් ලැබේ. එනිසා එකම Peak එකේ Music එකෙක් Kick එකකින් වඩාත් ප්‍රබලව ඇසේ.',
        keyTerms: [
          { termEn: 'Peak', termSi: 'උපරිම ලක්ෂ්‍යය', definitionSi: 'ශබ්ද තරංගයේ ඉහළම (හෝ පහළම) මට්ටම.' },
          { termEn: 'RMS', termSi: 'සාමාන්‍ය ශක්ති මට්ටම', definitionSi: 'ශබ්දයේ සාමාන්‍ය ශක්තිය. කනට දැනෙන ප්‍රබලතාවට වඩාත් සමීප වේ.' },
          { termEn: 'Crest Factor', termSi: 'පීක්-ආර්එම්එස් පරතරය', definitionSi: 'Peak සහ RMS අතර ඇති පරතරය (dB). Percussive ශබ්දවල වැඩියි.' },
        ],
      },
      {
        id: 's-602-3',
        headingSi: 'Sample Rate සහ Nyquist Theorem',
        headingEn: 'Sample Rate and the Nyquist Theorem',
        bodySi:
          'ඩිජිටල් පද්ධතියක ශබ්දය පටිගත කරන්නේ නියැදි (Samples) කිහිපයක් ලෙසයි. Nyquist Theorem අනුව නිවැරදිව පටිගත කළ හැකි උපරිම සංඛ්‍යාතය Sample Rate එකේ අඩකයි. එහෙයින් 44,100 Hz Sample Rate එකකින් උපරිම 22,050 Hz දක්වා පමණක් පටිගත කළ හැක. එය මිනිස් කනේ පරාසයට (20 kHz) ප්‍රමාණවත් මට්ටමින් වැඩියෙන් ඇත. මෙයට වඩා ඉහළ සංඛ්‍යාත පටිගත වුවහොත් Aliasing නම් දෝෂය ඇතිවේ.',
        keyTerms: [
          { termEn: 'Sample Rate', termSi: 'නියැදි වේගය', definitionSi: 'තත්පරයකට ශබ්දය මනින වාර ගණන (44,100 Hz, 48,000 Hz ආදී).' },
          { termEn: 'Nyquist Theorem', termSi: 'නයික්විස්ට් සිද්ධාන්තය', definitionSi: 'නිවැරදිව පටිගත කළ හැකි උපරිම සංඛ්‍යාතය Sample Rate එකේ අඩක් වේ.' },
          { termEn: 'Aliasing', termSi: 'ව්‍යාජ සංඛ්‍යාත දෝෂය', definitionSi: 'Nyquist සීමාව ඉක්මවා යන සංඛ්‍යාත වැරදි සංඛ්‍යාත ලෙස නැවත පෙනීම.' },
        ],
        formulaOrDiagram:
          'Nyquist Frequency = Sample Rate ÷ 2\n\n44,100 Hz → 22,050 Hz (CD සම්මතය)\n48,000 Hz → 24,000 Hz (Video/Professional සම්මතය)\n96,000 Hz → 48,000 Hz (High-Resolution)',
      },
      {
        id: 's-602-4',
        headingSi: 'Bit Depth සහ Quantization Noise',
        headingEn: 'Bit Depth and Quantization Noise',
        bodySi:
          'Bit Depth එකෙන් එක් නියැදියක් සටහන් කිරීමට යොදන Bits ගණන තීරණය වේ. 16-bit එකේ මට්ටම් 65,536 ක් ඇති අතර 24-bit එකේ මට්ටම් 16,777,216 ක් ඇත. Bit Depth එකේ සෑම Bit එකක්ම අපේක්ෂිත ධාරිතාවයට 6.02 dB එකතු කරයි. එනිසා 24-bit පටිගත කිරීම් වලට ඉතා වැඩි Headroom සහ අඩු Noise ලැබේ.',
        keyTerms: [
          { termEn: 'Bit Depth', termSi: 'බිට් ගැඹුර', definitionSi: 'එක් නියැදියක් සටහන් කිරීමට යොදන Bits ගණන.' },
          { termEn: 'Quantization Noise', termSi: 'ප්‍රමාණීකරණ ඝෝෂාව', definitionSi: 'Bit Depth සීමිත වීම නිසා ඇතිවන ශබ්ද ඝෝෂාව.' },
          { termEn: 'Dynamic Range', termSi: 'ශබ්ද පරාසය', definitionSi: 'ඉතා මෘදු ශබ්දයේ සිට ඉතා ප්‍රබල ශබ්දය දක්වා ඇති පරතරය (dB වලින්).' },
        ],
        formulaOrDiagram:
          'Dynamic Range ≈ (6.02 × Bit Depth) + 1.76 dB\n\n16-bit → (6.02 × 16) + 1.76 = 98.08 dB  (ප්‍රායෝගිකව ~96 dB)\n24-bit → (6.02 × 24) + 1.76 = 146.24 dB\n\nපටිගත කිරීමට: 24-bit / 48 kHz නිර්දේශිතයි.\nබෙදාහැරීමට: 16-bit / 44.1 kHz ප්‍රමාණවත්ය.',
      },
      {
        id: 's-602-5',
        headingSi: 'Clipping සහ නිවැරදි Gain Staging',
        headingEn: 'Clipping and Correct Gain Staging',
        bodySi:
          'ඩිජිටල් පද්ධතියේ 0 dBFS ට වැඩි මට්ටමක් නොමැත. එය ඉක්මවා ගිය විට තරංගයේ ඉහළ සහ පහළ කොටස් කැපී යයි (Clipping). මෙය ආපසු හැරවිය නොහැකි විකෘතියකි (Irreversible Distortion). Gain Staging යනු සංඥාව ගමන් කරන සෑම පියවරකදීම ප්‍රශස්ත මට්ටමක පවත්වා ගැනීමයි. 24-bit පටිගත කිරීමේදී ප්‍රශස්ත මට්ටම -18 dBFS පමණ වන අතර උපරිම Peak මට්ටම -6 dBFS ට අඩුවෙන් තබන්න.',
        keyTerms: [
          { termEn: 'Clipping', termSi: 'ඉහළ මට්ටම කැපීම', definitionSi: '0 dBFS ඉක්මවා ගිය විට තරංගය කැපී යාමෙන් ඇතිවන විකෘතිය.' },
          { termEn: 'Gain Staging', termSi: 'ශබ්ද මට්ටම් පාලනය', definitionSi: 'සංඥාව ගමන් කරන සෑම පියවරකදීම ප්‍රශස්ත මට්ටමක (Headroom සහිතව) පවත්වා ගැනීම.' },
          { termEn: 'Unity Gain', termSi: 'සංඥා මට්ටම නොවෙනස්ව තැබීම', definitionSi: 'ශබ්දය ප්‍රබල කිරීමක් හෝ දුර්වල කිරීමක් නොකර එලෙසම යැවීම (0 dB).' },
        ],
        formulaOrDiagram:
          'ප්‍රශස්ත Recording මට්ටම් (24-bit):\n- සාමාන්‍ය මට්ටම : −18 dBFS\n- උපරිම Peak   : −6 dBFS (එයට වඩා ඉහළ නොයන්න)\n- Noise Floor   : −80 dBFS ට අඩු\n\n0 dBFS ට වැඩි වූ විට → Clipping → විකෘතිය (ආපසු හැරවිය නොහැක)',
      },
    ],
    examples: [
      {
        id: 'ex-602-1',
        titleSi: 'Decibel අගයන් පරිවර්තනය කිරීම',
        titleEn: 'Converting Between Decibels and Amplitude',
        descriptionSi:
          'රේඛීය ප්‍රබලතාවට අනුරූප Decibel අගයන් පහත පරිදි වේ.',
        notationOrSteps:
          '0.5 (පෙරළිස්)  → 20 × log10(0.5)  = −6.02 dB\n1.0 (පූර්ණය)   → 20 × log10(1.0)  =  0.00 dB (0 dBFS)\n0.25          → 20 × log10(0.25) = −12.04 dB\n0.0316        → 20 × log10(0.0316) = −30.00 dB',
      },
      {
        id: 'ex-602-2',
        titleSi: 'ඔබේ ගොනුවේ තාක්ෂණික මිනුම් කියවීම',
        titleEn: 'Reading Technical Measurements of Your File',
        descriptionSi:
          'Local Audio Analyzer Lab එකට ඔබේම ශබ්ද ගොනුවක් ලබා දී පහත අගයන් කියවන්න. මෙම ගණනය කිරීම් ඔබේම බ්‍රවුසරයේ 100% ක්ම සිදු වන අතර කිසිදු ගොනුවක් උඩුගත නොකෙරේ.',
        notationOrSteps:
          'Peak (dBFS) — වඩාත්ම ඉහළ ලක්ෂ්‍යය. −1.0 dBFS ට වඩා ඉහළ නම් අවධානය අවශ්‍යයි.\nRMS (dBFS)  — සාමාන්‍ය ශක්තිය. Mix එකකට −18 සිට −12 dBFS පමණ සුදුසුයි.\nCrest Factor — Peak සහ RMS අතර පරතරය. Percussion වල 12–20 dB පමණ වේ.',
      },
    ],
    exercises: [
      {
        id: 'exer-602-1',
        titleSi: 'Gain Staging සැලසුමක් සකස් කිරීම',
        instructionsSi: 'ඔබේ පටිගත කිරීමේ ක්‍රියාවලිය සඳහා Gain Staging සැලසුමක් ලියන්න.',
        stepsSi: [
          'ඔබේ Audio Interface එකේ Input Gain එක ශබ්දයට Peak −18 dBFS පමණ වන ලෙස සකසන්න.',
          'සාමාන්‍ය වාදනයේදී Peak −18 dBFS සහ උපරිම −6 dBFS අතර තබා ගන්න.',
          'ඔබේ DAW එකේ Meter එක නිරන්තරයෙන් නිරීක්ෂණය කරන්න.',
          'Plugins එකින් එක පසුකර යන විට සෑම එකකම Input සහ Output මට්ටම් පරීක්ෂා කරන්න.',
          'Mix එකක් සකස් කරන විට සාමාන්‍ය මට්ටම −18 dBFS පමණ තබන්න (Mixing වලට ප්‍රමාණවත් Headroom).',
          'Master Out එකේ Peak −6 dBFS ට අඩු බව තහවුරු කරගන්න.',
        ],
      },
    ],
    exerciseIds: ['exer-602-1'],
    quizIds: ['quiz-602'],
    summarySi:
      'Decibel පරිමාණය Logarithmic වන අතර එය කනට ඇසෙන ආකාරයට සමීපය. Peak සහ RMS වෙනස් මිනුම් වන අතර ඒවා අතර පරතරය Crest Factor එකයි. Nyquist Theorem අනුව Sample Rate එකේ අඩක් උපරිම සංඛ්‍යාතයයි. Bit Depth එකෙන් Dynamic Range තීරණය වේ. Clipping වළක්වා නිවැරදි Gain Staging පවත්වා ගැනීම අත්‍යවශ්‍යයි.',
    furtherPracticeSi: [
      '96,000 Hz Sample Rate එකක Nyquist සංඛ්‍යාතය ගණනය කරන්න. (48,000 Hz)',
      'ඔබේ පටිගත කළ ගොනුවක් Local Audio Analyzer Lab එකට දමා Peak සහ RMS කියවන්න.',
    ],
    published: true,
    order: 2,
    updatedAt: UPDATED_AT,
  },
  {
    id: 'lesson-603',
    slug: 'microphones-polar-patterns-and-monitoring',
    courseId: 'course-level-6',
    titleSi: 'මයික්‍රෆෝන, Polar Patterns සහ Room Acoustics මූලධර්ම',
    titleEn: 'Microphones, Polar Patterns and Monitoring Basics',
    descriptionSi:
      'Dynamic සහ Condenser මයික්‍රෆෝන, Cardioid සහ Omni Polar Patterns, Proximity Effect, Phantom Power, Monitor Placement සහ කුඩා කාමරවල Acoustic ගැටලු පිළිබඳ විද්‍යාත්මක පැහැදිලි කිරීම.',
    category: 'audio-engineering',
    level: 6,
    prerequisites: ['decibels-digital-audio-and-gain-staging'],
    estimatedMinutes: 26,
    learningObjectives: [
      'Dynamic සහ Condenser මයික්‍රෆෝන අතර වෙනස සහ භාවිතයන් පැහැදිලි කිරීම.',
      'Cardioid, Omni සහ Figure-8 Polar Patterns හඳුනා ගැනීම.',
      'යම් අවස්ථාවකට සුදුසු Polar Pattern තෝරා ගැනීම.',
      'කුඩා කාමරවල කුඩා අවකාශයක ශබ්දය සුවිශේෂීව පටිගත කිරීමට සරල පියවර ගැනීම.',
    ],
    sections: [
      {
        id: 's-603-1',
        headingSi: 'Dynamic සහ Condenser මයික්‍රෆෝන',
        headingEn: 'Dynamic versus Condenser Microphones',
        bodySi:
          'Dynamic මයික්‍රෆෝනයක් ශබ්ද තරංගය මගින් චුම්බක තන්තුව (Magnet + Voice Coil) චලනය කිරීමෙන් විද්‍යුත් සංඥාවක් උත්පාදනය කරයි. එය ඉතා ශක්තිමත්, අඩු සංවේදීතාවක් ඇති (Robust) සහ දිගු කල් පවතින මයික්‍රෆෝනයකි. කුඩා කාමරවලටත්, ඉහළ ශබ්දයකටත් (Drums, Live) Dynamic මයික්‍රෝෆෝන යොදයි. කුඩා කාමරයක හොඳ මයික්‍රෆෝනයක් වන්නේ Dynamics මයික්‍රෆෝනයකි.',
        keyTerms: [
          { termEn: 'Dynamic Microphone', termSi: 'ඩයිනමික් මයික්‍රෆෝනය', definitionSi: 'චුම්බක ක්‍රියාවලිය මත ක්‍රියාකරන ශක්තිමත් මයික්‍රෆෝනය.' },
          { termEn: 'Condenser Microphone', termSi: 'කන්ඩෙන්සර් මයික්‍රෆෝනය', definitionSi: 'විද්‍යුත් ධාරිතාව වෙනස් වීම මත ක්‍රියාකරන, වඩාත් සංවේදී මයික්‍රෆෝනය.' },
          { termEn: 'Sensitivity', termSi: 'සංවේදීතාව', definitionSi: 'මයික්‍රෆෝනයේ සංඥාව උත්පාදනය කිරීමේ ශක්තිය.' },
        ],
      },
      {
        id: 's-603-2',
        headingSi: 'Polar Patterns — ශබ්දය ලබාගන්නා දිශාවන්',
        headingEn: 'Understanding Polar Patterns',
        bodySi:
          'මයික්‍රෆෝනයක් සියලු දිශාවන්ගෙන් සමානව ශබ්දය ලබා නොගනී. එය ලබාගන්නා දිශාව Polar Pattern එකෙන් දක්වයි. Cardioid — ඉදිරිපසින් පිහිටන ශබ්දයට වඩාත් සංවේදී වන අතර පසුපසින් පිහිටන ශබ්දය (Rejection) අඩු කරයි. එය කුඩා කාමරවලට වඩාත් සුදුසුයි. Omni — සියලු දිශාවන්ගෙන් සමානව ශබ්දය ලබා ගනී. Figure-8 — ඉදිරිපසින් සහ පසුපසින් පමණක් ශබ්දය ලබා ගනී.',
        keyTerms: [
          { termEn: 'Cardioid', termSi: 'කාඩියොයිඩ් රටාව', definitionSi: 'ඉදිරිපසට වඩාත් සංවේදී වන, පසුපස ශබ්දය අඩු කරන රටාව.' },
          { termEn: 'Omnidirectional', termSi: 'සර්වදිශා රටාව', definitionSi: 'සියලු දිශාවන්ගෙන් සමානව ශබ්දය ලබා ගන්නා රටාව.' },
          { termEn: 'Figure-8 (Bidirectional)', termSi: 'ද්විදිශා රටාව', definitionSi: 'ඉදිරිපසින් සහ පසුපසින් පමණක් ශබ්දය ලබා ගන්නා රටාව.' },
          { termEn: 'Phantom Power (+48V)', termSi: 'ෆැන්ටම් බලය', definitionSi: 'Condenser මයික්‍රෆෝන ක්‍රියාත්මක කිරීමට ලබා දෙන 48V විද්‍යුත් බලය.' },
          { termEn: 'Proximity Effect', termSi: 'සමීපතා ප්‍රතිඵලය', definitionSi: 'මයික්‍රෆෝනයට ඉතා සමීප වන විට පහළ සංඛ්‍යාත ප්‍රබල වීමේ ප්‍රතිඵලය.' },
        ],
        formulaOrDiagram:
          'Cardioid     : ඉදිරිපස 100% | පැති ~50% | පසුපස ~0%\nOmni         : සියලු දිශාවන් 100%\nFigure-8     : ඉදිරිපස 100% | පැති 0% | පසුපස 100%\nHypercardioid: ඉදිරිපස 100% | පසුපස ~30% (වඩාත් සමීපව ලබා ගනී)',
      },
      {
        id: 's-603-3',
        headingSi: 'කුඩා කාමරවල ශබ්දය සුවිශේෂීව පටිගත කිරීම',
        headingEn: 'Recording Cleanly in Small Rooms',
        bodySi:
          'සම්පූර්ණයෙන්ම Acoustic Treatment නොකළ කාමරයක වුවද පටිගත කිරීමේ ගුණාත්මක බව ඉහළ නංවා ගැනීමට හැක. මයික්‍රෆෝනය ශබ්ද මූලාශ්‍රයට සමීපව තබන්න. එසේ කිරීමෙන් Direct Sound සහ Room Reflections අතර පරතරය වැඩි වේ (සංඥාව හා ඝෝෂාව අතර අනුපාතය යහපත් වේ). බිත්තිවලට පර්දා, පොරෝනා හෝ මෙට්ට තැබීමෙන් කෙටි Reflexions නැවතීමට උපකාරී වේ. කර්ටන්, රත්තරන් හෝ වැවිලි සහිත කාමරවල Reflexions අඩු වේ.',
        keyTerms: [
          { termEn: 'Direct Sound', termSi: 'සෘජු ශබ්දය', definitionSi: 'මූලාශ්‍රයේ සිට මයික්‍රෆෝනයට කෙලින්ම එන ශබ්දය.' },
          { termEn: 'Room Reflection', termSi: 'කාමර ප්‍රතිබිම්බය', definitionSi: 'බිත්තිවලින් පිළිබිඹු වී මයික්‍රෆෝනයට එන ශබ්දය.' },
          { termEn: 'Acoustic Treatment', termSi: 'ශබ්ද පාලනය', definitionSi: 'ප්‍රතිබිම්බ අවම කිරීමට හෝ සමතුලිත කිරීමට කරන කාමර සැකසුම්.' },
        ],
      },
      {
        id: 's-603-4',
        headingSi: 'Monitor Placement සහ ශ්‍රවණ පරිසරය',
        headingEn: 'Monitor Placement and Listening Environment',
        bodySi:
          'ශ්‍රවණ පටිපාටියේ වඩාත් වැදගත්ම දෙය ඔබේ කාමරයයි. Studio Monitor දෙකක් සහ ඔබේ හිස අතර සමපාර්ශ්වික ත්‍රිකෝණයක් (Equilateral Triangle) සාදන්න. Monitor දෙක ඔබේ කන් උසට සමාන කරන්න (Tweeter ඔබේ කනට කෙලින්ම සමාන විය යුතුයි). Speaker ඔබේ දෙපසට සමාන කර, බිත්තියේ සිට අවම අඟල් 12 ක් පමණ දුරින් තබන්න. ඉතා උස් හෝ ඉතා පහත් monitor දෙකක් ශ්‍රවණය කිරීමෙන් වැරදි තීරණ ගැනීමට පුළුවන.',
        keyTerms: [
          { termEn: 'Reference Monitor', termSi: 'සමබර ශ්‍රවණ යන්ත්‍රය', definitionSi: 'ශබ්දය විකෘති නොකර සත්‍යව ඉදිරිපත් කරන ශ්‍රවණ යන්ත්‍රය.' },
          { termEn: 'Sweet Spot', termSi: 'ප්‍රශස්ත ශ්‍රවණ ස්ථානය', definitionSi: 'Monitor දෙකේ ශබ්දය හොඳින්ම එකට එකතු වන ස්ථානය.' },
          { termEn: 'Standing Wave', termSi: 'ස්ථාවර තරංගය', definitionSi: 'Side-by-side බිත්ති අතර පිළිබිඹු වී ඇතිවන, සමහර සංඛ්‍යාත උත්සන්න කරන තරංගය.' },
        ],
      },
    ],
    examples: [
      {
        id: 'ex-603-1',
        titleSi: 'යම් අවස්ථාවකට සුදුසු මයික්‍රෆෝනය තෝරා ගැනීම',
        titleEn: 'Choosing the Right Microphone for a Task',
        descriptionSi: 'පහත අවස්ථා සඳහා සුදුසු තේරීම් සහ ඒවාට හේතු.',
        notationOrSteps:
          'ගායනය (නිහඬ කාමරය)  →  Large-Diaphragm Condenser (සංවේදී, විස්තරවත්)\nගායනය (ඝෝෂාකාරී කාමරය) →  Dynamic Cardioid (පසුපස ශබ්දය අවම)\nAcoustic Guitar       →  Small-Diaphragm Condenser (ඉහළ සංඛ්‍යාත පැහැදිලි)\nDrum Overheads        →  Cardioid Condenser යුගලයක් (Stereo)\nLive Stage Vocal      →  Dynamic Cardioid (ශක්තිමත්)',
      },
    ],
    exercises: [
      {
        id: 'exer-603-1',
        titleSi: 'ශ්‍රවණ පරිසරය පිරික්සීම',
        instructionsSi: 'ඔබේ වර්තමාන පටිගත කිරීමේ දුරකථන/කාමර පරිසරය පිරික්සා improvement ලැයිස්තුවක් සාදන්න.',
        stepsSi: [
          'ඔබේ කාමරයේ බිත්ති මෘදු ද (Carpet, Curtain) නැතහොත් දෘඪ ද (Cement, Glass) යන්න සටහන් කරගන්න.',
          'මයික්‍රෆෝනය ශබ්ද මූලාශ්‍රයට සමීප කිරීමෙන් Direct Sound අනුපාතය වැඩි කර ගැනීමට හැකි ආකාරය සටහන් කරන්න.',
          'පොරෝනා, මෙට්ට හෝ පුස්තකාල දම්වැල් යොදා අතිරේක ප්‍රතිබිම්බ අවශෝෂණය කළ හැකි ස්ථාන 2 ක් සොයාගන්න.',
          'ඔබේ Headphones එකෙන් කෙටි ටෙස්ට් පටිගත කිරීමක් සිදු කර පසුබිම් ශබ්දයට සවන් දෙන්න.',
          'මයික්‍රෆෝනය සහ මූලාශ්‍රය අතර ඇති පරතරය (අඟල්) කිහිපයක් ලියා ඒවායේ ප්‍රතිඵලය සටහන් කරන්න.',
        ],
      },
    ],
    exerciseIds: ['exer-603-1'],
    quizIds: ['quiz-603'],
    summarySi:
      'Dynamic මයික්‍රෆෝන ශක්තිමත් වන අතර Condenser මයික්‍රෆෝන සංවේදීය. Cardioid රටාව පසුපස ශබ්දය අවම කරන බැවින් කුඩා කාමරවලට සුදුසුයි. Monitor දෙක සහ හිස අතර සමපාර්ශ්වික ත්‍රිකෝණයක් සැදීම අත්‍යවශ්‍යයි. Acoustic Treatment මගින් ප්‍රතිබිම්බ අවම කරගත හැක.',
    furtherPracticeSi: [
      'Condenser මයික්‍රෆෝනයක ෆැන්ටම් බලය අවශ්‍ය වන්නේ ඇයිදැයි ගවේෂණය කරන්න.',
      'ඔබේ Monitor දෙක ස්ථානගත කිරීමේ ත්‍රිකෝණය මැන ගණන් කරන්න.',
    ],
    published: true,
    order: 3,
    updatedAt: UPDATED_AT,
  },

  // =====================================================================================
  // LEVEL 7 — MIXING
  // =====================================================================================
  {
    id: 'lesson-701',
    slug: 'eq-and-frequency-masking',
    courseId: 'course-level-7',
    titleSi: 'Parametric EQ සහ Frequency Masking ඉවත් කිරීම',
    titleEn: 'Parametric EQ and Removing Frequency Masking',
    descriptionSi:
      'Parametric EQ හි අංශ (Bell, Shelf, High-Pass, Notch), Q පරාමිතිය, Frequency Masking හඳුනා ගැනීම සහ Subtractive EQ ක්‍රමවේදය, මෙන්ම නිතර භාවිතා වන සංඛ්‍යාත පරාස ඉලක්ක.',
    category: 'mixing',
    level: 7,
    prerequisites: ['microphones-polar-patterns-and-monitoring'],
    estimatedMinutes: 26,
    learningObjectives: [
      'Parametric EQ හි අංශ 4 හඳුනාගෙන භාවිතා කිරීම.',
      'Subtractive EQ (කැපීම) සහ Additive EQ අතර වෙනස පැහැදිලි කිරීම.',
      'Frequency Masking ඇතිවන සංඛ්‍යාත පරාසය හඳුනා ගැනීම.',
      'High-Pass Filter එකක් ඕනෑම Channel එකකට යෙදිය යුත්තේ කවදාද යන්න තීරණය කිරීම.',
    ],
    sections: [
      {
        id: 's-701-1',
        headingSi: 'EQ හි මූලික අංශ 4',
        headingEn: 'The Four Basic EQ Shapes',
        bodySi:
          'Parametric EQ එකක ප්‍රධාන අංශ 4 ක් ඇත. High-Pass Filter (HPF) — නිශ්චිත සංඛ්‍යාතයට පහළින් සියල්ල ඉවත් කරයි. අනවශ්‍ය අඩු සංඛ්‍යාත ඝෝෂාව (Rumble, Handling Noise) ඉවත් කිරීමට ඕනෑම Channel එකකට යොදයි. Low-Pass Filter (LPF) — නිශ්චිත සංඛ්‍යාතයට ඉහළින් සියල්ල ඉවත් කරයි. Bell (Peak) — නිශ්චිත සංඛ්‍යාතයක් වටා පටු හෝ පුළුල් කඳක් ලෙස වැඩි හෝ අඩු කරයි. Shelf — නිශ්චිත සංඛ්‍යාතයට ඉහළින් සියල්ලම සමානව වැඩි හෝ අඩු කරයි.',
        keyTerms: [
          { termEn: 'High-Pass Filter (HPF)', termSi: 'අඩු සංඛ්‍යාත කපන Filter', definitionSi: 'නිශ්චිත සංඛ්‍යාතයට පහළ සියලු සංඛ්‍යාත ඉවත් කරන Filter එක.' },
          { termEn: 'Bell / Peak Filter', termSi: 'කඳ Filter', definitionSi: 'නිශ්චිත සංඛ්‍යාතයක් වටා වැඩි හෝ අඩු කරන EQ අංශය.' },
          { termEn: 'Shelf Filter', termSi: 'ෂෙල්ෆ් Filter', definitionSi: 'නිශ්චිත සංඛ්‍යාතයට ඉහළින් හෝ පහළින් සියල්ල සමානව වෙනස් කරන EQ අංශය.' },
          { termEn: 'Q (Quality Factor)', termSi: 'Q පරාමිතිය', definitionSi: 'EQ කඳේ පළල. Q අගය වැඩි නම් කඳ පටුයි; Q අගය අඩු නම් කඳ පුළුල්යි.' },
        ],
        formulaOrDiagram:
          'HPF   : ————\u2500 ▁▁▁▁  (ඉහළ නොවෙනස්ව, පහළ ඉවත්)\nLPF   : ▁▁▁▁ ————\u2500  (පහළ නොවෙනස්ව, ඉහළ ඉවත්)\nBell  : ——————⌒——————  (මැද කඳ)\nShelf : ▁▁▁▁ ————  (ඉහළ සියල්ල එකවර)',
      },
      {
        id: 's-701-2',
        headingSi: 'Frequency Masking — ගැටුම් හඳුනා ගැනීම',
        headingEn: 'Identifying Frequency Masking',
        bodySi:
          'වාද්‍ය භාණ්ඩ දෙකක් එකම සංඛ්‍යාත පරාසයේ තිබෙන විට එකක් අනෙකට මුවා වේ. මෙයට Frequency Masking කියනු ලැබේ. උදාහරණයක් ලෙස Kick drum එකේ සහ Bass ගිටාරයේ මූලික බර 60–100 Hz අතර ඇත. දෙකම එකම ප්‍රමාණයේ තිබුණහොත් ශබ්දය මඩ වේ. විසඳුම එකම අංශයේ සුළු වෙනසක් කිරීමයි. එකක් HPF එකකින් ඉවත් කර අනෙකට ඉඩ දීමයි.',
        keyTerms: [
          { termEn: 'Frequency Masking', termSi: 'සංඛ්‍යාත අතිච්ඡාදනය', definitionSi: 'එක් ශබ්දයක් තවත් ශබ්දයක් මුවා කිරීමෙන් පැහැදිලි බව අඩු වීම.' },
          { termEn: 'Subtractive EQ', termSi: 'අඩු කිරීමේ EQ', definitionSi: 'අනවශ්‍ය හෝ ගැටුම් ඇති කරන සංඛ්‍යාත කැපීමෙන් පැහැදිලි බව ලබා ගැනීම.' },
          { termEn: 'Frequency Slotting', termSi: 'සංඛ්‍යාත බෙදා හැරීම', definitionSi: 'සෑම භාණ්ඩයකටම තමන්ගේම සංඛ්‍යාත ප්‍රදේශයක් වෙන් කර දීම.' },
        ],
        formulaOrDiagram:
          'Sub-Bass  (20–60 Hz)   : ස්පර්ශය පමණයි — බොහෝ දුරට ඉවත් කරන්න\nBass Body  (60–120 Hz) : Kick + Bass\nWarmth    (120–300 Hz) : Bass, Guitar, Vocal  (වැඩි නම් මඩ වේ)\nMud       (200–500 Hz) : අවම කිරීමට උත්සාහ කරන්න\nBody      (500 Hz–2 kHz): වාද්‍ය භාණ්ඩවල ප්‍රධාන වර්ණය\nPresence  (2–5 kHz)    : පැහැදිලි බව (Vocal සඳහා වැදගත්)\nSibilance (5–8 kHz)    : "ස්" ශබ්දය — De-esser සඳහා\nAir       (10–16 kHz)  : වායුමය අවකාශය',
      },
      {
        id: 's-701-3',
        headingSi: 'Subtractive EQ ක්‍රමවේදය',
        headingEn: 'The Subtractive EQ Workflow',
        bodySi:
          'නවකයන් බහුලව කරන වැරැද්ද වන්නේ සෑම EQ Band එකකින්ම වැඩි කිරීමයි. එය අවසානයේ ශබ්දය ඝෝෂාකාරී කරයි. වඩාත් හොඳ ක්‍රමය නම් (1) Narrow Bell එකක් +12 dB පමණ ඉහළ නංවා ශබ්දයේ අප්‍රසන්න සංඛ්‍යාතය හඳුනා ගැනීම. (2) එම සංඛ්‍යාතය -3 සිට -6 dB දක්වා පහත හෙළීම. (3) Q අගය පුළුල් කර ස්වභාවික බව ලබා ගැනීම.',
        keyTerms: [
          { termEn: 'Sweep and Destroy', termSi: 'සොයා ඉවත් කිරීම', definitionSi: 'Boost කර අප්‍රසන්න සංඛ්‍යාතය සොයා Cut කිරීමේ ක්‍රමවේදය.' },
          { termEn: 'A/B Comparison', termSi: 'සංසන්දන පරීක්ෂාව', definitionSi: 'EQ යෙදූ සහ නොයෙදූ අවස්ථාව සසඳා වඩා හොඳ තත්ත්වය තෝරා ගැනීම.' },
        ],
      },
    ],
    examples: [
      {
        id: 'ex-701-1',
        titleSi: 'Kick සහ Bass අතර ගැටුම විසඳීම',
        titleEn: 'Resolving the Kick–Bass Collision',
        descriptionSi:
          'Kick drum එකට 60 Hz ප්‍රදේශය තබා Bass ගිටාරයේ මූලික බර 80–90 Hz පමණ ලෙසට වෙනස් කරන්න. Bass එකට HPF එකක් 40 Hz ට යොදන්න. එවිට එකිනෙක යටපත් නොවේ.',
        notationOrSteps:
          'Kick : HPF 30 Hz, Bell +2 dB @ 65 Hz (Q 1.0)\nBass : HPF 40 Hz, Bell -3 dB @ 65 Hz (Q 1.2), Bell +2 dB @ 100 Hz\nMaster: HPF 25 Hz (DC සහ Sub-Rumble ඉවත් කිරීමට)',
      },
    ],
    exercises: [
      {
        id: 'exer-701-1',
        titleSi: 'EQ Lab භාවිතයෙන් සංඛ්‍යාත හඳුනා ගැනීම',
        instructionsSi: 'Audio Engineering Lab හි Parametric EQ ලැබ් එක භාවිතයෙන් පහත අභ්‍යාසය කරන්න.',
        stepsSi: [
          'Low Band: 80 Hz, +6 dB ලෙස සකසන්න. ශබ්දයේ බර වැඩි වන ආකාරය අවධානය කරන්න.',
          'Low Band: 80 Hz, -6 dB ලෙස වෙනස් කරන්න. බර අඩු වන ආකාරය අසන්න.',
          'Mid Band: 800 Hz, +6 dB (Mud ප්‍රදේශය) සහ -6 dB (පැහැදිලි බව) සසඳන්න.',
          'High Band: 8 kHz, +6 dB කරන්න. එය ඉතා ඉහළ නම් කණට අපහසු (Harsh) වන බව සටහන් කරගන්න.',
          'අවසානයේ සමතුලිත සැකසුමක් (Low +2, Mid -2, High +3) ලෙස සකසන්න.',
        ],
        linkedLabTab: 'eq',
      },
    ],
    exerciseIds: ['exer-701-1'],
    quizIds: ['quiz-701'],
    summarySi:
      'Parametric EQ හි HPF, LPF, Bell සහ Shelf යන මූලික අංශ 4 ක් ඇත. Q පරාමිතියෙන් කඳේ පළල තීරණය වේ. Frequency Masking නිසා භාණ්ඩ එකිනෙක මුවා වේ. Subtractive EQ ක්‍රමවේදයෙන් සොයා ඉවත් කිරීම මගින් පැහැදිලි බව ලබා ගත හැක.',
    furtherPracticeSi: [
      'Vocal track එකකට HPF එකක් යෙදිය යුත්තේ කුමන සංඛ්‍යාතයේද? (සාමාන්‍යයෙන් 80–100 Hz)',
      'ඔබේ ප්‍රියතම ගීතයක් ඇසීමේදී Kick සහ Bass අතර ගැටුමක් ඇත්දැයි තීරණය කරන්න.',
    ],
    published: true,
    order: 1,
    updatedAt: UPDATED_AT,
  },
  {
    id: 'lesson-702',
    slug: 'compression-reverb-and-stereo-imaging',
    courseId: 'course-level-7',
    titleSi: 'Compression, Reverb සහ Stereo Imaging',
    titleEn: 'Compression, Reverb and Stereo Imaging',
    descriptionSi:
      'Compressor හි පරාමිතීන් 6 (Threshold, Ratio, Attack, Release, Knee, Makeup Gain), Parallel Compression, Gate සහ De-esser, Reverb කාල වර්ග (Room, Hall, Plate), Panning සහ Phase Correlation පරීක්ෂාව.',
    category: 'mixing',
    level: 7,
    prerequisites: ['eq-and-frequency-masking'],
    estimatedMinutes: 30,
    learningObjectives: [
      'Compressor පරාමිතීන් 6 හඳුනාගෙන ඒවායේ බලපෑම පැහැදිලි කිරීම.',
      'Parallel Compression භාවිතයෙන් ස්වභාවික බව රැක ගනිමින් ප්‍රබලතාව වැඩි කිරීම.',
      'Reverb කාල වර්ග 3 හඳුනාගෙන සුදුසු එකක් තෝරා ගැනීම.',
      'Phase Correlation පරීක්ෂාවෙන් Mono Compatibility තහවුරු කිරීම.',
    ],
    sections: [
      {
        id: 's-702-1',
        headingSi: 'Compressor පරාමිතීන් 6',
        headingEn: 'The Six Compressor Parameters',
        bodySi:
          'Compressor එකක් නිවැරදිව භාවිතා කිරීමට එහි පරාමිතීන් 6 තේරුම් ගැනීම අත්‍යවශ්‍යයි. Threshold — කවර මට්ටමකට ඉහළින් Compressor එක ක්‍රියාත්මක වන්නේද යන්නයි. Ratio — Threshold මට්ටමට ඉහළින් ඇති ශබ්දය කුමන අනුපාතයකින් අඩු කරන්නේද යන්නයි (4:1 නම් 4 dB ඉහළ ගිය ශබ්දය 1 dB ලෙස ප්‍රතිදානය වේ). Attack — Compressor එක ක්‍රියාත්මක වීමට කොපමණ කාලයක් ගන්නවාද යන්නයි. Release — ක්‍රියාත්මක වීමෙන් පසු නැවත මුදා හැරීමට ගතවන කාලයයි. Knee — ක්‍රියාත්මක වීමේ සුමටාවයි (Soft Knee මෘදුයි). Makeup Gain — අඩු වූ මට්ටම නැවත ඉහළ නැංවීමයි.',
        keyTerms: [
          { termEn: 'Threshold', termSi: 'සීමා මට්ටම', definitionSi: 'Compressor එක ක්‍රියාත්මක වීම ආරම්භ වන ශබ්ද මට්ටම.' },
          { termEn: 'Ratio', termSi: 'අනුපාතය', definitionSi: 'Threshold ට ඉහළින් ඇති ශබ්දය අඩු කරන අනුපාතය (උදා: 4:1).' },
          { termEn: 'Attack', termSi: 'ප්‍රතිචාර කාලය', definitionSi: 'Threshold ඉක්මවූ පසු Compressor එක ශබ්දය අඩු කිරීමට ගත කරන කාලය.' },
          { termEn: 'Release', termSi: 'මුදා හැරීමේ කාලය', definitionSi: 'ශබ්දය Threshold ට පහළ ගිය පසු නැවත මුල් තත්ත්වයට ඒමට ගත කරන කාලය.' },
          { termEn: 'Knee', termSi: 'නැවුම් ස්ථානය', definitionSi: 'Threshold ස්ථානයේ Compressor එක ක්‍රියාත්මක වන සුමටාව (Soft/Hard).' },
          { termEn: 'Makeup Gain', termSi: 'පූර්ණ ශක්ති මට්ටම', definitionSi: 'Compression නිසා අඩු වූ සමස්ත මට්ටම නැවත ඉහළ නැංවීම.' },
        ],
        formulaOrDiagram:
          'Threshold: −18 dBFS | Ratio: 4:1 | Attack: 10 ms | Release: 100 ms\n\nඋදා: Input Peak −10 dBFS (Threshold ට 8 dB ඉහළ)\n→ Output = −18 + (8 ÷ 4) = −18 + 2 = −16 dBFS  (Gain Reduction = 6 dB)\n\nGain Reduction මීටරය සාමාන්‍යයෙන් 2–6 dB තබා ගැනීම ප්‍රායෝගිකයි.',
      },
      {
        id: 's-702-2',
        headingSi: 'Parallel Compression සහ Gating',
        headingEn: 'Parallel Compression and Gating',
        bodySi:
          'Parallel Compression (New York Compression) — Track එකේ පිටපතක් තදින් Compress කර මුල් පිටපත සමඟ මිශ්‍ර කිරීමයි. මෙයින් මුල් ශබ්දයේ ස්වභාවික බව (Transients) රැක ගනිමින් ප්‍රබලතාව වැඩි කළ හැක. Gate එකක් Compressor එකේ ප්‍රතිවිරුද්ධයයි: Threshold ට පහළින් ඇති ශබ්දය සම්පූර්ණයෙන්ම ඉවත් කරයි (බෙර මයික්‍රෆෝන අතර Bleed ඉවත් කිරීමට). De-esser යනු නිශ්චිත සංඛ්‍යාත පරාසයක් (සාමාන්‍යයෙන් 5–8 kHz) පමණක් ඉලක්ක කරන Compressor එකකි.',
        keyTerms: [
          { termEn: 'Parallel Compression', termSi: 'සමාන්තර සම්පීඩනය', definitionSi: 'තදින් Compress කළ පිටපතක් මුල් පිටපත සමඟ මිශ්‍ර කිරීමෙන් ප්‍රබලතාව වැඩි කිරීම.' },
          { termEn: 'Gate / Expander', termSi: 'ද්වාරය', definitionSi: 'Threshold ට පහළින් ඇති ශබ්දය අඩු කරන හෝ ඉවත් කරන මෙවලම.' },
          { termEn: 'De-esser', termSi: 'සිබිලන්ස් පාලකය', definitionSi: '"ස්" වැනි ඉහළ සංඛ්‍යාත ශබ්ද පාලනය කරන නිශ්චිත Compressor එක.' },
          { termEn: 'Transient', termSi: 'ආඝාතයේ මුල් කොටස', definitionSi: 'ශබ්දයක ආරම්භයේ ඇති කෙටි, ඉහළ ශක්තියක් සහිත කොටස.' },
        ],
      },
      {
        id: 's-702-3',
        headingSi: 'Reverb සහ Delay',
        headingEn: 'Reverb and Delay',
        bodySi:
          'Reverb එකකින් කාමරයක ස්වභාවය අනුකරණය කරයි. Room Reverb — කුඩා කාමරයක් ලෙස කෙටිය. Hall Reverb — විශාල ශාලාවක් ලෙස දිගුයි. Plate Reverb — දීප්තිමත් සහ ලෝහමය (Vocal සඳහා ජනප්‍රිය). Reverb එකේ ප්‍රධාන පරාමිතීන්: Pre-delay (සෘජු ශබ්දයට පසු Reverb එක ආරම්භ වන කාලය), Decay Time (Reverb එක පවතින කාලය), Wet/Dry Mix. Pre-delay වැඩි කිරීමෙන් Vocal එකේ පැහැදිලි බව රැක ගත හැක.',
        keyTerms: [
          { termEn: 'Reverb Decay Time (RT60)', termSi: 'ශබ්දය ක්ෂය වන කාලය', definitionSi: 'ශබ්දය නතර වූ පසු 60 dB කින් (1000 වෙනි කොටසට) පහළ යාමට ගතවන කාලය.' },
          { termEn: 'Pre-delay', termSi: 'පෙර ප්‍රමාදය', definitionSi: 'සෘජු ශබ්දයට පසු Reverb එක ආරම්භ වීමට පෙර ගතවන කාලය.' },
          { termEn: 'Delay / Echo', termSi: 'ප්‍රමාද ශබ්දය', definitionSi: 'ශබ්දය නිශ්චිත කාලයකට පසු නැවත ඇසෙන, කාලය හා සංගීතයට ගැළපිය හැකි Effect එක.' },
          { termEn: 'Wet/Dry Mix', termSi: 'තෙත්/වියලි මිශ්‍රණය', definitionSi: 'Effect එක සහිත ශබ්දය (Wet) සහ රහිත ශබ්දය (Dry) අතර අනුපාතය.' },
        ],
      },
      {
        id: 's-702-4',
        headingSi: 'Panning සහ Stereo Width',
        headingEn: 'Panning and Stereo Width',
        bodySi:
          'Panning එකෙන් භාණ්ඩයක් වම් හෝ දකුණු ස්පීකරයට සමීප කරයි. වඩාත් නිතර භාවිතා වන සැකැස්ම: Kick, Snare, Bass, Lead Vocal මධ්‍යයේ (Center). Hi-hat, Guitar, Keyboards පැතිවලට. සමාන ප්‍රමාණයක් වම් සහ දකුණු දෙපසට බෙදා සමතුලිතභාවය රැක ගන්න. ස්පීකර දෙකක් ළඟා වන එකම සංඥාවේ කුඩා ප්‍රමාදයක් නිසා (Haas Effect) ශබ්දය පැතිවලට පැතිරෙන බවක් දැනේ.',
        keyTerms: [
          { termEn: 'Panning', termSi: 'පැති බෙදා හැරීම', definitionSi: 'ශබ්දය වම් හෝ දකුණු ස්පීකරයට සමීප කිරීම.' },
          { termEn: 'Stereo Width', termSi: 'ස්ටීරියෝ පළල', definitionSi: 'ශබ්ද දර්ශනයේ වම් සහ දකුණු දෙපස විහිදී යාමේ පරාසය.' },
          { termEn: 'Phase Correlation Meter', termSi: 'අවස්ථා සහසම්බන්ධතා මීටරය', definitionSi: '+1 සිට −1 දක්වා වන මිනුමකින් වම් සහ දකුණු සංඥා අතර සම්බන්ධතාව දක්වයි.' },
        ],
        formulaOrDiagram:
          'Mono Compatible (Phase +1 සිට 0 දක්වා)  ✓ Mono ස්පීකරයකදී හොඳින් ඇසේ\nOut of Phase (Phase 0 සිට −1 දක්වා)    ✗ Mono වලදී ශබ්දය අවලංගු වේ\n\nසෑම Mix එකක්ම Mono ලෙස පරීක්ෂා කිරීම අනිවාර්යයෙන් කළ යුතුය.',
      },
    ],
    examples: [
      {
        id: 'ex-702-1',
        titleSi: 'Vocal සඳහා Compressor සැකසුමක්',
        titleEn: 'A Starting Compressor Setting for Vocals',
        descriptionSi:
          'ගායනයක් ස්ථාවර මට්ටමක තබා ගැනීමට ආරම්භක සැකසුමක්. මෙය නියත විසඳුමක් නොවන අතර මූලාශ්‍රයේ ස්වභාවය අනුව සකස් කළ යුතුය.',
        notationOrSteps:
          'Threshold : −18 dBFS (Gain Reduction 3–6 dB ලැබෙන ලෙස)\nRatio     : 3:1\nAttack    : 10–20 ms (ආරම්භක ශබ්දය සුරකින්න)\nRelease   : 80–150 ms (සංගීතයේ ලයට ගැළපෙන්න)\nKnee      : Soft\nMakeup    : Gain Reduction අගයට සමානව නැවත ඉහළ නංවන්න',
      },
    ],
    exercises: [
      {
        id: 'exer-702-1',
        titleSi: 'Mono Compatibility පරීක්ෂා කිරීම',
        instructionsSi: 'ඕනෑම Mix එකක් අවසන් කිරීමට පෙර මෙම පියවර 6 අනුගමනය කරන්න.',
        stepsSi: [
          'ඔබේ Mix එක සාමාන්‍ය ලෙස Stereo වලින් සවන් දෙන්න.',
          'Master Channel එකේ Mono පරීක්ෂාව සක්‍රීය කරන්න.',
          'ශබ්දය සැලකිය යුතු ලෙස අඩු වුවහොත් හෝ කොටස් අතුරුදහන් වුවහොත් Phase ගැටලුවක් ඇත.',
          'Phase Correlation Meter එක +1 සහ 0 අතර තිබිය යුතුයි.',
          'Panning අතිශයින් අඩු කර හෝ එක් පැත්තකට සියල්ල ගෙන ගොස් පරීක්ෂා කරන්න.',
          'නිවැරදි ප්‍රතිඵලය ලැබෙන තෙක් පියවර නැවත කරන්න.',
        ],
        linkedLabTab: 'visualizer',
      },
    ],
    exerciseIds: ['exer-702-1'],
    quizIds: ['quiz-702'],
    summarySi:
      'Compressor පරාමිතීන් 6 ක් ඇත. Threshold සහ Ratio මගින් අඩු කිරීමේ ප්‍රමාණය තීරණය වන අතර Attack සහ Release මගින් හැඩය තීරණය වේ. Parallel Compression ස්වභාවික බව රැක ගනී. Reverb සහ Delay අවකාශය ලබා දෙයි. සෑම Mix එකක්ම Mono Compatibility පරීක්ෂා කිරීම අත්‍යවශ්‍යයි.',
    furtherPracticeSi: [
      'Compressor එකක Attack අගය 0 ms සහ 100 ms ලෙස සසඳා වෙනස හඳුනා ගන්න.',
      'ඔබේ ප්‍රියතම ගීතයක් Mono වලින් අසා කිසිදු කොටසක් අතුරුදහන් නොවන බව තහවුරු කර ගන්න.',
    ],
    published: true,
    order: 2,
    updatedAt: UPDATED_AT,
  },

  // =====================================================================================
  // LEVEL 8 — MASTERING
  // =====================================================================================
  {
    id: 'lesson-801',
    slug: 'mastering-fundamentals-loudness-and-true-peak',
    courseId: 'course-level-8',
    titleSi: 'Mastering මූලධර්ම — Loudness (LUFS), True Peak සහ Limiting',
    titleEn: 'Mastering Fundamentals: Loudness, True Peak and Limiting',
    descriptionSi:
      'Mixing සහ Mastering අතර වෙනස, Tonal Balance, Broad EQ, Limiter සැකසුම, Integrated සහ Short-term LUFS, True Peak (dBTP), Inter-sample Peaks, Dithering සහ බෙදාහැරීමේ සම්මත.',
    category: 'mastering',
    level: 8,
    prerequisites: ['compression-reverb-and-stereo-imaging'],
    estimatedMinutes: 30,
    learningObjectives: [
      'Mixing සහ Mastering අතර ඇති ප්‍රධාන වෙනස්කම් 5 ලැයිස්තුගත කිරීම.',
      'Integrated සහ Short-term LUFS අතර වෙනස පැහැදිලි කිරීම.',
      'True Peak සහ Sample Peak අතර වෙනස දැන Inter-sample Peaks අවබෝධ කර ගැනීම.',
      'Dithering අවශ්‍ය වන අවස්ථාව හඳුනා ගැනීම.',
      'ඕනෑම Mastering සැකසුමක් නියත සත්‍යයක් නොවන බව වටහාගෙන ශ්‍රවණය මත තීරණ ගැනීම.',
    ],
    sections: [
      {
        id: 's-801-1',
        headingSi: 'Mixing සහ Mastering අතර වෙනස',
        headingEn: 'The Difference Between Mixing and Mastering',
        bodySi:
          'මෙය වඩාත් නිතර වැරදියට වටහාගන්නා තැනකි. Mixing යනු සියලුම Track එකිනෙක සමබර කර සම්පූර්ණ Stereo ශබ්ද දර්ශනයක් නිර්මාණය කිරීමයි. එය Multi-track මට්ටමින් සිදු වේ. Mastering යනු සම්පූර්ණ වූ Stereo Mix එකක් සියලුම ශ්‍රවණ පද්ධතිවල නිවැරදිව ඇසෙන ලෙස සකස් කිරීමයි. Mastering එකකදී බොහෝ විට වෙනස් කළ හැක්කේ ඉතා කුඩා ප්‍රමාණයකි - එහි අරමුණ මිශ්‍රණය අලුතින් කිරීම නොව එය අවසන් කිරීමයි. Mix එක දුර්වල නම් Mastering එකකින් එය සුවිශේෂී කළ නොහැක.',
        bulletPointsSi: [
          'Mixing — Multi-track (Track 20–100). අරමුණ: ගැළපීම සහ පැහැදිලි බව.',
          'Mastering — Stereo (Track 1). අරමුණ: සමබරතාව, Loudness සහ බෙදාහැරීමට සූදානම.',
          'Mastering එකේදී සාමාන්‍යයෙන් EQ වෙනස්කම් 1–3 dB ට අඩුවෙන් තබා ගනී.',
          'Mix එකේ Compressor 5–6 ක් තිබිය හැකි නමුත් Master Bus එකේ එකක් හෝ දෙකක් පමණි.',
        ],
        keyTerms: [
          { termEn: 'Mixing', termSi: 'මිශ්‍රණය', definitionSi: 'සියලුම ට්‍රැක් එකිනෙක සමබර කර සම්පූර්ණ Stereo දර්ශනයක් නිර්මාණය කිරීම.' },
          { termEn: 'Mastering', termSi: 'අවසාන නිමාව', definitionSi: 'සම්පූර්ණ Mix එක බෙදාහැරීමට සුදුසු ලෙස සමබර කර අවසන් කිරීම.' },
          { termEn: 'Tonal Balance', termSi: 'සංඛ්‍යාත සමතුලිතතාව', definitionSi: 'අඩු, මධ්‍ය සහ ඉහළ සංඛ්‍යාත ප්‍රබලතා අතර ඇති සමබරතාව.' },
        ],
      },
      {
        id: 's-801-2',
        headingSi: 'Loudness — LUFS සහ LU',
        headingEn: 'Understanding LUFS Loudness Measurement',
        bodySi:
          'LUFS යනු මිනිස් කනට ශබ්දය ඇසෙන ආකාරය (K-weighting Filter) සහ කාලය සැලකිල්ලට ගනිමින් ශ්‍රවණ ප්‍රබලතාව මනින ජාත්‍යන්තර සම්මතයයි. Integrated LUFS — සම්පූර්ණ ගීතයේ සමස්ත සාමාන්‍යයයි. Short-term LUFS — අවසන් තත්පර 3 ක ප්‍රබලතාවයි. Momentary LUFS — අවසන් මිලි තත්පර 400 ක ප්‍රබලතාවයි. Loudness Range (LRA) — ගීතයේ ඉහළ සහ පහළ ප්‍රබලතා අතර පරතරයයි.',
        keyTerms: [
          { termEn: 'LUFS', termSi: 'සම්මත ශ්‍රවණ ප්‍රබලතා ඒකකය', definitionSi: 'කනට දැනෙන ප්‍රබලතාව සහ කාලය සැලකිල්ලට ගන්නා සම්මත ඒකකය.' },
          { termEn: 'Integrated LUFS', termSi: 'සමස්ත ප්‍රබලතාව', definitionSi: 'සම්පූර්ණ නිර්මාණයේ සමස්ත සාමාන්‍ය ප්‍රබලතාව.' },
          { termEn: 'Loudness Range (LRA)', termSi: 'ප්‍රබලතා පරාසය', definitionSi: 'ගීතයේ ප්‍රබලම සහ මෘදුම කොටස් අතර ඇති පරතරය.' },
          { termEn: 'K-weighting', termSi: 'K-බර කිරීමේ පෙරහන', definitionSi: 'මිනිස් කනට ඇසෙන ආකාරය අනුකරණය කරන සම්මත පෙරහන.' },
        ],
        formulaOrDiagram:
          'LUFS මිනුම් වර්ග:\nMomentary  (400 ms)   — ක්ෂණික ප්‍රබලතාව\nShort-term (3 sec)    — කෙටි කාලීන සාමාන්‍යය\nIntegrated (සම්පූර්ණ) — සමස්ත සාමාන්‍යය  ← බෙදාහැරීමේදී වඩාත් වැදගත්\nLRA                   — ප්‍රබලතා පරතරය (dB වලින්)\n\nඅවසාන නිකුතු දෙකක් සංසන්දනය කිරීමේදී Integrated LUFS අගයන් භාවිතා කරන්න.',
      },
      {
        id: 's-801-3',
        headingSi: 'True Peak සහ Inter-sample Peaks',
        headingEn: 'True Peak and Inter-sample Peaks',
        bodySi:
          'ඩිජිටල් ගොනුවේ සටහන් වන Sample Peak අගයන් පමණක් බැලීම ප්‍රමාණවත් නොවේ. නියැදි අතර ඇති සැබෑ අගය (Inter-sample Peak) ඊට වඩා ඉහළ විය හැක. D/A Converter එකට මෙම ඉහළ අගය ලැබුණහොත් විකෘතියක් ඇතිවේ. එහෙයින් නිවැරදි මිනුම True Peak (dBTP) වේ. නිවැරදි නිකුතුවක් සඳහා True Peak මට්ටම −1.0 dBTP ට අඩුවෙන් තබා ගැනීම වඩාත් ආරක්ෂිතයි.',
        keyTerms: [
          { termEn: 'True Peak (dBTP)', termSi: 'සැබෑ උපරිම මට්ටම', definitionSi: 'නියැදි අතර ඇති සැබෑ උපරිම සංඥා මට්ටම.' },
          { termEn: 'Inter-sample Peak', termSi: 'නියැදි අතර උපරිමය', definitionSi: 'නියැදි දෙකක් අතර පවතින, නියැදියට හසු නොවන උපරිම සංඥාව.' },
          { termEn: 'Oversampling', termSi: 'අධි නියැදීම', definitionSi: 'නිවැරදි True Peak මිනුම සහ Limiting සඳහා Sample Rate එක තාවකාලිකව වැඩි කිරීම.' },
        ],
      },
      {
        id: 's-801-4',
        headingSi: 'Dithering සහ Bit Depth පරිවර්තනය',
        headingEn: 'Dithering and Bit Depth Conversion',
        bodySi:
          '24-bit වලින් 16-bit වෙත පරිවර්තනය කරන විට Quantization ඝෝෂාවක් ඇතිවේ. Dithering යනු ඉතා කුඩා, අහඹු ඝෝෂාවක් එක් කිරීමෙන් එම Quantization දෝෂය ශබ්දයට අහිතකර නොවන ලෙස බෙදා හැරීමයි. 16-bit සඳහා මෙය අතිශයින් වැදගත්ය. සාමාන්‍යයෙන් Dithering යොදනු ලබන්නේ සම්පූර්ණ නිර්මාණයේ අවසන් පියවර ලෙස පමණක් විය යුතුය (එක් වරක් පමණක්).',
        keyTerms: [
          { termEn: 'Dithering', termSi: 'ඩිතරින්', definitionSi: 'Bit Depth පරිවර්තනයේදී quantization ඝෝෂාව හානිකර නොවන ලෙස බෙදා හැරීම.' },
          { termEn: 'Noise Shaping', termSi: 'ඝෝෂා හැඩගැස්වීම', definitionSi: 'Quantization ඝෝෂාව මිනිස් කනට අඩුවෙන් ඇසෙන සංඛ්‍යාත ප්‍රදේශවලට යොමු කිරීම.' },
          { termEn: 'Sample Rate Conversion (SRC)', termSi: 'නියැදි වේග පරිවර්තනය', definitionSi: 'එක් Sample Rate එකක සිට තවත් එකකට පරිවර්තනය කිරීම.' },
        ],
        formulaOrDiagram:
          '24-bit → 16-bit : Dithering අවශ්‍යයි ✓\n16-bit → 16-bit : Dithering අවශ්‍ය නැත ✗\n32-bit float → 24-bit: සාමාන්‍යයෙන් Dithering අවශ්‍ය නැත\n\nපිළිවෙල: Broad EQ → Compression → Limiting → Sample Rate Conversion → Dither → 16-bit Export',
      },
      {
        id: 's-801-5',
        headingSi: 'තත්ත්ව පරීක්ෂාව (Quality Control)',
        headingEn: 'Quality Control Checklist',
        bodySi:
          'අවසන් ගොනුව බෙදා හැරීමට පෙර පහත පරීක්ෂා කරන්න. ඕනෑම Mastering සැකසුමක් සාර්වත්‍ර නියමයක් නොවන බව මතක තබා ගන්න. එය මූලාශ්‍රයේ ස්වභාවය සහ අරමුණු කරන බෙදාහැරීමේ වේදිකාව අනුව වෙනස් වේ.',
        bulletPointsSi: [
          'True Peak −1.0 dBTP ට අඩු ද?',
          'Integrated LUFS අගය අරමුණු කරන මට්ටමට සමීප ද?',
          'ස්පීකර්, Headphones, දුරකථන ස්පීකර් සහ කාර් එකක ඇසුවේ ද?',
          'Mono පරීක්ෂාව සාර්ථක ද?',
          'ගීතයේ ආරම්භය සහ අවසානය නිහඬව, කැපීමකින් තොරව ඇත්තේ ද?',
          'ගොනු නාමකරණය සහ Metadata (නම, කලාකරු, ISRC) නිවැරදි ද?',
        ],
        keyTerms: [
          { termEn: 'Metadata', termSi: 'ගොනු තොරතුරු', definitionSi: 'ගොනුව තුළම සටහන් වන තොරතුරු (නම, කලාකරු, ISRC කේතය).' },
          { termEn: 'ISRC', termSi: 'ජාත්‍යන්තර පටිගත කේතය', definitionSi: 'සෑම පටිගත කිරීමකටම ලබා දෙන අනන්‍ය සංගීත හැඳුනුම් කේතය.' },
          { termEn: 'Delivery Format', termSi: 'බෙදාහැරීමේ ආකෘතිය', definitionSi: 'නිකුතුව සඳහා තෝරාගන්නා ගොනු ආකෘතිය (WAV, AAC, FLAC).' },
        ],
      },
    ],
    examples: [
      {
        id: 'ex-801-1',
        titleSi: 'True Peak සහ Sample Peak අතර වෙනස',
        titleEn: 'True Peak versus Sample Peak',
        descriptionSi:
          'ඔබේ නිකුතුවේ True Peak මට්ටම Sample Peak මට්ටමට වඩා ඉහළ විය හැක. එයට හේතුව නියැදි අතර ඇති සැබෑ උපරිමය නියැදියට හසු නොවීමයි.',
        notationOrSteps:
          'Sample Peak = −0.3 dBFS (නියැදි අගයන් මත පමණක් මනින ලදී)\nTrue Peak   = +0.4 dBTP (නියැදි අතර සැබෑ අගය)\n\n→ D/A Converter එකේදී +0.4 dBTP මට්ටම විකෘතියක් ඇති කරයි!\n→ නිවැරදි කිරීම: True Peak Limiter එක −1.0 dBTP ට සකසන්න.',
      },
    ],
    exercises: [
      {
        id: 'exer-801-1',
        titleSi: 'Mastering QC ලැයිස්තුවක් සකස් කිරීම',
        instructionsSi: 'ඔබේ ඊළඟ නිකුතුව සඳහා QC ලැයිස්තුවක් සකස් කරන්න.',
        stepsSi: [
          'ඔබේ නිකුතුව සඳහා ඉලක්ක කරන Integrated LUFS අගය තීරණය කරන්න.',
          'True Peak ඉලක්කය −1.0 dBTP ලෙස සකසන්න.',
          'ශ්‍රවණ පද්ධති 4 කින් අසා සටහන් ගන්න (Monitor, Headphones, Phone, Car).',
          'Mono පරීක්ෂාව සිදු කරන්න.',
          '16-bit WAV අපනයනය කරන විට Dithering සක්‍රීය කරන්න.',
          'ගොනු නම සහ Metadata සම්පූර්ණ කරන්න (Artist_Name-Track_Title-Master_v1.wav).',
        ],
        linkedLabTab: 'analyzer',
      },
    ],
    exerciseIds: ['exer-801-1'],
    quizIds: ['quiz-801'],
    summarySi:
      'Mixing යනු Multi-track සමබර කිරීමයි; Mastering යනු Stereo Mix එක බෙදාහැරීමට සකස් කිරීමයි. LUFS මගින් කනට දැනෙන ප්‍රබලතාව මනින අතර True Peak මගින් සැබෑ උපරිමය මනිනු ලැබේ. Bit Depth අඩු කිරීමේදී Dithering අවශ්‍යයි. ඕනෑම අගයක් සාර්වත්‍ර නියමයක් නොවේ - ශ්‍රවණය මත තීරණ ගන්න.',
    furtherPracticeSi: [
      'ඔබේ ප්‍රියතම වාණිජ ගීතයක් Local Audio Analyzer Lab එකට දමා Peak සහ RMS අගයන් පරීක්ෂා කරන්න.',
      'ඔබේම Mix එකක් ශ්‍රවණ පද්ධති 4 කින් අසා සටහන් 4 ක් ලියන්න.',
    ],
    published: true,
    order: 1,
    updatedAt: UPDATED_AT,
  },
  {
    id: 'lesson-902',
    slug: 'capstone-projects-and-technical-reflection',
    courseId: 'course-level-9',
    titleSi: 'Capstone ව්‍යාපෘති 6 සහ තාක්ෂණික පරාවර්තනය',
    titleEn: 'The Six Capstone Projects and Technical Reflection',
    descriptionSi:
      'මුල් සංගීත අදහසේ සිට අවසන් Master දක්වා සම්පූර්ණ නිෂ්පාදන ක්‍රියාවලිය, නිර්මාණාත්මක තීරණ සටහන් කිරීම සහ ප්‍රතිනිෂ්පාදනය කළ හැකි Workflow එකක් ගොඩනැගීම.',
    category: 'advanced-practice',
    level: 9,
    prerequisites: ['mastering-fundamentals-loudness-and-true-peak'],
    estimatedMinutes: 32,
    learningObjectives: [
      'සම්පූර්ණ නිෂ්පාදන දාමය (Composition → Mastering) සැලසුම් කර ක්‍රියාත්මක කිරීම.',
      'ඔබේ නිර්මාණාත්මක හා තාක්ෂණික තීරණ ලිඛිතව පැහැදිලි කිරීම.',
      'ප්‍රතිනිෂ්පාදනය කළ හැකි (Reproducible) Workflow එකක් ලේඛනගත කිරීම.',
      'ඔබේ ව්‍යාපෘතියෙන් ඉගෙන ගත් පාඩම් විවේචනාත්මකව විශ්ලේෂණය කිරීම.',
    ],
    sections: [
      {
        id: 's-902-1',
        headingSi: 'Capstone ව්‍යාපෘති 6',
        headingEn: 'The Six Capstone Projects',
        bodySi:
          'මට්ටම් 1 සිට 9 දක්වා ඉගෙන ගත් සියලු දැනුම එකට යොදා ගනිමින් එක් මූලික සංගීත අදහසක් සම්පූර්ණ නිර්මාණයක් බවට වර්ධනය කරන්න. සෑම පියවරකදීම ඔබේ තීරණ සටහන් කර තබා ගැනීම මෙම ව්‍යාපෘතියේ ප්‍රධාන කොටසකි.',
        bulletPointsSi: [
          'Capstone 1 — මුල් සංගීත නිර්මාණය: ඔබේම Motif, තනුව සහ කෝඩ් රටාවක් සහිත 1–2 මිනිත්තු තනුවක් ලියන්න.',
          'Capstone 2 — සම්පූර්ණ සංයෝජනය: එය භාණ්ඩ 8 කට වඩා අඩුවෙන් සංයෝජනය කරන්න.',
          'Capstone 3 — නිෂ්පාදිත Multi-track Session: Track සියල්ල නම් කර පිරිසිදුව සුරකින්න (48 kHz / 24-bit).',
          'Capstone 4 — සම්පූර්ණ Mix එකක්: EQ, Compression, Reverb, Panning සහ Automation යොදන්න.',
          'Capstone 5 — Mastered නිමාව: True Peak −1.0 dBTP ට අඩුවෙන්, ඔබේ ඉලක්කයට ගැළපෙන ප්‍රබලතාවයකින්.',
          'Capstone 6 — ලිඛිත තාක්ෂණික පරාවර්තනය: ගත් සෑම තීරණයක් සහ එහි පදනම ලියා තබන්න.',
        ],
        keyTerms: [
          { termEn: 'Capstone Project', termSi: 'අවසන් සම්පූර්ණ ව්‍යාපෘතිය', definitionSi: 'ඉගෙන ගත් සියලු නිපුණතා එකට යොදා ගනිමින් නිම කරන සම්පූර්ණ සංගීත නිර්මාණය.' },
          { termEn: 'Reproducible Workflow', termSi: 'ප්‍රතිනිෂ්පාදනය කළ හැකි ක්‍රියාවලිය', definitionSi: 'අනෙකෙකුට හෝ ඔබටම පසුව නැවත එම ප්‍රතිඵලයම ලබා ගත හැකි ලෙස ලේඛනගත කළ ක්‍රියාවලිය.' },
        ],
      },
      {
        id: 's-902-2',
        headingSi: 'ඔබේ ව්‍යාපෘතියේ සැලැස්ම',
        headingEn: 'Planning Your Project',
        bodySi:
          'ආරම්භ කිරීමට පෙර ලිඛිත සැලැස්මක් සාදන්න. මෙය ඔබේ කලාත්මක අරමුණ තහවුරු කර ව්‍යාපෘතිය අතරමං වීමෙන් වළක්වයි.',
        bulletPointsSi: [
          'අරමුණ සහ මනූද — ගීතය කුමක් පිළිබඳද? කවර හැඟීමක්ද?',
          'ඉලක්ක කරන කාල ප්‍රමාණය — මිනිත්තු 2 ක්ද? මිනිත්තු 4 ක්ද?',
          'වාද්‍ය භාණ්ඩ ලැයිස්තුව සහ ඒවායේ කාර්යයන්.',
          'ගීත ආකෘතිය සහ සෑම කොටසකම කාල ප්‍රමාණය (Bars).',
          'නිෂ්පාදන සැකසුම් — Sample Rate, Tempo සහ අවශ්‍ය Plugins.',
          'කාල රාමුව — සැලසුම් කිරීම, රචනය, නිෂ්පාදනය, Mixing සහ Mastering සඳහා දින වෙන් කරන්න.',
        ],
      },
      {
        id: 's-902-3',
        headingSi: 'තාක්ෂණික පරාවර්තනය ලිවීම',
        headingEn: 'Writing the Technical Reflection',
        bodySi:
          'මෙය වඩාත් වැදගත් මෙන්ම බොහෝ දෙනා මග හරින කොටසයි. ඔබ ගත් සෑම තීරණයක් සහ එහි පදනම ලිවීම මගින් ඔබේ දැනුම තහවුරු වන අතර අනාගතයේදී එම දැනුම ප්‍රතිනිෂ්පාදනය කළ හැකි වේ. එහිදී අසාර්ථක තීරණද අවංකව සටහන් කරන්න - ඒවායින් ඉගෙන ගැනීම තමයි වඩාත් වැදගත්.',
        bulletPointsSi: [
          'ආරම්භක අදහස කුමක්ද, එය කෙසේ වෙනස් වියද?',
          'කෝඩ් රටාව තෝරා ගත්තේ ඇයි? අනෙක් විකල්ප මොනවාද?',
          'Vocal එකට යෙදූ EQ සහ Compression සැකසුම් සහ ඒවාට හේතු.',
          'ශ්‍රවණ පද්ධති කිහිපයක් අසා හඳුනාගත් ගැටළු සහ විසඳුම්.',
          'Master එකේ Integrated LUFS සහ True Peak අගයන් සහ ඒවා තෝරාගත් හේතු.',
          'නැවත කරන්නේ නම් වෙනස් කරන දේ 2 ක්.',
        ],
      },
    ],
    examples: [
      {
        id: 'ex-902-1',
        titleSi: 'Capstone උදාහරණය — මිනිත්තු 2 ක Ballad',
        titleEn: 'Capstone Example: A Two-Minute Ballad',
        descriptionSi:
          'මෙය මට්ටම් 1–9 හි ඉගෙන ගත් සියලු අංග එකට යොදන ලද සැලැස්මකි.',
        notationOrSteps:
          'Tempo: 72 BPM | Key: A Natural Minor | 4/4\n\nIntro (Bars 1–4)    : Piano පමණයි (Am → F → C → G)\nVerse (Bars 5–12)   : Piano + Vocal\nChorus (Bars 13–20) : + Bass + Strings + Light Drums\nBridge (Bars 21–28) : Breakdown — Piano + Vocal පමණයි\nFinal Chorus (29–36): සියලු භාණ්ඩ + Octave Vocal\nOutro (Bars 37–40)  : Piano + Fade\n\nMaster ඉලක්කය: Integrated ~−14 LUFS | True Peak −1.0 dBTP',
        synthPreviewNotes: [57, 60, 64, 65, 60, 64, 67, 69, 60, 64, 67, 72],
        synthType: 'chord',
      },
    ],
    exercises: [
      {
        id: 'exer-902-1',
        titleSi: 'සම්පූර්ණ Capstone ව්‍යාපෘතිය',
        instructionsSi: 'මෙය පාඨමාලාවේ අවසාන හා වඩාත් වැදගත් අභ්‍යාසයයි. එය නිම කිරීමට දින 7–14 ක් වෙන් කරන්න.',
        stepsSi: [
          'සැලැස්ම ලියන්න. කලාත්මක අරමුණ එක් වාක්‍යයකින් ලියන්න.',
          'මුල් Motif එකක් සහ එයින් තනුවක් රචනා කරන්න (Capstone 1).',
          'එය භාණ්ඩ 8 කට වඩා අඩු ප්‍රමාණයකින් සංයෝජනය කරන්න (Capstone 2).',
          'Track සියල්ල නම් කර පිරිසිදුව සුරකින්න (Capstone 3).',
          'EQ, Compression, Reverb සහ Panning යොදා Mix එක නිම කරන්න (Capstone 4).',
          'ශ්‍රවණ පද්ධති 4 කින් පරීක්ෂා කර Master එක සකසන්න (Capstone 5).',
          'ඔබේ තීරණ සියල්ල පැහැදිලි කරමින් තාක්ෂණික පරාවර්තනය ලියන්න (Capstone 6).',
        ],
        linkedLabTab: 'analyzer',
      },
    ],
    exerciseIds: ['exer-902-1'],
    quizIds: ['quiz-902'],
    summarySi:
      'Capstone ව්‍යාපෘති 6 මගින් ඔබේ සම්පූර්ණ දැනුම එකට යොදා ගනී. සැලැස්මක් සකස් කිරීම නිර්මාණය අතරමං වීමෙන් වළක්වයි. තාක්ෂණික පරාවර්තනය ලිවීම මගින් ඔබේ දැනුම තහවුරු වන අතර අනාගත වැඩ කටයුතුවලට ප්‍රතිනිෂ්පාදනය කළ හැකි පදනමක් ලැබේ.',
    furtherPracticeSi: [
      'ඔබේ Capstone නිර්මාණය පාසලක හෝ මිතුරන් අතර ඉදිරිපත් කර ධනාත්මක හා විවේචනාත්මක ප්‍රතිචාර ලබා ගන්න.',
      'ඔබේම ලැයිස්තුවේ ඇති අඩුවෙන් ප්‍රියතම ගීතයක් වැඩිදියුණු කිරීමට තීරණය කරන්න.',
    ],
    published: true,
    order: 2,
    updatedAt: UPDATED_AT,
  },
];
