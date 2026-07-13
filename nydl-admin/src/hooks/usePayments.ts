import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentsApi } from '@/api/payments.api';

export function usePayments(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['payments', params],
    queryFn: async () => {
      const res = await paymentsApi.getAll(params);
      return res.data.data;
    },
  });
}

export function usePayment(id: string) {
  return useQuery({
    queryKey: ['payment', id],
    queryFn: async () => {
      const res = await paymentsApi.getById(id);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function usePaymentMutations() {
  const queryClient = useQueryClient();

  const verifyMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { status: string; notes?: string } }) =>
      paymentsApi.verify(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['payment', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['analytics-summary'] });
      queryClient.invalidateQueries({ queryKey: ['revenue-trends'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: paymentsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['analytics-summary'] });
      queryClient.invalidateQueries({ queryKey: ['revenue-trends'] });
    },
  });

  return {
    verifyPayment: verifyMutation.mutateAsync,
    isVerifying: verifyMutation.isPending,
    deletePayment: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
