import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LogOut, BookOpen, CreditCard, AlertCircle } from 'lucide-react';
import { useEnrollments } from '@/hooks/useEnrollments';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/button';
import { PartialPaymentModal } from '@/components/common/PartialPaymentModal';

/**
 * Blocking overlay shown inside the student dashboard shell.
 *
 * Gate logic:
 * 1. No enrollments at all → "Register & Pay" gate
 * 2. Has enrollment(s) but none are ACTIVE/COMPLETED (e.g. PENDING with
 *    remainingDue > 0, or PARTIAL_PAYMENT) → "Payment Pending" gate
 *    with inline partial-payment modal
 * 3. At least one ACTIVE or COMPLETED enrollment → let through (return null)
 *
 * The /enroll/* and /courses* routes are always reachable so students can
 * actually register and browse the catalog.
 */
export function EnrollmentGate() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const autoOpenedRef = useRef(false);

  const isStudent = (user?.role || '').toUpperCase() === 'STUDENT';

  const { data: enrollmentsRes, isLoading, isError } = useEnrollments();
  const enrollments = enrollmentsRes?.data || [];

  // Auto-open payment modal when partial payment is detected on mount/auth load
  useEffect(() => {
    if (isLoading || isError || !isStudent) return;
    if (enrollments && enrollments.length > 0 && !autoOpenedRef.current) {
      const hasPartial = enrollments.some(
        (e) => e.remainingDue && e.remainingDue > 0
      );
      if (hasPartial) {
        setShowPaymentModal(true);
        autoOpenedRef.current = true;
      }
    }
  }, [enrollments, isLoading, isError, isStudent]);

  // Always allow non-students, enrollment/course routes, and loading states
  const isExemptRoute = pathname.startsWith('/enroll') || pathname.startsWith('/courses');
  if (!isStudent || isExemptRoute || isLoading || isError) {
    return null;
  }


  // Check if student has at least one fully-granted enrollment
  const hasActiveAccess = enrollments.some(
    (e) => e.status === 'ACTIVE' || e.status === 'COMPLETED' || e.status === 'APPROVED'
  );

  if (hasActiveAccess) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const hasAnyEnrollment = enrollments.length > 0;
  const partialEnrollment = enrollments.find(
    (e) => e.remainingDue && e.remainingDue > 0
  ) || enrollments[0];

  // Gate: student has enrolled but payment is not complete
  if (hasAnyEnrollment) {
    const courseName = (partialEnrollment?.courseId as any)?.title || 'your course';
    const remaining = partialEnrollment?.remainingDue;
    const amountPaid = partialEnrollment?.amountPaid;

    return (
      <>
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-background/80 backdrop-blur-sm px-4">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-8 shadow-xl text-center space-y-6">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950/30 text-amber-600">
              <AlertCircle className="h-7 w-7" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">
                Payment {remaining && remaining > 0 ? 'Incomplete' : 'Pending'}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                You've registered for <span className="font-semibold">{courseName}</span>, but your
                payment hasn't been fully verified yet. Once the full course fee is paid and
                verified, your dashboard, assignments, live sessions, and resources will unlock
                automatically.
              </p>
              {remaining !== undefined && remaining > 0 && (
                <div className="mx-auto max-w-xs rounded-lg border border-border bg-muted/40 p-3 mt-3 text-left space-y-1">
                  {amountPaid !== undefined && amountPaid > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Paid so far:</span>
                      <span className="font-semibold text-emerald-600">{amountPaid} ETB</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Remaining due:</span>
                    <span className="font-bold text-amber-600">{remaining} ETB</span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-3">
              {partialEnrollment && (
                <Button
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full justify-center"
                >
                  <CreditCard className="mr-2 h-4 w-4" /> Pay Remaining Balance
                </Button>
              )}
              <Button variant="outline" onClick={handleLogout} className="w-full justify-center">
                <LogOut className="mr-2 h-4 w-4" /> Log out
              </Button>
            </div>
          </div>
        </div>

        {showPaymentModal && partialEnrollment && (
          <PartialPaymentModal
            enrollment={partialEnrollment}
            onClose={() => setShowPaymentModal(false)}
          />
        )}
      </>
    );
  }

  // Gate: student has no enrollments at all
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-background/80 backdrop-blur-sm px-4">
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
            the registration and course fee payment. Once your payment is verified,
            everything unlocks automatically.
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
