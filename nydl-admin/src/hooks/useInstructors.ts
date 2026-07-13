import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { instructorsApi } from '@/api/instructors.api';

export function useInstructors(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['instructors', params],
    queryFn: async () => {
      const res = await instructorsApi.getAll(params);
      return res.data.data;
    },
  });
}

export function useInstructor(id: string) {
  return useQuery({
    queryKey: ['instructor', id],
    queryFn: async () => {
      const res = await instructorsApi.getById(id);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useInstructorMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: instructorsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructors'] });
      queryClient.invalidateQueries({ queryKey: ['analytics-summary'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => instructorsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['instructors'] });
      queryClient.invalidateQueries({ queryKey: ['instructor', variables.id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: instructorsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructors'] });
      queryClient.invalidateQueries({ queryKey: ['analytics-summary'] });
    },
  });

  return {
    createInstructor: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateInstructor: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteInstructor: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
