import { useQuery } from '@tanstack/react-query';
import { auditLogsApi } from '@/api/audit-logs.api';

export function useAuditLogs(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['audit-logs', params],
    queryFn: async () => {
      const res = await auditLogsApi.getAll(params);
      return res.data.data;
    },
  });
}
