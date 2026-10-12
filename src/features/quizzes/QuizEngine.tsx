import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  CheckCircle2,
  ListChecks,
  Play,
  RotateCcw,
  Save,
  Shuffle,
  Square,
  XCircle,
} from 'lucide-react';
import { Quiz, QuizQuestion } from '../../types/content';
import {
  AnswerValue,
  fetchQuizById,
  gradeQuiz,
  QuizGradeResult,
  saveQuizAttempt,
  shuffleQuestions,
} from '../../services/quizService';
import { LoadingState, StatusBanner } from '../../components/feedback/Feedback';
import { useAuth } from '../../hooks/useAuth';
import { webAudioEngine } from '../../lib/webAudioEngine';

function previewNotes(question: QuizQuestion): number[] {
  const notes = question.audioPreviewMidi ?? [];
  if (question.audioPreviewMode === 'chord' || question.audioPreviewMode === 'interval') {
    return notes;
  }
  return notes;
}

export function QuizEngine({
  quizIds,
  lessonTitleSi,
}: {
  /** Kept in the public API so callers can pass the owning lesson id. */
  lessonId?: string;
  quizIds: string[];
  lessonTitleSi: string;
}) {
  const { user } = useAuth();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [result, setResult] = useState<QuizGradeResult | null>(null);
  const [randomise, setRandomise] = useState(false);
  const [shuffleKey, setShuffleKey] = useState(0);
  const [saveState, setSaveState] = useState<'idle' | 'saved' | 'error'>('idle');
  const [playingId, setPlayingId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const quizId = quizIds[0];
    if (!quizId) {
      setLoading(false);
      return;
    }
    void fetchQuizById(quizId)
      .then((found) => {
        if (mounted) setQuiz(found);
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
      webAudioEngine.stopAllNotes();
    };
  }, [quizIds]);

  const displayedQuestions = useMemo(() => {
    if (!quiz) return [];
    return randomise ? shuffleQuestions(quiz.questions) : quiz.questions;
    // shuffleKey is intentionally part of the dependency list to allow re-shuffling.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiz, randomise, shuffleKey]);

  function setAnswer(questionId: string, value: AnswerValue) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  function toggleMulti(questionId: string, optionId: string) {
    setAnswers((prev) => {
      const current = Array.isArray(prev[questionId]) ? (prev[questionId] as string[]) : [];
      const next = current.includes(optionId)
        ? current.filter((v) => v !== optionId)
        : [...current, optionId];
      return { ...prev, [questionId]: next };
    });
  }

  function playPreview(question: QuizQuestion) {
    const notes = previewNotes(question);
    if (notes.length === 0) return;

    if (playingId === question.id) {
      webAudioEngine.stopAllNotes();
      setPlayingId(null);
      return;
    }

    setPlayingId(question.id);
    if (question.audioPreviewMode === 'chord' || question.audioPreviewMode === 'interval') {
      webAudioEngine.playChord(notes, 1.2, 'triangle', 0);
      if (question.audioPreviewMode === 'interval' && notes.length === 2) {
        // Interval questions play the two notes sequentially as well.
        webAudioEngine.playNoteForDuration(notes[0], 0.5, 'triangle', 1.4);
        webAudioEngine.playNoteForDuration(notes[1], 0.5, 'triangle', 2.0);
        window.setTimeout(() => setPlayingId(null), 2700);
      } else {
        window.setTimeout(() => setPlayingId(null), 1400);
      }
    } else {
      webAudioEngine.playSequence(notes, question.audioPreviewMode === 'rhythm' ? 0.5 : 0.6, 'triangle', (midi) => {
        if (midi === null) setPlayingId(null);
      });
    }
  }

  async function submit() {
    if (!quiz) return;
    const graded = gradeQuiz(quiz, answers);
    setResult(graded);

    if (user) {
      try {
        await saveQuizAttempt(user.uid, quiz, answers, graded);
        setSaveState('saved');
      } catch {
        setSaveState('error');
      }
    }

    window.scrollTo({ top: window.scrollY + 120, behavior: 'smooth' });
  }

  function retry() {
    setAnswers({});
    setResult(null);
    setSaveState('idle');
    setShuffleKey((k) => k + 1);
    webAudioEngine.stopAllNotes();
  }

  if (loading) return <LoadingState labelSi="දැනුම පරීක්ෂාව පූර්ණයෙන් පූරණය වෙමින්..." />;

  if (!quiz) {
    return (
      <StatusBanner tone="info" titleSi="දැනුම පරීක්ෂාවක් තවමත් නොමැත">
        මෙම පාඩම සඳහා දැනුම පරීක්ෂාවක් තවමත් එක් කර නොමැත.
      </StatusBanner>
    );
  }

  const answeredCount = quiz.questions.filter((q) => {
    const a = answers[q.id];
    if (a === undefined || a === null || a === '') return false;
    if (Array.isArray(a)) return a.length > 0;
    return true;
  }).length;

  const allAnswered = answeredCount === quiz.questions.length;

  return (
    <section className="surface-card" aria-labelledby="quiz-heading">
      <header style={{ marginBottom: 'var(--space-4)' }}>
        <span className="badge badge-cyan" style={{ marginBottom: '0.5rem' }}>
          <ListChecks size={12} aria-hidden="true" /> දැනුම පරීක්ෂාව
        </span>
        <h2 id="quiz-heading" style={{ marginBottom: '0.25rem', fontSize: '1.1rem' }}>
          {quiz.titleSi}
        </h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
          {quiz.titleEn} · {lessonTitleSi}
        </p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          {quiz.descriptionSi}
        </p>
        <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)' }}>
          ප්‍රශ්න {quiz.questions.length} ක් · සමත් වීමට අවම {quiz.passingPercentage}% ක් අවශ්‍යයි ·
          නැවත උත්සාහ කිරීමට අසීමිත අවස්ථා ඇත.
        </p>
      </header>

      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: 'var(--space-4)' }}>
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={() => {
            setRandomise((v) => !v);
            setShuffleKey((k) => k + 1);
          }}
          aria-pressed={randomise}
        >
          <Shuffle size={13} aria-hidden="true" />
          {randomise ? 'අහඹු අනුපිළිවෙල සක්‍රීයයි' : 'ප්‍රශ්න අහඹු ලෙස මාරු කරන්න'}
        </button>
        <span className="badge" aria-live="polite">
          පිළිතුරු දී ඇත {answeredCount}/{quiz.questions.length}
        </span>
      </div>

      <ol style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 'var(--space-5)' }}>
        {displayedQuestions.map((question, qIndex) => {
          const graded = result?.graded.find((g) => g.questionId === question.id);
          const answer = answers[question.id];

          return (
            <li key={question.id}>
              <fieldset
                style={{
                  border: `1px solid ${
                    graded ? (graded.correct ? 'var(--accent-success)' : 'var(--accent-danger)') : 'var(--border-subtle)'
                  }`,
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-4)',
                }}
              >
                <legend style={{ padding: '0 0.4rem', fontWeight: 700, fontSize: '0.95rem' }}>
                  ප්‍රශ්නය {qIndex + 1}
                </legend>

                <p style={{ fontWeight: 600, marginBottom: '0.2rem' }}>{question.promptSi}</p>
                <p style={{ fontSize: '0.79rem', color: 'var(--text-muted)' }}>{question.promptEn}</p>

                {question.audioPreviewMidi && question.audioPreviewMidi.length > 0 && (
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ marginBottom: '0.7rem' }}
                    onClick={() => playPreview(question)}
                  >
                    {playingId === question.id ? (
                      <>
                        <Square size={12} aria-hidden="true" /> නතර කරන්න
                      </>
                    ) : (
                      <>
                        <Play size={12} aria-hidden="true" /> ශ්‍රවණ උදාහරණය අසන්න (Synthesized)
                      </>
                    )}
                  </button>
                )}

                {/* Single-answer types */}
                {(question.type === 'single-choice' ||
                  question.type === 'note-identification' ||
                  question.type === 'chord-identification' ||
                  question.type === 'interval-identification' ||
                  question.type === 'rhythm-recognition') &&
                  question.options && (
                    <div style={{ display: 'grid', gap: '0.4rem' }}>
                      {question.options.map((option) => (
                        <label
                          key={option.id}
                          style={{
                            display: 'flex',
                            gap: '0.5rem',
                            alignItems: 'center',
                            padding: '0.45rem 0.6rem',
                            borderRadius: 'var(--radius-sm)',
                            background: 'var(--bg-tertiary)',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                          }}
                        >
                          <input
                            type="radio"
                            name={question.id}
                            value={option.id}
                            checked={answer === option.id}
                            onChange={() => setAnswer(question.id, option.id)}
                            disabled={result !== null}
                          />
                          <span>{option.labelSi}</span>
                        </label>
                      ))}
                    </div>
                  )}

                {/* Multiple-answer types */}
                {(question.type === 'multiple-choice' || question.type === 'checklist') && (
                  <div style={{ display: 'grid', gap: '0.4rem' }}>
                    {(question.type === 'checklist' ? question.checklistItems : question.options)?.map(
                      (option) => {
                        const current = Array.isArray(answer) ? (answer as string[]) : [];
                        return (
                          <label
                            key={option.id}
                            style={{
                              display: 'flex',
                              gap: '0.5rem',
                              alignItems: 'flex-start',
                              padding: '0.45rem 0.6rem',
                              borderRadius: 'var(--radius-sm)',
                              background: 'var(--bg-tertiary)',
                              cursor: 'pointer',
                              fontSize: '0.9rem',
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={current.includes(option.id)}
                              onChange={() => toggleMulti(question.id, option.id)}
                              disabled={result !== null}
                              style={{ marginTop: '0.25rem' }}
                            />
                            <span>{option.labelSi}</span>
                          </label>
                        );
                      }
                    )}
                  </div>
                )}

                {/* Numeric */}
                {question.type === 'numeric' && (
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <label htmlFor={`${question.id}-input`} className="visually-hidden">
                      සංඛ්‍යාත්මක පිළිතුර
                    </label>
                    <input
                      id={`${question.id}-input`}
                      type="number"
                      step="any"
                      className="input-field"
                      style={{ maxWidth: 180 }}
                      value={typeof answer === 'number' ? answer : ''}
                      onChange={(e) =>
                        setAnswer(question.id, e.target.value === '' ? '' : Number(e.target.value))
                      }
                      disabled={result !== null}
                    />
                    {question.numericUnit && (
                      <span className="badge">{question.numericUnit}</span>
                    )}
                    {question.numericTolerance !== undefined && (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        ±{question.numericTolerance} දක්වා පිළිගැනේ
                      </span>
                    )}
                  </div>
                )}

                {graded && (
                  <div
                    style={{
                      marginTop: '0.9rem',
                      paddingTop: '0.7rem',
                      borderTop: '1px solid var(--border-subtle)',
                      fontSize: '0.88rem',
                    }}
                    role="status"
                  >
                    <p
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontWeight: 700,
                        color: graded.correct ? 'var(--accent-success)' : 'var(--accent-danger)',
                        marginBottom: '0.35rem',
                      }}
                    >
                      {graded.correct ? (
                        <>
                          <CheckCircle2 size={15} aria-hidden="true" /> නිවැරදියි
                        </>
                      ) : (
                        <>
                          <XCircle size={15} aria-hidden="true" /> වැරදියි
                        </>
                      )}
                    </p>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                      ඔබේ පිළිතුර: {graded.userAnswerSummarySi}
                    </p>
                    {!graded.correct && (
                      <p style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                        නිවැරදි පිළිතුර: <strong>{graded.correctAnswerSummarySi}</strong>
                      </p>
                    )}
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 0 }}>
                      <strong>පැහැදිලි කිරීම:</strong> {graded.explanationSi}
                    </p>
                  </div>
                )}
              </fieldset>
            </li>
          );
        })}
      </ol>

      {result && (
        <div style={{ marginTop: 'var(--space-5)' }}>
          <StatusBanner
            tone={result.passed ? 'success' : 'warning'}
            titleSi={
              result.passed
                ? `සුබ පැතුම්! ඔබ සමත් විය — ලකුණු ${result.percentage}%`
                : `තවත් උත්සාහයක් අවශ්‍යයි — ලකුණු ${result.percentage}%`
            }
          >
            <p style={{ margin: '0.25rem 0' }}>
              නිවැරදි පිළිතුරු {result.score}/{result.totalQuestions} කි. සමත් වීමට අවශ්‍යයි{' '}
              {quiz.passingPercentage}% ක්.
            </p>
            {!user && (
              <p style={{ margin: '0.25rem 0' }}>
                <strong>ලකුණු සුරැකී නැත</strong>
                {' — ලකුණු සුරැකීමට '}
                <Link to="/login">පිවිසෙන්න</Link>.
              </p>
            )}
            {user && saveState === 'saved' && (
              <p style={{ margin: '0.25rem 0', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Save size={13} aria-hidden="true" /> ඔබේ ලකුණු ඔබේ ගිණුමට සුරකින ලදී.
              </p>
            )}
            {user && saveState === 'error' && (
              <p style={{ margin: '0.25rem 0', display: 'flex', alignItems: 'center', gap: 4 }}>
                <AlertTriangle size={13} aria-hidden="true" /> ලකුණු සේවාදායකයට සුරැකීමට නොහැකි විය —
                ඒවා දේශීයව සුරකින ලදී.
              </p>
            )}
          </StatusBanner>
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginTop: 'var(--space-4)' }}>
        {!result ? (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => void submit()}
            disabled={answeredCount === 0}
          >
            පිළිතුරු ඉදිරිපත් කරන්න
            {!allAnswered && (
              <span style={{ fontSize: '0.78rem', opacity: 0.85 }}>
                ({quiz.questions.length - answeredCount} ක් ඉතිරියි)
              </span>
            )}
          </button>
        ) : (
          <button type="button" className="btn btn-secondary" onClick={retry}>
            <RotateCcw size={14} aria-hidden="true" /> නැවත උත්සාහ කරන්න
          </button>
        )}
      </div>

      <p style={{ marginTop: 'var(--space-4)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
        <strong>වැදගත්:</strong> Quiz ලකුණු ගණනය කරනු ලබන්නේ ඔබේ බ්‍රවුසරයේය. එනිසා මෙය
        <strong> අධ්‍යයන අභ්‍යාසයක් සඳහා පමණක්</strong> වන අතර වෘත්තීය සහතිකයක් සඳහා සුදුසු නොවේ.
        ඔබේ පිළිතුරු ඔබේම ගිණුමට පමණක් සුරැකේ.
      </p>
    </section>
  );
}
