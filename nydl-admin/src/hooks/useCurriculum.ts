import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { curriculumApi } from '@/api/curriculum.api';

export function useCurriculumDetail(courseId: string) {
  return useQuery({
    queryKey: ['curriculum-detail', courseId],
    queryFn: async () => {
      const res = await curriculumApi.getDetail(courseId);
      return res.data.data;
    },
    enabled: !!courseId,
  });
}

export function useCurriculumMutations(courseId: string) {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['curriculum-detail', courseId] });
  };

  const createModuleMutation = useMutation({
    mutationFn: curriculumApi.createModule,
    onSuccess: invalidate,
  });

  const updateModuleMutation = useMutation({
    mutationFn: ({ id, title, description, order }: { id: string; title: string; description: string; order: number }) =>
      curriculumApi.updateModule(id, { title, description, order }),
    onSuccess: invalidate,
  });

  const deleteModuleMutation = useMutation({
    mutationFn: curriculumApi.deleteModule,
    onSuccess: invalidate,
  });

  const createLessonMutation = useMutation({
    mutationFn: curriculumApi.createLesson,
    onSuccess: invalidate,
  });

  const updateLessonMutation = useMutation({
    mutationFn: ({ id, ...data }: { id: string; [key: string]: any }) =>
      curriculumApi.updateLesson(id, data),
    onSuccess: invalidate,
  });

  const deleteLessonMutation = useMutation({
    mutationFn: curriculumApi.deleteLesson,
    onSuccess: invalidate,
  });

  return {
    createModule: createModuleMutation.mutateAsync,
    isCreatingModule: createModuleMutation.isPending,
    updateModule: updateModuleMutation.mutateAsync,
    isUpdatingModule: updateModuleMutation.isPending,
    deleteModule: deleteModuleMutation.mutateAsync,
    isDeletingModule: deleteModuleMutation.isPending,
    createLesson: createLessonMutation.mutateAsync,
    isCreatingLesson: createLessonMutation.isPending,
    updateLesson: updateLessonMutation.mutateAsync,
    isUpdatingLesson: updateLessonMutation.isPending,
    deleteLesson: deleteLessonMutation.mutateAsync,
    isDeletingLesson: deleteLessonMutation.isPending,
  };
}
