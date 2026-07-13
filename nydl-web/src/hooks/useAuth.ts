import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/api/auth.api';
import { useAuthStore } from '@/store/auth.store';
import { toast } from 'sonner';

export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth);
  return useMutation({
    mutationFn: (data: Parameters<typeof authApi.login>[0]) =>
      authApi.login(data).then((res) => res.data),
    onSuccess: (res) => {
      const { token, user } = res.data;
      setAuth(token, user);
      toast.success('Signed in successfully!');
    },
  });
}

export function useSignup() {
  return useMutation({
    mutationFn: (data: Parameters<typeof authApi.signup>[0]) =>
      authApi.signup(data).then((res) => res.data),
    onSuccess: () => {
      toast.success('Account created successfully! Please log in.');
    },
  });
}
