import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { authApi } from '@/api/auth.api';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/button';
import type { UserRole } from '@/types';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFields = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [activeRole, setActiveRole] = useState<UserRole>('STUDENT');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
  });

const onSubmit = async (data: LoginFields) => {
  setIsSubmitting(true);
  try {
    const res = await authApi.login({ ...data });
    const { token, user } = res.data.data;

    // Normalize roles to uppercase to prevent case-sensitive mismatches (e.g., "student" vs "STUDENT")
    const backendRole = user.role.toUpperCase();
    const selectedRole = activeRole.toUpperCase();

    // Check if user has the selected role or is an admin logging in
    if (backendRole !== selectedRole && !(backendRole === 'ADMIN' && selectedRole === 'ADMIN')) {
      toast.error(`You do not have the ${activeRole.toLowerCase()} role assigned to this account.`);
      setIsSubmitting(false);
      return;
    }

    // 1. Commit auth state first
    setAuth(token, user);
    
    // 2. Trigger success toast
    toast.success('Successfully signed in!');

    // 3. Handle routing based on normalized role strings
    if (backendRole === 'ADMIN' || backendRole === 'SUPER_ADMIN') {
      // Redirect to separate admin application instance
      window.location.href = `${import.meta.env.REDIRECT_URI}` || 'http://localhost:5174/dashboard';
    } else {
      // React Router DOM path navigation
      navigate('/dashboard');
    }
  } catch (err: any) {
    toast.error(err.response?.data?.message || 'Invalid email or password');
  } finally {
    setIsSubmitting(false);
  }
};


  const handleGithubLogin = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
    const origin = window.location.origin;
    window.location.href = `${apiUrl}/auth/github?from=${encodeURIComponent(origin)}`;
  };

  return (
    <div className="mx-auto w-full max-w-sm lg:w-96">
      {/* Mobile Logo (hidden on desktop) */}
      <Link to='/' className="flex items-center mb-8 lg:hidden">
        <img src="/banner-logo.png" alt="NYDL" className="h-9 w-auto" />
      </Link>

      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Sign in</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Welcome back to your cohort.
        </p>
      </div>

      <div className="mt-8">
        {/* Role Tabs */}
        <div className="flex rounded-lg bg-muted p-1 mb-6" role="tablist">
          {(['STUDENT', 'INSTRUCTOR', 'ADMIN'] as const).map((role) => (
            <button
              key={role}
              aria-selected={activeRole === role}
              className={`flex-1 rounded-md py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-150 ${
                activeRole === role
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setActiveRole(role as UserRole)}
              type="button"
            >
              {role.toLowerCase()}
            </button>
          ))}
        </div>

        <div className="mt-4">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-foreground" htmlFor="email">
                Email Address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register('email')}
                  className="block w-full rounded-md border-0 py-2 px-3 text-foreground shadow-sm ring-1 ring-inset ring-border placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-inset focus:ring-primary text-sm sm:leading-6 bg-muted/20"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-foreground" htmlFor="password">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  {...register('password')}
                  className="block w-full rounded-md border-0 py-2 px-3 text-foreground shadow-sm ring-1 ring-inset ring-border placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-inset focus:ring-primary text-sm sm:leading-6 bg-muted/20"
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div>
              <Button type="submit" className="w-full justify-center" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </div>
          </form>
        </div>

        <div className="mt-8">
          <div className="relative">
            <div aria-hidden="true" className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs font-medium leading-6">
              <span className="bg-background px-4 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={handleGithubLogin}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-muted/10 px-3 py-2 text-xs font-semibold text-foreground shadow-sm ring-1 ring-inset ring-border hover:bg-muted/30 transition-colors"
            >
              <svg aria-hidden="true" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              GitHub
            </button>
          </div>
        </div>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            Create an account
          </Link>
        </p>

        <div className="mt-8 flex justify-center gap-4 text-center text-xs text-muted-foreground">
          <a className="hover:text-foreground transition-colors" href="#">Terms of Service</a>
          <span>•</span>
          <a className="hover:text-foreground transition-colors" href="#">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
}
