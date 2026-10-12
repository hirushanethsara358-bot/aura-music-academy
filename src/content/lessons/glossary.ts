import { GlossaryTerm } from '../../types/content';

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: 'term-pitch',
    termEn: 'Pitch',
    termSi: 'තාරතාව (ස්වරයේ උස් පහත් බව)',
    category: 'music-foundations',
    definitionSi:
      'ශබ්ද තරංගයක මූලික සංඛ්‍යාතය (Fundamental Frequency) අනුව අපගේ කනට දැනෙන ස්වරයක උස් හෝ පහත් බවයි. සංඛ්‍යාතය වැඩි වන විට Pitch එක ඉහළ යයි.',
    exampleSi: 'A4 ස්වරයේ සංඛ්‍යාතය 440 Hz වන අතර A5 ස්වරයේ සංඛ්‍යාතය 880 Hz වේ.',
  },
  {
    id: 'term-rhythm',
    termEn: 'Rhythm',
    termSi: 'රිද්මය',
    category: 'music-foundations',
    definitionSi: 'කාලයත් සමඟ සංගීත ස්වර සහ නිහඬතා (Rests) සංවිධානය වී ඇති රටාවයි.',
    exampleSi: '4/4 කාල මානයක Quarter Notes සහ Eighth Notes මිශ්‍ර කර වාදනය කරන බෙර රටාවක්.',
  },
  {
    id: 'term-tempo',
    termEn: 'Tempo (BPM)',
    termSi: 'ලය / වේගය (මිනිත්තුවකට ඇති තාල ගණන)',
    category: 'music-foundations',
    definitionSi: 'සංගීත නිර්මාණයක වේගය මනින ඒකකයයි. එය BPM (Beats Per Minute) ලෙස දක්වයි.',
    exampleSi: '60 BPM යනු තත්පරයකට එක් තාලයක් (Beat) බැගින් ගමන් කරන මන්දගාමී වේගයකි.',
  },
  {
    id: 'term-semitone',
    termEn: 'Semitone (Half Step)',
    termSi: 'අර්ධ ස්වරය',
    category: 'music-theory',
    definitionSi: 'බටහිර සංගීතයේ ස්වර දෙකක් අතර පවතින කුඩාම සම්මත පරතරයයි.',
    exampleSi: 'පියානෝවේ C සිට C# දක්වා හෝ E සිට F දක්වා ඇති පරතරය අර්ධ ස්වර 1 කි.',
  },
  {
    id: 'term-melody',
    termEn: 'Melody',
    termSi: 'තනුව (ස්වර මාලාවක් ලෙස ගොඩනැගෙන සංගීත අදහස)',
    category: 'composition',
    definitionSi:
      'තනි ස්වර එකින් එක අනුපිළිවෙළට වාදනය වීමෙන් හෝ ගායනා වීමෙන් ශ්‍රාවකයාට මතකයේ රැඳෙන ප්‍රධාන සංගීත රේඛාවයි.',
    exampleSi: 'ගීතයක ප්‍රධාන ගායකයා ගායනා කරන තනුව (Lead Vocal Melody).',
  },
  {
    id: 'term-harmony',
    termEn: 'Harmony',
    termSi: 'ස්වර සංයෝජනය (එකවර ඇසෙන ස්වර අතර සම්බන්ධතාව)',
    category: 'music-theory',
    definitionSi:
      'ස්වර දෙකක් හෝ වැඩි ගණනක් එකවර වාදනය වීමෙන් (Chords) තනුවට ලබා දෙන ගැඹුර සහ හැඟීම්බර පසුබිමයි.',
    exampleSi: 'C Major කෝඩ් එක (C - E - G) මගින් C ස්වරයේ තනුවකට ස්ථාවර පසුබිමක් ලබා දීම.',
  },
  {
    id: 'term-triad',
    termEn: 'Triad',
    termSi: 'ත්‍රිත්ව ස්වරය',
    category: 'music-theory',
    definitionSi: 'Root, Third සහ Fifth යන ස්වර තුන එකවර වාදනය කිරීමෙන් සෑදෙන මූලික කෝඩ් වර්ගයයි.',
    exampleSi: 'A Minor Triad එක A, C සහ E යන ස්වර තුනෙන් සමන්විත වේ.',
  },
  {
    id: 'term-voice-leading',
    termEn: 'Voice Leading',
    termSi: 'හඬ මෙහෙයවීම (සුමට කෝඩ් සම්බන්ධතාව)',
    category: 'composition',
    definitionSi:
      'එක් කෝඩ් එකක සිට ඊළඟ කෝඩ් එකට මාරු වීමේදී එක් එක් ස්වරය අවම දුරකින් හා සුමටව ගමන් කරවීමේ ශිල්පයයි.',
    exampleSi: 'C Major (C-E-G) සිට F Major 2nd Inversion (C-F-A) වෙත මාරුවීමේදී C ස්වරය පොදුවේ තබා ගැනීම.',
  },
  {
    id: 'term-arrangement',
    termEn: 'Arrangement',
    termSi: 'සංගීත සංයෝජනය',
    category: 'arrangement',
    definitionSi:
      'රචනා කරන ලද තනුවක් සහ කෝඩ් රටාවක් කුමන වාද්‍ය භාණ්ඩවලින්, කුමන ස්වර පරාසවල (Registers) සහ කුමන කොටස්වලදී වාදනය විය යුතුද යන්න සැලසුම් කිරීමයි.',
    exampleSi: 'Verse කොටසේදී Acoustic Guitar පමණක් යොදා Chorus කොටසේදී Strings සහ Drums එක් කිරීම.',
  },
  {
    id: 'term-daw',
    termEn: 'DAW (Digital Audio Workstation)',
    termSi: 'ඩිජිටල් ශබ්ද වැඩබිම (සංගීත නිෂ්පාදන මෘදුකාංගය)',
    category: 'production',
    definitionSi:
      'ශබ්ද පටිගත කිරීම, MIDI සංස්කරණය, Virtual Instruments වාදනය, Mixing සහ Mastering සිදු කරන මෘදුකාංග පද්ධතියයි.',
    exampleSi: 'Reaper, Cubase, Logic Pro, Ableton Live, සහ Studio One.',
  },
  {
    id: 'term-frequency',
    termEn: 'Frequency (Hz)',
    termSi: 'සංඛ්‍යාතය (හර්ට්ස් - Hz)',
    category: 'audio-engineering',
    definitionSi:
      'ශබ්ද තරංගයක් තත්පරයකට සම්පූර්ණ කරන කම්පන වාර ගණනයි. මිනිස් කනට ඇසෙන පරාසය දළ වශයෙන් 20 Hz සිට 20,000 Hz (20 kHz) දක්වා වේ.',
    exampleSi: 'Kick drum එකක මූලික බර 50–80 Hz අතර පවතින අතර Cymbals වල දීප්තිය 8–16 kHz අතර පවතී.',
  },
  {
    id: 'term-gain-staging',
    termEn: 'Gain Staging',
    termSi: 'ශබ්ද මට්ටම් කළමනාකරණය',
    category: 'audio-engineering',
    definitionSi:
      'ශබ්ද සංඥාවක් ගමන් කරන සෑම පියවරකදීම (Recording, Plugins, Buses) Noise සහ Digital Clipping ඇති නොවන පරිදි ප්‍රශස්ත මට්ටමක (Headroom සහිතව) පවත්වා ගැනීමයි.',
    exampleSi: '24-bit පටිගත කිරීමකදී සාමාන්‍ය මට්ටම -18 dBFS පමණ සහ උපරිම Peak මට්ටම -6 dBFS ට අඩුවෙන් තබා ගැනීම.',
  },
  {
    id: 'term-eq',
    termEn: 'Equalization (EQ)',
    termSi: 'සංඛ්‍යාත සමතුලිතකරණය',
    category: 'mixing',
    definitionSi: 'ශබ්ද සංඥාවක විශේෂිත සංඛ්‍යාත පරාසවල (Frequency Bands) ශබ්ද මට්ටම අඩු කිරීම (Cut) හෝ වැඩි කිරීම (Boost) මගින් පැහැදිලි බව සහ සමබරතාව සැකසීමයි.',
    exampleSi: 'Vocal track එකක අනවශ්‍ය අඩු සංඛ්‍යාත ඝෝෂාව ඉවත් කිරීමට 80 Hz High-Pass Filter එකක් යෙදීම.',
  },
  {
    id: 'term-compression',
    termEn: 'Compression',
    termSi: 'ශබ්දයේ Dynamic Range පාලනය කිරීම',
    category: 'mixing',
    definitionSi:
      'ශබ්දයක ඉතා ඉහළ මට්ටම් (Peaks) තෝරාගත් Threshold මට්ටමකදී අඩු කර, ශබ්දයේ උස්-පහත් පරතරය (Dynamic Range) පාලනය කිරීමයි.',
    exampleSi: 'ගායනයක රහසින් කියන වචන සහ හඬ නගා කියන වචන අතර ශබ්ද පරතරය සමබරව තබා ගැනීම.',
  },
  {
    id: 'term-lufs',
    termEn: 'LUFS (Loudness Units relative to Full Scale)',
    termSi: 'සම්මත ශබ්ද ප්‍රබලතා මිනුම (LUFS)',
    category: 'mastering',
    definitionSi:
      'මිනිස් කනට සංඛ්‍යාත ඇසෙන ආකාරය (K-weighting) සහ කාලය සැලකිල්ලට ගනිමින් ගීතයක සැබෑ ශ්‍රවණ ප්‍රබලතාව (Perceived Loudness) මනින ජාත්‍යන්තර සම්මත ඒකකයයි.',
    exampleSi: 'විවිධ Streaming වේදිකා සහ නිකුතු සඳහා Integrated LUFS සහ True Peak (dBTP) පරීක්ෂා කිරීම.',
  },
  {
    id: 'term-mastering',
    termEn: 'Mastering',
    termSi: 'අවසාන නිමාව (අවසාන Audio Mix එක නිකුත් කිරීමට සුදුසු ලෙස සකස් කිරීම)',
    category: 'mastering',
    definitionSi:
      'සම්පූර්ණ කරන ලද Stereo Mix එකක් සියලුම ශ්‍රවණ පද්ධතිවල (Speakers, Headphones, Phones) නිවැරදි Tonal Balance, Loudness සහ තත්ත්ව පරීක්ෂාව (QC) සහිතව බෙදා හැරීමට සූදානම් කිරීමේ අවසාන ඉංජිනේරු ක්‍රියාවලියයි.',
    exampleSi: 'ඇල්බමයක ගීත සියල්ල එකම ශබ්ද මට්ටමකට සහ Tonal ස්වභාවයකට ගෙන ඒම.',
  },
];
