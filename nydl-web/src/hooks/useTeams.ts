import { useQuery } from '@tanstack/react-query';
import { teamsApi } from '@/api/teams.api';

export function useTeams(params?: Parameters<typeof teamsApi.getAll>[0]) {
  return useQuery({
    queryKey: ['teams', params],
    queryFn: () => teamsApi.getAll(params).then((res) => res.data),
  });
}

export function useTeam(id: string) {
  return useQuery({
    queryKey: ['team', id],
    queryFn: () => teamsApi.getById(id).then((res) => res.data),
    enabled: !!id,
  });
}

export function useMyTeam() {
  return useQuery({
    queryKey: ['my-team'],
    queryFn: () => teamsApi.getMyTeam().then((res) => res.data),
  });
}
