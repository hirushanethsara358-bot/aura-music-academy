import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import { Course, Lesson } from '../../types/content';
import { fetchCourses } from '../../services/courseService';
import { fetchPublishedLessons } from '../../services/lessonService';
import { LoadingState } from '../../components/feedback/Feedback';

export function LearningPathsPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    void Promise.all([fetchCourses(), fetchPublishedLessons()])
      .then(([c, l]) => {
        if (!mounted) return;
        setCourses(c);
        setLessons(l);
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <LoadingState labelSi="ඉගෙනුම් මාර්ග පූරණය වෙමින්..." />;

  return (
    <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
      <header>
        <h1 style={{ marginBottom: '0.35rem' }}>ඉගෙනුම් මාර්ග (Learning Paths)</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: 780 }}>
          පදනම් සිට උසස් මට්ටම දක්වා ව්‍යුහගතව ගොඩනගා ඇති මට්ටම් 9 කින් යුත් පාඨමාලාවකි.
          එක් එක් මට්ටම පෙර මට්ටම මත ගොඩනැගෙන බැවින් පිළිවෙලින් ඉගෙන ගැනීම නිර්දේශිතයි.
        </p>
      </header>

      <ol style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 'var(--space-4)' }}>
        {courses.map((course) => {
          const courseLessons = lessons
            .filter((l) => l.courseId === course.id)
            .sort((a, b) => a.order - b.order);

          const isComplete = courseLessons.length > 0 && courseLessons.every((l) => l.published);
          const plannedRemaining = Math.max(0, course.plannedTotalLessons - courseLessons.length);

          return (
            <li key={course.id} className="surface-card">
              <div
                style={{
                  display: 'flex',
                  gap: 'var(--space-3)',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                }}
              >
                <div
                  aria-hidden="true"
                  style={{
                    flexShrink: 0,
                    width: 46,
                    height: 46,
                    borderRadius: 'var(--radius-md)',
                    background: 'linear-gradient(135deg, var(--accent-violet), var(--accent-cyan))',
                    display: 'grid',
                    placeItems: 'center',
                    fontWeight: 800,
                    color: '#fff',
                    fontSize: '1.15rem',
                  }}
                >
                  {course.level}
                </div>

                <div style={{ flex: 1, minWidth: 240 }}>
                  <h2 style={{ fontSize: '1.08rem', marginBottom: '0.2rem' }}>{course.titleSi}</h2>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    {course.titleEn}
                  </p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {course.descriptionSi}
                  </p>

                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
                    <span className="badge badge-violet">
                      {courseLessons.filter((l) => l.published).length} පාඩම් ප්‍රකාශිත
                    </span>
                    {plannedRemaining > 0 && (
                      <span className="badge badge-amber">
                        තවත් පාඩම් {plannedRemaining} ක් සැලසුම් කර ඇත
                      </span>
                    )}
                    {isComplete && (
                      <span className="badge badge-success">
                        <CheckCircle2 size={12} aria-hidden="true" /> සම්පූර්ණයි
                      </span>
                    )}
                  </div>

                  <details>
                    <summary style={{ cursor: 'pointer', fontSize: '0.87rem', fontWeight: 600 }}>
                      ඉගෙනුම් ප්‍රතිඵල සහ පාඩම් ලැයිස්තුව
                    </summary>
                    <ul style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                      {course.outcomesSi.map((outcome) => (
                        <li key={outcome}>{outcome}</li>
                      ))}
                    </ul>
                    <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.86rem', marginTop: '0.5rem' }}>
                      {courseLessons.map((lesson) => (
                        <li key={lesson.id} style={{ padding: '0.25rem 0' }}>
                          <Link to={`/lessons/${lesson.slug}`}>
                            <ChevronRight size={13} style={{ verticalAlign: '-2px' }} aria-hidden="true" />{' '}
                            {lesson.titleSi}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                </div>

                <Link to={`/levels/${course.level}`} className="btn btn-primary btn-sm">
                  මට්ටම {course.level}
                </Link>
              </div>

              {plannedRemaining > 0 && (
                <p
                  style={{
                    marginTop: 'var(--space-4)',
                    marginBottom: 0,
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  <strong>සටහන:</strong> මෙම මට්ටම සඳහා තවත් පාඩම් {plannedRemaining} ක් සැලසුම්
                  කර ඇති අතර ඒවා තවමත් රචනා කර නොමැත. ප්‍රකාශිත පාඩම් පමණක් මෙහි දක්වා ඇත.
                </p>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
