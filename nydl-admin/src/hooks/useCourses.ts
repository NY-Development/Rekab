import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coursesApi } from '@/api/courses.api';

export function useCourses(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['courses', params],
    queryFn: async () => {
      const res = await coursesApi.getAll(params);
      return res.data.data;
    },
  });
}

export function useCourse(id: string) {
  return useQuery({
    queryKey: ['course', id],
    queryFn: async () => {
      const res = await coursesApi.getById(id);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useCourseMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: coursesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['analytics-summary'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => coursesApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['course', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['analytics-summary'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: coursesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['analytics-summary'] });
    },
  });

  return {
    createCourse: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateCourse: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteCourse: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
