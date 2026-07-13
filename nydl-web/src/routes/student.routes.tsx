import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import ProtectedRoute from "@/components/common/ProtectedRoute";

const DashboardPage = lazy(
  () => import("@/features/dashboard/pages/DashboardPage")
);
const MyCoursesPage = lazy(
  () => import("@/features/courses/pages/MyCoursesPage")
);
const AssignmentsPage = lazy(
  () => import("@/features/assignments/pages/AssignmentsPage")
);
const SubmitAssignmentPage = lazy(
  () => import("@/features/assignments/pages/SubmitAssignmentPage")
);
const SessionsPage = lazy(
  () => import("@/features/sessions/pages/SessionsPage")
);
const ResourcesPage = lazy(
  () => import("@/features/resources/pages/ResourcesPage")
);
const AnnouncementsPage = lazy(
  () => import("@/features/announcements/pages/AnnouncementsPage")
);
const TeamPage = lazy(
  () => import("@/features/teams/pages/TeamPage")
);
const ProgressPage = lazy(
  () => import("@/features/progress/pages/ProgressPage")
);
const ProfilePage = lazy(
  () => import("@/features/profile/pages/ProfilePage")
);
const NotificationsPage = lazy(
  () => import("@/features/notifications/pages/NotificationsPage")
);
const SettingsPage = lazy(
  () => import("@/features/settings/pages/SettingsPage")
);
const EnrollmentPage = lazy(
  () => import("@/features/enrollments/pages/EnrollmentPage")
);

export const studentRoutes: RouteObject[] = [
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "/courses/enrolled", element: <MyCoursesPage /> },
          { path: "/assignments", element: <AssignmentsPage /> },
          { path: "/assignments/:id/submit", element: <SubmitAssignmentPage /> },
          { path: "/sessions", element: <SessionsPage /> },
          { path: "/resources", element: <ResourcesPage /> },
          { path: "/announcements", element: <AnnouncementsPage /> },
          { path: "/teams", element: <TeamPage /> },
          { path: "/progress", element: <ProgressPage /> },
          { path: "/profile", element: <ProfilePage /> },
          { path: "/notifications", element: <NotificationsPage /> },
          { path: "/settings", element: <SettingsPage /> },
          { path: "/enroll/:courseId", element: <EnrollmentPage /> },
        ],
      },
    ],
  },
];