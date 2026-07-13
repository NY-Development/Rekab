import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { resourcesApi } from '@/api/resources.api';

export function useResources(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['resources', params],
    queryFn: async () => {
      const res = await resourcesApi.getAll(params);
      return res.data.data;
    },
  });
}

export function useResource(id: string) {
  return useQuery({
    queryKey: ['resource', id],
    queryFn: async () => {
      const res = await resourcesApi.getById(id);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useResourceMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: resourcesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => resourcesApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      queryClient.invalidateQueries({ queryKey: ['resource', variables.id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: resourcesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
  });

  return {
    createResource: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateResource: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteResource: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
