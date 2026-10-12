import { useMemo, useState } from 'react';
import { BookMarked, Search } from 'lucide-react';
import { GLOSSARY_TERMS } from '../../content/lessons/glossary';
import { EmptyState } from '../../components/feedback/Feedback';

const CATEGORY_FILTERS: Array<{ id: string; labelSi: string }> = [
  { id: 'all', labelSi: 'සියල්ල' },
  { id: 'music-foundations', labelSi: 'සංගීත මූලධර්ම' },
  { id: 'music-theory', labelSi: 'සංගීත න්‍යාය' },
  { id: 'composition', labelSi: 'නිර්මාණය' },
  { id: 'arrangement', labelSi: 'සංයෝජනය' },
  { id: 'production', labelSi: 'නිෂ්පාදනය' },
  { id: 'audio-engineering', labelSi: 'ශබ්ද ඉංජිනේරු' },
  { id: 'mixing', labelSi: 'Mixing' },
  { id: 'mastering', labelSi: 'Mastering' },
];

export function GlossaryPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return GLOSSARY_TERMS.filter((entry) => {
      const matchesCategory = category === 'all' || entry.category === category;
      if (!matchesCategory) return false;
      if (term.length === 0) return true;
      return [entry.termEn, entry.termSi, entry.definitionSi, entry.exampleSi]
        .join(' ')
        .toLowerCase()
        .includes(term);
    });
  }, [query, category]);

  return (
    <div style={{ display: 'grid', gap: 'var(--space-5)' }}>
      <header>
        <h1 style={{ marginBottom: '0.3rem' }}>
          <BookMarked size={24} style={{ verticalAlign: '-5px', marginRight: 6 }} aria-hidden="true" />
          සිංහල–ඉංග්‍රීසි සංගීත ශබ්දකෝෂය
        </h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: 780 }}>
          සංගීත න්‍යාය සහ ශබ්ද ඉංජිනේරු විද්‍යාවේ තාක්ෂණික යෙදුම් — සරල සිංහල පැහැදිලි කිරීම්
          සහ ප්‍රායෝගික උදාහරණ සමඟ.
        </p>
      </header>

      <div className="lab-control-row">
        <div className="lab-control" style={{ flexBasis: 260 }}>
          <label htmlFor="glossary-search">
            <Search size={13} style={{ verticalAlign: '-2px', marginRight: 4 }} aria-hidden="true" />
            සොයන්න
          </label>
          <input
            id="glossary-search"
            type="search"
            className="input-field"
            placeholder="උදා: Compression, Cadence, LUFS"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="lab-control">
          <label htmlFor="glossary-category">ප්‍රවර්ගය</label>
          <select
            id="glossary-category"
            className="select-field"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORY_FILTERS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.labelSi}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p aria-live="polite" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        යෙදුම් {filtered.length} ක් හමු විය (සමස්ත {GLOSSARY_TERMS.length} න්).
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          titleSi="ගැළපෙන යෙදුමක් හමු නොවිණි"
          descriptionSi="වෙනත් වචනයක් හෝ ප්‍රවර්ගයක් උත්සාහ කරන්න."
        />
      ) : (
        <dl className="grid-2" style={{ margin: 0 }}>
          {filtered.map((entry) => (
            <div key={entry.id} className="surface-card">
              <dt style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
                <code style={{ color: 'var(--accent-blue)', fontWeight: 700, fontSize: '0.95rem' }}>
                  {entry.termEn}
                </code>
                <span className="badge">
                  {CATEGORY_FILTERS.find((f) => f.id === entry.category)?.labelSi ?? entry.category}
                </span>
              </dt>
              <dd style={{ margin: '0.4rem 0 0' }}>
                <strong style={{ display: 'block', marginBottom: '0.35rem' }}>{entry.termSi}</strong>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                  {entry.definitionSi}
                </p>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: 0 }}>
                  <strong>උදාහරණය:</strong> {entry.exampleSi}
                </p>
              </dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
