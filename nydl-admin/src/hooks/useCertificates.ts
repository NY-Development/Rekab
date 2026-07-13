import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { certificatesApi } from '@/api/certificates.api';

export function useCertificates(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['certificates', params],
    queryFn: async () => {
      const res = await certificatesApi.getAll(params);
      return res.data.data;
    },
  });
}

export function useCertificate(id: string) {
  return useQuery({
    queryKey: ['certificate', id],
    queryFn: async () => {
      const res = await certificatesApi.getById(id);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useCertificateMutations() {
  const queryClient = useQueryClient();

  const issueMutation = useMutation({
    mutationFn: certificatesApi.issue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
    },
  });

  return {
    issueCertificate: issueMutation.mutateAsync,
    isIssuing: issueMutation.isPending,
  };
}
