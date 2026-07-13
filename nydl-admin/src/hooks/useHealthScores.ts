import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { healthScoresApi } from '@/api/health-scores.api';

export function useHealthScores(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['health-scores', params],
    queryFn: async () => {
      const res = await healthScoresApi.getAll(params);
      return res.data.data;
    },
  });
}

export function useStudentHealthScore(studentId: string) {
  return useQuery({
    queryKey: ['student-health-score', studentId],
    queryFn: async () => {
      const res = await healthScoresApi.getByStudent(studentId);
      return res.data.data;
    },
    enabled: !!studentId,
  });
}

export function useHealthScoreMutations() {
  const queryClient = useQueryClient();

  const recalculateMutation = useMutation({
    mutationFn: healthScoresApi.recalculate,
    onSuccess: (_, studentId) => {
      queryClient.invalidateQueries({ queryKey: ['health-scores'] });
      queryClient.invalidateQueries({ queryKey: ['student-health-score', studentId] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  return {
    recalculateHealthScore: recalculateMutation.mutateAsync,
    isRecalculating: recalculateMutation.isPending,
  };
}
