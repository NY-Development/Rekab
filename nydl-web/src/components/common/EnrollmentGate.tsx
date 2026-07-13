import { useLocation, useNavigate } from 'react-router-dom';
import { LogOut, BookOpen, CreditCard } from 'lucide-react';
import { useEnrollments } from '@/hooks/useEnrollments';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/button';

/**
 * Blocking overlay shown inside the student dashboard shell for accounts that
 * have not registered (and paid) for any course yet. The enrollment flow
 * itself (/enroll/:courseId) stays reachable so they can actually register.
 */
export function EnrollmentGate() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const { data: enrollmentsRes, isLoading, isError } = useEnrollments();
  const enrollments = enrollmentsRes?.data || [];

  const isEnrollFlow = pathname.startsWith('/enroll');
  if (isEnrollFlow || isLoading || isError || enrollments.length > 0) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm px-4">
      <div className="w-full max-w-lg rounded-xl border border-border bg-card p-8 shadow-xl text-center space-y-6">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CreditCard className="h-7 w-7" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">
            Welcome{user?.name ? `, ${user.name.split(' ')[0]}` : ''}! One more step
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your account is ready, but you haven't registered for a course yet. To access the
            dashboard, assignments, live sessions, and resources, choose a course and complete
            the registration and course fee payment. Once an admin verifies your payment and
            approves your registration, everything unlocks automatically.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <Button onClick={() => navigate('/courses')} className="w-full justify-center">
            <BookOpen className="mr-2 h-4 w-4" /> Browse Courses & Register
          </Button>
          <Button variant="outline" onClick={handleLogout} className="w-full justify-center">
            <LogOut className="mr-2 h-4 w-4" /> Log out — I'll pay and come back
          </Button>
        </div>
      </div>
    </div>
  );
}

export default EnrollmentGate;
