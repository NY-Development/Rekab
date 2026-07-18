import { Suspense } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";

import { publicRoutes } from "./public.routes";
import { studentRoutes } from "./student.routes";
import { authRoutes } from "./auth.routes";
import RouteErrorFallback from "@/components/common/RouteErrorFallback"; // Import your error component
import ScrollToTop from "@/components/common/ScrollToTop";

const router = createBrowserRouter([
  {
    // Pathless layout route acting as a global structural wrapper
    element: (
      <>
        <ScrollToTop />
        <Outlet />
      </>
    ),
    errorElement: <RouteErrorFallback />, // <-- This catches ALL uncaught errors in child routes
    children: [
      ...publicRoutes,
      ...authRoutes,
      ...studentRoutes,
    ],
  },
]);

export default function AppRouter() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <RouterProvider router={router} />
    </Suspense>
  );
}
