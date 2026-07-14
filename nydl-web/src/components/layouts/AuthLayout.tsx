import { Outlet } from 'react-router-dom';
import { AuthHero } from '@/components/auth/AuthHero';

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Left — Animated Branding Hero (tablet: simplified, desktop: full) */}
      <div className="hidden w-1/2 md:block">
        <AuthHero />
      </div>

      {/* Right — Auth Form */}
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
