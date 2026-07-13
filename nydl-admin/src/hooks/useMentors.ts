import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mentorsApi } from '@/api/mentors.api';

export function useMentors(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['mentors', params],
    queryFn: async () => {
      const res = await mentorsApi.getAll(params);
      return res.data.data;
    },
  });
}

export function useMentor(id: string) {
  return useQuery({
    queryKey: ['mentor', id],
    queryFn: async () => {
      const res = await mentorsApi.getById(id);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useMentorMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: mentorsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentors'] });
      queryClient.invalidateQueries({ queryKey: ['analytics-summary'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => mentorsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['mentors'] });
      queryClient.invalidateQueries({ queryKey: ['mentor', variables.id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: mentorsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentors'] });
      queryClient.invalidateQueries({ queryKey: ['analytics-summary'] });
    },
  });

  return {
    createMentor: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateMentor: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteMentor: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
