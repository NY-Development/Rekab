import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import api from '@/api/axios';
import { Loader2 } from 'lucide-react';

export function OAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');
      if (!token) {
        navigate('/login?error=no_token');
        return;
      }

      try {
        const response = await api.get('/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        const user = response.data.data.user;
        
        setAuth(token, user);
        
        navigate('/dashboard');
      } catch (err) {
        console.error('OAuth Callback Error:', err);
        navigate('/login?error=oauth_failed');
      }
    };

    handleCallback();
  }, [searchParams, navigate, setAuth]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-muted-foreground text-sm">Completing GitHub sign-in, please wait...</p>
    </div>
  );
}

export default OAuthCallbackPage;
