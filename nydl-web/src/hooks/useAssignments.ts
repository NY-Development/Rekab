import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assignmentsApi } from '@/api/assignments.api';

export function useAssignments(params?: Parameters<typeof assignmentsApi.getAll>[0]) {
  return useQuery({
    queryKey: ['assignments', params],
    queryFn: () => assignmentsApi.getAll(params).then((res) => res.data),
  });
}

export function useAssignment(id: string) {
  return useQuery({
    queryKey: ['assignment', id],
    queryFn: () => assignmentsApi.getById(id).then((res) => res.data),
    enabled: !!id,
  });
}

export function useSubmitAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ assignmentId, data }: { assignmentId: string; data: Parameters<typeof assignmentsApi.submit>[1] }) =>
      assignmentsApi.submit(assignmentId, data).then((res) => res.data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      queryClient.invalidateQueries({ queryKey: ['assignment', variables.assignmentId] });
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
    },
  });
}

export function useSubmissions(params?: Parameters<typeof assignmentsApi.getMySubmissions>[0]) {
  return useQuery({
    queryKey: ['submissions', params],
    queryFn: () => assignmentsApi.getMySubmissions(params).then((res) => res.data),
  });
}
