import { useQuery } from '@tanstack/react-query';
import { coursesApi } from '@/api/courses.api';

export function useCourses(params?: Parameters<typeof coursesApi.getAll>[0]) {
  return useQuery({
    queryKey: ['courses', params],
    queryFn: () => coursesApi.getAll(params).then((res) => res.data),
  });
}

export function useCourse(id: string) {
  return useQuery({
    queryKey: ['course', id],
    queryFn: () => coursesApi.getById(id).then((res) => res.data),
    enabled: !!id,
  });
}

export function useCourseModules(courseId: string) {
  return useQuery({
    queryKey: ['course-modules', courseId],
    queryFn: () => coursesApi.getModules(courseId).then((res) => res.data),
    enabled: !!courseId,
  });
}

export function useModuleLessons(moduleId: string) {
  return useQuery({
    queryKey: ['module-lessons', moduleId],
    queryFn: () => coursesApi.getLessons(moduleId).then((res) => res.data),
    enabled: !!moduleId,
  });
}
