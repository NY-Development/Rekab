import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attendanceApi } from '@/api/attendance.api';

export function useAttendance(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['attendance', params],
    queryFn: async () => {
      const res = await attendanceApi.getAll(params);
      return res.data.data;
    },
  });
}

export function useSessionAttendance(sessionId: string) {
  return useQuery({
    queryKey: ['attendance-session', sessionId],
    queryFn: async () => {
      const res = await attendanceApi.getBySession(sessionId);
      return res.data.data;
    },
    enabled: !!sessionId,
  });
}

export function useAttendanceMutations() {
  const queryClient = useQueryClient();

  const markMutation = useMutation({
    mutationFn: attendanceApi.mark,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      queryClient.invalidateQueries({ queryKey: ['attendance-session', variables.sessionId] });
    },
  });

  const bulkMarkMutation = useMutation({
    mutationFn: attendanceApi.bulkMark,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      queryClient.invalidateQueries({ queryKey: ['attendance-session', variables.sessionId] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => attendanceApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
  });

  return {
    markAttendance: markMutation.mutateAsync,
    isMarking: markMutation.isPending,
    bulkMarkAttendance: bulkMarkMutation.mutateAsync,
    isBulkMarking: bulkMarkMutation.isPending,
    updateAttendance: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
}
