import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { RefreshCw, Clock, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://rekab-api-v1.vercel.app/api/v1';
const TOKEN_KEY = 'nydl_token';
const WARNING_SECONDS = 120; // surface the notice when ≤ 2 minutes remain

/**
 * Watches the JWT's expiry and, at ≤2 min left, shows a banner with a live
 * countdown and a "Refresh session" button that silently rotates the access
 * token via the refresh cookie — so a student mid-registration or mid-lesson
 * isn't kicked out unexpectedly.
 */
export function SessionExpiryNotice() {
  const { token, user, setAuth, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!token || !isAuthenticated) {
      setSecondsLeft(null);
      return;
    }
    let expMs = 0;
    try {
      expMs = jwtDecode<{ exp: number }>(token).exp * 1000;
    } catch {
      return;
    }
    const tick = () => setSecondsLeft(Math.max(0, Math.round((expMs - Date.now()) / 1000)));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [token, isAuthenticated]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {}, { withCredentials: true });
      const newToken = res.data?.data?.token;
      if (newToken && user) {
        Cookies.set(TOKEN_KEY, newToken, { expires: 1 / 96, secure: true, sameSite: 'lax' });
        setAuth(newToken, user);
        toast.success('Session refreshed successfully', { duration: 3000 });
      }
    } catch {
      toast.error('Could not refresh your session. Please sign in again.');
    } finally {
      setRefreshing(false);
    }
  }, [user, setAuth]);

  if (secondsLeft === null || secondsLeft > WARNING_SECONDS) return null;

  const expired = secondsLeft <= 0;
  const mm = Math.floor(secondsLeft / 60);
  const ss = String(secondsLeft % 60).padStart(2, '0');

  return (
    <div className="fixed inset-x-0 bottom-4 z-[70] flex justify-center px-4">
      <div className="flex w-full max-w-md items-center gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 shadow-lg dark:border-amber-500/40 dark:bg-amber-950/70">
        <Clock className="size-5 shrink-0 text-amber-600 dark:text-amber-400" />
        <div className="min-w-0 flex-1">
          {expired ? (
            <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">Your session has expired.</p>
          ) : (
            <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
              Session ending in <span className="tabular-nums">{mm}:{ss}</span>
            </p>
          )}
          <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80">
            {expired ? 'Sign in again to continue.' : 'Refresh to stay signed in.'}
          </p>
        </div>
        {expired ? (
          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-amber-600 px-3 py-2 text-xs font-semibold text-white hover:bg-amber-700"
          >
            <LogIn className="size-4" /> Sign in
          </button>
        ) : (
          <button
            type="button"
            onClick={refresh}
            disabled={refreshing}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-amber-600 px-3 py-2 text-xs font-semibold text-white hover:bg-amber-700 disabled:opacity-60"
          >
            <RefreshCw className={`size-4 ${refreshing ? 'animate-spin' : ''}`} /> Refresh session
          </button>
        )}
      </div>
    </div>
  );
}

export default SessionExpiryNotice;
