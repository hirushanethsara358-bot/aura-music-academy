import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  ChevronUp,
  Eye,
  FileEdit,
  Filter,
  Plus,
  Save,
  Search,
  ShieldCheck,
  Upload,
} from 'lucide-react';
import { Course, Lesson } from '../../types/content';
import {
  fetchAllLessonsIncludingDrafts,
  saveEditorOverride,
  validateLessonForPublish,
} from '../../services/lessonService';
import { fetchCourses } from '../../services/courseService';
import { EmptyState, LoadingState, StatusBanner } from '../../components/feedback/Feedback';
import { useAuth } from '../../hooks/useAuth';
import { usingFirebaseAuth } from '../../services/authService';

export function AdminCmsPage() {
  const { user } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [courseFilter, setCourseFilter] = useState('all');
  const [editing, setEditing] = useState<Lesson | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [previewing, setPreviewing] = useState<Lesson | null>(null);

  async function load() {
    setLoading(true);
    const [l, c] = await Promise.all([fetchAllLessonsIncludingDrafts(), fetchCourses()]);
    setLessons(l);
    setCourses(c);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return lessons.filter((lesson) => {
      if (statusFilter === 'published' && !lesson.published) return false;
      if (statusFilter === 'draft' && lesson.published) return false;
      if (courseFilter !== 'all' && lesson.courseId !== courseFilter) return false;
      if (term.length === 0) return true;
      return `${lesson.titleSi} ${lesson.titleEn} ${lesson.slug}`.toLowerCase().includes(term);
    });
  }, [lessons, query, statusFilter, courseFilter]);

  const validationErrors = editing ? validateLessonForPublish(editing) : [];

  function persist(lesson: Lesson) {
    saveEditorOverride({
      lessonId: lesson.id,
      published: lesson.published,
      order: lesson.order,
      titleSi: lesson.titleSi,
      titleEn: lesson.titleEn,
      descriptionSi: lesson.descriptionSi,
      updatedAt: new Date().toISOString(),
    });
    setLessons((prev) => prev.map((l) => (l.id === lesson.id ? lesson : l)));
    setNotice(
      `“${lesson.titleSi}” සුරකින ලදී. ${
        usingFirebaseAuth()
          ? 'Firebase සම්බන්ධ කර ඇති අතර, ලිවීම Firestore Security Rules මගින් පරීක්ෂා කරනු ලැබේ.'
          : 'දේශීය ප්‍රකාරයේ සුරකින ලදී (මෙම බ්‍රවුසරයේ පමණක්).'
      }`
    );
  }

  function move(lesson: Lesson, direction: -1 | 1) {
    const next = { ...lesson, order: Math.max(1, lesson.order + direction) };
    persist(next);
    setEditing(next.id === editing?.id ? next : editing);
  }

  if (loading) return <LoadingState labelSi="පරිපාලන දත්ත පූරණය වෙමින්..." />;

  if (!user?.isAdmin) {
    return (
      <StatusBanner tone="warning" titleSi="ප්‍රවේශය අවසර නැත">
        මෙම පරිපාලන පැනලය Admin පරිපාලකයින් සඳහා පමණි.
      </StatusBanner>
    );
  }

  return (
    <div style={{ display: 'grid', gap: 'var(--space-5)' }}>
      <header>
        <h1 style={{ marginBottom: '0.3rem' }}>
          <ShieldCheck size={22} style={{ verticalAlign: '-4px', marginRight: 6 }} aria-hidden="true" />
          අන්තර්ගත කළමනාකරණ පැනලය (Admin CMS)
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          පාඩම් සහ පාඨමාලා සංස්කරණය, පිළිවෙල සැකසීම, ප්‍රකාශනය සහ පෙරදසුන් කිරීම.
        </p>
      </header>

      {/* Authorization transparency */}
      <section className="surface-card" style={{ borderLeft: '4px solid var(--accent-violet)' }}>
        <h2 style={{ fontSize: '0.98rem', marginBottom: '0.4rem' }}>අවසර දීමේ ක්‍රියාවලිය</h2>
        <ul style={{ margin: 0, fontSize: '0.87rem', color: 'var(--text-secondary)', paddingLeft: '1.1rem' }}>
          <li>
            Admin තත්ත්වය තීරණය වන්නේ <strong>Firebase Auth Custom Claim</strong> (
            <code>admin: true</code>) මගිනි. එය සේවාදායකය මගින් පමණක් සකසනු ලබන අතර බ්‍රවුසරයෙන්
            වෙනස් කළ නොහැක.
          </li>
          <li>
            පරිශීලක පැතිකඩ (Profile) තුළ ඇති <code>role</code> ක්ෂේත්‍රයක් කිසිවිටෙකත් අවසර දීම
            සඳහා භාවිතා නොකෙරේ — එය පරිශීලකයාටම වෙනස් කළ හැකි බැවිනි.
          </li>
          <li>
            සියලුම වරප්‍රසාදිත Firestore ලිවීම් <code>firebase/firestore.rules</code> මගින් ස්වාධීනව
            පරීක්ෂා කරනු ලැබේ. මෙම පිටුව සැඟවීම හෝ පෙන්වීම කිසිසේත් ආරක්ෂණ යාන්ත්‍රණයක් නොවේ.
          </li>
          <li>
            පළමු Admin පරිපාලක නිර්මාණය කරන ආකාරය <Link to="/about">දැනුම්දීම් පිටුවේ</Link> සහ{' '}
            <code>docs/SECURITY.md</code> හි විස්තර කර ඇත.
          </li>
        </ul>
      </section>

      {notice && (
        <StatusBanner tone="success" titleSi="සුරකින ලදී">
          {notice}
        </StatusBanner>
      )}

      {/* Filters */}
      <section className="surface-card">
        <h2 style={{ fontSize: '0.98rem' }}>
          <Filter size={16} style={{ verticalAlign: '-3px', marginRight: 6 }} aria-hidden="true" />
          සෙවීම සහ පෙරහන්
        </h2>
        <div className="lab-control-row" style={{ marginBottom: 0 }}>
          <div className="lab-control" style={{ flexBasis: 240 }}>
            <label htmlFor="admin-search">
              <Search size={12} style={{ verticalAlign: '-2px', marginRight: 4 }} aria-hidden="true" />
              සොයන්න
            </label>
            <input
              id="admin-search"
              type="search"
              className="input-field"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="මාතෘකාව හෝ slug"
            />
          </div>

          <div className="lab-control">
            <label htmlFor="admin-status">ප්‍රකාශන තත්ත්වය</label>
            <select
              id="admin-status"
              className="select-field"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'published' | 'draft')}
            >
              <option value="all">සියල්ල</option>
              <option value="published">ප්‍රකාශිත</option>
              <option value="draft">කෙටුම්පත්</option>
            </select>
          </div>

          <div className="lab-control" style={{ flexBasis: 220 }}>
            <label htmlFor="admin-course">පාඨමාලාව</label>
            <select
              id="admin-course"
              className="select-field"
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
            >
              <option value="all">සියලු පාඨමාලා</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  මට්ටම {c.level}
                </option>
              ))}
            </select>
          </div>

          <span className="badge" aria-live="polite">
            පාඩම් {filtered.length} ක්
          </span>
        </div>
      </section>

      {/* Lesson table */}
      <section className="surface-card">
        <h2 style={{ fontSize: '1rem' }}>පාඩම්</h2>
        {filtered.length === 0 ? (
          <EmptyState
            titleSi="පාඩම් හමු නොවිණි"
            descriptionSi="ඔබේ සෙවුම් නිර්ණායකයට ගැළපෙන පාඩමක් නොමැත."
          />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">මට්ටම</th>
                  <th scope="col">මාතෘකාව</th>
                  <th scope="col">Slug</th>
                  <th scope="col">පිළිවෙල</th>
                  <th scope="col">තත්ත්වය</th>
                  <th scope="col">ක්‍රියා</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((lesson) => (
                  <tr key={lesson.id}>
                    <td>{lesson.level}</td>
                    <td>
                      <strong>{lesson.titleSi}</strong>
                      <br />
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {lesson.titleEn}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
                      {lesson.slug}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.2rem' }}>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => move(lesson, -1)}
                          aria-label="ඉහළට"
                        >
                          <ChevronUp size={12} aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => move(lesson, 1)}
                          aria-label="පහළට"
                        >
                          <ChevronDown size={12} aria-hidden="true" />
                        </button>
                        <span style={{ marginLeft: 4, alignSelf: 'center' }}>{lesson.order}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${lesson.published ? 'badge-success' : 'badge-amber'}`}>
                        {lesson.published ? 'ප්‍රකාශිත' : 'ප්‍රකාශිත නොවේ'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setEditing(lesson);
                            setPreviewing(null);
                          }}
                        >
                          <FileEdit size={12} aria-hidden="true" /> සංස්කරණය
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => {
                            setPreviewing(lesson);
                            setEditing(null);
                          }}
                        >
                          <Eye size={12} aria-hidden="true" /> පෙරදසුන
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Editor */}
      {editing && (
        <section className="surface-card">
          <h2 style={{ fontSize: '1rem' }}>
            <FileEdit size={17} style={{ verticalAlign: '-3px', marginRight: 6 }} aria-hidden="true" />
            සංස්කරණය: {editing.titleSi}
          </h2>

          {validationErrors.length > 0 && (
            <StatusBanner tone="error" titleSi="ප්‍රකාශ කිරීමට පෙර මේවා නිවැරදි කරන්න">
              <ul style={{ margin: 0, paddingLeft: '1.1rem' }}>
                {validationErrors.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </StatusBanner>
          )}

          <div style={{ display: 'grid', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
            <div className="lab-control">
              <label htmlFor="edit-title-si">සිංහල මාතෘකාව (titleSi) *</label>
              <input
                id="edit-title-si"
                type="text"
                className="input-field"
                value={editing.titleSi}
                onChange={(e) => setEditing({ ...editing, titleSi: e.target.value })}
              />
            </div>

            <div className="lab-control">
              <label htmlFor="edit-title-en">ඉංග්‍රීසි මාතෘකාව (titleEn) *</label>
              <input
                id="edit-title-en"
                type="text"
                className="input-field"
                value={editing.titleEn}
                onChange={(e) => setEditing({ ...editing, titleEn: e.target.value })}
              />
            </div>

            <div className="lab-control">
              <label htmlFor="edit-slug">Slug * (අකුරු කුඩා ඉංග්‍රීසි, අංක සහ - පමණි)</label>
              <input
                id="edit-slug"
                type="text"
                className="input-field"
                value={editing.slug}
                onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
              />
            </div>

            <div className="lab-control">
              <label htmlFor="edit-description">සිංහල විස්තරය (descriptionSi) *</label>
              <textarea
                id="edit-description"
                className="textarea-field"
                rows={3}
                value={editing.descriptionSi}
                onChange={(e) => setEditing({ ...editing, descriptionSi: e.target.value })}
              />
            </div>

            <div className="lab-control-row" style={{ marginBottom: 0 }}>
              <div className="lab-control">
                <label htmlFor="edit-minutes">ඇස්තමේන්තුගත මිනිත්තු *</label>
                <input
                  id="edit-minutes"
                  type="number"
                  min={1}
                  className="input-field"
                  value={editing.estimatedMinutes}
                  onChange={(e) =>
                    setEditing({ ...editing, estimatedMinutes: Number(e.target.value) || 1 })
                  }
                />
              </div>

              <div className="lab-control">
                <label htmlFor="edit-order">පිළිවෙල (Order)</label>
                <input
                  id="edit-order"
                  type="number"
                  min={1}
                  className="input-field"
                  value={editing.order}
                  onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) || 1 })}
                />
              </div>

              <div className="lab-control">
                <label htmlFor="edit-published">ප්‍රකාශන තත්ත්වය</label>
                <select
                  id="edit-published"
                  className="select-field"
                  value={editing.published ? 'yes' : 'no'}
                  onChange={(e) => setEditing({ ...editing, published: e.target.value === 'yes' })}
                >
                  <option value="yes">ප්‍රකාශ කරන්න</option>
                  <option value="no">කෙටුම්පත ලෙස තබන්න</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => persist(editing)}
                disabled={validationErrors.length > 0 && editing.published}
              >
                <Save size={14} aria-hidden="true" /> සුරකින්න
              </button>
              <button
                type="button"
                className="btn btn-outline"
                disabled={validationErrors.length > 0}
                onClick={() => {
                  persist({ ...editing, published: true });
                }}
              >
                <Upload size={14} aria-hidden="true" /> සුරකින්න සහ ප්‍රකාශ කරන්න
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setEditing(null)}>
                අවලංගු කරන්න
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Preview */}
      {previewing && (
        <section className="surface-card" style={{ borderLeft: '4px solid var(--accent-cyan)' }}>
          <h2 style={{ fontSize: '1rem' }}>
            <Eye size={17} style={{ verticalAlign: '-3px', marginRight: 6 }} aria-hidden="true" />
            පෙරදසුන — {previewing.titleSi}
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{previewing.titleEn}</p>
          <p style={{ color: 'var(--text-secondary)' }}>{previewing.descriptionSi}</p>

          {previewing.sections.map((section) => (
            <div key={section.id} style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-3)', marginTop: 'var(--space-3)' }}>
              <h3 style={{ fontSize: '0.95rem' }}>{section.headingSi}</h3>
              {section.bodySi.split('\n\n').map((p, i) => (
                <p key={i} style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  {p}
                </p>
              ))}
            </div>
          ))}

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: 'var(--space-4)' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setPreviewing(null)}>
              පෙරදසුන වසන්න
            </button>
            <Link to={`/lessons/${previewing.slug}`} className="btn btn-outline">
              සජීවී පාඩම් පිටුව බලන්න
            </Link>
          </div>
        </section>
      )}

      {/* New lesson placeholder */}
      <section className="surface-card">
        <h2 style={{ fontSize: '0.98rem' }}>
          <Plus size={17} style={{ verticalAlign: '-3px', marginRight: 6 }} aria-hidden="true" />
          නව පාඩමක් සෑදීම
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          සම්පූර්ණ නව පාඩමක් අන්තර්ගතය සමඟ නිර්මාණය කිරීම තවමත් සංවර්ධනය වෙමින් පවතී. දැනට
          ඔබට පවතින පාඩම් සංස්කරණය කිරීමට, පිළිවෙල වෙනස් කිරීමට, ප්‍රකාශ කිරීමට හෝ කෙටුම්පත්
          ලෙස තැබීමට හැක. නව පාඩම් දැනට{' '}
          <code>src/content/lessons/</code> හි රචනා කර repository එකට එක් කරනු ලැබේ.
        </p>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: 0 }}>
          <strong>වගකීම් සහගත සංස්කරණය:</strong> පාඩමක් ප්‍රකාශ කිරීමට පෙර අවම වශයෙන් අංශයක්,
          ඉගෙනුම් අරමුණක් සහ සාරාංශයක් තිබිය යුතුයි. සම්පූර්ණ නොවන පාඩමක් ප්‍රකාශ නොකරන්න —
          එය ඉගෙනුම්කරුවන් නොමග යැවීමකි.
        </p>
      </section>
    </div>
  );
}
