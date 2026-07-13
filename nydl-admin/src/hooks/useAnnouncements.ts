import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { announcementsApi } from '@/api/announcements.api';

export function useAnnouncements(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['announcements', params],
    queryFn: async () => {
      const res = await announcementsApi.getAll(params);
      return res.data.data;
    },
  });
}

export function useAnnouncement(id: string) {
  return useQuery({
    queryKey: ['announcement', id],
    queryFn: async () => {
      const res = await announcementsApi.getById(id);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useAnnouncementMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: announcementsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => announcementsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      queryClient.invalidateQueries({ queryKey: ['announcement', variables.id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: announcementsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });

  return {
    createAnnouncement: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateAnnouncement: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteAnnouncement: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
