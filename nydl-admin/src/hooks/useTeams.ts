import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teamsApi } from '@/api/teams.api';

export function useTeams(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['teams', params],
    queryFn: async () => {
      const res = await teamsApi.getAll(params);
      return res.data.data;
    },
  });
}

export function useTeam(id: string) {
  return useQuery({
    queryKey: ['team', id],
    queryFn: async () => {
      const res = await teamsApi.getById(id);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useTeamMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: teamsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => teamsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['team', variables.id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: teamsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });

  return {
    createTeam: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateTeam: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteTeam: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
