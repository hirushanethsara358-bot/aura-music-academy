import { useCallback, useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { getPitchInfo } from '../../lib/musicTheory';
import { webAudioEngine } from '../../lib/webAudioEngine';
import { WaveformType } from '../../types/music';

const WAVEFORMS: Array<{ id: WaveformType; labelSi: string }> = [
  { id: 'triangle', labelSi: 'Triangle (මෘදු)' },
  { id: 'sine', labelSi: 'Sine (පිරිසිදු)' },
  { id: 'sawtooth', labelSi: 'Sawtooth (පොහොසත්)' },
  { id: 'square', labelSi: 'Square (ලෝහමය)' },
];

/** Computer keyboard → semitone offset from the lowest key currently shown. */
const KEY_MAP: Record<string, number> = {
  a: 0,
  w: 1,
  s: 2,
  e: 3,
  d: 4,
  f: 5,
  t: 6,
  g: 7,
  y: 8,
  h: 9,
  u: 10,
  j: 11,
  k: 12,
  o: 13,
  l: 14,
  p: 15,
};

const BLACK_OFFSETS = new Set([1, 3, 6, 8, 10]);

export function VirtualPiano({
  highlightedNotes = [],
  octaveRange = [1, 6] as [number, number],
  onNotePlayed,
}: {
  highlightedNotes?: string[];
  octaveRange?: [number, number];
  onNotePlayed?: (note: string) => void;
}) {
  const [startOctave, setStartOctave] = useState(3);
  const [span, setSpan] = useState(2);
  const [waveform, setWaveform] = useState<WaveformType>('triangle');
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [activeNotes, setActiveNotes] = useState<Set<number>>(new Set());
  const [audioReady, setAudioReady] = useState(false);
  const pressedKeys = useRef(new Set<string>());

  const minStart = octaveRange[0];
  const maxStart = octaveRange[1];
  const clampedStart = Math.min(Math.max(startOctave, minStart), maxStart);
  const maxSpan = Math.min(3, octaveRange[1] + 1 - clampedStart);
  const clampedSpan = Math.min(Math.max(span, 1), maxSpan);

  const baseMidi = (clampedStart + 1) * 12;
  const whitesPerOctave = 7;
  const whiteKeys: number[] = [];
  const blackKeys: Array<{ midi: number; leftPx: number }> = [];

  for (let octave = 0; octave < clampedSpan; octave += 1) {
    for (let semitone = 0; semitone < 12; semitone += 1) {
      const midi = baseMidi + octave * 12 + semitone;
      if (BLACK_OFFSETS.has(semitone)) {
        // Position immediately after the preceding white key, offset by half a white key.
        const semitoneToWhiteIndex: Record<number, number> = { 1: 0, 3: 1, 6: 3, 8: 4, 10: 5 };
        const whiteIndexThisOctave = semitoneToWhiteIndex[semitone];
        const globalWhiteIndex = octave * whitesPerOctave + whiteIndexThisOctave;
        const leftPx = ((globalWhiteIndex + 1) * 100) / (clampedSpan * whitesPerOctave);
        blackKeys.push({ midi, leftPx });
      } else {
        whiteKeys.push(midi);
      }
    }
  }

  useEffect(() => {
    webAudioEngine.setMasterVolume(muted ? 0 : volume);
  }, [volume, muted]);

  const playNote = useCallback(
    (midi: number) => {
      setAudioReady(true);
      if (!muted) webAudioEngine.startNote(midi, waveform);
      setActiveNotes((prev) => new Set(prev).add(midi));
      onNotePlayed?.(getPitchInfo(midi).note);
    },
    [muted, waveform, onNotePlayed]
  );

  const releaseNote = useCallback((midi: number) => {
    webAudioEngine.stopNote(midi);
    setActiveNotes((prev) => {
      const next = new Set(prev);
      next.delete(midi);
      return next;
    });
  }, []);

  useEffect(() => {
    function isTextInput(target: EventTarget | null): boolean {
      const el = target as HTMLElement | null;
      return !!el && ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (isTextInput(event.target)) return;
      const key = event.key.toLowerCase();
      const offset = KEY_MAP[key];
      if (offset === undefined) return;
      if (pressedKeys.current.has(key)) return; // ignore key auto-repeat → prevents stuck notes
      pressedKeys.current.add(key);
      playNote(baseMidi + offset);
    }

    function handleKeyUp(event: KeyboardEvent) {
      const key = event.key.toLowerCase();
      const offset = KEY_MAP[key];
      if (offset === undefined) return;
      pressedKeys.current.delete(key);
      releaseNote(baseMidi + offset);
    }

    function releaseEverything() {
      pressedKeys.current.clear();
      webAudioEngine.stopAllNotes();
      setActiveNotes(new Set());
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', releaseEverything);
    document.addEventListener('visibilitychange', releaseEverything);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', releaseEverything);
      document.removeEventListener('visibilitychange', releaseEverything);
      releaseEverything();
    };
  }, [baseMidi, playNote, releaseNote]);

  const highlightSet = new Set(highlightedNotes);
  const lowest = getPitchInfo(baseMidi);
  const highest = getPitchInfo(baseMidi + clampedSpan * 12 - 1);

  return (
    <div>
      <div className="lab-control-row">
        <div className="lab-control">
          <label htmlFor="piano-waveform">ශබ්ද තරංගය (Waveform)</label>
          <select
            id="piano-waveform"
            className="select-field"
            value={waveform}
            onChange={(e) => setWaveform(e.target.value as WaveformType)}
          >
            {WAVEFORMS.map((w) => (
              <option key={w.id} value={w.id}>
                {w.labelSi}
              </option>
            ))}
          </select>
        </div>

        <div className="lab-control">
          <label htmlFor="piano-start-octave">ආරම්භක ඔක්ටේව්</label>
          <select
            id="piano-start-octave"
            className="select-field"
            value={clampedStart}
            onChange={(e) => setStartOctave(Number(e.target.value))}
          >
            {Array.from({ length: maxStart - minStart + 1 }, (_, i) => minStart + i).map((o) => (
              <option key={o} value={o}>
                C{o}
              </option>
            ))}
          </select>
        </div>

        <div className="lab-control">
          <label htmlFor="piano-span">ඔක්ටේව් ප්‍රමාණය</label>
          <select
            id="piano-span"
            className="select-field"
            value={clampedSpan}
            onChange={(e) => setSpan(Number(e.target.value))}
          >
            {[1, 2, 3].map((n) => (
              <option key={n} value={n} disabled={n > maxSpan}>
                ඔක්ටේව් {n} ({n * 12} යතුරු)
              </option>
            ))}
          </select>
        </div>

        <div className="lab-control">
          <label htmlFor="piano-volume">
            ප්‍රබලතාව ({Math.round((muted ? 0 : volume) * 100)}%)
          </label>
          <input
            id="piano-volume"
            type="range"
            min={0}
            max={100}
            value={Math.round((muted ? 0 : volume) * 100)}
            onChange={(e) => {
              setMuted(false);
              setVolume(Number(e.target.value) / 100);
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => setMuted((m) => !m)}
            aria-pressed={muted}
          >
            {muted ? <VolumeX size={14} aria-hidden="true" /> : <Volume2 size={14} aria-hidden="true" />}
            {muted ? 'නිහඬයි' : 'නිහඬ කරන්න'}
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => {
              webAudioEngine.stopAllNotes();
              setActiveNotes(new Set());
              pressedKeys.current.clear();
            }}
          >
            සියලු ස්වර නතර කරන්න
          </button>
        </div>
      </div>

      {!audioReady && (
        <p style={{ fontSize: '0.83rem', color: 'var(--accent-amber)', marginBottom: '0.6rem' }}>
          ශබ්දය ආරම්භ කිරීමට පළමුව යතුරක් ඔබන්න. බ්‍රවුසර සංගීතය ස්වයංක්‍රීයව ආරම්භ නොකරයි —
          එය ඔබේ අවසරය අපේක්ෂා කරයි.
        </p>
      )}

      <div className="piano-scroll-wrapper">
        <div
          className="piano-keyboard"
          role="group"
          aria-label={`අතථ්‍ය පියානෝ යතුරු පුවරුව — ${lowest.scientific} සිට ${highest.scientific} දක්වා`}
          style={{ minWidth: Math.max(560, clampedSpan * 340) }}
        >
          {whiteKeys.map((midi) => {
            const info = getPitchInfo(midi);
            const active = activeNotes.has(midi);
            const highlighted = highlightSet.has(info.note);
            return (
              <button
                type="button"
                key={midi}
                className={`piano-key-white${active ? ' active' : ''}${highlighted ? ' highlighted' : ''}`}
                onMouseDown={() => playNote(midi)}
                onMouseUp={() => releaseNote(midi)}
                onMouseLeave={() => releaseNote(midi)}
                onTouchStart={(e) => {
                  e.preventDefault();
                  playNote(midi);
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  releaseNote(midi);
                }}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    playNote(midi);
                  }
                }}
                onKeyUp={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') releaseNote(midi);
                }}
                aria-label={`${info.scientific} ස්වරය වාදනය කරන්න`}
              >
                <span>{info.scientific}</span>
              </button>
            );
          })}

          {blackKeys.map(({ midi, leftPx }) => {
            const info = getPitchInfo(midi);
            const active = activeNotes.has(midi);
            return (
              <button
                type="button"
                key={midi}
                className={`piano-key-black${active ? ' active' : ''}`}
                style={{
                  position: 'absolute',
                  left: `calc(${leftPx}% + 4px)`,
                  transform: 'translateX(-50%)',
                  margin: 0,
                  height: 112,
                }}
                onMouseDown={() => playNote(midi)}
                onMouseUp={() => releaseNote(midi)}
                onMouseLeave={() => releaseNote(midi)}
                onTouchStart={(e) => {
                  e.preventDefault();
                  playNote(midi);
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  releaseNote(midi);
                }}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    playNote(midi);
                  }
                }}
                onKeyUp={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') releaseNote(midi);
                }}
                aria-label={`${info.scientific} ස්වරය වාදනය කරන්න`}
              >
                <span>{info.note.replace('#', '♯')}</span>
              </button>
            );
          })}
        </div>
      </div>

      <details style={{ marginTop: 'var(--space-4)' }}>
        <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
          යතුරු පුවරු සිතියම (A W S E D F T G Y H U J K)
        </summary>
        <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          ඔබේ යතුරු පුවරුවේ <code>A W S E D F T G Y H U J K</code> අකුරු මගින් සුදු සහ කළු
          යතුරු අනුපිළිවෙලින් වාදනය කළ හැක (කළු යතුරු සඳහා W, E, T, Y, U). වර්තමාන පරාසය{' '}
          {lowest.scientific} සිට {highest.scientific} දක්වා වේ.
        </p>
        <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
          සමාන ශබ්ද ස්වර (Enharmonic Equivalents): C♯ = D♭ · D♯ = E♭ · F♯ = G♭ · G♯ = A♭ · A♯ =
          B♭. යතුරු පුවරුවේ මේවා එකම කළු යතුරු වේ.
        </p>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          සංඛ්‍යාත යොමුව: A4 = {getPitchInfo(69).frequencyHz} Hz · C4 ={' '}
          {getPitchInfo(60).frequencyHz} Hz.
        </p>
      </details>
    </div>
  );
}
