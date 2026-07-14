import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff } from 'lucide-react';

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482C9.521 20.76 9.5 19.12 9.5 17.34c-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

export function LoginPage() {
  const { login, isLoggingIn, loginError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    try {
      await login({ email, password });
    } catch (err) {
      console.error(err);
    }
  };

  const handleGithubLogin = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
    const origin = window.location.origin;
    window.location.href = `${apiUrl}/auth/github?from=${encodeURIComponent(origin)}`;
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {loginError && (
          <Alert variant="destructive" className="bg-rose-500/10 text-rose-400 border-rose-500/20">
            <AlertDescription>
              {loginError instanceof Error ? loginError.message : 'Invalid credentials. Please try again.'}
            </AlertDescription>
          </Alert>
        )}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-350 text-white">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="admin@nydev.org"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-slate-950 border-slate-800 text-white focus:ring-blue-500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-slate-350 text-white">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-slate-950 border-slate-800 text-white focus:ring-blue-500 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <Button type="submit" className="w-full bg-blue-650 hover:bg-blue-700 bg-blue-600 text-white font-semibold py-2" disabled={isLoggingIn}>
          {isLoggingIn ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-800" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-slate-950 px-2 text-slate-400">Or continue with</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full bg-slate-900 border-slate-850 hover:bg-slate-800 text-white border-slate-700 font-semibold py-2 flex items-center justify-center"
        onClick={handleGithubLogin}
      >
        <GithubIcon className="mr-2 h-4 w-4" />
        Sign in with GitHub
      </Button>
    </div>
  );
}

export default LoginPage;
