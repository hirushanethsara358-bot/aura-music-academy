import { describe, expect, it } from 'vitest';
import {
  amplitudeToDb,
  buildChord,
  calculateInterval,
  CHROMATIC_NOTES,
  dbToAmplitude,
  dynamicRangeForBitDepth,
  formatEnharmonicNote,
  frequencyToMidi,
  generateScale,
  getDiatonicChords,
  getPitchInfo,
  midiToFrequency,
  nyquistFrequency,
  parseScientificPitch,
  validateProgression,
} from '../lib/musicTheory';
import { ALL_SEED_LESSONS } from '../content/lessons';
import { SEED_COURSES } from '../content/courses/seedCourses';
import { SEED_QUIZZES } from '../content/quizzes/seedQuizzes';

describe('MIDI ↔ frequency conversion', () => {
  it('maps A4 (MIDI 69) to exactly 440 Hz', () => {
    expect(midiToFrequency(69)).toBe(440);
  });

  it('doubles frequency one octave up', () => {
    expect(midiToFrequency(81)).toBe(880);
    expect(midiToFrequency(57)).toBe(220);
  });

  it('rejects non-positive frequencies when converting back', () => {
    expect(() => frequencyToMidi(0)).toThrow();
    expect(() => frequencyToMidi(-10)).toThrow();
  });

  it('round-trips MIDI → Hz → MIDI across the playable range', () => {
    for (let midi = 21; midi <= 108; midi += 1) {
      expect(frequencyToMidi(midiToFrequency(midi))).toBe(midi);
    }
  });
});

describe('Pitch naming and octave handling', () => {
  it('derives scientific names and octaves correctly', () => {
    expect(getPitchInfo(60).scientific).toBe('C4');
    expect(getPitchInfo(69).scientific).toBe('A4');
    expect(getPitchInfo(21).scientific).toBe('A0');
    expect(getPitchInfo(108).scientific).toBe('C8');
  });

  it('flags sharps and exposes enharmonic spellings', () => {
    expect(getPitchInfo(61).isSharp).toBe(true);
    expect(getPitchInfo(61).enharmonic).toBe('C# / Db');
    expect(getPitchInfo(60).isSharp).toBe(false);
  });

  it('parses scientific pitch notation including accidentals and octaves', () => {
    expect(parseScientificPitch('C4')).toBe(60);
    expect(parseScientificPitch('F#3')).toBe(54);
    expect(parseScientificPitch('Bb4')).toBe(70);
    expect(parseScientificPitch('C-1')).toBe(0);
    expect(parseScientificPitch('C9')).toBe(120);
    expect(parseScientificPitch('H4')).toBeNull();
    expect(parseScientificPitch('C11')).toBeNull();
  });

  it('formats enharmonic equivalents when flats are preferred', () => {
    expect(formatEnharmonicNote('C#', false)).toBe('C#');
    expect(formatEnharmonicNote('C#', true)).toBe('Db');
    expect(formatEnharmonicNote('A#', true)).toBe('Bb');
  });
});

describe('Major and minor scale generation', () => {
  it('generates C major with no accidentals', () => {
    const scale = generateScale('C', 'major', 4);
    expect(scale.notes).toEqual(['C', 'D', 'E', 'F', 'G', 'A', 'B']);
    expect(scale.midiNotes).toEqual([60, 62, 64, 65, 67, 69, 71, 72]);
  });

  it('generates D major with F# and C#', () => {
    const scale = generateScale('D', 'major', 4);
    expect(scale.notes).toContain('F#');
    expect(scale.notes).toContain('C#');
    expect(scale.notes.filter((n) => n.includes('#'))).toHaveLength(2);
  });

  it('applies the T-T-S-T-T-T-S interval pattern for every major key', () => {
    for (const root of CHROMATIC_NOTES) {
      const scale = generateScale(root, 'major', 4);
      const semitones = scale.definition.semitones;
      expect(semitones).toEqual([0, 2, 4, 5, 7, 9, 11]);
      // Tonic an octave above must be exactly 12 semitones from the root.
      expect(scale.midiNotes[scale.midiNotes.length - 1] - scale.midiNotes[0]).toBe(12);
    }
  });

  it('generates A natural minor with the lowered 3rd, 6th and 7th', () => {
    const scale = generateScale('A', 'natural_minor', 4);
    expect(scale.midiNotes.slice(0, 7)).toEqual([69, 71, 72, 74, 76, 77, 79]);
    expect(scale.midiNotes[0] - getPitchInfo(69).midi).toBe(0);
  });

  it('raises the 7th degree by one semitone in harmonic minor', () => {
    const natural = generateScale('A', 'natural_minor', 4);
    const harmonic = generateScale('A', 'harmonic_minor', 4);
    expect(harmonic.midiNotes[6] - natural.midiNotes[6]).toBe(1);
  });

  it('raises both the 6th and 7th degrees in melodic minor', () => {
    const natural = generateScale('A', 'natural_minor', 4);
    const melodic = generateScale('A', 'melodic_minor', 4);
    expect(melodic.midiNotes[5] - natural.midiNotes[5]).toBe(1);
    expect(melodic.midiNotes[6] - natural.midiNotes[6]).toBe(1);
  });

  it('produces five distinct notes for pentatonic scales', () => {
    expect(generateScale('C', 'major_pentatonic', 4).definition.semitones).toHaveLength(5);
    expect(generateScale('A', 'minor_pentatonic', 4).definition.semitones).toHaveLength(5);
  });

  it('numbers scale degrees 1 through 7 with roman numerals', () => {
    const scale = generateScale('G', 'major', 4);
    expect(scale.degrees.map((d) => d.degree)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(scale.degrees[4].roman).toBe('V');
  });
});

describe('Interval calculation', () => {
  it('identifies the tritone at 6 semitones', () => {
    const interval = calculateInterval(60, 66);
    expect(interval.semitones).toBe(6);
    expect(interval.nameEn).toContain('Tritone');
    expect(interval.consonance).toBe('dissonant');
  });

  it('identifies a perfect fifth and major third', () => {
    expect(calculateInterval(60, 67).shortName).toBe('P5');
    expect(calculateInterval(60, 64).shortName).toBe('M3');
  });

  it('is direction independent', () => {
    expect(calculateInterval(72, 60).semitones).toBe(calculateInterval(60, 72).semitones);
  });

  it('describes compound intervals explicitly', () => {
    const interval = calculateInterval(60, 86);
    expect(interval.semitones).toBe(26);
    expect(interval.nameSi).toContain('සංයුක්ත');
  });
});

describe('Chord construction', () => {
  it('builds a C major triad as C-E-G', () => {
    const chord = buildChord('C', 'major');
    expect(chord.notes).toEqual(['C', 'E', 'G']);
    expect(chord.midiNotes).toEqual([60, 64, 67]);
    expect(chord.symbol).toBe('C');
  });

  it('builds a minor triad with a lowered third', () => {
    const major = buildChord('C', 'major');
    const minor = buildChord('C', 'minor');
    expect(minor.notes).toEqual(['C', 'D#', 'G']);
    expect(minor.midiNotes[1] - major.midiNotes[1]).toBe(-1);
  });

  it('builds diminished and augmented triads at the correct semitone offsets', () => {
    expect(buildChord('C', 'diminished').midiNotes).toEqual([60, 63, 66]);
    expect(buildChord('C', 'augmented').midiNotes).toEqual([60, 64, 68]);
  });

  it('builds seventh chords with four distinct pitch classes', () => {
    const maj7 = buildChord('C', 'maj7');
    const dom7 = buildChord('C', 'dom7');
    expect(maj7.midiNotes).toHaveLength(4);
    expect(dom7.midiNotes[3] - maj7.midiNotes[3]).toBe(-1);
  });

  it('raises the lowest chord tone by an octave for each inversion', () => {
    const root = buildChord('C', 'major', 0);
    const first = buildChord('C', 'major', 1);
    const second = buildChord('C', 'major', 2);

    expect(root.midiNotes).toEqual([60, 64, 67]);
    expect(first.midiNotes).toEqual([64, 67, 72]);
    expect(second.midiNotes).toEqual([67, 72, 76]);
    expect(first.notes[0]).toBe('E');
    expect(second.notes[0]).toBe('G');
  });

  it('labels inverted chords with a slash bass note', () => {
    expect(buildChord('C', 'major', 1).symbol).toBe('C/E');
    expect(buildChord('C', 'major', 0).symbol).toBe('C');
  });

  it('clamps an out-of-range inversion request to the highest available', () => {
    const triad = buildChord('C', 'major', 3);
    expect(triad.inversion).toBe(2);
  });
});

describe('Diatonic harmony and roman numerals', () => {
  it('lists the seven diatonic chords of C major with correct qualities', () => {
    const chords = getDiatonicChords('C', 'major');
    expect(chords.map((c) => c.symbol)).toEqual(['C', 'Dm', 'Em', 'F', 'G', 'Am', 'Bdim']);
    expect(chords.map((c) => c.roman)).toEqual(['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°']);
  });

  it('lists the diatonic chords of A natural minor', () => {
    const chords = getDiatonicChords('A', 'natural_minor');
    expect(chords.map((c) => c.roman)).toEqual(['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII']);
    expect(chords[0].quality).toBe('minor');
    expect(chords[6].quality).toBe('major');
  });

  it('assigns a tonic, subdominant and dominant function to each degree', () => {
    const chords = getDiatonicChords('C', 'major');
    expect(chords[0].functionNameEn).toContain('Tonic');
    expect(chords[3].functionNameEn).toContain('Subdominant');
    expect(chords[4].functionNameEn).toContain('Dominant');
  });
});

describe('Progression validation and cadence detection', () => {
  const step = (root: 'C' | 'F' | 'G' | 'A' | 'D' | 'E', quality: 'major' | 'minor', roman: string) => ({
    id: `${root}-${quality}`,
    root,
    quality,
    roman,
    beats: 4,
  });

  it('reports an empty progression as invalid without throwing', () => {
    const result = validateProgression([], 'C', 'major');
    expect(result.isValid).toBe(false);
    expect(result.diatonicCount).toBe(0);
  });

  it('detects an authentic cadence (V → I)', () => {
    const result = validateProgression(
      [step('C', 'major', 'I'), step('G', 'major', 'V'), step('C', 'major', 'I')],
      'C',
      'major'
    );
    expect(result.cadenceNameEn).toContain('Authentic');
    expect(result.borrowedChords).toHaveLength(0);
  });

  it('detects a plagal cadence (IV → I)', () => {
    const result = validateProgression(
      [step('C', 'major', 'I'), step('F', 'major', 'IV'), step('C', 'major', 'I')],
      'C',
      'major'
    );
    expect(result.cadenceNameEn).toContain('Plagal');
  });

  it('detects a half cadence ending on V', () => {
    const result = validateProgression(
      [step('C', 'major', 'I'), step('F', 'major', 'IV'), step('G', 'major', 'V')],
      'C',
      'major'
    );
    expect(result.cadenceNameEn).toContain('Half');
  });

  it('detects a deceptive cadence (V → vi)', () => {
    const result = validateProgression(
      [step('C', 'major', 'I'), step('G', 'major', 'V'), step('A', 'minor', 'vi')],
      'C',
      'major'
    );
    expect(result.cadenceNameEn).toContain('Deceptive');
  });

  it('flags chords borrowed from outside the key', () => {
    const result = validateProgression(
      [step('C', 'major', 'I'), step('D', 'major', 'II'), step('G', 'major', 'V'), step('C', 'major', 'I')],
      'C',
      'major'
    );
    expect(result.borrowedChords).toContain('D');
    expect(result.diatonicCount).toBe(3);
  });
});

describe('Acoustic and digital audio mathematics', () => {
  it('converts amplitude ratios to decibels correctly', () => {
    expect(amplitudeToDb(1)).toBe(0);
    expect(amplitudeToDb(0.5)).toBeCloseTo(-6.02, 1);
    expect(amplitudeToDb(0)).toBe(-120);
  });

  it('round-trips dB → amplitude within rounding tolerance', () => {
    const amplitudes = [1, 0.5, 0.25, 0.1, 0.01];
    for (const amplitude of amplitudes) {
      const db = amplitudeToDb(amplitude);
      expect(dbToAmplitude(db)).toBeCloseTo(amplitude, 2);
    }
  });

  it('halves the Nyquist frequency rule correctly', () => {
    expect(nyquistFrequency(44100)).toBe(22050);
    expect(nyquistFrequency(48000)).toBe(24000);
    expect(nyquistFrequency(96000)).toBe(48000);
    expect(() => nyquistFrequency(0)).toThrow();
  });

  it('computes PCM dynamic range as 6.02N + 1.76 dB', () => {
    expect(dynamicRangeForBitDepth(16)).toBeCloseTo(98.08, 1);
    expect(dynamicRangeForBitDepth(24)).toBeCloseTo(146.24, 1);
    expect(() => dynamicRangeForBitDepth(0)).toThrow();
  });

  it('confirms the 6 dB per bit step between bit depths', () => {
    const difference = dynamicRangeForBitDepth(24) - dynamicRangeForBitDepth(16);
    expect(difference).toBeCloseTo(48.16, 1);
  });
});

describe('Seed curriculum integrity', () => {
  it('ships exactly nine learning levels', () => {
    expect(SEED_COURSES).toHaveLength(9);
    expect(SEED_COURSES.map((c) => c.level)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it('gives every lesson a unique id and slug', () => {
    const ids = ALL_SEED_LESSONS.map((l) => l.id);
    const slugs = ALL_SEED_LESSONS.map((l) => l.slug);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('never points a lesson at a course that does not exist', () => {
    const courseIds = new Set(SEED_COURSES.map((c) => c.id));
    for (const lesson of ALL_SEED_LESSONS) {
      expect(courseIds.has(lesson.courseId)).toBe(true);
    }
  });

  it('never references a prerequisite slug that does not exist', () => {
    const slugs = new Set(ALL_SEED_LESSONS.map((l) => l.slug));
    for (const lesson of ALL_SEED_LESSONS) {
      for (const prereq of lesson.prerequisites) {
        expect(slugs.has(prereq)).toBe(true);
      }
    }
  });

  it('references only real quizzes from lessons', () => {
    const quizIds = new Set(SEED_QUIZZES.map((q) => q.id));
    for (const lesson of ALL_SEED_LESSONS) {
      for (const quizId of lesson.quizIds) {
        expect(quizIds.has(quizId)).toBe(true);
      }
    }
  });

  it('ships a fully populated lesson for every published course listing', () => {
    for (const course of SEED_COURSES) {
      if (!course.published) continue;
      const lessons = ALL_SEED_LESSONS.filter((l) => l.courseId === course.id);
      expect(lessons.length).toBeGreaterThan(0);
      for (const lesson of lessons) {
        expect(lesson.sections.length).toBeGreaterThan(0);
        expect(lesson.learningObjectives.length).toBeGreaterThan(0);
        expect(lesson.summarySi.length).toBeGreaterThan(10);
        expect(lesson.titleSi.length).toBeGreaterThan(3);
      }
    }
  });

  it('never claims more published lessons than the planned total', () => {
    for (const course of SEED_COURSES) {
      const actual = ALL_SEED_LESSONS.filter((l) => l.courseId === course.id).length;
      expect(actual).toBeLessThanOrEqual(course.plannedTotalLessons);
    }
  });

  it('marks every seeded lesson as published', () => {
    for (const lesson of ALL_SEED_LESSONS) {
      expect(lesson.published).toBe(true);
    }
  });
});
