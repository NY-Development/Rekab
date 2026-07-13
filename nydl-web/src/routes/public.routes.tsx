import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import PublicLayout from "@/components/layouts/PublicLayout";

const LandingPage = lazy(
  () => import("@/features/landing/pages/LandingPage")
);
const CourseCatalogPage = lazy(
  () => import("@/features/courses/pages/CourseCatalogPage")
);
const CourseDetailPage = lazy(
  () => import("@/features/courses/pages/CourseDetailPage")
);
const AboutPage = lazy(
  () => import("@/features/about/pages/AboutPage")
);
const ContactPage = lazy(
  () => import("@/features/contact/pages/ContactPage")
);
const HelpPage = lazy(
  () => import("@/features/help/pages/HelpPage")
);

export const publicRoutes: RouteObject[] = [
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/courses", element: <CourseCatalogPage /> },
      { path: "/courses/:id", element: <CourseDetailPage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/contact", element: <ContactPage /> },
      { path: "/help", element: <HelpPage /> },
    ],
  },
];