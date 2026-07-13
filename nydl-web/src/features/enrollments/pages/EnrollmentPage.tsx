import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCourse } from '@/hooks/useCourses';
import { useApplyEnrollment } from '@/hooks/useEnrollments';
import { useSubmitPayment } from '@/hooks/usePayments';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import api from '@/api/axios';
import { toast } from 'sonner';
import { Calendar, Wallet, CheckCircle, ArrowRight } from 'lucide-react';

export default function EnrollmentPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const { data: courseRes, isLoading: isCourseLoading } = useCourse(courseId || '');
  const applyMutation = useApplyEnrollment();
  const submitPaymentMutation = useSubmitPayment();

  const course = courseRes?.data;

  // Enrollment states
  const [cohorts, setCohorts] = useState<any[]>([]);
  const [isCohortsLoading, setIsCohortsLoading] = useState(false);
  const [selectedCohortId, setSelectedCohortId] = useState('');
  
  // Flow steps: 'apply' | 'pay' | 'success'
  const [step, setStep] = useState<'apply' | 'pay' | 'success'>('apply');
  const [createdEnrollment, setCreatedEnrollment] = useState<any>(null);

  // Payment states
  const [txnRef, setTxnRef] = useState('');

  // Fetch cohorts for this course
  useEffect(() => {
    if (courseId) {
      setIsCohortsLoading(true);
      api.get(`/cohorts`, { params: { courseId } })
        .then((res) => {
          const list = res.data?.data?.cohorts || [];
          setCohorts(list);
          if (list.length > 0) {
            setSelectedCohortId(list[0].id);
          }
        })
        .catch(() => {
          toast.error('Failed to load cohorts for this course.');
        })
        .finally(() => {
          setIsCohortsLoading(false);
        });
    }
  }, [courseId]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId || !selectedCohortId) {
      toast.error('Please select a cohort.');
      return;
    }

    try {
      const res = await applyMutation.mutateAsync({
        courseId,
        cohortId: selectedCohortId,
      });
      // The return structure has the enrollment object
      const enrollmentObj = res?.data;
      setCreatedEnrollment(enrollmentObj);

      if (course && course.price > 0) {
        setStep('pay');
      } else {
        setStep('success');
      }
      toast.success('Enrollment application submitted!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit enrollment.');
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createdEnrollment || !txnRef) {
      toast.error('Transaction reference is required.');
      return;
    }

    try {
      await submitPaymentMutation.mutateAsync({
        enrollmentId: createdEnrollment.id,
        amount: course?.price || 0,
        transactionReference: txnRef,
      });
      toast.success('Payment receipt submitted successfully!');
      setStep('success');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit payment details.');
    }
  };

  if (isCourseLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <p className="text-red-500 font-semibold mb-4">Course not found.</p>
        <Button onClick={() => navigate('/courses/enrolled')}>View Catalog</Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 md:px-0 py-10">
      
      {/* ─── STEP 1: CHOOSE COHORT & APPLY ─── */}
      {step === 'apply' && (
        <Card className="border border-slate-200">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="text-xl font-bold text-slate-900">Apply for Course</CardTitle>
            <CardDescription className="text-xs">
              Confirm your cohort details for <span className="font-semibold text-slate-800">{course.title}</span>.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleApply} className="space-y-6">
              
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-md flex justify-between items-center">
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Selected Course</span>
                  <span className="text-sm font-semibold text-slate-800">{course.title}</span>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tuition Price</span>
                  <span className="text-base font-bold text-blue-650">${course.price} {course.currency}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Available Cohort Groups</label>
                {isCohortsLoading ? (
                  <div className="h-10 w-full animate-pulse bg-slate-100 rounded" />
                ) : cohorts.length === 0 ? (
                  <p className="text-xs text-red-500 bg-red-50 p-3 rounded">No cohorts are currently open for applications on this course.</p>
                ) : (
                  <div className="space-y-3">
                    {cohorts.map((cohort) => (
                      <label
                        key={cohort.id}
                        className={`flex justify-between items-center p-3 rounded-lg border cursor-pointer hover:bg-slate-50 transition-colors ${
                          selectedCohortId === cohort.id ? 'border-blue-600 bg-blue-50/10' : 'border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="cohortSelection"
                            value={cohort.id}
                            checked={selectedCohortId === cohort.id}
                            onChange={() => setSelectedCohortId(cohort.id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                          />
                          <div>
                            <span className="text-xs font-bold text-slate-850 block">{cohort.name}</span>
                            <span className="text-[10px] text-slate-450 flex items-center gap-1 mt-0.5">
                              <Calendar className="h-3 w-3" />
                              Starts: {new Date(cohort.startDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold text-slate-400">
                          {cohort.enrolledCount} / {cohort.capacity} enrolled
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t border-slate-100 pt-6 flex justify-end">
                <Button type="submit" disabled={applyMutation.isPending || cohorts.length === 0} className="flex items-center gap-1.5 focus:none border hover:cursor-pointer">
                  <span>Register & Continue</span> <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>
      )}

      {/* ─── STEP 2: PAYMENT VERIFICATION SCREEN ─── */}
      {step === 'pay' && (
        <Card className="border border-slate-200">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Wallet className="h-5 w-5 text-blue-600" /> Confirm Tuition Payment
            </CardTitle>
            <CardDescription className="text-xs">
              Please finalize your payment using one of our verified banking gateways.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handlePayment} className="space-y-6">
              
              <div className="space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-md">
                <h4 className="text-xs font-bold text-slate-850">Billing Details</h4>
                <div className="flex justify-between text-xs text-slate-550">
                  <span>Tuition Fee amount</span>
                  <span className="font-semibold text-slate-800">${course.price}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-550 border-t border-slate-200/60 pt-2">
                  <span>Merchant account</span>
                  <span className="font-mono text-[10px]">CBE 1000293029191 (NYDEV learning operations)</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5" htmlFor="txn_reference">
                  Transaction Reference ID *
                </label>
                <input
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded focus:ring-1 focus:ring-blue-600 text-sm text-slate-900 placeholder-slate-400"
                  id="txn_reference"
                  type="text"
                  placeholder="e.g. FT26071..."
                  value={txnRef}
                  onChange={(e) => setTxnRef(e.target.value)}
                  required
                />
                <p className="text-[10px] text-slate-400 mt-1 select-none">
                  Enter the transaction hash/code received from your banking application to verify this purchase receipt.
                </p>
              </div>

              <div className="border-t border-slate-100 pt-6 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep('success')}
                  className="text-xs"
                >
                  Pay Later
                </Button>
                <Button type="submit" disabled={submitPaymentMutation.isPending}>
                  {submitPaymentMutation.isPending ? 'Verifying Reference...' : 'Submit Receipt'}
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>
      )}

      {/* ─── STEP 3: SUCCESS CONFIRMATION ─── */}
      {step === 'success' && (
        <Card className="border border-slate-200 text-center py-12 px-6">
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <CheckCircle className="h-14 w-14 text-emerald-500" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900 leading-tight">Registration Complete!</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Your enrollment application is securely logged. If this is a paid program, your seat will activate as soon as administrators verify your transaction reference.
              </p>
            </div>

            <div className="pt-4 flex justify-center">
              <Button onClick={() => navigate('/dashboard')} className="flex items-center gap-1.5 hover:cursor-pointer">
                Go to Dashboard <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
}
