import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { normalizeRole, hasCapability, type Capability } from '@/lib/permissions';
import type { UserRole } from '@/types';

interface RoleGuardProps {
  /** Roles allowed to see the children. */
  allow: UserRole[];
  children: ReactNode;
  /**
   * 'hide' (default) renders nothing for unauthorized users — for buttons,
   * menu items, widgets. 'redirect' navigates away — for whole routes.
   */
  mode?: 'hide' | 'redirect';
  redirectTo?: string;
}

/**
 * Renders children only when the signed-in user's role is in `allow`.
 * Unauthorized UI is not rendered at all (not merely disabled).
 */
export function RoleGuard({ allow, children, mode = 'hide', redirectTo = '/dashboard' }: RoleGuardProps) {
  const role = normalizeRole(useAuthStore((state) => state.user?.role));
  const allowed = role !== null && allow.includes(role);

  if (allowed) return <>{children}</>;
  if (mode === 'redirect') return <Navigate to={redirectTo} replace />;
  return null;
}

interface PermissionGuardProps {
  capability: Capability;
  children: ReactNode;
}

/** Capability-based variant of RoleGuard for finer-grained UI gating. */
export function PermissionGuard({ capability, children }: PermissionGuardProps) {
  const role = useAuthStore((state) => state.user?.role);
  if (!hasCapability(role, capability)) return null;
  return <>{children}</>;
}

export default RoleGuard;
