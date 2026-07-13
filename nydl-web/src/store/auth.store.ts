import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setAuth: (token: string, user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
  hydrateFromCookie: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      setAuth: (token: string, user: User) => {
        Cookies.set('nydl_token', token, { expires: 7, sameSite: 'lax' });
        set({ token, user, isAuthenticated: true, isLoading: false });
      },

      logout: () => {
        Cookies.remove('nydl_token');
        set({ token: null, user: null, isAuthenticated: false, isLoading: false });
      },

      setUser: (user: User) => {
        set({ user });
      },

      hydrateFromCookie: () => {
        const token = Cookies.get('nydl_token');
        if (token) {
          try {
            const decoded = jwtDecode<{ userId: string; exp: number }>(token);
            if (decoded.exp * 1000 > Date.now()) {
              set({ token, isAuthenticated: true, isLoading: false });
              return;
            }
          } catch {
            // invalid token
          }
        }
        Cookies.remove('nydl_token');
        set({ token: null, user: null, isAuthenticated: false, isLoading: false });
      },
    }),
    {
      name: 'nydl-auth',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
);
