import axios from 'axios';
import Cookies from 'js-cookie';
import { useAuthStore } from '@/store/auth.store';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://rekab-api-v1.vercel.app/api/v1';
const TOKEN_KEY = 'nydl_token';

function clearSession() {
  Cookies.remove(TOKEN_KEY);
  useAuthStore.getState().logout();
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
  withCredentials: true,
});

// Request interceptor — attach JWT
api.interceptors.request.use((config) => {
  const token = Cookies.get(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle 401 with Token Rotation
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      const isTokenExpired = error.response.data?.code === 'TOKEN_EXPIRED';
      
      if (isTokenExpired) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return api(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const response = await axios.post(
            `${API_BASE_URL}/auth/refresh-token`,
            {},
            { withCredentials: true }
          );

          const { token } = response.data.data;
          
          Cookies.set(TOKEN_KEY, token, { expires: 1 / 96, secure: true, sameSite: 'lax' });

          api.defaults.headers.common.Authorization = `Bearer ${token}`;
          originalRequest.headers.Authorization = `Bearer ${token}`;

          processQueue(null, token);
          isRefreshing = false;

          return api(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          isRefreshing = false;

          clearSession();
          if (!window.location.pathname.startsWith('/login')) {
            window.location.href = '/login';
          }
          return Promise.reject(refreshError);
        }
      } else {
        clearSession();
        if (!window.location.pathname.startsWith('/login')) {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
