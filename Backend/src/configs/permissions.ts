/**
 * Central RBAC permission matrix — the single source of truth for what each
 * role may do with each resource. Route middleware and services consult this
 * instead of hardcoding role lists, so policy changes happen in one place.
 *
 * Scope semantics:
 *  - 'all'      → may act on any record
 *  - 'assigned' → may act only on records within the user's ownership scope
 *                 (instructor: assignedCourses/assignedCohorts,
 *                  mentor: assignedTeams/assignedStudents)
 *  - 'own'      → may act only on records belonging to the user themself
 *  - 'none'     → forbidden
 */

export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'INSTRUCTOR' | 'MENTOR' | 'STUDENT';
export type Action = 'create' | 'read' | 'update' | 'delete';
export type Scope = 'all' | 'assigned' | 'own' | 'none';

export type Resource =
  | 'users'
  | 'roles'
  | 'courses'
  | 'cohorts'
  | 'teams'
  | 'sessions'
  | 'assignments'
  | 'resources'
  | 'announcements'
  | 'attendance'
  | 'grades'
  | 'certificates'
  | 'analytics'
  | 'payments'
  | 'settings';

type ResourcePolicy = Partial<Record<Role, Partial<Record<Action, Scope>>>>;

const FULL: Partial<Record<Action, Scope>> = { create: 'all', read: 'all', update: 'all', delete: 'all' };
const READ_ALL: Partial<Record<Action, Scope>> = { read: 'all' };
const READ_OWN: Partial<Record<Action, Scope>> = { read: 'own' };

export const PERMISSIONS: Record<Resource, ResourcePolicy> = {
  users: {
    SUPER_ADMIN: FULL,
    ADMIN: FULL,
  },
  roles: {
    SUPER_ADMIN: FULL,
  },
  courses: {
    SUPER_ADMIN: FULL,
    ADMIN: FULL,
    INSTRUCTOR: { read: 'all', update: 'assigned' },
    MENTOR: READ_ALL,
    STUDENT: READ_ALL,
  },
  cohorts: {
    SUPER_ADMIN: FULL,
    ADMIN: FULL,
    INSTRUCTOR: { read: 'assigned', update: 'assigned' },
    MENTOR: { read: 'assigned' },
    STUDENT: READ_OWN,
  },
  teams: {
    SUPER_ADMIN: FULL,
    ADMIN: FULL,
    INSTRUCTOR: { create: 'assigned', read: 'assigned', update: 'assigned' },
    MENTOR: { read: 'assigned', update: 'assigned' },
    STUDENT: READ_OWN,
  },
  sessions: {
    SUPER_ADMIN: FULL,
    ADMIN: FULL,
    INSTRUCTOR: { create: 'assigned', read: 'assigned', update: 'assigned', delete: 'assigned' },
    MENTOR: { read: 'assigned' },
    STUDENT: READ_OWN,
  },
  assignments: {
    SUPER_ADMIN: FULL,
    ADMIN: FULL,
    INSTRUCTOR: { create: 'assigned', read: 'assigned', update: 'assigned', delete: 'assigned' },
    MENTOR: { read: 'assigned' },
    STUDENT: READ_OWN,
  },
  resources: {
    SUPER_ADMIN: FULL,
    ADMIN: FULL,
    INSTRUCTOR: { create: 'assigned', read: 'assigned', update: 'assigned', delete: 'assigned' },
    MENTOR: { read: 'assigned' },
    STUDENT: READ_OWN,
  },
  announcements: {
    SUPER_ADMIN: FULL,
    ADMIN: FULL,
    INSTRUCTOR: { create: 'assigned', read: 'all', update: 'assigned', delete: 'assigned' },
    MENTOR: READ_ALL,
    STUDENT: READ_ALL,
  },
  attendance: {
    SUPER_ADMIN: FULL,
    ADMIN: FULL,
    INSTRUCTOR: { create: 'assigned', read: 'assigned', update: 'assigned' },
    MENTOR: { read: 'assigned' },
    STUDENT: READ_OWN,
  },
  grades: {
    SUPER_ADMIN: FULL,
    ADMIN: FULL,
    INSTRUCTOR: { create: 'assigned', read: 'assigned', update: 'assigned' },
    MENTOR: { read: 'assigned' },
    STUDENT: READ_OWN,
  },
  certificates: {
    SUPER_ADMIN: FULL,
    ADMIN: FULL,
    INSTRUCTOR: { create: 'assigned', read: 'assigned' },
    MENTOR: { read: 'assigned' },
    STUDENT: READ_OWN,
  },
  analytics: {
    SUPER_ADMIN: READ_ALL,
    ADMIN: READ_ALL,
    INSTRUCTOR: { read: 'assigned' },
    MENTOR: { read: 'assigned' },
    STUDENT: READ_OWN,
  },
  payments: {
    SUPER_ADMIN: FULL,
    ADMIN: FULL,
    STUDENT: READ_OWN,
  },
  settings: {
    SUPER_ADMIN: FULL,
    ADMIN: { read: 'all', update: 'all' },
  },
};

export function normalizeRole(role: string): Role {
  return role.toUpperCase() as Role;
}

/** Returns the scope a role has for an action, or 'none' when forbidden. */
export function can(role: string, resource: Resource, action: Action): Scope {
  return PERMISSIONS[resource]?.[normalizeRole(role)]?.[action] ?? 'none';
}

export function isAdminRole(role: string): boolean {
  const normalized = normalizeRole(role);
  return normalized === 'ADMIN' || normalized === 'SUPER_ADMIN';
}
