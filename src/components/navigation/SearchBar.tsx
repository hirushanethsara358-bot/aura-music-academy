import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Lesson } from '../../types/content';
import { fetchPublishedLessons, searchLessons } from '../../services/lessonService';
import { readJson, writeJson } from '../../lib/storage';

const RECENT_KEY = 'recent-searches';

export function SearchBar({
  autoFocus = false,
  onNavigate,
}: {
  autoFocus?: boolean;
  onNavigate?: () => void;
}) {
  const [query, setQuery] = useState('');
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    void fetchPublishedLessons()
      .then((all) => {
        if (mounted) setLessons(all);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const results = useMemo(() => {
    if (query.trim().length < 2) return [];
    return searchLessons(lessons, query).slice(0, 8);
  }, [lessons, query]);

  function commitSearch(term: string) {
    if (term.trim().length === 0) return;
    const recent = readJson<string[]>(RECENT_KEY, []);
    const next = [term.trim(), ...recent.filter((r) => r !== term.trim())].slice(0, 6);
    writeJson(RECENT_KEY, next);
    onNavigate?.();
    navigate(`/search?q=${encodeURIComponent(term.trim())}`);
  }

  return (
    <div style={{ position: 'relative' }}>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          commitSearch(query);
        }}
        style={{ display: 'flex', gap: '0.5rem' }}
      >
        <label htmlFor="aura-global-search" className="visually-hidden">
          පාඩම් සොයන්න
        </label>
        <input
          id="aura-global-search"
          type="search"
          className="input-field"
          placeholder="පාඩම්, සංකල්ප හෝ යෙදුම් සොයන්න (උදා: Cadence, LUFS, EQ)"
          value={query}
          autoFocus={autoFocus}
          onChange={(e) => setQuery(e.target.value)}
          aria-describedby="aura-search-hint"
          autoComplete="off"
        />
        <button type="submit" className="btn btn-primary" disabled={query.trim().length === 0}>
          <Search size={15} aria-hidden="true" />
          සොයන්න
        </button>
      </form>

      <p
        id="aura-search-hint"
        style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}
      >
        සිංහල හෝ ඉංග්‍රීසි භාෂාවෙන් සොයන්න — පාඩම් මාතෘකා, සංකල්ප සහ Glossary යෙදුම් සියල්ල
        සොයනු ලැබේ.
      </p>

      {query.trim().length >= 2 && (
        <div
          style={{
            position: 'absolute',
            zIndex: 50,
            left: 0,
            right: 0,
            marginTop: '0.35rem',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-md)',
            maxHeight: 360,
            overflowY: 'auto',
          }}
        >
          {loading && (
            <p style={{ padding: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
              පූරණය වෙමින්...
            </p>
          )}
          {!loading && results.length === 0 && (
            <p style={{ padding: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
              ප්‍රතිඵල නොමැත. වෙනත් වචනයකින් උත්සාහ කරන්න.
            </p>
          )}
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {results.map((lesson) => (
              <li key={lesson.id}>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate?.();
                    navigate(`/lessons/${lesson.slug}`);
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.6rem 0.75rem',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  <span style={{ display: 'block', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {lesson.titleSi}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    මට්ටම {lesson.level} · {lesson.titleEn}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
