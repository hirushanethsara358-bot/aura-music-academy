import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Course, Lesson } from '../../types/content';
import { fetchCourseById } from '../../services/courseService';
import { fetchLessonsByCourse } from '../../services/lessonService';
import { LessonCard } from '../../components/lessons/LessonCard';
import { EmptyState, LoadingState } from '../../components/feedback/Feedback';
import { useProgress } from '../../hooks/useProgress';
import { NotFoundPage } from './NotFoundPage';

export function LevelPage() {
  const { level } = useParams<{ level: string }>();
  const levelNumber = Number(level);
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const { isCompleted, isBookmarked } = useProgress();

  useEffect(() => {
    let mounted = true;
    if (!Number.isInteger(levelNumber) || levelNumber < 1 || levelNumber > 9) {
      setLoading(false);
      return;
    }
    const courseId = `course-level-${levelNumber}`;
    void Promise.all([fetchCourseById(courseId), fetchLessonsByCourse(courseId)])
      .then(([c, l]) => {
        if (!mounted) return;
        setCourse(c);
        setLessons(l);
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [levelNumber]);

  if (!Number.isInteger(levelNumber) || levelNumber < 1 || levelNumber > 9) {
    return <NotFoundPage />;
  }

  if (loading) return <LoadingState />;

  if (!course) {
    return (
      <EmptyState
        titleSi="මෙම මට්ටම හමු නොවිණි"
        descriptionSi="ඔබ සොයන ඉගෙනුම් මට්ටම තවමත් සකසා නොමැත."
      />
    );
  }

  return (
    <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
      <header className="surface-card">
        <span className="badge badge-violet" style={{ marginBottom: '0.6rem' }}>
          මට්ටම {course.level}
        </span>
        <h1 style={{ marginBottom: '0.3rem' }}>{course.titleSi}</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{course.titleEn}</p>
        <p style={{ color: 'var(--text-secondary)', maxWidth: 780 }}>{course.descriptionSi}</p>

        <h2 style={{ fontSize: '0.98rem', marginTop: 'var(--space-5)' }}>ඉගෙනුම් ප්‍රතිඵල</h2>
        <ul style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          {course.outcomesSi.map((o) => (
            <li key={o}>{o}</li>
          ))}
        </ul>

        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 0 }}>
          ප්‍රකාශිත පාඩම් {lessons.length} ක් · සැලසුම් කළ මුළු පාඩම් {course.plannedTotalLessons} ක්
        </p>
      </header>

      {lessons.length === 0 ? (
        <EmptyState
          titleSi="මෙම මට්ටමේ පාඩම් තවමත් ප්‍රකාශිත නොවේ"
          descriptionSi="පාඩම් රචනා කරමින් පවතින අතර ඒවා මෙහි ප්‍රකාශිත වූ පසු දිස්වනු ඇත."
        />
      ) : (
        <section>
          <h2 style={{ marginBottom: 'var(--space-4)' }}>පාඩම්</h2>
          <div className="grid-2">
            {lessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                completed={isCompleted(lesson.id)}
                bookmarked={isBookmarked(lesson.id)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
