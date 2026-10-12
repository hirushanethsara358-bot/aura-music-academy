import { useCallback, useEffect, useState } from 'react';
import { Lesson } from '../types/content';
import {
  computeProgressStats,
  fetchBookmarks,
  fetchUserProgress,
  markLessonVisited,
  ProgressStats,
  setLessonCompletion,
  toggleBookmark,
} from '../services/progressService';
import { BookmarkItem, LessonProgress } from '../types/content';
import { useAuth } from './useAuth';
import { fetchPublishedLessons } from '../services/lessonService';

interface UseProgressResult {
  stats: ProgressStats;
  progressRecords: LessonProgress[];
  bookmarks: BookmarkItem[];
  lessons: Lesson[];
  loading: boolean;
  error: string | null;
  isCompleted: (lessonId: string) => boolean;
  isBookmarked: (lessonId: string) => boolean;
  toggleCompletion: (lessonId: string) => Promise<void>;
  toggleBookmarkFor: (lessonId: string) => Promise<void>;
  recordVisit: (lessonId: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const EMPTY_STATS: ProgressStats = {
  totalPublishedLessons: 0,
  completedLessons: 0,
  completionPercentage: 0,
  bookmarkedLessons: 0,
  lastVisitedLessonId: null,
  levelBreakdown: [],
};

export function useProgress(): UseProgressResult {
  const { user } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progressRecords, setProgressRecords] = useState<LessonProgress[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const published = await fetchPublishedLessons();
      setLessons(published);

      if (user) {
        const [records, marks] = await Promise.all([
          fetchUserProgress(user.uid),
          fetchBookmarks(user.uid),
        ]);
        setProgressRecords(records);
        setBookmarks(marks);
      } else {
        setProgressRecords([]);
        setBookmarks([]);
      }
    } catch (err) {
      console.warn('[Aura] useProgress failed to load.', err);
      setError('දත්ත පූරණය කිරීමේදී ගැටලුවක් ඇතිවිය.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

  const isCompleted = useCallback(
    (lessonId: string) => progressRecords.some((r) => r.lessonId === lessonId && r.completed),
    [progressRecords]
  );

  const isBookmarked = useCallback(
    (lessonId: string) => bookmarks.some((b) => b.lessonId === lessonId),
    [bookmarks]
  );

  const toggleCompletion = useCallback(
    async (lessonId: string) => {
      if (!user) return;
      const nextCompleted = !isCompleted(lessonId);
      const updated = await setLessonCompletion(user.uid, lessonId, nextCompleted);
      setProgressRecords((prev) => [...prev.filter((p) => p.lessonId !== lessonId), updated]);
    },
    [user, isCompleted]
  );

  const toggleBookmarkFor = useCallback(
    async (lessonId: string) => {
      if (!user) return;
      const next = await toggleBookmark(user.uid, lessonId, isBookmarked(lessonId));
      setBookmarks(next);
    },
    [user, isBookmarked]
  );

  const recordVisit = useCallback(
    async (lessonId: string) => {
      if (!user) return;
      await markLessonVisited(user.uid, lessonId);
    },
    [user]
  );

  const stats = user
    ? computeProgressStats(user.uid, lessons, progressRecords, bookmarks.length)
    : { ...EMPTY_STATS, totalPublishedLessons: lessons.length };

  return {
    stats,
    progressRecords,
    bookmarks,
    lessons,
    loading,
    error,
    isCompleted,
    isBookmarked,
    toggleCompletion,
    toggleBookmarkFor,
    recordVisit,
    refresh: load,
  };
}
