import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { submissionsApi } from '@/api/submissions.api';

export function useSubmissions(params?: Parameters<typeof submissionsApi.getAll>[0]) {
  return useQuery({
    queryKey: ['submissions', params],
    queryFn: async () => {
      const res = await submissionsApi.getAll(params);
      return res.data.data;
    },
  });
}

export function useSubmissionMutations() {
  const queryClient = useQueryClient();

  const gradeMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { points: number; feedback: string } }) =>
      submissionsApi.grade(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
    },
  });

  return {
    gradeSubmission: gradeMutation.mutateAsync,
    isGrading: gradeMutation.isPending,
  };
}
