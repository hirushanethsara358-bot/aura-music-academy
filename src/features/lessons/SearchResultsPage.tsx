import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Lesson } from '../../types/content';
import { fetchPublishedLessons, searchLessons } from '../../services/lessonService';
import { LessonCard } from '../../components/lessons/LessonCard';
import { EmptyState, LoadingState } from '../../components/feedback/Feedback';
import { useProgress } from '../../hooks/useProgress';

export function SearchResultsPage() {
  const [params] = useSearchParams();
  const query = params.get('q') ?? '';
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const { isCompleted, isBookmarked } = useProgress();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    void fetchPublishedLessons()
      .then((all) => {
        if (mounted) setLessons(all);
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const results = query ? searchLessons(lessons, query) : [];

  if (loading) return <LoadingState labelSi="සොයමින්..." />;

  return (
    <div style={{ display: 'grid', gap: 'var(--space-5)' }}>
      <header>
        <h1 style={{ marginBottom: '0.3rem' }}>
          <Search size={22} style={{ verticalAlign: '-4px', marginRight: 6 }} aria-hidden="true" />
          සෙවුම් ප්‍රතිඵල
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          “{query}” සඳහා පාඩම් <strong>{results.length}</strong> ක් හමු විය.
        </p>
      </header>

      {results.length === 0 ? (
        <EmptyState
          titleSi="ප්‍රතිඵල නොමැත"
          descriptionSi="වෙනත් වචනයක් භාවිතා කරන්න, නැතහොත් ඉගෙනුම් මාර්ග පිටුවෙන් පාඩම් කෙලින්ම තෝරන්න."
        />
      ) : (
        <div className="grid-2">
          {results.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              completed={isCompleted(lesson.id)}
              bookmarked={isBookmarked(lesson.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
