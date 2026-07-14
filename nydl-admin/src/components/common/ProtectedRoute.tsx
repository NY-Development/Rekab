import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';

const WEB_APP_URL: string =
  (import.meta.env.VITE_WEB_URL as string | undefined) || 'https://nydev-learning-v1.vercel.app';

const ADMIN_TIERS = ['ADMIN', 'SUPER_ADMIN'];

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

/**
 * nydl-admin is exclusively for platform administrators.
 * - Non-admin users (students/instructors/mentors) are signed out of this app
 *   and sent to the learning platform where they belong.
 * - Admin-tier users lacking a narrower requirement (e.g. SUPER_ADMIN-only
 *   settings) are redirected to the admin dashboard instead.
 */
export function ProtectedRoute({ allowedRoles = ADMIN_TIERS }: ProtectedRouteProps) {
  const { isAuthenticated, user, logout } = useAuthStore();

  const role = (user?.role || '').toUpperCase();
  const isAdminTier = ADMIN_TIERS.includes(role);
  const normalizedAllowed = allowedRoles.map((r) => r.toUpperCase());
  const isAllowed = normalizedAllowed.includes(role);
  const shouldEject = isAuthenticated && !!user && !isAdminTier;

  useEffect(() => {
    if (shouldEject) {
      logout();
      window.location.href = WEB_APP_URL;
    }
  }, [shouldEject, logout]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (shouldEject) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-slate-400">
        Redirecting to the learning platform...
      </div>
    );
  }

  if (!isAllowed) {
    // Admin-tier user without the required tier (e.g. ADMIN on a SUPER_ADMIN page).
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />; // Renders the nested routes (AdminLayout)
}

export default ProtectedRoute;
