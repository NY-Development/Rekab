import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '@/api/profile.api';
import { useAuthStore } from '@/store/auth.store';

export function useStudentProfile() {
  return useQuery({
    queryKey: ['student-profile'],
    queryFn: () => profileApi.getStudentProfile().then((res) => res.data),
  });
}

export function useUserProfile() {
  return useQuery({
    queryKey: ['user-profile'],
    queryFn: () => profileApi.getProfile().then((res) => res.data),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  return useMutation({
    mutationFn: (data: Parameters<typeof profileApi.updateProfile>[0]) =>
      profileApi.updateProfile(data).then((res) => res.data),
    onSuccess: (data) => {
      setUser(data.data.user);
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
  });
}
