import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contactsApi } from '@/api/contacts.api';

export function useContacts(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['contacts', params],
    queryFn: async () => {
      const res = await contactsApi.getAll(params);
      return res.data.data;
    },
  });
}

/** Lightweight count of unhandled (NEW) contact messages — used for the header badge. */
export function useContactsUnreadCount() {
  return useQuery({
    queryKey: ['contacts', 'unread-count'],
    queryFn: async () => {
      const res = await contactsApi.unreadCount();
      return res.data.data.count;
    },
    refetchInterval: 60_000,
  });
}

export function useContactMutations() {
  const queryClient = useQueryClient();
  const markHandledMutation = useMutation({
    mutationFn: (id: string) => contactsApi.markHandled(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
  return {
    markHandled: markHandledMutation.mutateAsync,
    isMarking: markHandledMutation.isPending,
  };
}
