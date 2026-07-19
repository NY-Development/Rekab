import { useQuery } from '@tanstack/react-query';
import { certificatesApi } from '@/api/certificates.api';

export function useMyCertificates() {
  return useQuery({
    queryKey: ['certificates', 'me'],
    queryFn: () => certificatesApi.getMine().then((res) => res.data),
  });
}
