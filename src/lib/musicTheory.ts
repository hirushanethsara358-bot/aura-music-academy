import {
  ChordDefinition,
  ChordInversion,
  ChordQuality,
  ChordResult,
  DiatonicChordInfo,
  IntervalInfo,
  NoteName,
  PitchInfo,
  ProgressionPreset,
  ProgressionStep,
  ScaleDefinition,
  ScaleResult,
  ScaleType,
} from '../types/music';

export const CHROMATIC_NOTES: NoteName[] = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
];

export const ENHARMONIC_EQUIVALENTS: Record<NoteName, string> = {
  C: 'C',
  'C#': 'C# / Db',
  D: 'D',
  'D#': 'D# / Eb',
  E: 'E',
  F: 'F',
  'F#': 'F# / Gb',
  G: 'G',
  'G#': 'G# / Ab',
  A: 'A',
  'A#': 'A# / Bb',
  B: 'B',
};

const FLAT_EQUIVALENTS: Record<NoteName, string> = {
  C: 'C',
  'C#': 'Db',
  D: 'D',
  'D#': 'Eb',
  E: 'E',
  F: 'F',
  'F#': 'Gb',
  G: 'G',
  'G#': 'Ab',
  A: 'A',
  'A#': 'Bb',
  B: 'B',
};

const FLAT_PREFERRING_ROOTS = new Set<string>(['F', 'A#', 'D#', 'G#', 'C#']);

export const SCALE_DEFINITIONS: Record<ScaleType, ScaleDefinition> = {
  major: {
    id: 'major',
    nameEn: 'Major Scale (Ionian)',
    nameSi: 'මේජර් ස්වර මාලාව (Major Scale)',
    semitones: [0, 2, 4, 5, 7, 9, 11],
    stepPattern: 'T - T - S - T - T - T - S',
    formula: '1 - 2 - 3 - 4 - 5 - 6 - 7',
    explanationSi:
      'බටහිර සංගීතයේ වඩාත් මූලික ස්වර මාලාවයි. 3 සහ 4 වන ස්වර අතරත්, 7 සහ 8 (Octave) අතරත් අර්ධ ස්වර (Semitones - S) පිහිටයි.',
    characteristicSi: 'දීප්තිමත්, ප්‍රීතිමත් සහ ස්ථාවර හැඟීමක් ලබා දෙයි.',
  },
  natural_minor: {
    id: 'natural_minor',
    nameEn: 'Natural Minor Scale (Aeolian)',
    nameSi: 'ස්වාභාවික මයිනර් ස්වර මාලාව (Natural Minor)',
    semitones: [0, 2, 3, 5, 7, 8, 10],
    stepPattern: 'T - S - T - T - S - T - T',
    formula: '1 - 2 - b3 - 4 - 5 - b6 - b7',
    explanationSi:
      'මේජර් ස්වර මාලාවේ 3, 6 සහ 7 වන ස්වර අර්ධ ස්වරයකින් (Semitone) පහත් කිරීමෙන් ස්වාභාවික මයිනර් ස්වර මාලාව සෑදේ.',
    characteristicSi: 'ගැඹුරු, සංවේදී හෝ ශෝකජනක හැඟීමක් ප්‍රකාශ කිරීමට බහුලව යොදා ගනී.',
  },
  harmonic_minor: {
    id: 'harmonic_minor',
    nameEn: 'Harmonic Minor Scale',
    nameSi: 'හාමොනික් මයිනර් ස්වර මාලාව (Harmonic Minor)',
    semitones: [0, 2, 3, 5, 7, 8, 11],
    stepPattern: 'T - S - T - T - S - 1.5T - S',
    formula: '1 - 2 - b3 - 4 - 5 - b6 - 7',
    explanationSi:
      'ස්වාභාවික මයිනර් ස්වර මාලාවේ 7 වන ස්වරය අර්ධ ස්වරයකින් ඉහළ නංවා ප්‍රබල Leading Tone එකක් (V7 -> i) නිර්මාණය කරයි.',
    characteristicSi: 'සම්භාව්‍ය සහ නාට්‍යමය Harmonic ආතතියක් (Tension) ඇති කරයි.',
  },
  melodic_minor: {
    id: 'melodic_minor',
    nameEn: 'Melodic Minor Scale (Ascending)',
    nameSi: 'මෙලොඩික් මයිනර් ස්වර මාලාව (Melodic Minor)',
    semitones: [0, 2, 3, 5, 7, 9, 11],
    stepPattern: 'T - S - T - T - T - T - S',
    formula: '1 - 2 - b3 - 4 - 5 - 6 - 7',
    explanationSi:
      'හාමොනික් මයිනර් හි b6 සහ 7 අතර ඇති විශාල පරතරය සුමට කිරීමට 6 සහ 7 යන ස්වර දෙකම ස්වාභාවික (Natural) තත්ත්වයට උසස් කර ඇත.',
    characteristicSi: 'සුමට තනු නිර්මාණයට සහ Jazz harmony සඳහා ඉතා වැදගත් වේ.',
  },
  dorian: {
    id: 'dorian',
    nameEn: 'Dorian Mode',
    nameSi: 'ඩෝරියන් මෝඩය (Dorian Mode)',
    semitones: [0, 2, 3, 5, 7, 9, 10],
    stepPattern: 'T - S - T - T - T - S - T',
    formula: '1 - 2 - b3 - 4 - 5 - 6 - b7',
    explanationSi:
      'ස්වාභාවික මයිනර් ස්වර මාලාවට සමාන වුවත් 6 වන ස්වරය උසස් (Natural 6th) බැවින් මයිනර් ස්වභාවය සමඟ දීප්තිමත් වර්ණයක් එක් කරයි.',
    characteristicSi: 'Fusion, Jazz, Funk සහ සිනමා සංගීතයේ බහුලව භාවිතා වේ.',
  },
  mixolydian: {
    id: 'mixolydian',
    nameEn: 'Mixolydian Mode',
    nameSi: 'මික්සොලිඩියන් මෝඩය (Mixolydian Mode)',
    semitones: [0, 2, 4, 5, 7, 9, 10],
    stepPattern: 'T - T - S - T - T - S - T',
    formula: '1 - 2 - 3 - 4 - 5 - 6 - b7',
    explanationSi:
      'මේජර් ස්වර මාලාවේ 7 වන ස්වරය අර්ධ ස්වරයකින් පහත් (b7) කිරීමෙන් සෑදෙන Dominant ස්වභාවයේ මෝඩයකි.',
    characteristicSi: 'Rock, Blues, Pop සහ ජන සංගීත තනු සඳහා ඉතා ජනප්‍රිය වේ.',
  },
  major_pentatonic: {
    id: 'major_pentatonic',
    nameEn: 'Major Pentatonic Scale',
    nameSi: 'මේජර් පෙන්ටටොනික් ස්වර මාලාව (5-Note)',
    semitones: [0, 2, 4, 7, 9],
    stepPattern: 'T - T - 1.5T - T - 1.5T',
    formula: '1 - 2 - 3 - 5 - 6',
    explanationSi:
      'මේජර් ස්වර මාලාවේ 4 සහ 7 වන ස්වර ඉවත් කර ස්වර 5 කින් පමණක් ගොඩනගන ඉතා මිහිරි ස්වර මාලාවකි.',
    characteristicSi: 'ආසියානු, Pop, Country සහ Guitar improvisation සඳහා ඉතා සුදුසුය.',
  },
  minor_pentatonic: {
    id: 'minor_pentatonic',
    nameEn: 'Minor Pentatonic Scale',
    nameSi: 'මයිනර් පෙන්ටටොනික් ස්වර මාලාව (5-Note)',
    semitones: [0, 3, 5, 7, 10],
    stepPattern: '1.5T - T - T - 1.5T - T',
    formula: '1 - b3 - 4 - 5 - b7',
    explanationSi:
      'ස්වාභාවික මයිනර් ස්වර මාලාවේ 2 සහ 6 වන ස්වර ඉවත් කර ස්වර 5 කින් ගොඩනගන ස්වර මාලාවකි.',
    characteristicSi: 'Rock, Blues, Pop solos සහ ආරම්භක තනු නිර්මාණයට ඉතා පහසුය.',
  },
};

export const CHORD_DEFINITIONS: Record<ChordQuality, ChordDefinition> = {
  major: {
    id: 'major',
    nameEn: 'Major Triad',
    nameSi: 'මේජර් ත්‍රිත්ව ස්වරය (Major Triad)',
    symbol: '',
    intervals: [0, 4, 7],
    formula: '1 - 3 - 5',
    explanationSi: 'මූලික ස්වරය (Root), Major 3rd (+4 semitones) සහ Perfect 5th (+7 semitones) එක්වීමෙන් සෑදේ.',
  },
  minor: {
    id: 'minor',
    nameEn: 'Minor Triad',
    nameSi: 'මයිනර් ත්‍රිත්ව ස්වරය (Minor Triad)',
    symbol: 'm',
    intervals: [0, 3, 7],
    formula: '1 - b3 - 5',
    explanationSi: 'මූලික ස්වරය (Root), Minor 3rd (+3 semitones) සහ Perfect 5th (+7 semitones) එක්වීමෙන් සෑදේ.',
  },
  diminished: {
    id: 'diminished',
    nameEn: 'Diminished Triad',
    nameSi: 'ඩිමිනිෂ්ඩ් ත්‍රිත්ව ස්වරය (Diminished Triad)',
    symbol: 'dim',
    intervals: [0, 3, 6],
    formula: '1 - b3 - b5',
    explanationSi: 'Root, Minor 3rd (+3) සහ Diminished 5th (+6) එක්වීමෙන් නොසන්සුන් (Tense) ශබ්දයක් නිර්මාණය කරයි.',
  },
  augmented: {
    id: 'augmented',
    nameEn: 'Augmented Triad',
    nameSi: 'ඕග්මෙන්ටඩ් ත්‍රිත්ව ස්වරය (Augmented Triad)',
    symbol: 'aug',
    intervals: [0, 4, 8],
    formula: '1 - 3 - #5',
    explanationSi: 'Root, Major 3rd (+4) සහ Augmented 5th (+8) එක්වීමෙන් සිහිනමය සහ අස්ථාවර හැඟීමක් ලබා දෙයි.',
  },
  maj7: {
    id: 'maj7',
    nameEn: 'Major Seventh',
    nameSi: 'මේජර් සෙවන්ත් කෝඩ් එක (Major 7th)',
    symbol: 'maj7',
    intervals: [0, 4, 7, 11],
    formula: '1 - 3 - 5 - 7',
    explanationSi: 'මේජර් ත්‍රිත්ව ස්වරයට Major 7th (+11 semitones) එකතු කිරීමෙන් උණුසුම්, Jazz/Pop වර්ණයක් ලබා දෙයි.',
  },
  min7: {
    id: 'min7',
    nameEn: 'Minor Seventh',
    nameSi: 'මයිනර් සෙවන්ත් කෝඩ් එක (Minor 7th)',
    symbol: 'm7',
    intervals: [0, 3, 7, 10],
    formula: '1 - b3 - 5 - b7',
    explanationSi: 'මයිනර් ත්‍රිත්ව ස්වරයට Minor 7th (+10 semitones) එකතු කිරීමෙන් සුමට හා ගැඹුරු ශබ්දයක් ලබා දෙයි.',
  },
  dom7: {
    id: 'dom7',
    nameEn: 'Dominant Seventh',
    nameSi: 'ඩොමිනන්ට් සෙවන්ත් කෝඩ් එක (Dominant 7th)',
    symbol: '7',
    intervals: [0, 4, 7, 10],
    formula: '1 - 3 - 5 - b7',
    explanationSi:
      'මේජර් ත්‍රිත්වයට Minor 7th (+10) එක් කරයි. 3 සහ b7 අතර ඇති Tritone පරතරය නිසා Tonic කෝඩ් එක වෙත විසඳීමට (Resolve) ප්‍රබල ආතතියක් ඇති කරයි.',
  },
  m7b5: {
    id: 'm7b5',
    nameEn: 'Half-Diminished Seventh',
    nameSi: 'හාෆ්-ඩිමිනිෂ්ඩ් සෙවන්ත් (m7b5)',
    symbol: 'm7b5',
    intervals: [0, 3, 6, 10],
    formula: '1 - b3 - b5 - b7',
    explanationSi:
      'Diminished ත්‍රිත්වයට Minor 7th (+10) එකතු කිරීමෙන් සෑදේ. මයිනර් Key එකක ii°7 කෝඩ් එක ලෙස බහුලව යොදා ගනී.',
  },
};

export const INTERVAL_TABLE: IntervalInfo[] = [
  {
    semitones: 0,
    shortName: 'P1',
    nameEn: 'Perfect Unison',
    nameSi: 'සම ස්වරය (Perfect Unison)',
    consonance: 'perfect',
    explanationSi: 'එකම සංඛ්‍යාතය සහිත ස්වර දෙකක් (අර්ධ ස්වර 0).',
  },
  {
    semitones: 1,
    shortName: 'm2',
    nameEn: 'Minor Second',
    nameSi: 'මයිනර් දෙවැන්න (Minor 2nd / Semitone)',
    consonance: 'dissonant',
    explanationSi: 'අර්ධ ස්වර 1 ක පරතරය. ඉහළ ආතතියක් (Tension) ඇති කරයි.',
  },
  {
    semitones: 2,
    shortName: 'M2',
    nameEn: 'Major Second',
    nameSi: 'මේජර් දෙවැන්න (Major 2nd / Whole Tone)',
    consonance: 'dissonant',
    explanationSi: 'අර්ධ ස්වර 2 ක (පූර්ණ ස්වර 1 ක) පරතරය.',
  },
  {
    semitones: 3,
    shortName: 'm3',
    nameEn: 'Minor Third',
    nameSi: 'මයිනර් තුන්වැන්න (Minor 3rd)',
    consonance: 'imperfect',
    explanationSi: 'අර්ධ ස්වර 3 ක පරතරය. මයිනර් කෝඩ් එකක මූලික හැඟීම තීරණය කරයි.',
  },
  {
    semitones: 4,
    shortName: 'M3',
    nameEn: 'Major Third',
    nameSi: 'මේජර් තුන්වැන්න (Major 3rd)',
    consonance: 'imperfect',
    explanationSi: 'අර්ධ ස්වර 4 ක පරතරය. මේජර් කෝඩ් එකක දීප්තිමත් බව ලබා දෙයි.',
  },
  {
    semitones: 5,
    shortName: 'P4',
    nameEn: 'Perfect Fourth',
    nameSi: 'පූර්ණ හතරවැන්න (Perfect 4th)',
    consonance: 'perfect',
    explanationSi: 'අර්ධ ස්වර 5 ක පරතරය. විවෘත සහ ශක්තිමත් ස්වර සම්බන්ධතාවකි.',
  },
  {
    semitones: 6,
    shortName: 'TT',
    nameEn: 'Tritone (Augmented 4th / Diminished 5th)',
    nameSi: 'ට්‍රයිටෝන් පරතරය (Tritone)',
    consonance: 'dissonant',
    explanationSi: 'අර්ධ ස්වර 6 ක් (පූර්ණ ස්වර 3 ක්). බටහිර සංගීතයේ වඩාත් නොසන්සුන් පරතරයයි.',
  },
  {
    semitones: 7,
    shortName: 'P5',
    nameEn: 'Perfect Fifth',
    nameSi: 'පූර්ණ පස්වැන්න (Perfect 5th)',
    consonance: 'perfect',
    explanationSi: 'අර්ධ ස්වර 7 ක පරතරය. කෝඩ් එකකට ඉහළම ස්ථාවරත්වය ලබා දෙයි (3:2 සංඛ්‍යාත අනුපාතය).',
  },
  {
    semitones: 8,
    shortName: 'm6',
    nameEn: 'Minor Sixth',
    nameSi: 'මයිනර් හයවැන්න (Minor 6th)',
    consonance: 'imperfect',
    explanationSi: 'අර්ධ ස්වර 8 ක පරතරය. සංවේදී හා පුළුල් තනු සඳහා යොදා ගනී.',
  },
  {
    semitones: 9,
    shortName: 'M6',
    nameEn: 'Major Sixth',
    nameSi: 'මේජර් හයවැන්න (Major 6th)',
    consonance: 'imperfect',
    explanationSi: 'අර්ධ ස්වර 9 ක පරතරය. උණුසුම් සහ මිහිරි සංවාදයක් ඇති කරයි.',
  },
  {
    semitones: 10,
    shortName: 'm7',
    nameEn: 'Minor Seventh',
    nameSi: 'මයිනර් හත්වැන්න (Minor 7th)',
    consonance: 'dissonant',
    explanationSi: 'අර්ධ ස්වර 10 ක පරතරය. Dominant 7 සහ Minor 7 කෝඩ් ගොඩනැගීමට යොදා ගනී.',
  },
  {
    semitones: 11,
    shortName: 'M7',
    nameEn: 'Major Seventh',
    nameSi: 'මේජර් හත්වැන්න (Major 7th)',
    consonance: 'dissonant',
    explanationSi: 'අර්ධ ස්වර 11 ක පරතරය. Octave එකට අර්ධ ස්වරයක් පහළින් පිහිටන Leading Tone පරතරයයි.',
  },
  {
    semitones: 12,
    shortName: 'P8',
    nameEn: 'Perfect Octave',
    nameSi: 'ඔක්ටේව් පරතරය (Perfect Octave)',
    consonance: 'perfect',
    explanationSi: 'අර්ධ ස්වර 12 ක පරතරය. ඉහළ ස්වරයේ සංඛ්‍යාතය පහළ ස්වරය මෙන් දෙගුණයකි (2:1 අනුපාතය).',
  },
];

export const PROGRESSION_PRESETS: ProgressionPreset[] = [
  {
    id: 'pop-axis',
    nameEn: 'I - V - vi - IV (Pop Anthem)',
    nameSi: 'I - V - vi - IV (ජනප්‍රිය පොප් කෝඩ් රටාව)',
    descriptionSi: 'නූතන Pop සහ Ballad ගීත දහස් ගණනක භාවිතා වන සමබර සහ ආකර්ෂණීය කෝඩ් රටාවකි.',
    degrees: [1, 5, 6, 4],
    mode: 'major',
  },
  {
    id: 'jazz-ii-v-i',
    nameEn: 'ii - V - I - I (Classic Cadence)',
    nameSi: 'ii - V - I (සම්භාව්‍ය සහ Jazz විසඳුම)',
    descriptionSi: 'Subdominant (ii) සිට Dominant (V) හරහා Tonic (I) වෙත ඉතා ශක්තිමත්ව ගමන් කරන රටාවකි.',
    degrees: [2, 5, 1, 1],
    mode: 'major',
  },
  {
    id: 'fifties-progression',
    nameEn: 'I - vi - IV - V (Classic Turnaround)',
    nameSi: 'I - vi - IV - V (සම්භාව්‍ය 50 දශකයේ රටාව)',
    descriptionSi: 'මුල් කාලීන Pop, Doo-Wop සහ සරල ගීත තනු සඳහා ඉතා මිහිරි කෝඩ් ගමන් මගකි.',
    degrees: [1, 6, 4, 5],
    mode: 'major',
  },
  {
    id: 'andalusian-minor',
    nameEn: 'i - VII - VI - V (Minor Descent)',
    nameSi: 'i - VII - VI - V (මයිනර් අවරෝහණ රටාව)',
    descriptionSi: 'මයිනර් ගීතවල නාට්‍යමය හා චිත්තවේගීය බව මතු කරන පියවරෙන් පියවර පහළට ගමන් කරන රටාවකි.',
    degrees: [1, 7, 6, 5],
    mode: 'natural_minor',
  },
  {
    id: 'emotional-minor',
    nameEn: 'i - VI - III - VII (Cinematic Minor)',
    nameSi: 'i - VI - III - VII (සිනමාත්මක මයිනර් රටාව)',
    descriptionSi: 'සිනමා සංගීතය, Rock සහ නූතන සිංහල ගීතවල බහුලව ඇසෙන හැඟීම්බර කෝඩ් රටාවකි.',
    degrees: [1, 6, 3, 7],
    mode: 'natural_minor',
  },
];

/**
 * Convert MIDI note number (0..127) to frequency in Hz (A4 = MIDI 69 = 440 Hz).
 */
export function midiToFrequency(midi: number): number {
  const raw = 440 * Math.pow(2, (midi - 69) / 12);
  return Math.round(raw * 100) / 100;
}

/**
 * Convert frequency in Hz to nearest MIDI note number.
 */
export function frequencyToMidi(frequencyHz: number): number {
  if (frequencyHz <= 0) {
    throw new Error('Frequency must be greater than 0 Hz');
  }
  return Math.round(69 + 12 * Math.log2(frequencyHz / 440));
}

/**
 * Return structured pitch metadata for any MIDI note number.
 */
export function getPitchInfo(midi: number): PitchInfo {
  const clamped = Math.max(0, Math.min(127, Math.round(midi)));
  const noteIndex = ((clamped % 12) + 12) % 12;
  const octave = Math.floor(clamped / 12) - 1;
  const note = CHROMATIC_NOTES[noteIndex];
  return {
    midi: clamped,
    note,
    enharmonic: ENHARMONIC_EQUIVALENTS[note],
    octave,
    scientific: `${note}${octave}`,
    frequencyHz: midiToFrequency(clamped),
    isSharp: note.includes('#'),
  };
}

/**
 * Parse scientific pitch notation (e.g. "C4", "F#3", "Bb4") into MIDI number.
 */
export function parseScientificPitch(input: string): number | null {
  const trimmed = input.trim();
  const match = /^([A-Ga-g])([#b]?)(-?\d+)$/.exec(trimmed);
  if (!match) return null;

  const letter = match[1].toUpperCase();
  const accidental = match[2];
  const octave = parseInt(match[3], 10);

  const baseOffsets: Record<string, number> = {
    C: 0,
    D: 2,
    E: 4,
    F: 5,
    G: 7,
    A: 9,
    B: 11,
  };

  let semitone = baseOffsets[letter];
  if (accidental === '#') semitone += 1;
  if (accidental === 'b') semitone -= 1;

  const midi = (octave + 1) * 12 + semitone;
  if (midi < 0 || midi > 127) return null;
  return midi;
}

/**
 * Format a note name using flats when the root key conventionally prefers flats.
 */
export function formatEnharmonicNote(note: NoteName, preferFlats = false): string {
  if (preferFlats) {
    return FLAT_EQUIVALENTS[note];
  }
  return note;
}

/**
 * Generate a musical scale from a root note and scale type.
 */
export function generateScale(
  root: NoteName,
  type: ScaleType,
  baseOctave = 4
): ScaleResult {
  const definition = SCALE_DEFINITIONS[type];
  const rootIndex = CHROMATIC_NOTES.indexOf(root);
  const baseMidi = (baseOctave + 1) * 12 + rootIndex;
  const preferFlats = FLAT_PREFERRING_ROOTS.has(root) || type.includes('minor');

  const notes: NoteName[] = [];
  const displayNotes: string[] = [];
  const midiNotes: number[] = [];

  for (const offset of definition.semitones) {
    const noteIndex = (rootIndex + offset) % 12;
    const noteName = CHROMATIC_NOTES[noteIndex];
    notes.push(noteName);
    displayNotes.push(formatEnharmonicNote(noteName, preferFlats && root !== 'E' && root !== 'B'));
    midiNotes.push(baseMidi + offset);
  }
  // Include octave tonic at top for playback completeness
  midiNotes.push(baseMidi + 12);

  const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
  const degrees = definition.semitones.map((offset, idx) => ({
    degree: idx + 1,
    roman: romanNumerals[idx] ?? `${idx + 1}`,
    note: displayNotes[idx],
    semitonesFromRoot: offset,
  }));

  return {
    root,
    type,
    definition,
    notes,
    displayNotes,
    midiNotes,
    degrees,
  };
}

/**
 * Calculate the interval between two MIDI notes.
 */
export function calculateInterval(midiA: number, midiB: number): IntervalInfo {
  const distance = Math.abs(Math.round(midiB) - Math.round(midiA));
  if (distance <= 12) {
    return INTERVAL_TABLE[distance];
  }
  const normalized = distance % 12 === 0 ? 12 : distance % 12;
  const base = INTERVAL_TABLE[normalized];
  return {
    ...base,
    semitones: distance,
    nameEn: `${base.nameEn} (Compound: ${distance} semitones)`,
    nameSi: `${base.nameSi} (සංයුක්ත පරතරය: අර්ධ ස්වර ${distance})`,
  };
}

/**
 * Build a triad or seventh chord with optional inversion.
 */
export function buildChord(
  root: NoteName,
  quality: ChordQuality,
  inversion: ChordInversion = 0,
  baseOctave = 4
): ChordResult {
  const def = CHORD_DEFINITIONS[quality];
  const rootIndex = CHROMATIC_NOTES.indexOf(root);
  const baseMidi = (baseOctave + 1) * 12 + rootIndex;

  const rawMidi = def.intervals.map((semitones) => baseMidi + semitones);
  const maxInversion = Math.min(inversion, rawMidi.length - 1) as ChordInversion;

  const invertedMidi = [...rawMidi];
  for (let i = 0; i < maxInversion; i += 1) {
    invertedMidi[i] += 12;
  }
  invertedMidi.sort((a, b) => a - b);

  const notes = invertedMidi.map((midi) => CHROMATIC_NOTES[((midi % 12) + 12) % 12]);
  const bassNote = notes[0];
  const slashSuffix = maxInversion > 0 && bassNote !== root ? `/${bassNote}` : '';
  const symbol = `${root}${def.symbol}${slashSuffix}`;

  return {
    root,
    quality,
    inversion: maxInversion,
    symbol,
    nameEn: `${root} ${def.nameEn}${maxInversion > 0 ? ` (Inversion ${maxInversion})` : ''}`,
    nameSi: `${root} ${def.nameSi}${maxInversion > 0 ? ` (පෙරළුම ${maxInversion})` : ''}`,
    formula: def.formula,
    notes,
    midiNotes: invertedMidi,
    explanationSi: def.explanationSi,
  };
}

/**
 * Generate the 7 diatonic triads for a Major or Natural Minor key.
 */
export function getDiatonicChords(
  keyRoot: NoteName,
  mode: 'major' | 'natural_minor'
): DiatonicChordInfo[] {
  const scale = generateScale(keyRoot, mode, 4);
  const majorQualities: ChordQuality[] = [
    'major',
    'minor',
    'minor',
    'major',
    'major',
    'minor',
    'diminished',
  ];
  const majorRomans = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];
  const minorQualities: ChordQuality[] = [
    'minor',
    'diminished',
    'major',
    'minor',
    'minor',
    'major',
    'major',
  ];
  const minorRomans = ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'];

  const functionsEn = [
    'Tonic (Home / Stability)',
    'Supertonic (Pre-dominant)',
    'Mediant (Tonic prolongation)',
    'Subdominant (Departure / Motion)',
    'Dominant (Tension toward Tonic)',
    'Submediant (Relative Minor/Major)',
    'Leading Tone / Subtonic (Strong Tension)',
  ];

  const functionsSi = [
    'Tonic — මූලික ස්ථාවර ස්වරය (නිවහන)',
    'Supertonic — Subdominant වෙත යොමු කරන ස්වරය',
    'Mediant — Tonic වර්ණය මෘදු ලෙස දිගු කරන ස්වරය',
    'Subdominant — ගමනක් හෝ වෙනසක් ආරම්භ කරන ස්වරය',
    'Dominant — නැවත Tonic වෙත විසඳීමට ප්‍රබල ආතතියක් ඇති කරන ස්වරය',
    'Submediant — සමාන මයිනර්/මේජර් හැඟීම ලබා දෙන ස්වරය',
    'Leading Tone / Subtonic — Tonic වෙත ඇදී යන ඉහළ ආතතියක් සහිත ස්වරය',
  ];

  const qualities = mode === 'major' ? majorQualities : minorQualities;
  const romans = mode === 'major' ? majorRomans : minorRomans;

  return scale.notes.map((note, idx) => {
    const quality = qualities[idx];
    const chord = buildChord(note, quality, 0, 4);
    return {
      degree: idx + 1,
      roman: romans[idx],
      root: note,
      quality,
      symbol: chord.symbol,
      functionNameEn: functionsEn[idx],
      functionNameSi: functionsSi[idx],
    };
  });
}

/**
 * Validate and analyze a chord progression in a given key.
 */
export function validateProgression(
  steps: ProgressionStep[],
  keyRoot: NoteName,
  mode: 'major' | 'natural_minor'
): {
  isValid: boolean;
  diatonicCount: number;
  borrowedChords: string[];
  cadenceNameEn: string;
  cadenceNameSi: string;
  analysisSi: string;
} {
  if (steps.length === 0) {
    return {
      isValid: false,
      diatonicCount: 0,
      borrowedChords: [],
      cadenceNameEn: 'None',
      cadenceNameSi: 'කෝඩ් ඇතුළත් කර නැත',
      analysisSi: 'කරුණාකර විශ්ලේෂණය සඳහා අවම වශයෙන් කෝඩ් 2 ක් වත් එක් කරන්න.',
    };
  }

  const diatonic = getDiatonicChords(keyRoot, mode);
  let diatonicCount = 0;
  const borrowedChords: string[] = [];

  for (const step of steps) {
    const match = diatonic.find((d) => d.root === step.root && d.quality === step.quality);
    if (match) {
      diatonicCount += 1;
    } else {
      const built = buildChord(step.root, step.quality);
      borrowedChords.push(built.symbol);
    }
  }

  let cadenceNameEn = 'Open / Continuing Progression';
  let cadenceNameSi = 'විවෘත කෝඩ් ගමන් මගක් (Open Progression)';

  if (steps.length >= 2) {
    const prev = steps[steps.length - 2];
    const last = steps[steps.length - 1];
    const tonic = diatonic[0];
    const subdominant = diatonic[3];
    const dominant = diatonic[4];
    const submediant = diatonic[5];

    if (prev.root === dominant.root && last.root === tonic.root) {
      cadenceNameEn = 'Authentic Cadence (V -> I)';
      cadenceNameSi = 'පූර්ණ විසඳුම (Authentic Cadence: V -> I)';
    } else if (prev.root === subdominant.root && last.root === tonic.root) {
      cadenceNameEn = 'Plagal Cadence (IV -> I)';
      cadenceNameSi = 'ප්ලේගල් විසඳුම (Plagal Cadence: IV -> I)';
    } else if (last.root === dominant.root) {
      cadenceNameEn = 'Half Cadence (? -> V)';
      cadenceNameSi = 'අර්ධ විසඳුම (Half Cadence: ? -> V)';
    } else if (prev.root === dominant.root && last.root === submediant.root) {
      cadenceNameEn = 'Deceptive Cadence (V -> vi)';
      cadenceNameSi = 'අපේක්ෂා නොකළ විසඳුම (Deceptive Cadence: V -> vi)';
    }
  }

  const analysisSi =
    borrowedChords.length === 0
      ? `මෙම කෝඩ් ${steps.length} ම ${keyRoot} ${mode === 'major' ? 'Major' : 'Natural Minor'} Key එකට අයත් Diatonic කෝඩ් වේ. අවසානය: ${cadenceNameSi}.`
      : `කෝඩ් ${steps.length} න් ${diatonicCount} ක් Diatonic වන අතර (${borrowedChords.join(', ')}) පිටතින් ලබාගත් (Borrowed / Chromatic) කෝඩ් ලෙස වර්ණයක් එක් කරයි. අවසානය: ${cadenceNameSi}.`;

  return {
    isValid: steps.length >= 2,
    diatonicCount,
    borrowedChords,
    cadenceNameEn,
    cadenceNameSi,
    analysisSi,
  };
}

/**
 * Convert linear amplitude (0..1+) to decibels (dBFS).
 */
export function amplitudeToDb(linear: number): number {
  if (linear <= 0.000001) return -120;
  return Math.round(20 * Math.log10(linear) * 100) / 100;
}

/**
 * Convert decibels (dB) to linear amplitude ratio.
 */
export function dbToAmplitude(db: number): number {
  return Math.round(Math.pow(10, db / 20) * 10000) / 10000;
}

/**
 * Calculate the Nyquist frequency for a given digital sample rate in Hz.
 */
export function nyquistFrequency(sampleRateHz: number): number {
  if (sampleRateHz <= 0) {
    throw new Error('Sample rate must be positive');
  }
  return sampleRateHz / 2;
}

/**
 * Calculate theoretical PCM quantization dynamic range in dB (6.02 * N + 1.76).
 */
export function dynamicRangeForBitDepth(bits: number): number {
  if (bits <= 0) {
    throw new Error('Bit depth must be positive');
  }
  return Math.round((6.02 * bits + 1.76) * 100) / 100;
}
