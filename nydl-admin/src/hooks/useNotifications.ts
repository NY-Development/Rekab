import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '@/api/notifications.api';

export function useNotifications(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: async () => {
      const res = await notificationsApi.getAll(params);
      return res.data.data;
    },
  });
}

export function useNotificationMutations() {
  const queryClient = useQueryClient();

  const sendMutation = useMutation({
    mutationFn: notificationsApi.send,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: notificationsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  return {
    sendNotification: sendMutation.mutateAsync,
    isSending: sendMutation.isPending,
    deleteNotification: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
