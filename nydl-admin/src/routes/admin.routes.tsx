import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'));
const UsersPage = lazy(() => import('@/features/users/pages/UsersPage'));
const StudentsPage = lazy(() => import('@/features/students/pages/StudentsPage'));
const InstructorsPage = lazy(() => import('@/features/instructors/pages/InstructorsPage'));
const MentorsPage = lazy(() => import('@/features/mentors/pages/MentorsPage'));
const CoursesPage = lazy(() => import('@/features/courses/pages/CoursesPage'));
const CohortsPage = lazy(() => import('@/features/cohorts/pages/CohortsPage'));
const TeamsPage = lazy(() => import('@/features/teams/pages/TeamsPage'));
const EnrollmentsPage = lazy(() => import('@/features/enrollments/pages/EnrollmentsPage'));
const PaymentsPage = lazy(() => import('@/features/payments/pages/PaymentsPage'));
const SessionsPage = lazy(() => import('@/features/sessions/pages/SessionsPage'));
const AttendancePage = lazy(() => import('@/features/attendance/pages/AttendancePage'));
const AssignmentsPage = lazy(() => import('@/features/assignments/pages/AssignmentsPage'));
const SubmissionsPage = lazy(() => import('@/features/submissions/pages/SubmissionsPage'));
const ResourcesPage = lazy(() => import('@/features/resources/pages/ResourcesPage'));
const AnnouncementsPage = lazy(() => import('@/features/announcements/pages/AnnouncementsPage'));
const AnalyticsPage = lazy(() => import('@/features/analytics/pages/AnalyticsPage'));
const CertificatesPage = lazy(() => import('@/features/certificates/pages/CertificatesPage'));
const NotificationsPage = lazy(() => import('@/features/notifications/pages/NotificationsPage'));
const AuditLogsPage = lazy(() => import('@/features/audit-logs/pages/AuditLogsPage'));
const RiskStudentsPage = lazy(() => import('@/features/risk-students/pages/RiskStudentsPage'));
const SettingsPage = lazy(() => import('@/features/settings/pages/SettingsPage'));

export const adminRoutes: RouteObject[] = [
  {
    path: 'dashboard',
    element: <DashboardPage />,
  },
  {
    path: 'users',
    element: <UsersPage />,
  },
  {
    path: 'students',
    element: <StudentsPage />,
  },
  {
    path: 'instructors',
    element: <InstructorsPage />,
  },
  {
    path: 'mentors',
    element: <MentorsPage />,
  },
  {
    path: 'courses',
    element: <CoursesPage />,
  },
  {
    path: 'cohorts',
    element: <CohortsPage />,
  },
  {
    path: 'teams',
    element: <TeamsPage />,
  },
  {
    path: 'enrollments',
    element: <EnrollmentsPage />,
  },
  {
    path: 'payments',
    element: <PaymentsPage />,
  },
  {
    path: 'sessions',
    element: <SessionsPage />,
  },
  {
    path: 'attendance',
    element: <AttendancePage />,
  },
  {
    path: 'assignments',
    element: <AssignmentsPage />,
  },
  {
    path: 'submissions',
    element: <SubmissionsPage />,
  },
  {
    path: 'resources',
    element: <ResourcesPage />,
  },
  {
    path: 'announcements',
    element: <AnnouncementsPage />,
  },
  {
    path: 'analytics',
    element: <AnalyticsPage />,
  },
  {
    path: 'certificates',
    element: <CertificatesPage />,
  },
  {
    path: 'notifications',
    element: <NotificationsPage />,
  },
  {
    path: 'audit-logs',
    element: <AuditLogsPage />,
  },
  {
    path: 'risk-students',
    element: <RiskStudentsPage />,
  },
  {
    path: 'settings',
    element: <SettingsPage />,
  },
];

export default adminRoutes;
