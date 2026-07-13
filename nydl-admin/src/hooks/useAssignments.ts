import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assignmentsApi } from '@/api/assignments.api';

export function useAssignments(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['assignments', params],
    queryFn: async () => {
      const res = await assignmentsApi.getAll(params);
      return res.data.data;
    },
  });
}

export function useAssignment(id: string) {
  return useQuery({
    queryKey: ['assignment', id],
    queryFn: async () => {
      const res = await assignmentsApi.getById(id);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useAssignmentMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: assignmentsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => assignmentsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      queryClient.invalidateQueries({ queryKey: ['assignment', variables.id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: assignmentsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
    },
  });

  return {
    createAssignment: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateAssignment: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteAssignment: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
