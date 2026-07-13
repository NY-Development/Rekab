import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export function ProtectedRoute({ allowedRoles = ['ADMIN', 'SUPER_ADMIN'] }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const normalizedAllowed = allowedRoles.map((r) => r.toUpperCase());
  if (user && !normalizedAllowed.includes(user.role.toUpperCase())) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />; // Renders the nested routes (AdminLayout)
}

export default ProtectedRoute;