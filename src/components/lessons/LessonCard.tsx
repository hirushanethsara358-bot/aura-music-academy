import { Link } from 'react-router-dom';
import { BookmarkCheck, CheckCircle2, Clock, PlayCircle } from 'lucide-react';
import { Lesson } from '../../types/content';

const CATEGORY_LABEL: Record<string, string> = {
  'music-foundations': 'සංගීත මූලධර්ම',
  'music-theory': 'සංගීත න්‍යාය',
  composition: 'සංගීත නිර්මාණය',
  arrangement: 'සංයෝජනය',
  production: 'නිෂ්පාදනය',
  'audio-engineering': 'ශබ්ද ඉංජිනේරු',
  mixing: 'Mixing',
  mastering: 'Mastering',
  'advanced-practice': 'උසස් ප්‍රායෝගික',
};

export function LessonCard({
  lesson,
  completed = false,
  bookmarked = false,
  showStatus = true,
}: {
  lesson: Lesson;
  completed?: boolean;
  bookmarked?: boolean;
  showStatus?: boolean;
}) {
  return (
    <article className="surface-card surface-card-interactive">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '0.5rem',
          flexWrap: 'wrap',
          marginBottom: '0.5rem',
        }}
      >
        <span className="badge badge-violet">මට්ටම {lesson.level}</span>
        <span className="badge">{CATEGORY_LABEL[lesson.category] ?? lesson.category}</span>
        {showStatus && completed && (
          <span className="badge badge-success">
            <CheckCircle2 size={12} aria-hidden="true" /> නිම කළා
          </span>
        )}
        {showStatus && bookmarked && (
          <span className="badge badge-cyan">
            <BookmarkCheck size={12} aria-hidden="true" /> සුරකින ලදී
          </span>
        )}
      </div>

      <h3 style={{ fontSize: '1.05rem', marginBottom: '0.3rem' }}>
        <Link to={`/lessons/${lesson.slug}`} style={{ color: 'var(--text-primary)' }}>
          {lesson.titleSi}
        </Link>
      </h3>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
        {lesson.titleEn}
      </p>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
        {lesson.descriptionSi}
      </p>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem',
          flexWrap: 'wrap',
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
          }}
        >
          <Clock size={13} aria-hidden="true" /> මිනිත්තු {lesson.estimatedMinutes}
        </span>
        <Link to={`/lessons/${lesson.slug}`} className="btn btn-secondary btn-sm">
          <PlayCircle size={14} aria-hidden="true" />
          පාඩම ආරම්භ කරන්න
        </Link>
      </div>
    </article>
  );
}
