import { useEffect, useRef, useState } from 'react';
import { Play, Square, Timer } from 'lucide-react';
import { webAudioEngine } from '../../lib/webAudioEngine';

const TEMPO_PRESETS: Array<{ bpm: number; labelSi: string }> = [
  { bpm: 60, labelSi: 'Adagio (මන්දගාමී)' },
  { bpm: 76, labelSi: 'Andante (සාමාන්‍ය)' },
  { bpm: 96, labelSi: 'Moderato (මධ්‍යම)' },
  { bpm: 120, labelSi: 'Allegro (වේගවත්)' },
  { bpm: 144, labelSi: 'Vivace (ඉතා වේගවත්)' },
];

export function Metronome() {
  const [bpm, setBpm] = useState(96);
  const [beatsPerBar, setBeatsPerBar] = useState(4);
  const [running, setRunning] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(-1);
  const beatRef = useRef(-1);

  useEffect(() => {
    webAudioEngine.updateMetronomeConfig(bpm, beatsPerBar);
  }, [bpm, beatsPerBar]);

  useEffect(() => {
    return () => {
      webAudioEngine.stopMetronome();
    };
  }, []);

  function start() {
    beatRef.current = -1;
    webAudioEngine.startMetronome(bpm, beatsPerBar, (beatIndex) => {
      beatRef.current = beatIndex;
      setCurrentBeat(beatIndex);
    });
    setRunning(true);
  }

  function stop() {
    webAudioEngine.stopMetronome();
    setRunning(false);
    setCurrentBeat(-1);
  }

  const secondsPerBeat = 60 / bpm;
  const barsPerMinute = (60 / bpm / beatsPerBar).toFixed(2);

  return (
    <div style={{ display: 'grid', gap: 'var(--space-5)' }}>
      <div className="lab-control-row" style={{ marginBottom: 0 }}>
        <div className="lab-control" style={{ flexBasis: 260 }}>
          <label htmlFor="metro-bpm">Tempo — {bpm} BPM</label>
          <input
            id="metro-bpm"
            type="range"
            min={30}
            max={240}
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            aria-valuetext={`${bpm} beats per minute`}
          />
        </div>

        <div className="lab-control">
          <label htmlFor="metro-bpm-number">BPM (නිශ්චිත)</label>
          <input
            id="metro-bpm-number"
            type="number"
            min={30}
            max={240}
            className="input-field"
            value={bpm}
            onChange={(e) =>
              setBpm(Math.min(240, Math.max(30, Number(e.target.value) || 30)))
            }
          />
        </div>

        <div className="lab-control">
          <label htmlFor="metro-signature">කාල මානය (Time Signature)</label>
          <select
            id="metro-signature"
            className="select-field"
            value={beatsPerBar}
            onChange={(e) => setBeatsPerBar(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 12].map((n) => (
              <option key={n} value={n}>
                {n}/4
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {running ? (
            <button type="button" className="btn btn-danger" onClick={stop}>
              <Square size={14} aria-hidden="true" /> නතර කරන්න
            </button>
          ) : (
            <button type="button" className="btn btn-primary" onClick={start}>
              <Play size={14} aria-hidden="true" /> ආරම්භ කරන්න
            </button>
          )}
        </div>
      </div>

      <section className="surface-card" style={{ textAlign: 'center' }}>
        <div
          role="status"
          aria-live="polite"
          aria-label={`වර්තමාන Beat ${currentBeat >= 0 ? currentBeat + 1 : 0} / ${beatsPerBar}`}
          style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: 'var(--space-4)' }}
        >
          {Array.from({ length: beatsPerBar }).map((_, i) => (
            <span
              key={i}
              style={{
                width: 46,
                height: 46,
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                fontWeight: 700,
                fontSize: '1rem',
                border: '2px solid var(--border-subtle)',
                background:
                  running && currentBeat === i
                    ? i === 0
                      ? 'var(--accent-violet)'
                      : 'var(--bg-elevated)'
                    : 'var(--bg-primary)',
                color: running && currentBeat === i ? '#fff' : 'var(--text-muted)',
                transition: 'background-color 0.05s linear',
              }}
            >
              {i + 1}
            </span>
          ))}
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 'var(--space-4)' }}>
          <Timer size={14} style={{ verticalAlign: '-2px', marginRight: 4 }} aria-hidden="true" />
          එක් Beat එකක් = {secondsPerBeat.toFixed(3)} තත්පර · විනාඩියකට බාර් {barsPerMinute} ක් · පළමු
          Beat එක ඉහළ ස්වරයකින් (Accent) දක්වයි.
        </p>

        <h2 style={{ fontSize: '0.98rem' }}>Tempo පෙරසැකසුම් (Musical Terms)</h2>
        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {TEMPO_PRESETS.map((preset) => (
            <button
              key={preset.bpm}
              type="button"
              className={`btn btn-sm ${bpm === preset.bpm ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setBpm(preset.bpm)}
            >
              {preset.bpm} BPM · {preset.labelSi}
            </button>
          ))}
        </div>
      </section>

      <section className="surface-card" style={{ borderLeft: '4px solid var(--accent-cyan)' }}>
        <h2 style={{ fontSize: '0.95rem' }}>මෙම Metronome එක නිවැරදි වන්නේ ඇයි?</h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          සාමාන්‍ය JavaScript <code>setInterval</code> මගින් තත්පරයට කිහිප වරක් පමණක් ක්‍රියා කළ
          හැකි අතර එය සැමවිටම කුඩා ප්‍රමාදයක් හෝ ඉදිරියට යාමක් (Timer Drift) ඇති කරයි. සංගීතයට
          එය ඉතා පැහැදිලිව ඇසේ.
        </p>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 0 }}>
          මෙම මෙවලම <strong>Web Audio API Lookahead Scheduler</strong> ක්‍රමවේදය භාවිතා කරයි:
          එනම් ඉදිරියේ ඇති කෙටි කාල පරාසය තුළ (100 ms) ක්ලික් ශබ්ද{' '}
          <code>AudioContext.currentTime</code> අනුව කලින්ම නිශ්චිත කාලවලට සැලසුම් කරයි. නිශ්චිත
          කාලය තීරණය වන්නේ Audio Hardware Clock එක මගින් වන බැවින් කිසිදු Drift එකක් ඇති නොවේ.
        </p>
      </section>
    </div>
  );
}
