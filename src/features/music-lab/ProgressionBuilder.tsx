import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Plus, Play, RotateCcw, Square, Trash2, Wand2 } from 'lucide-react';
import {
  buildChord,
  CHROMATIC_NOTES,
  getDiatonicChords,
  PROGRESSION_PRESETS,
  validateProgression,
} from '../../lib/musicTheory';
import { ChordQuality, NoteName, ProgressionStep } from '../../types/music';
import { webAudioEngine } from '../../lib/webAudioEngine';
import { readJson, writeJson } from '../../lib/storage';

const SAVE_KEY = 'progression-draft';

export function ProgressionBuilder() {
  const [keyRoot, setKeyRoot] = useState<NoteName>('C');
  const [mode, setMode] = useState<'major' | 'natural_minor'>('major');
  const [steps, setSteps] = useState<ProgressionStep[]>([]);
  const [bpm, setBpm] = useState(90);
  const [beatsPerChord, setBeatsPerChord] = useState(4);
  const [playing, setPlaying] = useState(false);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const diatonic = useMemo(() => getDiatonicChords(keyRoot, mode), [keyRoot, mode]);

  // Restore a locally saved draft (available with or without an account).
  useEffect(() => {
    const draft = readJson<{
      keyRoot: NoteName;
      mode: 'major' | 'natural_minor';
      steps: ProgressionStep[];
      bpm: number;
      beatsPerChord: number;
    } | null>(SAVE_KEY, null);

    if (draft && Array.isArray(draft.steps) && draft.steps.length > 0) {
      setKeyRoot(draft.keyRoot);
      setMode(draft.mode);
      setSteps(draft.steps);
      setBpm(draft.bpm);
      setBeatsPerChord(draft.beatsPerChord);
      setSavedNotice('ඔබ කලින් සුරකින ලද කෝඩ් රටාව පූරණය කරන ලදී.');
    }
  }, []);

  useEffect(() => {
    return () => {
      webAudioEngine.stopAllNotes();
    };
  }, []);

  const analysis = useMemo(() => validateProgression(steps, keyRoot, mode), [steps, keyRoot, mode]);

  const addChord = useCallback(
    (root: NoteName, quality: ChordQuality, roman: string) => {
      setSteps((prev) => [
        ...prev,
        { id: `step-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, root, quality, roman, beats: beatsPerChord },
      ]);
      setSavedNotice(null);
    },
    [beatsPerChord]
  );

  const loadPreset = useCallback(
    (presetId: string) => {
      const preset = PROGRESSION_PRESETS.find((p) => p.id === presetId);
      if (!preset) return;
      setMode(preset.mode);
      const chords = getDiatonicChords(keyRoot, preset.mode);
      const next = preset.degrees
        .map((degree, idx) => {
          const entry = chords[degree - 1];
          if (!entry) return null;
          return {
            id: `step-${Date.now()}-${idx}`,
            root: entry.root,
            quality: entry.quality,
            roman: entry.roman,
            beats: beatsPerChord,
          };
        })
        .filter((s): s is ProgressionStep => s !== null);
      setSteps(next);
      setSavedNotice(`${preset.nameSi} පූරණය කරන ලදී.`);
    },
    [keyRoot, beatsPerChord]
  );

  function move(index: number, direction: -1 | 1) {
    setSteps((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function remove(index: number) {
    setSteps((prev) => prev.filter((_, i) => i !== index));
  }

  function play() {
    if (steps.length === 0) return;
    webAudioEngine.stopAllNotes();
    setPlaying(true);

    const secondsPerBeat = 60 / Math.max(30, Math.min(240, bpm));
    const chordDuration = secondsPerBeat * beatsPerChord;

    steps.forEach((step, idx) => {
      const chord = buildChord(step.root, step.quality, 0, 4);
      webAudioEngine.playChord(chord.midiNotes, chordDuration * 0.92, 'triangle', idx * chordDuration);
    });

    window.setTimeout(() => setPlaying(false), steps.length * chordDuration * 1000);
  }

  function stop() {
    webAudioEngine.stopAllNotes();
    setPlaying(false);
  }

  function saveDraft() {
    writeJson(SAVE_KEY, { keyRoot, mode, steps, bpm, beatsPerChord });
    setSavedNotice('ඔබේ කෝඩ් රටාව මෙම බ්‍රවුසරයේ සුරකින ලදී. (ගිණුමකට සම්බන්ධ කිරීම ඉදිරි අනුවාදයකදී)');
  }

  return (
    <div style={{ display: 'grid', gap: 'var(--space-5)' }}>
      <div className="lab-control-row" style={{ marginBottom: 0 }}>
        <div className="lab-control">
          <label htmlFor="prog-key">Key (මූලික ස්වරය)</label>
          <select
            id="prog-key"
            className="select-field"
            value={keyRoot}
            onChange={(e) => {
              setKeyRoot(e.target.value as NoteName);
              setSteps([]);
            }}
          >
            {CHROMATIC_NOTES.map((note) => (
              <option key={note} value={note}>
                {note}
              </option>
            ))}
          </select>
        </div>

        <div className="lab-control">
          <label htmlFor="prog-mode">මෝඩය</label>
          <select
            id="prog-mode"
            className="select-field"
            value={mode}
            onChange={(e) => {
              setMode(e.target.value as 'major' | 'natural_minor');
              setSteps([]);
            }}
          >
            <option value="major">Major (මේජර්)</option>
            <option value="natural_minor">Natural Minor (මයිනර්)</option>
          </select>
        </div>

        <div className="lab-control">
          <label htmlFor="prog-bpm">Tempo — {bpm} BPM</label>
          <input
            id="prog-bpm"
            type="range"
            min={40}
            max={200}
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
          />
        </div>

        <div className="lab-control">
          <label htmlFor="prog-beats">කෝඩ් එකකට Beats</label>
          <select
            id="prog-beats"
            className="select-field"
            value={beatsPerChord}
            onChange={(e) => setBeatsPerChord(Number(e.target.value))}
          >
            <option value={1}>1 Beat</option>
            <option value={2}>2 Beats</option>
            <option value={4}>4 Beats (බාර් 1)</option>
            <option value={8}>8 Beats (බාර් 2)</option>
          </select>
        </div>
      </div>

      <div className="lab-control-row">
        <button type="button" className="btn btn-primary" onClick={play} disabled={steps.length === 0 || playing}>
          <Play size={14} aria-hidden="true" /> රටාව වාදනය කරන්න
        </button>
        <button type="button" className="btn btn-secondary" onClick={stop}>
          <Square size={14} aria-hidden="true" /> නතර කරන්න
        </button>
        <button type="button" className="btn btn-outline" onClick={saveDraft} disabled={steps.length === 0}>
          දේශීයව සුරකින්න
        </button>
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => {
            setSteps([]);
            setSavedNotice(null);
          }}
          disabled={steps.length === 0}
        >
          <RotateCcw size={14} aria-hidden="true" /> හිස් කරන්න
        </button>
      </div>

      {savedNotice && (
        <p role="status" style={{ fontSize: '0.87rem', color: 'var(--accent-cyan)' }}>
          {savedNotice}
        </p>
      )}

      <section className="surface-card">
        <h2 style={{ fontSize: '1rem' }}>
          <Wand2 size={17} style={{ verticalAlign: '-3px', marginRight: 6 }} aria-hidden="true" />
          සංගීතමය වශයෙන් වලංගු උදාහරණ රටා
        </h2>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {PROGRESSION_PRESETS.map((preset) => (
            <div
              key={preset.id}
              style={{
                display: 'flex',
                gap: '0.6rem',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                padding: '0.55rem 0.7rem',
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <div style={{ flex: 1, minWidth: 220 }}>
                <strong style={{ fontSize: '0.9rem' }}>{preset.nameSi}</strong>
                <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
                  {preset.descriptionSi}
                </p>
              </div>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => loadPreset(preset.id)}
              >
                පූරණය කරන්න
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="surface-card">
        <h2 style={{ fontSize: '1rem' }}>
          {keyRoot} {mode === 'major' ? 'Major' : 'Natural Minor'} — Diatonic කෝඩ්
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          එක් කිරීමට කෝඩ් එකක් තෝරන්න. Roman Numeral අංකනය එක් එක් කෝඩ් එකේ කාර්යය පෙන්නුම් කරයි.
        </p>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {diatonic.map((entry) => (
            <button
              key={entry.roman}
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => addChord(entry.root, entry.quality, entry.roman)}
              title={entry.functionNameSi}
            >
              <Plus size={12} aria-hidden="true" />
              {entry.roman} · {entry.symbol}
            </button>
          ))}
        </div>

        <h3 style={{ fontSize: '0.92rem', marginTop: 'var(--space-5)' }}>අනෙකුත් කෝඩ් එක් කරන්න</h3>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {CHROMATIC_NOTES.flatMap((note) =>
            (['major', 'minor', 'dom7', 'maj7', 'min7', 'diminished'] as ChordQuality[]).map(
              (quality) => ({
                note,
                quality,
                symbol: buildChord(note, quality).symbol,
              })
            )
          )
            .slice(0, 24)
            .map((option) => (
              <button
                key={`${option.note}-${option.quality}`}
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => addChord(option.note, option.quality, '—')}
              >
                {option.symbol}
              </button>
            ))}
        </div>
      </section>

      <section className="surface-card">
        <h2 style={{ fontSize: '1rem' }}>ඔබේ කෝඩ් රටාව ({steps.length} කෝඩ්)</h2>

        {steps.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            තවමත් කෝඩ් එක් කර නැත. ඉහත බොත්තමක් ඔබන්න හෝ උදාහරණ රටාවක් පූරණය කරන්න.
          </p>
        ) : (
          <ol style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '0.4rem' }}>
            {steps.map((step, index) => {
              const chord = buildChord(step.root, step.quality);
              const isDiatonic = diatonic.some(
                (d) => d.root === step.root && d.quality === step.quality
              );
              return (
                <li
                  key={step.id}
                  style={{
                    display: 'flex',
                    gap: '0.5rem',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    padding: '0.45rem 0.6rem',
                    background: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-sm)',
                    borderLeft: `3px solid ${isDiatonic ? 'var(--accent-cyan)' : 'var(--accent-amber)'}`,
                  }}
                >
                  <span style={{ fontSize: '0.9rem' }}>
                    <strong>{index + 1}.</strong> {step.roman !== '—' && <strong>{step.roman} · </strong>}
                    {chord.symbol} <span style={{ color: 'var(--text-muted)' }}>({chord.notes.join(' ')})</span>
                    {!isDiatonic && (
                      <span className="badge badge-amber" style={{ marginLeft: 6 }}>
                        Key එකට පිටතින්
                      </span>
                    )}
                  </span>
                  <span style={{ display: 'flex', gap: '0.3rem' }}>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => move(index, -1)}
                      disabled={index === 0}
                      aria-label="ඉහළට ගෙන යන්න"
                    >
                      <ArrowUp size={12} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => move(index, 1)}
                      disabled={index === steps.length - 1}
                      aria-label="පහළට ගෙන යන්න"
                    >
                      <ArrowDown size={12} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => remove(index)}
                      aria-label="ඉවත් කරන්න"
                    >
                      <Trash2 size={12} aria-hidden="true" />
                    </button>
                  </span>
                </li>
              );
            })}
          </ol>
        )}

        {steps.length > 0 && (
          <div className="formula-block" style={{ marginTop: 'var(--space-4)' }}>
{`විශ්ලේෂණය: ${analysis.analysisSi}
Cadence: ${analysis.cadenceNameSi}
Diatonic කෝඩ්: ${analysis.diatonicCount}/${steps.length}
Key එකට පිටතින්: ${analysis.borrowedChords.length === 0 ? 'නොමැත' : analysis.borrowedChords.join(', ')}`}
          </div>
        )}

        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 'var(--space-3)' }}>
          <strong>සටහන:</strong> මෙය සංගීතමය වශයෙන් වලංගුතාව පිළිබඳ <em>මාර්ගෝපදේශයක්</em>{' '}
          පමණි. Diatonic නොවන කෝඩ් සංගීතමය වශයෙන් වැරදි නොවේ — ඒවා කලාත්මක වර්ණයක් ලබා දෙයි.
        </p>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          කලින් සුරකින ලද රටා පවතින අතර ගිණුමකට සම්බන්ධ නොකරන ලදී. Cloud සුරැකුම Firebase
          සම්බන්ධ කිරීමෙන් සක්‍රීය වේ.
        </p>
      </section>
    </div>
  );
}
