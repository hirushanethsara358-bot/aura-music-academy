import { useCallback, useEffect, useState } from 'react';
import { CheckCircle2, Ear, Play, RotateCcw, Square, XCircle } from 'lucide-react';
import { calculateInterval, CHROMATIC_NOTES, INTERVAL_TABLE } from '../../lib/musicTheory';
import { webAudioEngine } from '../../lib/webAudioEngine';
import { NoteName } from '../../types/music';

type DrillType = 'note' | 'interval' | 'chord' | 'rhythm';

const NOTE_POOL: NoteName[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const INTERVAL_POOL = [2, 3, 4, 5, 7, 9, 10, 11, 12];
const CHORD_POOL: Array<{ id: string; quality: 'major' | 'minor'; labelSi: string }> = [
  { id: 'major', quality: 'major', labelSi: 'Major (මේජර්)' },
  { id: 'minor', quality: 'minor', labelSi: 'Minor (මයිනර්)' },
];

const RHYTHM_POOL: Array<{ id: string; labelSi: string; pattern: number[] }> = [
  { id: 'four-quarters', labelSi: 'Quarter Notes 4 (සමාන)', pattern: [0, 1, 2, 3] },
  { id: 'half-half', labelSi: 'Half Notes 2 (දිගු)', pattern: [0, 2] },
  { id: 'dotted', labelSi: 'Quarter + Eighth + Quarter + Eighth', pattern: [0, 1, 1.5, 2, 3, 3.5] },
  { id: 'three-quarters', labelSi: 'Quarter Notes 3 + Rest', pattern: [0, 1, 2] },
];

function randInt(max: number): number {
  return Math.floor(Math.random() * max);
}

export function EarTraining() {
  const [drill, setDrill] = useState<DrillType>('note');
  const [question, setQuestion] = useState<{
    id: string;
    promptSi: string;
    options: Array<{ id: string; labelSi: string }>;
    correctOptionId: string;
    explanationSi: string;
    play: () => void;
  } | null>(null);

  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [playing, setPlaying] = useState(false);

  const makePlaySequence = useCallback((notes: number[], stepSec = 0.6) => {
    return () => {
      setPlaying(true);
      webAudioEngine.playSequence(notes, stepSec, 'triangle', (midi) => {
        if (midi === null) setPlaying(false);
      });
    };
  }, []);

  const makePlayChord = useCallback((notes: number[], secondSequence?: number[]) => {
    return () => {
      setPlaying(true);
      webAudioEngine.playChord(notes, 1.3, 'triangle', 0);
      if (secondSequence) {
        webAudioEngine.playNoteForDuration(secondSequence[0], 0.5, 'triangle', 1.6);
        webAudioEngine.playNoteForDuration(secondSequence[1], 0.5, 'triangle', 2.3);
        window.setTimeout(() => setPlaying(false), 3000);
      } else {
        window.setTimeout(() => setPlaying(false), 1500);
      }
    };
  }, []);

  const nextQuestion = useCallback(() => {
    setSelected(null);
    webAudioEngine.stopAllNotes();

    if (drill === 'note') {
      const target = NOTE_POOL[randInt(NOTE_POOL.length)];
      const octave = randInt(2) === 0 ? 4 : 5;
      const midi = (octave + 1) * 12 + CHROMATIC_NOTES.indexOf(target);
      setQuestion({
        id: `note-${Date.now()}`,
        promptSi: 'අසන්න ස්වරය හඳුනා ගන්න.',
        options: NOTE_POOL.map((n) => ({ id: n, labelSi: n })),
        correctOptionId: target,
        explanationSi: `එය ${target}${octave} ස්වරයයි. සංඛ්‍යාතය ${(440 * Math.pow(2, (midi - 69) / 12)).toFixed(2)} Hz වේ.`,
        play: makePlaySequence([midi]),
      });
      return;
    }

    if (drill === 'interval') {
      const semitones = INTERVAL_POOL[randInt(INTERVAL_POOL.length)];
      const rootMidi = 60 + randInt(8);
      const interval = calculateInterval(rootMidi, rootMidi + semitones);
      const distractors = INTERVAL_POOL.filter((s) => s !== semitones)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      const optionIds = [semitones, ...distractors].sort(() => Math.random() - 0.5);

      setQuestion({
        id: `interval-${Date.now()}`,
        promptSi: 'අසන්න පරතරය (Interval) හඳුනා ගන්න. පළමුව ස්වර දෙක වෙන වෙනම සහ පසුව එකවර ඇසේ.',
        options: optionIds.map((s) => ({
          id: String(s),
          labelSi: INTERVAL_TABLE[s].nameSi,
        })),
        correctOptionId: String(semitones),
        explanationSi: `${semitones} අර්ධ ස්වර = ${interval.nameSi}. ${interval.explanationSi} (වර්ගය: ${interval.consonance})`,
        play: makePlayChord([rootMidi, rootMidi + semitones], [rootMidi, rootMidi + semitones]),
      });
      return;
    }

    if (drill === 'chord') {
      const choice = CHORD_POOL[randInt(CHORD_POOL.length)];
      const rootIndex = randInt(NOTE_POOL.length);
      const root = CHROMATIC_NOTES.indexOf(NOTE_POOL[rootIndex]);
      const baseMidi = 60 + root;
      const semitones = choice.quality === 'major' ? [0, 4, 7] : [0, 3, 7];
      const notes = semitones.map((s) => baseMidi + s);

      setQuestion({
        id: `chord-${Date.now()}`,
        promptSi: 'අසන්න කෝඩ් එක Major ද Minor ද?',
        options: [
          { id: 'major', labelSi: 'Major (දීප්තිමත්)' },
          { id: 'minor', labelSi: 'Minor (ගැඹුරු)' },
        ],
        correctOptionId: choice.quality,
        explanationSi: `${NOTE_POOL[rootIndex]} ${choice.quality === 'major' ? 'Major' : 'Minor'} කෝඩ් එකයි. ${
          choice.quality === 'major'
            ? 'Major 3rd (අර්ධ ස්වර 4) නිසා දීප්තිමත් ස්වභාවයක් ලැබේ.'
            : 'Minor 3rd (අර්ධ ස්වර 3) නිසා ගැඹුරු හා සංවේදී ස්වභාවයක් ලැබේ.'
        }`,
        play: makePlayChord(notes),
      });
      return;
    }

    // rhythm
    const pattern = RHYTHM_POOL[randInt(RHYTHM_POOL.length)];
    const beatMs = 480;
    setQuestion({
      id: `rhythm-${Date.now()}`,
      promptSi: 'අසන්න රිද්ම රටාව හඳුනා ගන්න.',
      options: RHYTHM_POOL.map((r) => ({ id: r.id, labelSi: r.labelSi })),
      correctOptionId: pattern.id,
      explanationSi: pattern.labelSi,
      play: () => {
        setPlaying(true);
        webAudioEngine.stopAllNotes();
        pattern.pattern.forEach((beat) => {
          webAudioEngine.playNoteForDuration(75, 0.14, 'square', (beat * beatMs) / 1000);
        });
        window.setTimeout(() => setPlaying(false), pattern.pattern[pattern.pattern.length - 1] * beatMs + 600);
      },
    });
  }, [drill, makePlayChord, makePlaySequence]);

  useEffect(() => {
    nextQuestion();
    return () => {
      webAudioEngine.stopAllNotes();
    };
    // Regenerate whenever the drill type changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drill]);

  function answer(optionId: string) {
    if (!question || selected !== null) return;
    setSelected(optionId);
    const isCorrect = optionId === question.correctOptionId;
    setScore((prev) => ({ correct: prev.correct + (isCorrect ? 1 : 0), total: prev.total + 1 }));
  }

  function reset() {
    setScore({ correct: 0, total: 0 });
    nextQuestion();
  }

  const accuracy = score.total === 0 ? 0 : Math.round((score.correct / score.total) * 100);

  return (
    <div style={{ display: 'grid', gap: 'var(--space-5)' }}>
      <div className="tab-strip" role="tablist" aria-label="ශ්‍රවණ පුහුණු ආකාරය">
        {[
          { id: 'note', labelSi: 'ස්වර හඳුනා ගැනීම' },
          { id: 'interval', labelSi: 'පරතර හඳුනා ගැනීම' },
          { id: 'chord', labelSi: 'Major / Minor කෝඩ්' },
          { id: 'rhythm', labelSi: 'රිද්ම හඳුනා ගැනීම' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            className="tab-button"
            aria-selected={drill === tab.id}
            onClick={() => setDrill(tab.id as DrillType)}
          >
            <Ear size={13} aria-hidden="true" />
            {tab.labelSi}
          </button>
        ))}
      </div>

      <section className="surface-card" style={{ borderLeft: '3px solid var(--accent-amber)' }}>
        <p style={{ margin: 0, fontSize: '0.87rem', color: 'var(--text-secondary)' }}>
          <strong>වැදගත් සටහන:</strong> මෙහි සියලු ශ්‍රවණ උදාහරණ{' '}
          <strong>Web Audio API මගින් තත්‍ය කාලීනව සංශ්ලේෂණය කරන ලද</strong> කෘත්‍රිම ශබ්ද වේ.
          ඒවා සැබෑ වාද්‍ය භාණ්ඩ පටිගත කිරීම් නොවේ. එනිසා Timbre ස්වාභාවික නොවේ.
        </p>
      </section>

      <section className="surface-card">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '0.5rem',
            flexWrap: 'wrap',
            marginBottom: 'var(--space-4)',
          }}
        >
          <span className="badge badge-violet">
            ලකුණු: {score.correct}/{score.total} ({accuracy}%)
          </span>
          <button type="button" className="btn btn-outline btn-sm" onClick={reset}>
            <RotateCcw size={13} aria-hidden="true" /> ලකුණු යළි සකසන්න
          </button>
        </div>

        {question && (
          <>
            <p style={{ fontWeight: 600, marginBottom: 'var(--space-4)' }}>{question.promptSi}</p>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: 'var(--space-4)' }}>
              <button type="button" className="btn btn-primary" onClick={question.play}>
                <Play size={14} aria-hidden="true" /> නැවත අසන්න
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  webAudioEngine.stopAllNotes();
                  setPlaying(false);
                }}
              >
                <Square size={14} aria-hidden="true" /> නතර කරන්න
              </button>
              {playing && (
                <span className="badge badge-cyan" role="status">
                  වාදනය වෙමින්...
                </span>
              )}
            </div>

            <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
              <legend className="visually-hidden">පිළිතුර තෝරන්න</legend>
              <div style={{ display: 'grid', gap: '0.45rem' }}>
                {question.options.map((option) => {
                  const isSelected = selected === option.id;
                  const isCorrect = option.id === question.correctOptionId;
                  const showResult = selected !== null;

                  let borderColor = 'var(--border-subtle)';
                  if (showResult && isCorrect) borderColor = 'var(--accent-success)';
                  else if (showResult && isSelected) borderColor = 'var(--accent-danger)';

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => answer(option.id)}
                      disabled={showResult}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        textAlign: 'left',
                        padding: '0.6rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        border: `1px solid ${borderColor}`,
                        background: 'var(--bg-tertiary)',
                        color: 'var(--text-primary)',
                        fontFamily: 'inherit',
                        fontSize: '0.92rem',
                        cursor: showResult ? 'default' : 'pointer',
                      }}
                    >
                      {showResult && isCorrect && (
                        <CheckCircle2 size={15} color="var(--accent-success)" aria-hidden="true" />
                      )}
                      {showResult && isSelected && !isCorrect && (
                        <XCircle size={15} color="var(--accent-danger)" aria-hidden="true" />
                      )}
                      {option.labelSi}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {selected !== null && (
              <div
                role="status"
                style={{
                  marginTop: 'var(--space-4)',
                  paddingTop: 'var(--space-3)',
                  borderTop: '1px solid var(--border-subtle)',
                  fontSize: '0.9rem',
                }}
              >
                <p
                  style={{
                    fontWeight: 700,
                    color:
                      selected === question.correctOptionId
                        ? 'var(--accent-success)'
                        : 'var(--accent-danger)',
                    marginBottom: '0.3rem',
                  }}
                >
                  {selected === question.correctOptionId ? 'නිවැරදියි!' : 'වැරදියි.'}
                </p>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
                  {question.explanationSi}
                </p>
                <button type="button" className="btn btn-primary" onClick={nextQuestion}>
                  ඊළඟ ප්‍රශ්නය
                </button>
              </div>
            )}

            {selected === null && (
              <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', marginTop: 'var(--space-4)' }}>
                වැරදුණහොත් නැවත නැවත උත්සාහ කළ හැක — එසේ කිරීමෙන් ඔබේ කන ඉතා ඉක්මනින් පුහුණු වේ.
              </p>
            )}
          </>
        )}
      </section>
    </div>
  );
}
