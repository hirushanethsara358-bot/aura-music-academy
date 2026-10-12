import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Compass,
  FlaskConical,
  GraduationCap,
  Layers,
  Radio,
  ShieldCheck,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { Course, Lesson } from '../../types/content';
import { fetchCourses } from '../../services/courseService';
import { fetchPublishedLessons } from '../../services/lessonService';
import { LessonCard } from '../../components/lessons/LessonCard';
import { SkeletonGrid } from '../../components/feedback/Feedback';
import { GLOSSARY_TERMS } from '../../content/lessons/glossary';

export function HomePage() {
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
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const featured = lessons.slice(0, 4);

  return (
    <div style={{ display: 'grid', gap: 'var(--space-8)' }}>
      {/* Hero */}
      <section
        className="surface-card"
        style={{
          background:
            'linear-gradient(135deg, rgba(124,92,255,0.14), rgba(56,189,248,0.08) 55%, transparent)',
          padding: 'var(--space-8) var(--space-6)',
        }}
      >
        <span className="badge badge-cyan" style={{ marginBottom: '0.85rem' }}>
          <Sparkles size={13} aria-hidden="true" /> සිංහල-පළමු සංගීත අධ්‍යාපන වේදිකාව
        </span>
        <h1 style={{ fontSize: 'clamp(1.7rem, 4vw, 2.6rem)', lineHeight: 1.3, marginBottom: '0.75rem' }}>
          මුල සිට උසස් මට්ටම දක්වා — බටහිර සංගීත න්‍යාය, නිර්මාණය සහ ශබ්ද ඉංජිනේරු විද්‍යාව
        </h1>
        <p style={{ maxWidth: 720, color: 'var(--text-secondary)', fontSize: '1.02rem' }}>
          <strong>Aura Music Academy</strong> හි සංගීත පදනම්, Harmony, ගීත රචනය, සංයෝජනය, DAW
          නිෂ්පාදනය, Microphone සහ Acoustics, Mixing සහ Mastering යන මාතෘකා මට්ටම් 9 ක් පුරා
          සරල සිංහලෙන් ඉගෙන ගන්න. සෑම පාඩමකම ඉංග්‍රීසි තාක්ෂණික යෙදුම්ද පැහැදිලි කර ඇත.
        </p>

        <div
          style={{
            display: 'flex',
            gap: '0.6rem',
            flexWrap: 'wrap',
            marginTop: 'var(--space-5)',
          }}
        >
          <Link to="/learning-paths" className="btn btn-primary">
            <Compass size={16} aria-hidden="true" /> ඉගෙනුම් මාර්ග බලන්න
          </Link>
          <Link to="/lessons/what-is-music-and-sound" className="btn btn-secondary">
            <BookOpen size={16} aria-hidden="true" /> පළමු පාඩමෙන් ආරම්භ කරන්න
          </Link>
          <Link to="/labs" className="btn btn-outline">
            <FlaskConical size={16} aria-hidden="true" /> අන්තර්ක්‍රියාකාරී Lab
          </Link>
        </div>

        <dl
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: 'var(--space-4)',
            marginTop: 'var(--space-6)',
            marginBottom: 0,
          }}
        >
          {[
            { label: 'ඉගෙනුම් මට්ටම්', value: String(courses.length || 9) },
            { label: 'ප්‍රකාශිත පාඩම්', value: String(lessons.length || '—') },
            { label: 'Glossary යෙදුම්', value: String(GLOSSARY_TERMS.length) },
            { label: 'Lab මෙවලම්', value: '9' },
          ].map((stat) => (
            <div key={stat.label}>
              <dt style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{stat.label}</dt>
              <dd style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>{stat.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Learning paths preview */}
      <section>
        <header style={{ marginBottom: 'var(--space-4)' }}>
          <h2 style={{ marginBottom: '0.25rem' }}>
            <Layers size={20} style={{ verticalAlign: '-3px', marginRight: 6 }} aria-hidden="true" />
            ඉගෙනුම් මාර්ග 9
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 0 }}>
            පදනම් සිට උසස් මට්ටම දක්වා පිළිවෙලින් ගොඩනගා ඇති ව්‍යුහගත පාඨමාලා.
          </p>
        </header>

        {loading ? (
          <SkeletonGrid count={3} />
        ) : (
          <div className="grid-3">
            {courses.map((course) => (
              <article key={course.id} className="surface-card surface-card-interactive">
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.55rem' }}>
                  <span className="badge badge-violet">මට්ටම {course.level}</span>
                  <span className="badge">
                    {course.lessonIds.length}/{course.plannedTotalLessons} පාඩම් ප්‍රකාශිත
                  </span>
                </div>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.35rem' }}>{course.titleSi}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
                  {course.titleEn}
                </p>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  {course.descriptionSi}
                </p>
                <Link to={`/levels/${course.level}`} className="btn btn-secondary btn-sm">
                  මට්ටම {course.level} බලන්න <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Featured lessons */}
      <section>
        <header style={{ marginBottom: 'var(--space-4)' }}>
          <h2 style={{ marginBottom: '0.25rem' }}>
            <BookOpen size={20} style={{ verticalAlign: '-3px', marginRight: 6 }} aria-hidden="true" />
            මුලින්ම ඉගෙන ගන්න
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 0 }}>
            ආරම්භකයින් සඳහා වඩාත් සුදුසු පාඩම් කිහිපයක්.
          </p>
        </header>
        {loading ? (
          <SkeletonGrid count={4} />
        ) : (
          <div className="grid-2">
            {featured.map((lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} showStatus={false} />
            ))}
          </div>
        )}
      </section>

      {/* Capabilities */}
      <section>
        <h2 style={{ marginBottom: 'var(--space-4)' }}>වේදිකාවේ විශේෂාංග</h2>
        <div className="grid-4">
          {[
            {
              icon: Radio,
              title: 'අන්තර්ක්‍රියාකාරී Music Lab',
              body: 'Virtual Piano, Scale/Chord Explorer, Progression Builder, Metronome සහ Ear Training — සියල්ල Web Audio API මගින් තත්‍ය කාලීනව.',
            },
            {
              icon: Volume2,
              title: 'ශබ්ද ඉංජිනේරු Lab',
              body: 'Waveform/FFT Visualizer, ක්‍රියාකාරී 3-band Parametric EQ සහ ඔබේම ගොනු බ්‍රවුසරයේම විශ්ලේෂණය කරන Analyzer.',
            },
            {
              icon: GraduationCap,
              title: 'ඉගෙනුම් ප්‍රගතිය',
              body: 'පාඩම් නිම කිරීම, Bookmark, Quiz ලකුණු සහ මට්ටම් අනුව ප්‍රගති සාරාංශය.',
            },
            {
              icon: ShieldCheck,
              title: 'සුරක්ෂිත ගොඩනැගීම',
              body: 'Default-Deny Firestore Security Rules, UID-අනුව පමණක් ප්‍රවේශය සහ විශ්වාසදායක Admin ක්‍රියාවලිය.',
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="surface-card">
                <Icon size={22} color="var(--accent-blue)" aria-hidden="true" />
                <h3 style={{ fontSize: '0.98rem', marginTop: '0.6rem', marginBottom: '0.35rem' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.87rem', color: 'var(--text-muted)', marginBottom: 0 }}>
                  {item.body}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Transparency */}
      <section className="surface-card" style={{ borderLeft: '4px solid var(--accent-amber)' }}>
        <h2 style={{ fontSize: '1.05rem', marginBottom: '0.55rem' }}>
          අවංක තත්ත්ව දැනුම්දීම
        </h2>
        <ul style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', paddingLeft: '1.1rem', margin: 0 }}>
          <li>
            සියලුම සංගීත උදාහරණ <strong>Web Audio API මගින් තත්‍ය කාලීනව සංශ්ලේෂණය</strong> කරන
            ලද්දේය. ඒවා සැබෑ වාද්‍ය භාණ්ඩ පටිගත කිරීම් නොවේ.
          </li>
          <li>
            සංගීත පටිගත කිරීම්, සහතික (Certificates) හෝ වෘත්තීය සමාලෝචන මෙම වේදිකාවේ
            සපයන්නේ නැත.
          </li>
          <li>
            සෑම මට්ටමකම සියලු පාඩම් ස්ලොට් තවමත් රචනා වී නොමැත. ප්‍රකාශිත පාඩම් ගණන සහ
            සැලසුම් කළ මුළු ගණන වෙන වෙනම පෙන්වා ඇත.
          </li>
          <li>
            Quiz ලකුණු ගණනය කරනු ලබන්නේ Client එකේය. එය <strong>අධ්‍යයන අභ්‍යාස සඳහා පමණක්</strong>{' '}
            වන අතර වෘත්තීය සහතික සඳහා සුදුසු නොවේ.
          </li>
        </ul>
      </section>
    </div>
  );
}
