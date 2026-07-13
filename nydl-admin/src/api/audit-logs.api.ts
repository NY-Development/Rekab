import api from '@/lib/axios';
import { API_ROUTES } from '@/lib/constants';
import type { PaginatedResponse, AuditLog } from '@/types';

export const auditLogsApi = {
  getAll: (params?: Record<string, any>) =>
    api.get<PaginatedResponse<AuditLog>>(API_ROUTES.AUDIT_LOGS, { params }),
};
