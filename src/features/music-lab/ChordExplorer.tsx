import { useMemo, useState } from 'react';
import { Play, Square } from 'lucide-react';
import {
  buildChord,
  CHORD_DEFINITIONS,
  CHROMATIC_NOTES,
  getDiatonicChords,
} from '../../lib/musicTheory';
import { ChordInversion, ChordQuality, NoteName } from '../../types/music';
import { webAudioEngine } from '../../lib/webAudioEngine';
import { VirtualPiano } from './VirtualPiano';

export function ChordExplorer() {
  const [root, setRoot] = useState<NoteName>('C');
  const [quality, setQuality] = useState<ChordQuality>('major');
  const [inversion, setInversion] = useState<ChordInversion>(0);
  const [keyRoot, setKeyRoot] = useState<NoteName>('C');
  const [mode, setMode] = useState<'major' | 'natural_minor'>('major');

  const chord = useMemo(() => buildChord(root, quality, inversion, 4), [root, quality, inversion]);
  const diatonic = useMemo(() => getDiatonicChords(keyRoot, mode), [keyRoot, mode]);

  function playChord() {
    webAudioEngine.playChord(chord.midiNotes, 1.2, 'triangle', 0);
  }

  function playDiatonic(symbol: string) {
    const notes = buildChord(
      symbol.replace(/m|dim|aug|7|b5/g, '') as NoteName,
      symbol.includes('dim') ? 'diminished' : symbol.includes('m') ? 'minor' : 'major',
      0,
      4
    ).midiNotes;
    webAudioEngine.playChord(notes, 1.1, 'triangle', 0);
  }

  return (
    <div style={{ display: 'grid', gap: 'var(--space-5)' }}>
      <div className="lab-control-row" style={{ marginBottom: 0 }}>
        <div className="lab-control">
          <label htmlFor="chord-root">මූලික ස්වරය (Root)</label>
          <select
            id="chord-root"
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
          <label htmlFor="chord-quality">කෝඩ් වර්ගය</label>
          <select
            id="chord-quality"
            className="select-field"
            value={quality}
            onChange={(e) => setQuality(e.target.value as ChordQuality)}
          >
            {Object.values(CHORD_DEFINITIONS).map((def) => (
              <option key={def.id} value={def.id}>
                {def.nameSi}
              </option>
            ))}
          </select>
        </div>

        <div className="lab-control">
          <label htmlFor="chord-inversion">පෙරළුම (Inversion)</label>
          <select
            id="chord-inversion"
            className="select-field"
            value={inversion}
            onChange={(e) => setInversion(Number(e.target.value) as ChordInversion)}
          >
            <option value={0}>මූල පිහිටීම (Root Position)</option>
            <option value={1}>1 වන පෙරළුම (1st Inversion)</option>
            <option value={2}>2 වන පෙරළුම (2nd Inversion)</option>
            {CHORD_DEFINITIONS[quality].intervals.length > 3 && (
              <option value={3}>3 වන පෙරළුම (3rd Inversion)</option>
            )}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button type="button" className="btn btn-primary" onClick={playChord}>
            <Play size={14} aria-hidden="true" /> කෝඩ් එක අසන්න
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => webAudioEngine.stopAllNotes()}
          >
            <Square size={14} aria-hidden="true" /> නතර කරන්න
          </button>
        </div>
      </div>

      <section className="surface-card">
        <h2 style={{ fontSize: '1.05rem', marginBottom: '0.2rem' }}>{chord.nameSi}</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{chord.nameEn}</p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>{chord.explanationSi}</p>

        <div className="formula-block">
{`අංකනය (Symbol)   : ${chord.symbol}
ස්වර සූත්‍රය       : ${chord.formula}
ස්වර             : ${chord.notes.join(' – ')}
MIDI සංඛ්‍යා         : ${chord.midiNotes.join(', ')}
පහළම ස්වරය (Bass) : ${chord.notes[0]}`}
        </div>

        <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
          <strong>පෙරළුම පිළිබඳ සටහන:</strong> කෝඩ් එකේ ස්වර වෙනස් නොවේ — වෙනස් වන්නේ පහළම
          ස්වරය (Bass Note) පමණි. එය Slash Chord අංකනයෙන් දක්වයි (උදා: C/E).
        </p>
      </section>

      <section className="surface-card">
        <h2 style={{ fontSize: '0.98rem' }}>යතුරු පුවරුව මත කෝඩ් එක</h2>
        <VirtualPiano highlightedNotes={chord.notes} />
      </section>

      <section className="surface-card">
        <h2 style={{ fontSize: '1rem' }}>Diatonic කෝඩ් සන්දර්භය (Roman Numerals)</h2>
        <div className="lab-control-row">
          <div className="lab-control">
            <label htmlFor="chord-key-root">Key එකේ මූලික ස්වරය</label>
            <select
              id="chord-key-root"
              className="select-field"
              value={keyRoot}
              onChange={(e) => setKeyRoot(e.target.value as NoteName)}
            >
              {CHROMATIC_NOTES.map((note) => (
                <option key={note} value={note}>
                  {note}
                </option>
              ))}
            </select>
          </div>
          <div className="lab-control">
            <label htmlFor="chord-key-mode">මෝඩය</label>
            <select
              id="chord-key-mode"
              className="select-field"
              value={mode}
              onChange={(e) => setMode(e.target.value as 'major' | 'natural_minor')}
            >
              <option value="major">Major (මේජර්)</option>
              <option value="natural_minor">Natural Minor (මයිනර්)</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <caption className="visually-hidden">
              {keyRoot} {mode} key එකේ diatonic කෝඩ්
            </caption>
            <thead>
              <tr>
                <th scope="col">Roman</th>
                <th scope="col">කෝඩ් එක</th>
                <th scope="col">කාර්යය (Function)</th>
                <th scope="col">වාදනය</th>
              </tr>
            </thead>
            <tbody>
              {diatonic.map((entry) => (
                <tr key={entry.roman}>
                  <td>
                    <strong>{entry.roman}</strong>
                  </td>
                  <td>{entry.symbol}</td>
                  <td style={{ fontSize: '0.8rem' }}>{entry.functionNameSi}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => playDiatonic(entry.symbol)}
                    >
                      <Play size={12} aria-hidden="true" /> අසන්න
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: 'var(--space-4)' }}>
          <strong>කාර්යය පිළිබඳ සටහන:</strong> Tonic (I, vi) ස්ථාවරත්වය ලබා දෙයි. Subdominant
          (IV, ii) ගමනක් ආරම්භ කරයි. Dominant (V, vii°) නැවත Tonic වෙත ඇදී යන ආතතියක් ඇති කරයි.
        </p>
      </section>
    </div>
  );
}
