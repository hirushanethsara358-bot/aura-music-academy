export type NoteName =
  | 'C'
  | 'C#'
  | 'D'
  | 'D#'
  | 'E'
  | 'F'
  | 'F#'
  | 'G'
  | 'G#'
  | 'A'
  | 'A#'
  | 'B';

export type EnharmonicSpelling =
  | NoteName
  | 'Db'
  | 'Eb'
  | 'Gb'
  | 'Ab'
  | 'Bb';

export type WaveformType = 'sine' | 'triangle' | 'sawtooth' | 'square';

export type ScaleType =
  | 'major'
  | 'natural_minor'
  | 'harmonic_minor'
  | 'melodic_minor'
  | 'dorian'
  | 'mixolydian'
  | 'major_pentatonic'
  | 'minor_pentatonic';

export type ChordQuality =
  | 'major'
  | 'minor'
  | 'diminished'
  | 'augmented'
  | 'maj7'
  | 'min7'
  | 'dom7'
  | 'm7b5';

export type ChordInversion = 0 | 1 | 2 | 3;

export interface PitchInfo {
  midi: number;
  note: NoteName;
  enharmonic: string;
  octave: number;
  scientific: string;
  frequencyHz: number;
  isSharp: boolean;
}

export interface ScaleDefinition {
  id: ScaleType;
  nameEn: string;
  nameSi: string;
  semitones: number[];
  stepPattern: string;
  formula: string;
  explanationSi: string;
  characteristicSi: string;
}

export interface ScaleResult {
  root: NoteName;
  type: ScaleType;
  definition: ScaleDefinition;
  notes: NoteName[];
  displayNotes: string[];
  midiNotes: number[];
  degrees: Array<{
    degree: number;
    roman: string;
    note: string;
    semitonesFromRoot: number;
  }>;
}

export interface ChordDefinition {
  id: ChordQuality;
  nameEn: string;
  nameSi: string;
  symbol: string;
  intervals: number[];
  formula: string;
  explanationSi: string;
}

export interface ChordResult {
  root: NoteName;
  quality: ChordQuality;
  inversion: ChordInversion;
  symbol: string;
  nameEn: string;
  nameSi: string;
  formula: string;
  notes: NoteName[];
  midiNotes: number[];
  explanationSi: string;
}

export interface IntervalInfo {
  semitones: number;
  shortName: string;
  nameEn: string;
  nameSi: string;
  consonance: 'perfect' | 'imperfect' | 'dissonant';
  explanationSi: string;
}

export interface DiatonicChordInfo {
  degree: number;
  roman: string;
  root: NoteName;
  quality: ChordQuality;
  symbol: string;
  functionNameEn: string;
  functionNameSi: string;
}

export interface ProgressionStep {
  id: string;
  root: NoteName;
  quality: ChordQuality;
  roman: string;
  beats: number;
}

export interface ProgressionPreset {
  id: string;
  nameEn: string;
  nameSi: string;
  descriptionSi: string;
  degrees: number[];
  mode: 'major' | 'natural_minor';
}

export interface EqBandConfig {
  id: 'low' | 'mid' | 'high';
  labelEn: string;
  labelSi: string;
  type: BiquadFilterType;
  frequencyHz: number;
  gainDb: number;
  q: number;
}

export interface AudioAnalysisSummary {
  fileName: string;
  fileSizeBytes: number;
  durationSeconds: number;
  sampleRate: number;
  numberOfChannels: number;
  peakLinear: number;
  peakDbfs: number;
  rmsLinear: number;
  rmsDbfs: number;
  crestFactorDb: number;
  dcOffset: number;
  clippedSamples: number;
  waveformPeaks: number[];
  spectralBands: Array<{
    bandLabel: string;
    rangeHz: string;
    relativeDb: number;
  }>;
}
