import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import AuthLayout from "@/components/layouts/AuthLayout";

const LoginPage = lazy(
  () => import("@/features/auth/pages/LoginPage")
);
const RegisterPage = lazy(
  () => import("@/features/auth/pages/RegisterPage")
);
const OAuthCallbackPage = lazy(
  () => import("@/features/auth/pages/OAuthCallbackPage")
);

export const authRoutes: RouteObject[] = [
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/oauth-callback", element: <OAuthCallbackPage /> },
    ],
  },
];