import { Suspense } from "react";

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import { publicRoutes } from "./public.routes";
import { studentRoutes } from "./student.routes";
import { authRoutes } from "./auth.routes";

const router = createBrowserRouter([
  ...publicRoutes,
  ...authRoutes,
  ...studentRoutes,
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