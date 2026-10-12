import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  Bookmark,
  BookOpen,
  Compass,
  GraduationCap,
  History,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useProgress } from '../../hooks/useProgress';
import { LessonCard } from '../../components/lessons/LessonCard';
import { EmptyState, LoadingState, SkeletonGrid } from '../../components/feedback/Feedback';

export function MyLearningPage() {
  const { user } = useAuth();
  const {
    stats,
    lessons,
    bookmarks,
    loading,
    isCompleted,
    isBookmarked,
    progressRecords,
  } = useProgress();

  const bookmarkLessons = useMemo(() => {
    const ids = new Set(bookmarks.map((b) => b.lessonId));
    return lessons.filter((l) => ids.has(l.id));
  }, [bookmarks, lessons]);

  const lastVisited = useMemo(() => {
    const record = progressRecords
      .filter((r) => r.lessonId !== stats.lastVisitedLessonId)
      .sort((a, b) => (b.lastVisitedAt ?? '').localeCompare(a.lastVisitedAt ?? ''))[0];
    const id = stats.lastVisitedLessonId ?? record?.lessonId;
    return lessons.find((l) => l.id === id) ?? null;
  }, [progressRecords, lessons, stats.lastVisitedLessonId]);

  if (loading) return <LoadingState labelSi="ඔබේ ඉගෙනුම් දත්ත පූරණය වෙමින්..." />;

  if (!user) {
    return (
      <div style={{ display: 'grid', gap: 'var(--space-5)' }}>
        <EmptyState
          titleSi="පිවිසීම අවශ්‍යයි"
          descriptionSi="ඔබේ ඉගෙනුම් ප්‍රගතිය, සුරකින ලද පාඩම් සහ Quiz ලකුණු බැලීමට පිවිසෙන්න. සියලුම පාඩම් සහ Lab මෙවලම් ගිණුමක් නොමැතිවද භාවිත කළ හැක."
        />
        <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/login" className="btn btn-primary">
            පිවිසෙන්න
          </Link>
          <Link to="/register" className="btn btn-secondary">
            ලියාපදිංචි වන්න
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
      <header>
        <h1 style={{ marginBottom: '0.25rem' }}>
          <GraduationCap size={24} style={{ verticalAlign: '-4px', marginRight: 6 }} aria-hidden="true" />
          මගේ ඉගෙනුම
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          ආයුබෝවන්, <strong>{user.displayName}</strong>. මෙය ඔබේ ප්‍රගතියේ සාරාංශයයි.
        </p>
      </header>

      {/* Stats */}
      <section className="grid-4" aria-label="ඉගෙනුම් සංඛ්‍යාලේඛන">
        {[
          {
            icon: TrendingUp,
            label: 'සම්පූර්ණ ප්‍රගතිය',
            value: `${stats.completionPercentage}%`,
            hint: `පාඩම් ${stats.completedLessons}/${stats.totalPublishedLessons}`,
          },
          {
            icon: Award,
            label: 'නිම කළ පාඩම්',
            value: String(stats.completedLessons),
            hint: `ප්‍රකාශිත පාඩම් ${stats.totalPublishedLessons} න්`,
          },
          {
            icon: Bookmark,
            label: 'සුරකින ලද පාඩම්',
            value: String(stats.bookmarkedLessons),
            hint: 'පසුව කියවීමට සුරකින ලද්දේ',
          },
          {
            icon: BookOpen,
            label: 'මට්ටම්',
            value: String(stats.levelBreakdown.length),
            hint: 'ඔබ ආරම්භ කළ මට්ටම් ගණන',
          },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <article key={card.label} className="surface-card">
              <Icon size={20} color="var(--accent-blue)" aria-hidden="true" />
              <p style={{ margin: '0.5rem 0 0.15rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {card.label}
              </p>
              <p style={{ margin: 0, fontSize: '1.7rem', fontWeight: 700 }}>{card.value}</p>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>{card.hint}</p>
            </article>
          );
        })}
      </section>

      {/* Overall meter */}
      <section className="surface-card">
        <h2 style={{ fontSize: '1rem' }}>සමස්ත ප්‍රගතිය</h2>
        <div
          className="meter-bar-track"
          role="progressbar"
          aria-valuenow={stats.completionPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="සමස්ත ඉගෙනුම් ප්‍රගතිය"
          style={{ marginBottom: '0.5rem' }}
        >
          <div className="meter-bar-fill" style={{ width: `${stats.completionPercentage}%` }} />
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 'var(--space-4)' }}>
          මෙම ප්‍රතිශතය ගණනය කරනු ලබන්නේ <strong>දැනට ප්‍රකාශිත පාඩම්</strong> සහ ඔබ සැබවින්ම
          නිම කළ පාඩම් මතයි. එය කිසිවිටෙකත් ස්ථිර අගයක් ලෙස සකසා නොමැත.
        </p>

        {stats.levelBreakdown.length > 0 && (
          <>
            <h3 style={{ fontSize: '0.92rem' }}>මට්ටම් අනුව ප්‍රගතිය</h3>
            <div style={{ display: 'grid', gap: '0.6rem' }}>
              {stats.levelBreakdown.map((level) => (
                <div key={level.level}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.82rem',
                      marginBottom: '0.2rem',
                    }}
                  >
                    <Link to={`/levels/${level.level}`}>මට්ටම {level.level}</Link>
                    <span style={{ color: 'var(--text-muted)' }}>
                      {level.completed}/{level.total} ({level.percentage}%)
                    </span>
                  </div>
                  <div className="meter-bar-track">
                    <div className="meter-bar-fill" style={{ width: `${level.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Continue */}
      <section>
        <h2 style={{ marginBottom: 'var(--space-4)' }}>
          <History size={18} style={{ verticalAlign: '-3px', marginRight: 6 }} aria-hidden="true" />
          අවසන් වරට බැලූ පාඩම
        </h2>
        {lastVisited ? (
          <div className="grid-2">
            <LessonCard
              lesson={lastVisited}
              completed={isCompleted(lastVisited.id)}
              bookmarked={isBookmarked(lastVisited.id)}
            />
          </div>
        ) : (
          <EmptyState
            titleSi="තවමත් පාඩමක් බලා නැත"
            descriptionSi="පළමු පාඩම ආරම්භ කරන්න — එය මිනිත්තු 15 කින් නිම කළ හැක."
            actionLabelSi="පාඩම් බලන්න"
          />
        )}
      </section>

      {/* Bookmarks */}
      <section>
        <h2 style={{ marginBottom: 'var(--space-4)' }}>
          <Bookmark size={18} style={{ verticalAlign: '-3px', marginRight: 6 }} aria-hidden="true" />
          සුරකින ලද පාඩම්
        </h2>
        {bookmarkLessons.length > 0 ? (
          <div className="grid-2">
            {bookmarkLessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                completed={isCompleted(lesson.id)}
                bookmarked
              />
            ))}
          </div>
        ) : (
          <EmptyState
            titleSi="සුරකින ලද පාඩම් නොමැත"
            descriptionSi="ඕනෑම පාඩමක 'සුරකින්න' බොත්තම ඔබා පසුව කියවීමට එය මෙහි තබා ගන්න."
          />
        )}
      </section>

      {/* Recommendation */}
      <section className="surface-card" style={{ borderLeft: '4px solid var(--accent-violet)' }}>
        <h2 style={{ fontSize: '1rem' }}>
          <Compass size={18} style={{ verticalAlign: '-3px', marginRight: 6 }} aria-hidden="true" />
          ඊළඟට කුමක්ද?
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          මට්ටම් පිළිවෙලින් ඉගෙන ගැනීම නිර්දේශිතයි. දැනට ඔබ සම්පූර්ණ කර ඇති ප්‍රමාණය{' '}
          {stats.completionPercentage}% කි. {stats.completionPercentage < 100
            ? 'ඊළඟ ප්‍රකාශිත පාඩමෙන් දිගටම යන්න.'
            : 'දැනට ප්‍රකාශිත සියලු පාඩම් නිම කර ඇත — අලුත් පාඩම් ප්‍රකාශිත වූ පසු මෙහි දිස්වනු ඇත.'}
        </p>
        <Link to="/learning-paths" className="btn btn-primary btn-sm">
          ඉගෙනුම් මාර්ග බලන්න
        </Link>
      </section>

      {loading && <SkeletonGrid count={2} />}
    </div>
  );
}
