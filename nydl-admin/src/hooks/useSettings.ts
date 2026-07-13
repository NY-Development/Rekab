import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApi } from '@/api/settings.api';

export function useSettings(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['settings', params],
    queryFn: async () => {
      const res = await settingsApi.getAll(params);
      return res.data.data;
    },
  });
}

export function useSettingsMutations() {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: ({ id, value }: { id: string; value: string }) =>
      settingsApi.update(id, { value }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });

  return {
    updateSetting: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
}
