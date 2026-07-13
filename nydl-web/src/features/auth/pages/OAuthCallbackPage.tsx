import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import api from '@/api/axios';
import { profileApi } from '@/api/profile.api';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { User } from '@/types';

const completeProfileSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: z.string().min(6, 'Phone number is required'),
});

type CompleteProfileFields = z.infer<typeof completeProfileSchema>;

export function OAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const setUser = useAuthStore((state) => state.setUser);

  const [pendingUser, setPendingUser] = useState<User | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CompleteProfileFields>({
    resolver: zodResolver(completeProfileSchema),
  });

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');
      if (!token) {
        toast.error('GitHub sign-in failed: no token received.');
        navigate('/login?error=no_token');
        return;
      }

      try {
        const response = await api.get('/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const user: User = response.data.data.user;
        setAuth(token, user);

        // GitHub doesn't provide a phone number (and often only a username, not
        // a real full name) — collect what's missing before entering the app.
        if (!user.phone) {
          setPendingUser(user);
          reset({ name: user.name || '', phone: '' });
          return;
        }

        toast.success('Successfully signed in with GitHub!');
        navigate('/dashboard');
      } catch (err) {
        console.error('OAuth Callback Error:', err);
        toast.error('GitHub sign-in failed. Please try again.');
        navigate('/login?error=oauth_failed');
      }
    };

    handleCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const onCompleteProfile = async (values: CompleteProfileFields) => {
    try {
      const res = await profileApi.updateProfile({ name: values.name, phone: values.phone });
      setUser(res.data.data.user);
      toast.success('Profile completed. Welcome to NYDL!');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save your profile. Please try again.');
    }
  };

  if (pendingUser) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Complete your profile</CardTitle>
            <CardDescription>
              You signed in with GitHub as <span className="font-semibold">{pendingUser.email}</span>.
              We just need a couple more details before you continue.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={handleSubmit(onCompleteProfile)}>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-foreground" htmlFor="name">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  {...register('name')}
                  className="mt-2 block w-full rounded-md border-0 py-2 px-3 text-foreground shadow-sm ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-primary text-sm bg-muted/20"
                />
                {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-foreground" htmlFor="phone">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="+251..."
                  {...register('phone')}
                  className="mt-2 block w-full rounded-md border-0 py-2 px-3 text-foreground shadow-sm ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-primary text-sm bg-muted/20"
                />
                {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p>}
              </div>
              <Button type="submit" className="w-full justify-center" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  'Continue to Dashboard'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-muted-foreground text-sm">Completing GitHub sign-in, please wait...</p>
    </div>
  );
}

export default OAuthCallbackPage;
