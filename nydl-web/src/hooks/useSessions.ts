import { useQuery } from '@tanstack/react-query';
import { sessionsApi } from '@/api/sessions.api';

export function useSessions(params?: Parameters<typeof sessionsApi.getAll>[0]) {
  return useQuery({
    queryKey: ['sessions', params],
    queryFn: () => sessionsApi.getAll(params).then((res) => res.data),
  });
}

export function useSession(id: string) {
  return useQuery({
    queryKey: ['session', id],
    queryFn: () => sessionsApi.getById(id).then((res) => res.data),
    enabled: !!id,
  });
}
