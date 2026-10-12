import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CurriculumCategory, Lesson } from '../../types/content';
import { fetchPublishedLessons } from '../../services/lessonService';
import { LessonCard } from '../../components/lessons/LessonCard';
import { EmptyState, LoadingState } from '../../components/feedback/Feedback';
import { useProgress } from '../../hooks/useProgress';

const CATEGORY_META: Record<CurriculumCategory, { titleSi: string; descriptionSi: string }> = {
  'music-foundations': {
    titleSi: 'සංගීත මූලධර්ම (Music Foundations)',
    descriptionSi:
      'සංගීතය පිළිබඳ මූලික දැනුමක් නොමැති ආරම්භකයින් සඳහා Pitch, Rhythm, Staff Notation සහ Piano Keyboard මුල සිට.',
  },
  'music-theory': {
    titleSi: 'බටහිර සංගීත න්‍යාය (Western Music Theory)',
    descriptionSi:
      'Scales, Intervals, Chords, Diatonic Harmony, Roman Numerals සහ Circle of Fifths පිළිබඳ න්‍යායාත්මක පදනම.',
  },
  composition: {
    titleSi: 'සංගීත නිර්මාණය (Composition)',
    descriptionSi:
      'Motifs, Phrases, Melody Contour, Chord Progression, Voice Leading සහ ගීත ආකෘති නිර්මාණය.',
  },
  arrangement: {
    titleSi: 'සංගීත සංයෝජනය (Arrangement)',
    descriptionSi:
      'වාද්‍ය භාණ්ඩවල කාර්යභාරය, Register බෙදාහැරීම, MIDI Programming, Fills සහ Transitions.',
  },
  production: {
    titleSi: 'සංගීත නිෂ්පාදනය (Production)',
    descriptionSi:
      'DAW Workflow, Audio සහ MIDI, Routing, Synthesizers, ADSR Envelopes, Automation සහ අඩු-පහසුකම් පරිගණක කළමනාකරණය.',
  },
  'audio-engineering': {
    titleSi: 'ශබ්ද ඉංජිනේරු මූලධර්ම (Audio Engineering)',
    descriptionSi:
      'ශබ්ද තරංග, Decibels, Digital Sampling, Gain Staging, Microphones සහ Acoustics විද්‍යාත්මකව.',
  },
  mixing: {
    titleSi: 'ශබ්ද මිශ්‍රණය (Mixing)',
    descriptionSi:
      'EQ, Compression, Frequency Masking, Reverb, Delay, Panning සහ Mono Compatibility පිළිබඳ ප්‍රායෝගික කර්තව්‍ය.',
  },
  mastering: {
    titleSi: 'අවසාන නිමාව (Mastering)',
    descriptionSi:
      'Tonal Balance, Limiting, LUFS, True Peak, Dithering සහ බෙදාහැරීමේ සම්මත පිළිබඳ අවසන් පියවර.',
  },
  'advanced-practice': {
    titleSi: 'උසස් ප්‍රායෝගික අභ්‍යාස (Advanced Practice)',
    descriptionSi:
      'Secondary Dominants, Modal Interchange, Extended Chords සහ සම්පූර්ණ Capstone ව්‍යාපෘති.',
  },
};

export function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const { isCompleted, isBookmarked } = useProgress();

  const meta = category ? CATEGORY_META[category as CurriculumCategory] : undefined;

  useEffect(() => {
    let mounted = true;
    void fetchPublishedLessons()
      .then((all) => {
        if (!mounted) return;
        setLessons(all.filter((l) => l.category === category).sort((a, b) => a.level - b.level || a.order - b.order));
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [category]);

  if (loading) return <LoadingState />;

  if (!meta) {
    return (
      <EmptyState
        titleSi="මෙම මාතෘකාව හමු නොවිණි"
        descriptionSi="කරුණාකර ඉගෙනුම් මාර්ග පිටුවෙන් නිවැරදි මාතෘකාවක් තෝරන්න."
      />
    );
  }

  return (
    <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
      <header>
        <h1 style={{ marginBottom: '0.35rem' }}>{meta.titleSi}</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: 760 }}>{meta.descriptionSi}</p>
      </header>

      {lessons.length === 0 ? (
        <EmptyState
          titleSi="මෙම මාතෘකාවේ පාඩම් තවමත් ප්‍රකාශිත නොවේ"
          descriptionSi="මෙම මාතෘකාව සඳහා පාඩම් සැලසුම් කරමින් පවතින අතර ළඟදීම එක් කරනු ලැබේ."
        />
      ) : (
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
      )}
    </div>
  );
}
