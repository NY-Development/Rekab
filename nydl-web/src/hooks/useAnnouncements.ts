import { useQuery } from '@tanstack/react-query';
import { announcementsApi } from '@/api/announcements.api';

export function useAnnouncements(params?: Parameters<typeof announcementsApi.getAll>[0]) {
  return useQuery({
    queryKey: ['announcements', params],
    queryFn: () => announcementsApi.getAll(params).then((res) => res.data),
  });
}

export function useAnnouncement(id: string) {
  return useQuery({
    queryKey: ['announcement', id],
    queryFn: () => announcementsApi.getById(id).then((res) => res.data),
    enabled: !!id,
  });
}
