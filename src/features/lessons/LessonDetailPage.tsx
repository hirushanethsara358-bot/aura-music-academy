import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Circle,
  Clock,
  ListChecks,
  Play,
  Square,
  Target,
} from 'lucide-react';
import { Lesson } from '../../types/content';
import { fetchLessonBySlug, searchLessons, fetchPublishedLessons } from '../../services/lessonService';
import { LoadingState, StatusBanner } from '../../components/feedback/Feedback';
import { useProgress } from '../../hooks/useProgress';
import { useAuth } from '../../hooks/useAuth';
import { QuizEngine } from '../quizzes/QuizEngine';
import { webAudioEngine } from '../../lib/webAudioEngine';
import { NotFoundPage } from '../courses/NotFoundPage';

export function LessonDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [siblings, setSiblings] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [playingExampleId, setPlayingExampleId] = useState<string | null>(null);

  const { user } = useAuth();
  const { isCompleted, isBookmarked, toggleCompletion, toggleBookmarkFor, recordVisit } = useProgress();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setNotFound(false);

    void fetchLessonBySlug(slug ?? '')
      .then(async (found) => {
        if (!mounted) return;
        if (!found) {
          setNotFound(true);
          return;
        }
        setLesson(found);
        const all = await fetchPublishedLessons();
        setSiblings(all.filter((l) => l.courseId === found.courseId).sort((a, b) => a.order - b.order));
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [slug]);

  useEffect(() => {
    if (user && lesson) {
      void recordVisit(lesson.id);
    }
    // Only record when the lesson identity changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid, lesson?.id]);

  useEffect(() => {
    return () => {
      webAudioEngine.stopAllNotes();
    };
  }, []);

  function playExample(exampleId: string, notes: number[], type: 'melody' | 'chord') {
    if (playingExampleId === exampleId) {
      webAudioEngine.stopAllNotes();
      setPlayingExampleId(null);
      return;
    }
    setPlayingExampleId(exampleId);
    if (type === 'chord') {
      // Chords are grouped in blocks of 3–4 notes for the seeded examples.
      const blockSize = notes.length % 4 === 0 ? 4 : 3;
      const blocks: number[][] = [];
      for (let i = 0; i < notes.length; i += blockSize) {
        blocks.push(notes.slice(i, i + blockSize));
      }
      blocks.forEach((block, idx) => {
        webAudioEngine.playChord(block, 0.85, 'triangle', idx * 0.9);
      });
      window.setTimeout(() => setPlayingExampleId(null), blocks.length * 900 + 200);
    } else {
      webAudioEngine.playSequence(notes, 0.35, 'triangle', (midi) => {
        if (midi === null) setPlayingExampleId(null);
      });
    }
  }

  if (loading) return <LoadingState labelSi="පාඩම පූරණය වෙමින්..." />;
  if (notFound || !lesson) return <NotFoundPage />;

  const index = siblings.findIndex((l) => l.id === lesson.id);
  const previous = index > 0 ? siblings[index - 1] : null;
  const next = index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : null;

  const unlocked = lesson.prerequisites.every((prereqSlug) => {
    const prereq = siblings.find((l) => l.slug === prereqSlug);
    return !prereq || !user || isCompleted(prereq.id);
  });

  return (
    <article style={{ display: 'grid', gap: 'var(--space-6)' }}>
      <nav aria-label="Breadcrumb" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        <Link to="/learning-paths">ඉගෙනුම් මාර්ග</Link>
        {' / '}
        <Link to={`/levels/${lesson.level}`}>මට්ටම {lesson.level}</Link>
        {' / '}
        <span>{lesson.titleSi}</span>
      </nav>

      <header className="surface-card">
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.7rem' }}>
          <span className="badge badge-violet">මට්ටම {lesson.level}</span>
          <span className="badge">
            <Clock size={12} aria-hidden="true" /> මිනිත්තු {lesson.estimatedMinutes}
          </span>
          {lesson.quizIds.length > 0 && (
            <span className="badge badge-cyan">
              <ListChecks size={12} aria-hidden="true" /> දැනුම පරීක්ෂාව
            </span>
          )}
        </div>

        <h1 style={{ marginBottom: '0.3rem' }}>{lesson.titleSi}</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{lesson.titleEn}</p>
        <p style={{ color: 'var(--text-secondary)', maxWidth: 820 }}>{lesson.descriptionSi}</p>

        {lesson.prerequisites.length > 0 && (
          <p style={{ fontSize: '0.87rem', color: 'var(--text-muted)' }}>
            <strong>පූර්ව අවශ්‍යතා:</strong>{' '}
            {lesson.prerequisites.map((p, i) => {
              const found = siblings.find((l) => l.slug === p);
              return (
                <span key={p}>
                  {i > 0 && ', '}
                  {found ? <Link to={`/lessons/${found.slug}`}>{found.titleSi}</Link> : p}
                </span>
              );
            })}
          </p>
        )}

        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginTop: 'var(--space-4)' }}>
          {user ? (
            <>
              <button
                type="button"
                className={`btn ${isCompleted(lesson.id) ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => void toggleCompletion(lesson.id)}
                aria-pressed={isCompleted(lesson.id)}
              >
                {isCompleted(lesson.id) ? (
                  <CheckCircle2 size={15} aria-hidden="true" />
                ) : (
                  <Circle size={15} aria-hidden="true" />
                )}
                {isCompleted(lesson.id) ? 'නිම කළා ලෙස සටහන් කර ඇත' : 'නිම කළා ලෙස සටහන් කරන්න'}
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => void toggleBookmarkFor(lesson.id)}
                aria-pressed={isBookmarked(lesson.id)}
              >
                {isBookmarked(lesson.id) ? (
                  <BookmarkCheck size={15} aria-hidden="true" />
                ) : (
                  <Bookmark size={15} aria-hidden="true" />
                )}
                {isBookmarked(lesson.id) ? 'සුරකින ලදී' : 'සුරකින්න'}
              </button>
            </>
          ) : (
            <StatusBanner tone="info" titleSi="ප්‍රගතිය සුරැකීමට පිවිසෙන්න">
              පාඩම් නිම කිරීම, Bookmark සහ Quiz ලකුණු සුරැකීමට <Link to="/login">පිවිසෙන්න</Link>.
              සියලුම පාඩම් සහ Lab ගිණුමක් නොමැතිවද නැරඹිය හැක.
            </StatusBanner>
          )}
        </div>
      </header>

      {!unlocked && (
        <StatusBanner tone="warning" titleSi="පූර්ව අවශ්‍යතා තවමත් නිම කර නැත">
          මෙම පාඩම පූර්ව අවශ්‍යතා මත ගොඩනැගී ඇත. කෙසේ වුවද ඔබට මෙය දැන් කියවා ඉදිරියට යා
          හැක — සංකල්ප වඩාත් හොඳින් වටහා ගැනීමට පෙර පාඩම් නිම කිරීම නිර්දේශිතයි.
        </StatusBanner>
      )}

      <section className="surface-card">
        <h2 style={{ fontSize: '1.05rem' }}>
          <Target size={18} style={{ verticalAlign: '-3px', marginRight: 6 }} aria-hidden="true" />
          ඉගෙනුම් අරමුණු
        </h2>
        <ul style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          {lesson.learningObjectives.map((objective) => (
            <li key={objective}>{objective}</li>
          ))}
        </ul>
      </section>

      {lesson.sections.map((section) => (
        <section key={section.id} className="surface-card lesson-body" id={section.id}>
          <h2 style={{ fontSize: '1.12rem', marginBottom: '0.20rem' }}>{section.headingSi}</h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.9rem' }}>
            {section.headingEn}
          </p>

          {section.bodySi.split('\n\n').map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}

          {section.bulletPointsSi && section.bulletPointsSi.length > 0 && (
            <ul style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              {section.bulletPointsSi.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          )}

          {section.formulaOrDiagram && (
            <pre className="formula-block" aria-label="සූත්‍රය හෝ රූප සටහන">
              {section.formulaOrDiagram}
            </pre>
          )}

          {section.keyTerms && section.keyTerms.length > 0 && (
            <div style={{ marginTop: 'var(--space-4)' }}>
              <h3 style={{ fontSize: '0.92rem', color: 'var(--text-muted)' }}>මූලික යෙදුම්</h3>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {section.keyTerms.map((term) => (
                  <div key={term.termEn} className="term-chip">
                    <code>{term.termEn}</code>
                    <strong style={{ fontSize: '0.87rem' }}>{term.termSi}</strong>
                    <span>{term.definitionSi}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      ))}

      {lesson.examples.length > 0 && (
        <section className="surface-card">
          <h2 style={{ fontSize: '1.05rem' }}>උදාහරණ සහ ශ්‍රවණ අභ්‍යාස</h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            පහත සියලුම උදාහරණ <strong>Web Audio API මගින් තත්‍ය කාලීනව සංශ්ලේෂණය</strong> කරන
            ලද Synthesized ශබ්ද වේ. සැබෑ වාද්‍ය භාණ්ඩ පටිගත කිරීම් නොවේ.
          </p>

          {lesson.examples.map((example) => (
            <div
              key={example.id}
              style={{
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: 'var(--space-4)',
                marginTop: 'var(--space-4)',
              }}
            >
              <h3 style={{ fontSize: '0.98rem', marginBottom: '0.25rem' }}>{example.titleSi}</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{example.titleEn}</p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {example.descriptionSi}
              </p>
              <pre className="formula-block">{example.notationOrSteps}</pre>

              {example.synthPreviewNotes && example.synthPreviewNotes.length > 0 && (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() =>
                    playExample(
                      example.id,
                      example.synthPreviewNotes as number[],
                      example.synthType ?? 'melody'
                    )
                  }
                >
                  {playingExampleId === example.id ? (
                    <>
                      <Square size={13} aria-hidden="true" /> නතර කරන්න
                    </>
                  ) : (
                    <>
                      <Play size={13} aria-hidden="true" /> අසන්න (Synthesized)
                    </>
                  )}
                </button>
              )}
            </div>
          ))}
        </section>
      )}

      {lesson.exercises.length > 0 && (
        <section className="surface-card">
          <h2 style={{ fontSize: '1.05rem' }}>ප්‍රායෝගික අභ්‍යාස</h2>
          {lesson.exercises.map((exercise) => (
            <div key={exercise.id}>
              <h3 style={{ fontSize: '0.98rem' }}>{exercise.titleSi}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                {exercise.instructionsSi}
              </p>
              <ol style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                {exercise.stepsSi.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              {exercise.linkedLabTab && (
                <Link to={`/labs?tab=${exercise.linkedLabTab}`} className="btn btn-outline btn-sm">
                  අදාළ Lab මෙවලම විවෘත කරන්න <ArrowRight size={13} aria-hidden="true" />
                </Link>
              )}
            </div>
          ))}
        </section>
      )}

      {lesson.quizIds.length > 0 && (
        <section>
          <QuizEngine lessonId={lesson.id} quizIds={lesson.quizIds} lessonTitleSi={lesson.titleSi} />
        </section>
      )}

      <section className="surface-card" style={{ borderLeft: '4px solid var(--accent-cyan)' }}>
        <h2 style={{ fontSize: '1.05rem' }}>සාරාංශය</h2>
        <p style={{ color: 'var(--text-secondary)' }}>{lesson.summarySi}</p>

        <h3 style={{ fontSize: '0.95rem' }}>ඉදිරි පුහුණුව</h3>
        <ul style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          {lesson.furtherPracticeSi.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <nav
        aria-label="පාඩම් සංචාලනය"
        style={{ display: 'flex', justifyContent: 'space-between', gap: '0.6rem', flexWrap: 'wrap' }}
      >
        {previous ? (
          <Link to={`/lessons/${previous.slug}`} className="btn btn-secondary">
            <ArrowLeft size={15} aria-hidden="true" /> {previous.titleSi}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link to={`/lessons/${next.slug}`} className="btn btn-primary">
            {next.titleSi} <ArrowRight size={15} aria-hidden="true" />
          </Link>
        )}
      </nav>
    </article>
  );
}

export { searchLessons };
