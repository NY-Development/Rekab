import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/api/auth.api';
import { useAuthStore } from '@/store/auth.store';
import { useNavigate } from 'react-router-dom';

export function useAuth() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { setAuth, logout: storeLogout, user, isAuthenticated } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: async (data: Parameters<typeof authApi.login>[0]) => {
      const res = await authApi.login(data);
      return res.data;
    },
    onSuccess: (data) => {
      setAuth(data.data.user, data.data.token);
      queryClient.setQueryData(['admin-profile'], data.data.user);
      navigate('/dashboard');
    },
  });

  const profileQuery = useQuery({
    queryKey: ['admin-profile'],
    queryFn: async () => {
      const res = await authApi.getProfile();
      return res.data.data.user;
    },
    enabled: isAuthenticated,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: Parameters<typeof authApi.updateProfile>[0]) => {
      const res = await authApi.updateProfile(data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-profile'] });
    },
  });

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // proceed with local cleanup even if backend call fails
    }
    storeLogout();
    queryClient.clear();
    navigate('/login');
  };

  return {
    user: profileQuery.data || user,
    isLoading: profileQuery.isLoading,
    isAuthenticated,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdatingProfile: updateProfileMutation.isPending,
    logout,
  };
}
