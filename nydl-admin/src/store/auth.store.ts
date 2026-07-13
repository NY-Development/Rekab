import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import type { User } from '@/types';

const TOKEN_KEY = 'nydl_admin_token';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        Cookies.set(TOKEN_KEY, token, { expires: 1 / 96, secure: true, sameSite: 'lax' });
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        Cookies.remove(TOKEN_KEY);
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    { name: 'nydl-admin-auth' }
  )
);
