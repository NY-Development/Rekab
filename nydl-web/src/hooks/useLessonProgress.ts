import { useState, useEffect } from 'react';

export function useLessonProgress(courseId: string) {
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);

  useEffect(() => {
    if (!courseId) return;
    const key = `nydl-progress-${courseId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        setCompletedLessonIds(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
  }, [courseId]);

  const toggleLesson = (lessonId: string) => {
    if (!courseId || !lessonId) return;
    const key = `nydl-progress-${courseId}`;
    setCompletedLessonIds((prev) => {
      const next = prev.includes(lessonId)
        ? prev.filter((id) => id !== lessonId)
        : [...prev, lessonId];
      localStorage.setItem(key, JSON.stringify(next));
      return next;
    });
  };

  const isCompleted = (lessonId: string) => completedLessonIds.includes(lessonId);

  return {
    completedLessonIds,
    toggleLesson,
    isCompleted,
  };
}
