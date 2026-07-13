import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { paymentsApi } from '@/api/payments.api';

export function usePayments() {
  return useQuery({
    queryKey: ['payments'],
    queryFn: () => paymentsApi.getMyPayments().then((res) => res.data),
  });
}

export function usePayment(id: string) {
  return useQuery({
    queryKey: ['payment', id],
    queryFn: () => paymentsApi.getById(id).then((res) => res.data),
    enabled: !!id,
  });
}

export function useSubmitPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof paymentsApi.submit>[0]) =>
      paymentsApi.submit(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['enrollment'] });
    },
  });
}
