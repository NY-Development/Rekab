import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assignmentsApi } from '@/api/assignments.api';
import type { Assignment } from '@/types';

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

export function useCreateAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Assignment>) => assignmentsApi.create(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
    },
  });
}

export function useUpdateAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Assignment> }) =>
      assignmentsApi.update(id, data).then((res) => res.data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      queryClient.invalidateQueries({ queryKey: ['assignment', variables.id] });
    },
  });
}

export function useDeleteAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => assignmentsApi.delete(id).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
    },
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

export function useSubmissions() {
  return useQuery({
    queryKey: ['submissions'],
    queryFn: () => assignmentsApi.getMySubmissions().then((res) => res.data),
  });
}

// Staff-only: monitor submissions for a specific assignment.
export function useAssignmentSubmissions(assignmentId: string) {
  return useQuery({
    queryKey: ['submissions', 'assignment', assignmentId],
    queryFn: () => assignmentsApi.listSubmissions({ assignmentId }).then((res) => res.data),
    enabled: !!assignmentId,
  });
}

export function useGradeSubmission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { points: number; feedback: string } }) =>
      assignmentsApi.gradeSubmission(id, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
    },
  });
}
