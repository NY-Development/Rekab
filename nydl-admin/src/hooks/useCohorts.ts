import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cohortsApi } from '@/api/cohorts.api';

export function useCohorts(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['cohorts', params],
    queryFn: async () => {
      const res = await cohortsApi.getAll(params);
      return res.data.data;
    },
  });
}

export function useCohort(id: string) {
  return useQuery({
    queryKey: ['cohort', id],
    queryFn: async () => {
      const res = await cohortsApi.getById(id);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useCohortMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: cohortsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cohorts'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => cohortsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cohorts'] });
      queryClient.invalidateQueries({ queryKey: ['cohort', variables.id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: cohortsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cohorts'] });
    },
  });

  return {
    createCohort: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateCohort: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteCohort: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
