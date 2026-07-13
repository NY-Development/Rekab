import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enrollmentsApi } from '@/api/enrollments.api';

export function useEnrollments(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['enrollments', params],
    queryFn: async () => {
      const res = await enrollmentsApi.getAll(params);
      return res.data.data;
    },
  });
}

export function useEnrollment(id: string) {
  return useQuery({
    queryKey: ['enrollment', id],
    queryFn: async () => {
      const res = await enrollmentsApi.getById(id);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useEnrollmentMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: enrollmentsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => enrollmentsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['enrollment', variables.id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: enrollmentsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
    },
  });

  return {
    createEnrollment: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateEnrollment: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteEnrollment: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
