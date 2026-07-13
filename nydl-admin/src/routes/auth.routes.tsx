import { RouteObject } from 'react-router-dom';
import LoginPage from '@/features/auth/pages/LoginPage';
import OAuthCallbackPage from '@/features/auth/pages/OAuthCallbackPage';

export const authRoutes: RouteObject[] = [
  {
    path: 'login',
    element: <LoginPage />,
  },
  {
    path: 'oauth-callback',
    element: <OAuthCallbackPage />,
  },
];

export default authRoutes;
