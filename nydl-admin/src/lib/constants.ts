// ─── API Routes ───
export const API_ROUTES = {
  AUTH: '/auth',
  USERS: '/admin/users',
  STUDENTS: '/students',
  INSTRUCTORS: '/instructors',
  MENTORS: '/mentors',
  COURSES: '/courses',
  CURRICULUM: '/curriculum',
  COHORTS: '/cohorts',
  TEAMS: '/teams',
  ENROLLMENTS: '/enrollments',
  PAYMENTS: '/payments',
  SESSIONS: '/sessions',
  ATTENDANCE: '/attendance',
  ASSIGNMENTS: '/assignments',
  SUBMISSIONS: '/submissions',
  RESOURCES: '/resources',
  ANNOUNCEMENTS: '/announcements',
  NOTIFICATIONS: '/notifications',
  HEALTH_SCORES: '/health-scores',
  ANALYTICS: '/analytics',
  AUDIT_LOGS: '/audit-logs',
  CERTIFICATES: '/certificates',
  SETTINGS: '/settings',
  CONTACTS: '/contacts',
} as const;

// ─── Status Options ───
export const ENROLLMENT_STATUSES = ['PENDING', 'ACTIVE', 'COMPLETED', 'DROPPED', 'SUSPENDED'] as const;
export const PAYMENT_STATUSES = ['PENDING', 'VERIFIED', 'REJECTED', 'REFUNDED'] as const;
export const COURSE_STATUSES = ['DRAFT', 'PUBLISHED', 'ARCHIVED'] as const;
export const COHORT_STATUSES = ['UPCOMING', 'ACTIVE', 'COMPLETED', 'CANCELLED'] as const;
export const SESSION_STATUSES = ['SCHEDULED', 'LIVE', 'COMPLETED', 'CANCELLED'] as const;
export const ATTENDANCE_STATUSES = ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'] as const;
export const ASSIGNMENT_STATUSES = ['DRAFT', 'PUBLISHED', 'CLOSED'] as const;
export const SUBMISSION_STATUSES = ['SUBMITTED', 'GRADED', 'RETURNED', 'LATE'] as const;
export const RISK_LEVELS = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;
export const USER_ROLES = ['STUDENT', 'INSTRUCTOR', 'MENTOR', 'ADMIN', 'SUPER_ADMIN'] as const;

// ─── Navigation Items ───
// `roles` controls which admin tier sees the module; omitted = both.
// System settings are reserved for SUPER_ADMIN per the permission matrix.
export interface AdminNavItem {
  label: string;
  path: string;
  icon: string;
  roles?: readonly ('ADMIN' | 'SUPER_ADMIN')[];
}

export const NAV_ITEMS: readonly AdminNavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Users', path: '/users', icon: 'Users' },
  { label: 'Students', path: '/students', icon: 'GraduationCap' },
  { label: 'Instructors', path: '/instructors', icon: 'BookUser' },
  { label: 'Mentors', path: '/mentors', icon: 'Heart' },
  { label: 'Courses', path: '/courses', icon: 'BookOpen' },
  { label: 'Cohorts', path: '/cohorts', icon: 'CalendarDays' },
  { label: 'Teams', path: '/teams', icon: 'Users2' },
  { label: 'Registrations', path: '/enrollments', icon: 'ClipboardCheck' },
  { label: 'Payments', path: '/payments', icon: 'CreditCard' },
  { label: 'Sessions', path: '/sessions', icon: 'Video' },
  { label: 'Attendance', path: '/attendance', icon: 'CheckSquare' },
  { label: 'Assignments', path: '/assignments', icon: 'FileText' },
  { label: 'Submissions', path: '/submissions', icon: 'Upload' },
  { label: 'Resources', path: '/resources', icon: 'FolderOpen' },
  { label: 'Announcements', path: '/announcements', icon: 'Megaphone' },
  { label: 'Analytics', path: '/analytics', icon: 'BarChart3' },
  { label: 'Certificates', path: '/certificates', icon: 'Award' },
  { label: 'Support Inbox', path: '/support', icon: 'LifeBuoy' },
  { label: 'Notifications', path: '/notifications', icon: 'Bell' },
  { label: 'Audit Logs', path: '/audit-logs', icon: 'ScrollText' },
  { label: 'Risk Students', path: '/risk-students', icon: 'ShieldAlert' },
  { label: 'Settings', path: '/settings', icon: 'Settings', roles: ['SUPER_ADMIN'] },
] as const;
