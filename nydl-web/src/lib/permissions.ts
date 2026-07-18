import type { UserRole } from '@/types';

/**
 * Frontend mirror of the backend permission matrix — used only to decide
 * what to RENDER (nav items, buttons, routes). The backend always
 * re-validates; nothing here grants real authority.
 */

export const ADMIN_ROLES: UserRole[] = ['ADMIN', 'SUPER_ADMIN'];
export const LEARNING_ROLES: UserRole[] = ['STUDENT', 'INSTRUCTOR', 'MENTOR'];

export function normalizeRole(role: string | undefined | null): UserRole | null {
  if (!role) return null;
  const upper = role.toUpperCase();
  if (['SUPER_ADMIN', 'ADMIN', 'INSTRUCTOR', 'MENTOR', 'STUDENT'].includes(upper)) {
    return upper as UserRole;
  }
  return null;
}

export function isAdminRole(role: string | undefined | null): boolean {
  const normalized = normalizeRole(role);
  return normalized === 'ADMIN' || normalized === 'SUPER_ADMIN';
}

/** Instructor and mentor are the same role on this platform. */
export function isInstructorRole(role: string | undefined | null): boolean {
  const normalized = normalizeRole(role);
  return normalized === 'INSTRUCTOR' || normalized === 'MENTOR';
}

/** Staff = admins + instructors/mentors; used to gate management UI. */
export function isStaffRole(role: string | undefined | null): boolean {
  return isAdminRole(role) || isInstructorRole(role);
}

export const ADMIN_APP_URL: string =
  (import.meta.env.VITE_ADMIN_URL as string | undefined) || 'https://nydl-admin-v1.vercel.app';

/** Capabilities used to gate UI affordances in nydl-web. */
export type Capability =
  | 'enroll-in-courses'      // start the registration/payment flow
  | 'submit-assignments'
  | 'manage-content'         // create/edit assignments, resources, sessions, announcements
  | 'review-submissions'
  | 'view-own-progress';

const CAPABILITIES: Record<Capability, UserRole[]> = {
  'enroll-in-courses': ['STUDENT'],
  'submit-assignments': ['STUDENT'],
  'manage-content': ['INSTRUCTOR', 'MENTOR'],
  'review-submissions': ['INSTRUCTOR', 'MENTOR'],
  'view-own-progress': ['STUDENT'],
};

export function hasCapability(role: string | undefined | null, capability: Capability): boolean {
  const normalized = normalizeRole(role);
  if (!normalized) return false;
  return CAPABILITIES[capability].includes(normalized);
}
