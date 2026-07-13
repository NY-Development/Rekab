import { RouteObject } from 'react-router-dom';
import DashboardPage from '@/features/dashboard/pages/DashboardPage';
import UsersPage from '@/features/users/pages/UsersPage';
import StudentsPage from '@/features/students/pages/StudentsPage';
import InstructorsPage from '@/features/instructors/pages/InstructorsPage';
import MentorsPage from '@/features/mentors/pages/MentorsPage';
import CoursesPage from '@/features/courses/pages/CoursesPage';
import CohortsPage from '@/features/cohorts/pages/CohortsPage';
import TeamsPage from '@/features/teams/pages/TeamsPage';
import EnrollmentsPage from '@/features/enrollments/pages/EnrollmentsPage';
import PaymentsPage from '@/features/payments/pages/PaymentsPage';
import SessionsPage from '@/features/sessions/pages/SessionsPage';
import AttendancePage from '@/features/attendance/pages/AttendancePage';
import AssignmentsPage from '@/features/assignments/pages/AssignmentsPage';
import SubmissionsPage from '@/features/submissions/pages/SubmissionsPage';
import ResourcesPage from '@/features/resources/pages/ResourcesPage';
import AnnouncementsPage from '@/features/announcements/pages/AnnouncementsPage';
import AnalyticsPage from '@/features/analytics/pages/AnalyticsPage';
import CertificatesPage from '@/features/certificates/pages/CertificatesPage';
import NotificationsPage from '@/features/notifications/pages/NotificationsPage';
import AuditLogsPage from '@/features/audit-logs/pages/AuditLogsPage';
import RiskStudentsPage from '@/features/risk-students/pages/RiskStudentsPage';
import SettingsPage from '@/features/settings/pages/SettingsPage';

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
