import { useQuery } from '@tanstack/react-query';
import { cohortsApi } from '@/api/cohorts.api';

export function useCohorts(params?: Parameters<typeof cohortsApi.getAll>[0]) {
  return useQuery({
    queryKey: ['cohorts', params],
    queryFn: () => cohortsApi.getAll(params).then((res) => res.data),
    enabled: !!params?.courseId,
  });
}
