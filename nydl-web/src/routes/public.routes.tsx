import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const WaitlistPage = lazy(
  () => import("@/features/waitlist/pages/WaitlistPage")
);

// const LandingPage = lazy(
//   () => import("@/features/landing/pages/LandingPage")
// );

// const LoginPage = lazy(
//   () => import("@/features/auth/pages/LoginPage")
// );

// const RegisterPage = lazy(
//   () => import("@/features/auth/pages/RegisterPage")
// );

export const publicRoutes: RouteObject[] = [
  {
    path: "/",
    // element: <LandingPage />,
    element: <WaitlistPage />,
  },
  {
    path: "/waitlist",
    element: <WaitlistPage />,
  },
  {
    path: "/login",
    // element: <LoginPage />,
    element: <WaitlistPage />,
  },
  {
    path: "/register",
    // element: <RegisterPage />,
    element: <WaitlistPage />,
  },
];