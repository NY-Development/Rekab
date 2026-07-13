import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enrollmentsApi } from '@/api/enrollments.api';

export function useEnrollments(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['enrollments', params],
    queryFn: async () => {
      const res = await enrollmentsApi.getAll(params);
      return res.data.data;
    },
  });
}

export function useEnrollment(id: string) {
  return useQuery({
    queryKey: ['enrollment', id],
    queryFn: async () => {
      const res = await enrollmentsApi.getById(id);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useEnrollmentMutations() {
  const queryClient = useQueryClient();

  const invalidateAll = (id?: string) => {
    queryClient.invalidateQueries({ queryKey: ['enrollments'] });
    if (id) queryClient.invalidateQueries({ queryKey: ['enrollment', id] });
    queryClient.invalidateQueries({ queryKey: ['courses'] });
    queryClient.invalidateQueries({ queryKey: ['analytics-summary'] });
    queryClient.invalidateQueries({ queryKey: ['enrollment-trends'] });
  };

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => enrollmentsApi.update(id, data),
    onSuccess: (_, variables) => invalidateAll(variables.id),
  });

  const approveMutation = useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) => enrollmentsApi.approve(id, notes),
    onSuccess: (_, variables) => invalidateAll(variables.id),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason, notes }: { id: string; reason: string; notes?: string }) => enrollmentsApi.reject(id, reason, notes),
    onSuccess: (_, variables) => invalidateAll(variables.id),
  });

  const grantAccessMutation = useMutation({
    mutationFn: (id: string) => enrollmentsApi.grantAccess(id),
    onSuccess: (_, id) => invalidateAll(id),
  });

  const suspendMutation = useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) => enrollmentsApi.suspend(id, notes),
    onSuccess: (_, variables) => invalidateAll(variables.id),
  });

  const deleteMutation = useMutation({
    mutationFn: enrollmentsApi.delete,
    onSuccess: () => invalidateAll(),
  });

  return {
    updateEnrollment: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    approveRegistration: approveMutation.mutateAsync,
    isApproving: approveMutation.isPending,
    rejectRegistration: rejectMutation.mutateAsync,
    isRejecting: rejectMutation.isPending,
    grantAccess: grantAccessMutation.mutateAsync,
    isGrantingAccess: grantAccessMutation.isPending,
    suspendAccess: suspendMutation.mutateAsync,
    isSuspending: suspendMutation.isPending,
    deleteEnrollment: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
