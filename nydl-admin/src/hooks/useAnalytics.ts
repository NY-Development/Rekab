import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/api/analytics.api';

export function useAnalyticsSummary() {
  return useQuery({
    queryKey: ['analytics-summary'],
    queryFn: async () => {
      const res = await analyticsApi.getSummary();
      return res.data.data;
    },
  });
}

export function useEnrollmentTrends(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['enrollment-trends', params],
    queryFn: async () => {
      const res = await analyticsApi.getEnrollmentTrends(params);
      return res.data.data;
    },
  });
}

export function useRevenueTrends(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['revenue-trends', params],
    queryFn: async () => {
      const res = await analyticsApi.getRevenueTrends(params);
      return res.data.data;
    },
  });
}
