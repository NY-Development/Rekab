import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Left — Branding Panel */}
      <div className="hidden w-1/2 items-center justify-center bg-primary lg:flex">
        <div className="max-w-md px-12 text-primary-foreground">
          <div className="mb-6 inline-flex rounded-xl bg-white p-3">
            <img src="/logo.png" alt="NYDEV Learning" className="h-16 w-auto" />
          </div>
          <h1 className="mb-4 text-3xl font-bold leading-tight">
            Accelerate your tech career with NYDEV Learning
          </h1>
          <p className="text-primary-foreground/80">
            Join cohort-based bootcamps led by industry professionals. From web development to cloud engineering — learn by building real projects.
          </p>
        </div>
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
