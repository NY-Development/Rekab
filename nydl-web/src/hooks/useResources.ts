import { useQuery } from '@tanstack/react-query';
import { resourcesApi } from '@/api/resources.api';

export function useResources(params?: Parameters<typeof resourcesApi.getAll>[0]) {
  return useQuery({
    queryKey: ['resources', params],
    queryFn: () => resourcesApi.getAll(params).then((res) => res.data),
  });
}

export function useResource(id: string) {
  return useQuery({
    queryKey: ['resource', id],
    queryFn: () => resourcesApi.getById(id).then((res) => res.data),
    enabled: !!id,
  });
}
