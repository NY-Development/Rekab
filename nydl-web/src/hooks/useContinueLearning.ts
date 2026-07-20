import { useMemo } from 'react';
import { useCurriculumDetail } from './useCurriculum';
import { useLessonProgress } from './useLessonProgress';

export function useContinueLearning(courseId: string) {
  const { data: curriculumRes, isLoading } = useCurriculumDetail(courseId);
  const { completedLessonIds } = useLessonProgress(courseId);

  const curriculum = curriculumRes?.data?.[0] || (curriculumRes as any)?.[0];
  const modules = curriculum?.modules || [];

  const nextLesson = useMemo(() => {
    if (modules.length === 0) return null;

    // Walk through all modules and lessons sequentially
    for (const mod of modules) {
      if (mod.lessons) {
        for (const les of mod.lessons) {
          if (!completedLessonIds.includes(les.id)) {
            return les;
          }
        }
      }
    }

    // Default to the first lesson if all lessons are done, or return null
    if (modules[0]?.lessons?.[0]) {
      return modules[0].lessons[0];
    }
    return null;
  }, [modules, completedLessonIds]);

  const continueUrl = nextLesson 
    ? `/courses/${courseId}/sessions/${nextLesson.id}`
    : `/courses/${courseId}`;

  return {
    nextLesson,
    continueUrl,
    isLoading,
  };
}
