import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enrollmentsApi } from '@/api/enrollments.api';

export function useEnrollments(params?: Parameters<typeof enrollmentsApi.getMyEnrollments>[0]) {
  return useQuery({
    queryKey: ['enrollments', params],
    queryFn: () => enrollmentsApi.getMyEnrollments(params).then((res) => res.data),
  });
}

export function useEnrollment(id: string) {
  return useQuery({
    queryKey: ['enrollment', id],
    queryFn: () => enrollmentsApi.getById(id).then((res) => res.data),
    enabled: !!id,
  });
}

export function useApplyEnrollment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof enrollmentsApi.apply>[0]) =>
      enrollmentsApi.apply(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
    },
  });
}
