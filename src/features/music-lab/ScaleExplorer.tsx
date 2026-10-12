import { useMemo, useState } from 'react';
import { Play, Square } from 'lucide-react';
import { CHROMATIC_NOTES, generateScale, SCALE_DEFINITIONS } from '../../lib/musicTheory';
import { NoteName, ScaleType } from '../../types/music';
import { webAudioEngine } from '../../lib/webAudioEngine';
import { VirtualPiano } from './VirtualPiano';

export function ScaleExplorer() {
  const [root, setRoot] = useState<NoteName>('C');
  const [scaleType, setScaleType] = useState<ScaleType>('major');
  const [playing, setPlaying] = useState(false);

  const scale = useMemo(() => generateScale(root, scaleType, 4), [root, scaleType]);

  function playScale() {
    setPlaying(true);
    webAudioEngine.playSequence(scale.midiNotes, 0.34, 'triangle', (midi) => {
      if (midi === null) setPlaying(false);
    });
  }

  function stop() {
    webAudioEngine.stopAllNotes();
    setPlaying(false);
  }

  return (
    <div style={{ display: 'grid', gap: 'var(--space-5)' }}>
      <div className="lab-control-row" style={{ marginBottom: 0 }}>
        <div className="lab-control">
          <label htmlFor="scale-root">මූලික ස්වරය (Root)</label>
          <select
            id="scale-root"
            className="select-field"
            value={root}
            onChange={(e) => setRoot(e.target.value as NoteName)}
          >
            {CHROMATIC_NOTES.map((note) => (
              <option key={note} value={note}>
                {note}
              </option>
            ))}
          </select>
        </div>

        <div className="lab-control" style={{ flexBasis: 240 }}>
          <label htmlFor="scale-type">ස්වර මාලා වර්ගය</label>
          <select
            id="scale-type"
            className="select-field"
            value={scaleType}
            onChange={(e) => setScaleType(e.target.value as ScaleType)}
          >
            {Object.values(SCALE_DEFINITIONS).map((def) => (
              <option key={def.id} value={def.id}>
                {def.nameSi}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button type="button" className="btn btn-primary" onClick={playScale} disabled={playing}>
            <Play size={14} aria-hidden="true" /> ස්වර මාලාව අසන්න
          </button>
          <button type="button" className="btn btn-secondary" onClick={stop}>
            <Square size={14} aria-hidden="true" /> නතර කරන්න
          </button>
        </div>
      </div>

      <section className="surface-card">
        <h2 style={{ fontSize: '1rem', marginBottom: '0.3rem' }}>{scale.definition.nameSi}</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{scale.definition.nameEn}</p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          {scale.definition.explanationSi}
        </p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          <strong>වර්ණය:</strong> {scale.definition.characteristicSi}
        </p>

        <h3 style={{ fontSize: '0.92rem', marginTop: 'var(--space-4)' }}>ස්වර</h3>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {scale.displayNotes.map((note, idx) => (
            <span key={`${note}-${idx}`} className="badge badge-violet" style={{ fontSize: '0.85rem' }}>
              {note}
            </span>
          ))}
        </div>

        <div className="formula-block" style={{ marginTop: 'var(--space-4)' }}>
{`පරතර රටාව (Step Pattern) : ${scale.definition.stepPattern}
ස්වර සූත්‍රය (Formula)     : ${scale.definition.formula}
අර්ධ ස්වර පිහිටීම        : ${scale.definition.semitones.join(' · ')}`}
        </div>

        <div style={{ overflowX: 'auto', marginTop: 'var(--space-4)' }}>
          <table className="data-table">
            <caption className="visually-hidden">
              {scale.definition.nameSi} හි ස්වර සහ ඒවායේ අර්ධ ස්වර දුර
            </caption>
            <thead>
              <tr>
                <th scope="col">අංකය (Degree)</th>
                <th scope="col">ස්වරය</th>
                <th scope="col">අර්ධ ස්වර (Root සිට)</th>
                <th scope="col">සංඛ්‍යාතය (Hz)</th>
              </tr>
            </thead>
            <tbody>
              {scale.degrees.map((degree, idx) => (
                <tr key={degree.degree}>
                  <td>
                    {degree.degree} ({degree.roman})
                  </td>
                  <td>{degree.note}</td>
                  <td>{degree.semitonesFromRoot}</td>
                  <td>
                    {(
                      440 *
                      Math.pow(2, ((scale.midiNotes[idx] ?? 60) - 69) / 12)
                    ).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="surface-card">
        <h2 style={{ fontSize: '0.98rem' }}>යතුරු පුවරුව මත ස්වර මාලාව</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          නිල්-කොළ පැහැති යටි ඉරි සහිත යතුරු මෙම ස්වර මාලාවට අයත් ස්වර වේ.
        </p>
        <VirtualPiano highlightedNotes={scale.displayNotes} />
      </section>
    </div>
  );
}
