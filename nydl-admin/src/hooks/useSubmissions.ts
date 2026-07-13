import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { submissionsApi } from '@/api/submissions.api';

export function useSubmissions(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['submissions', params],
    queryFn: async () => {
      const res = await submissionsApi.getAll(params);
      return res.data.data;
    },
  });
}

export function useSubmission(id: string) {
  return useQuery({
    queryKey: ['submission', id],
    queryFn: async () => {
      const res = await submissionsApi.getById(id);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useSubmissionMutations() {
  const queryClient = useQueryClient();

  const gradeMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { score: number; feedback: string } }) =>
      submissionsApi.grade(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
      queryClient.invalidateQueries({ queryKey: ['submission', variables.id] });
    },
  });

  return {
    gradeSubmission: gradeMutation.mutateAsync,
    isGrading: gradeMutation.isPending,
  };
}
