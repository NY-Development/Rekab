import { useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Loader2, ArrowRight, ArrowLeft, CheckCircle, AlertCircle, Clock,
  QrCode, ClipboardList, ExternalLink, X,
} from 'lucide-react';
import { useCourse } from '@/hooks/useCourses';
import { useEnrollments, useApplyEnrollment } from '@/hooks/useEnrollments';
import { useSubmitPayment } from '@/hooks/usePayments';
import { useAuthStore } from '@/store/auth.store';
import { getRegistrationStatusMeta } from '@/utils/registration';
import type { ApplyRegistrationPayload } from '@/api/enrollments.api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const NYDEV_FORM_URL = 'https://nydev-form-generation.vercel.app/f/nydev-learning-nydl-summer-cohort-registration-2026';
const QR_MAX_BYTES = 3 * 1024 * 1024;

const GRADE_OPTIONS = ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12', 'Freshman', 'Sophomore', 'Junior', 'Senior', 'Other'];

const INTEREST_OPTIONS = [
  'Internship Opportunities',
  'Real-world Projects',
  'Hackathons',
  'Mentorship',
  'Team Projects',
  'Portfolio Building',
  'Freelancing',
  'Career Guidance',
];

const AGREEMENT_ITEMS: { key: keyof AgreementFields; label: string }[] = [
  { key: 'agreedToPayFee', label: 'I agree to pay the required course fee.' },
  { key: 'agreedToPrivacyPolicy', label: 'I agree to the NYDL Privacy Policy.' },
  { key: 'agreedToTerms', label: 'I agree to the NYDL Terms and Conditions.' },
  { key: 'understandsAttendance', label: 'I understand attendance in live online sessions is required.' },
  { key: 'understandsAssignments', label: 'I understand assignments and projects must be completed.' },
  { key: 'agreesToRespect', label: 'I agree to respect mentors and fellow students.' },
  { key: 'understandsInternshipPerformanceBased', label: 'I understand internship opportunities are performance-based.' },
  { key: 'understandsEmploymentNotGuaranteed', label: 'I understand employment opportunities are not guaranteed and depend on performance and availability.' },
];

interface AgreementFields {
  agreedToPayFee: boolean;
  agreedToPrivacyPolicy: boolean;
  agreedToTerms: boolean;
  understandsAttendance: boolean;
  understandsAssignments: boolean;
  agreesToRespect: boolean;
  understandsInternshipPerformanceBased: boolean;
  understandsEmploymentNotGuaranteed: boolean;
}

const registrationSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  gender: z.enum(['Male', 'Female', 'Other']),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  phone: z.string().min(6, 'Phone number is required'),

  schoolName: z.string().min(1, 'School name is required'),
  grade: z.string().min(1, 'Grade is required'),

  city: z.string().min(1, 'City is required'),
  region: z.string().optional(),

  operatingSystem: z.enum(['Windows', 'Mac', 'Linux']),
  hasPersonalComputer: z.enum(['yes', 'no']),
  hasDiscord: z.enum(['yes', 'no']),
  programmingExperience: z.enum(['None', 'Beginner', 'Intermediate']),
  reasonForJoining: z.string().min(5, 'Please share why you want to join'),

  interests: z.array(z.string()),

  formRegistrationId: z.string().optional(),

  paymentMethod: z.enum(['CHAPA', 'TELEBIRR', 'BANK_TRANSFER', 'CASH']),
  transactionReference: z.string().min(4, 'Transaction reference is required'),

  agreedToPayFee: z.boolean(),
  agreedToPrivacyPolicy: z.boolean(),
  agreedToTerms: z.boolean(),
  understandsAttendance: z.boolean(),
  understandsAssignments: z.boolean(),
  agreesToRespect: z.boolean(),
  understandsInternshipPerformanceBased: z.boolean(),
  understandsEmploymentNotGuaranteed: z.boolean(),
});

type FormValues = z.infer<typeof registrationSchema>;

type IntakeMode = 'unset' | 'fast' | 'full';

type StepLabel =
  | 'Personal Information'
  | 'Education'
  | 'Location'
  | 'Course Selection'
  | 'Technical Readiness'
  | 'Interests'
  | 'NYDev Form Verification'
  | 'Payment & Agreements';

const FULL_STEPS: StepLabel[] = ['Personal Information', 'Education', 'Location', 'Course Selection', 'Technical Readiness', 'Interests', 'Payment & Agreements'];
// Fast-track: the NYDev Form already collected steps 1–6, so we only need
// proof of that registration plus the payment step.
const FAST_STEPS: StepLabel[] = ['NYDev Form Verification', 'Payment & Agreements'];

const STEP_FIELDS: Partial<Record<StepLabel, (keyof FormValues)[]>> = {
  'Personal Information': ['fullName', 'gender', 'dateOfBirth', 'phone'],
  Education: ['schoolName', 'grade'],
  Location: ['city'],
  'Technical Readiness': ['operatingSystem', 'hasPersonalComputer', 'hasDiscord', 'programmingExperience', 'reasonForJoining'],
  'Payment & Agreements': ['paymentMethod', 'transactionReference', 'agreedToPayFee', 'agreedToPrivacyPolicy', 'agreedToTerms', 'understandsAttendance', 'understandsAssignments', 'agreesToRespect', 'understandsInternshipPerformanceBased', 'understandsEmploymentNotGuaranteed'],
};

const STEP_DESCRIPTIONS: Record<StepLabel, string> = {
  'Personal Information': 'Tell us a bit about yourself.',
  Education: 'Where are you currently studying?',
  Location: 'Where are you located?',
  'Course Selection': "Confirm the program you're registering for.",
  'Technical Readiness': 'Help us understand your setup for online learning.',
  Interests: 'What are you hoping to get out of this program? (optional)',
  'NYDev Form Verification': 'Provide the registration ID or QR code you received from the NYDev Form.',
  'Payment & Agreements': 'Complete your course fee payment and accept our agreements.',
};

function calculateAge(dateOfBirth: string): number | undefined {
  if (!dateOfBirth) return undefined;
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return undefined;
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const monthDiff = now.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) age -= 1;
  return age >= 0 ? age : undefined;
}

export default function EnrollmentPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const { data: courseRes, isLoading: isCourseLoading } = useCourse(courseId || '');
  const { data: enrollmentsRes, isLoading: isEnrollmentsLoading } = useEnrollments();
  const applyMutation = useApplyEnrollment();
  const submitPaymentMutation = useSubmitPayment();

  const course = courseRes?.data;
  const existingEnrollment = useMemo(
    () => enrollmentsRes?.data?.find((e) => e.courseId === courseId),
    [enrollmentsRes, courseId]
  );

  const [intakeMode, setIntakeMode] = useState<IntakeMode>('unset');
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [enrollmentId, setEnrollmentId] = useState<string | null>(null);
  const [qrDataUri, setQrDataUri] = useState<string | null>(null);
  const qrInputRef = useRef<HTMLInputElement>(null);

  const steps = intakeMode === 'fast' ? FAST_STEPS : FULL_STEPS;
  const currentStep = steps[step];

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: user?.name || '',
      interests: [],
      agreedToPayFee: false,
      agreedToPrivacyPolicy: false,
      agreedToTerms: false,
      understandsAttendance: false,
      understandsAssignments: false,
      agreesToRespect: false,
      understandsInternshipPerformanceBased: false,
      understandsEmploymentNotGuaranteed: false,
    },
  });

  const dateOfBirth = watch('dateOfBirth');
  const age = calculateAge(dateOfBirth);
  const selectedInterests = watch('interests') || [];
  const formRegistrationId = watch('formRegistrationId');
  const agreementValues = AGREEMENT_ITEMS.map((item) => watch(item.key));
  const allAgreed = agreementValues.every(Boolean);
  const isPending = isSubmitting || applyMutation.isPending || submitPaymentMutation.isPending;

  const toggleInterest = (interest: string) => {
    const next = selectedInterests.includes(interest)
      ? selectedInterests.filter((i) => i !== interest)
      : [...selectedInterests, interest];
    setValue('interests', next, { shouldValidate: true });
  };

  const handleQrFile = (file: File | undefined) => {
    if (!file) return;
    if (!/^image\/(png|jpe?g|webp)$/.test(file.type)) {
      toast.error('Please upload the QR code as a PNG, JPG, or WebP image.');
      return;
    }
    if (file.size > QR_MAX_BYTES) {
      toast.error('QR code image is too large (max 3MB).');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setQrDataUri(reader.result as string);
    reader.onerror = () => toast.error('Failed to read the QR code image. Please try again.');
    reader.readAsDataURL(file);
  };

  const hasFormProof = !!(formRegistrationId?.trim() || qrDataUri);

  const goNext = async () => {
    if (currentStep === 'NYDev Form Verification') {
      if (!hasFormProof) {
        toast.error('Enter your NYDev Form registration ID or upload the QR code you received.');
        return;
      }
      setStep((s) => Math.min(s + 1, steps.length - 1));
      return;
    }
    const fields = STEP_FIELDS[currentStep] || [];
    const valid = fields.length === 0 || (await trigger(fields));
    if (!valid) {
      toast.error('Please complete all required fields.');
      return;
    }
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const goBack = () => {
    if (step === 0) {
      // Back out of the wizard to the intake-mode chooser.
      setIntakeMode('unset');
      return;
    }
    setStep((s) => Math.max(s - 1, 0));
  };

  const buildAgreements = (values: FormValues) => ({
    agreedToPayFee: values.agreedToPayFee,
    agreedToPrivacyPolicy: values.agreedToPrivacyPolicy,
    agreedToTerms: values.agreedToTerms,
    understandsAttendance: values.understandsAttendance,
    understandsAssignments: values.understandsAssignments,
    agreesToRespect: values.agreesToRespect,
    understandsInternshipPerformanceBased: values.understandsInternshipPerformanceBased,
    understandsEmploymentNotGuaranteed: values.understandsEmploymentNotGuaranteed,
  });

  const submitRegistrationAndPayment = async (
    payload: ApplyRegistrationPayload,
    paymentMethod: FormValues['paymentMethod'],
    transactionReference: string
  ) => {
    try {
      let currentEnrollmentId = enrollmentId;

      if (!currentEnrollmentId) {
        const enrollmentRes = await applyMutation.mutateAsync(payload);
        currentEnrollmentId = enrollmentRes.data.id;
        setEnrollmentId(currentEnrollmentId);
        toast.success('Registration submitted successfully.');
      }

      await submitPaymentMutation.mutateAsync({
        enrollmentId: currentEnrollmentId,
        paymentMethod,
        transactionReference,
      });

      toast.success('Payment verification successful.');
      setSubmitted(true);
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Registration failed. Please try again.';
      if (message.toLowerCase().includes('transaction reference has already been submitted')) {
        toast.error('Invalid transaction ID: this reference has already been used.');
      } else if (message.toLowerCase().includes('verification failed') || message.toLowerCase().includes('requires a payment')) {
        toast.error(message);
        toast.warning('Payment verification pending. You can correct the transaction ID and resubmit.');
      } else {
        toast.error(message);
      }
    }
  };

  // Full flow: RHF validates the entire schema.
  const onSubmitFull = async (values: FormValues) => {
    if (!allAgreed) {
      toast.error('Please accept all agreements to continue.');
      return;
    }
    if (!course) return;

    await submitRegistrationAndPayment(
      {
        courseId: course.id,
        personalInfo: {
          fullName: values.fullName,
          gender: values.gender,
          dateOfBirth: values.dateOfBirth,
          phone: values.phone,
          age,
        },
        education: {
          schoolName: values.schoolName,
          grade: values.grade,
        },
        location: {
          city: values.city,
          region: values.region,
        },
        technicalReadiness: {
          operatingSystem: values.operatingSystem,
          hasPersonalComputer: values.hasPersonalComputer === 'yes',
          hasDiscord: values.hasDiscord === 'yes',
          programmingExperience: values.programmingExperience,
          reasonForJoining: values.reasonForJoining,
        },
        interests: values.interests,
        agreements: buildAgreements(values),
      },
      values.paymentMethod,
      values.transactionReference
    );
  };

  // Fast-track flow: only the payment fields + agreements + form proof are
  // validated — the NYDev Form already collected the intake sections.
  const onSubmitFast = async () => {
    if (!course) return;
    const paymentValid = await trigger(['paymentMethod', 'transactionReference']);
    if (!paymentValid) {
      toast.error('Please complete the payment details.');
      return;
    }
    if (!allAgreed) {
      toast.error('Please accept all agreements to continue.');
      return;
    }
    if (!hasFormProof) {
      toast.error('Your NYDev Form registration proof is missing.');
      setStep(0);
      return;
    }

    const values = getValues();
    await submitRegistrationAndPayment(
      {
        courseId: course.id,
        externalForm: {
          registrationId: values.formRegistrationId?.trim() || undefined,
          qrCodeImage: qrDataUri || undefined,
        },
        interests: [],
        agreements: buildAgreements(values),
      },
      values.paymentMethod,
      values.transactionReference
    );
  };

  if (isCourseLoading || isEnrollmentsLoading) {
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
        <Button onClick={() => navigate('/courses')}>View Catalog</Button>
      </div>
    );
  }

  // ─── Already registered: show status instead of the form ───
  if (existingEnrollment && !submitted) {
    const statusMeta = getRegistrationStatusMeta(existingEnrollment);
    return (
      <div className="w-full max-w-2xl mx-auto px-4 md:px-0 py-16">
        <Card className="text-center py-12 px-6">
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              {statusMeta.tone === 'success' ? (
                <CheckCircle className="h-14 w-14 text-emerald-500" />
              ) : statusMeta.tone === 'destructive' ? (
                <AlertCircle className="h-14 w-14 text-red-500" />
              ) : (
                <Clock className="h-14 w-14 text-amber-500" />
              )}
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-foreground">{statusMeta.label}</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                You already have a registration for <span className="font-semibold">{course.title}</span>. {statusMeta.description}
              </p>
            </div>
            <div className="pt-4 flex justify-center gap-3">
              <Button variant="outline" onClick={() => navigate('/courses/enrolled')}>
                View My Courses
              </Button>
              <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ─── Success screen ───
  if (submitted) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 md:px-0 py-16">
        <Card className="text-center py-12 px-6">
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <CheckCircle className="h-14 w-14 text-emerald-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-foreground">Registration Submitted!</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                Your registration for <span className="font-semibold">{course.title}</span> and payment reference have been received.
                Your payment is being verified, and your registration will move to admin review shortly.
              </p>
            </div>
            <div className="pt-4 flex justify-center gap-3">
              <Button onClick={() => navigate('/courses/enrolled')}>View Registration Status</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ─── Intake mode chooser ───
  if (intakeMode === 'unset') {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 md:px-0 py-16">
        <div className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Register for {course.title}</h1>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Have you already registered on the <span className="font-semibold">NYDev Form</span>? If so, we only need
            your registration proof and payment — no need to fill everything in again.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => { setIntakeMode('fast'); setStep(0); }}
            className="text-left rounded-xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-md transition-all group"
          >
            <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
              <QrCode className="size-5" />
            </div>
            <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
              Yes, I've registered on the NYDev Form
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Fast track: just provide the registration ID or QR code the form gave you, then complete payment.
            </p>
          </button>

          <button
            type="button"
            onClick={() => { setIntakeMode('full'); setStep(0); }}
            className="text-left rounded-xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-md transition-all group"
          >
            <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
              <ClipboardList className="size-5" />
            </div>
            <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
              No, register here now
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Complete the full registration: personal details, education, technical readiness, and payment.
            </p>
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Haven't filled the NYDev Form and prefer it?{' '}
          <a href={NYDEV_FORM_URL} target="_blank" rel="noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
            Open the NYDev Form <ExternalLink className="size-3" />
          </a>{' '}
          then come back with your registration ID.
        </p>
      </div>
    );
  }

  const progressPercent = ((step + 1) / steps.length) * 100;
  const isLastStep = step === steps.length - 1;
  const errorMap = errors as Record<string, { message?: string } | undefined>;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 md:px-0 py-10">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">Course Registration</h1>
        <p className="text-sm text-muted-foreground">
          Step {step + 1} of {steps.length}: <span className="font-semibold">{currentStep}</span>
        </p>
        <Progress value={progressPercent} className="mt-4" />
      </div>

      <form onSubmit={intakeMode === 'full' ? handleSubmit(onSubmitFull) : (e) => e.preventDefault()}>
        <Card className="border border-border">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-lg font-bold text-foreground">{currentStep}</CardTitle>
            <CardDescription className="text-xs">{STEP_DESCRIPTIONS[currentStep]}</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-5">
            {/* ─── NYDev Form Verification (fast track) ─── */}
            {currentStep === 'NYDev Form Verification' && (
              <div className="space-y-6">
                <div className="bg-muted/40 border border-border rounded-md p-4 text-xs text-muted-foreground leading-relaxed">
                  You told us you already registered on the{' '}
                  <a href={NYDEV_FORM_URL} target="_blank" rel="noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                    NYDev Form <ExternalLink className="size-3" />
                  </a>
                  . Since that form collected your personal, education, and technical details, we only need the
                  registration ID or QR code it gave you when you finished.
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">
                    Registration ID
                  </label>
                  <input
                    placeholder="The ID shown after you submitted the NYDev Form"
                    className="w-full px-3 py-2 bg-background border border-border rounded focus:ring-1 focus:ring-primary text-sm text-foreground"
                    {...register('formRegistrationId')}
                  />
                </div>

                <div className="relative">
                  <div aria-hidden="true" className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs font-medium">
                    <span className="bg-card px-3 text-muted-foreground">or upload your QR code</span>
                  </div>
                </div>

                <div>
                  <input
                    ref={qrInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(e) => handleQrFile(e.target.files?.[0])}
                  />
                  {qrDataUri ? (
                    <div className="flex items-center gap-4 rounded-md border border-border bg-muted/40 p-4">
                      <img src={qrDataUri} alt="NYDev Form QR code" className="size-24 rounded-md border border-border object-contain bg-white" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-foreground">QR code attached</p>
                        <p className="text-xs text-muted-foreground">We'll verify it against your NYDev Form registration.</p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Remove QR code"
                        onClick={() => {
                          setQrDataUri(null);
                          if (qrInputRef.current) qrInputRef.current.value = '';
                        }}
                        className="text-muted-foreground hover:text-red-500 shrink-0"
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => qrInputRef.current?.click()}
                      className="w-full rounded-md border border-dashed border-border bg-muted/20 p-6 text-center hover:border-primary/50 hover:bg-muted/40 transition-colors"
                    >
                      <QrCode className="mx-auto mb-2 size-8 text-muted-foreground" />
                      <p className="text-sm font-semibold text-foreground">Upload QR code image</p>
                      <p className="text-xs text-muted-foreground mt-1">PNG, JPG, or WebP — max 3MB</p>
                    </button>
                  )}
                </div>

                <p className="text-[11px] text-muted-foreground">
                  Provide at least one: the registration ID <span className="font-semibold">or</span> the QR code image.
                </p>
              </div>
            )}

            {/* ─── Step: Personal Information ─── */}
            {currentStep === 'Personal Information' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">Full Name *</label>
                  <input className="w-full px-3 py-2 bg-background border border-border rounded focus:ring-1 focus:ring-primary text-sm text-foreground" {...register('fullName')} />
                  {errorMap.fullName && <p className="text-xs text-red-500 mt-1">{errorMap.fullName.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">Gender *</label>
                  <Select onValueChange={(v) => setValue('gender', v as FormValues['gender'], { shouldValidate: true })}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Select gender" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errorMap.gender && <p className="text-xs text-red-500 mt-1">{errorMap.gender.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">Date of Birth *</label>
                  <input type="date" className="w-full px-3 py-2 bg-background border border-border rounded focus:ring-1 focus:ring-primary text-sm text-foreground" {...register('dateOfBirth')} />
                  {errorMap.dateOfBirth && <p className="text-xs text-red-500 mt-1">{errorMap.dateOfBirth.message}</p>}
                  {age !== undefined && <p className="text-xs text-muted-foreground mt-1">Age: {age}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">Email Address</label>
                  <input disabled value={user?.email || ''} className="w-full px-3 py-2 bg-muted/40 border border-border rounded text-sm text-muted-foreground cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">Phone Number *</label>
                  <input className="w-full px-3 py-2 bg-background border border-border rounded focus:ring-1 focus:ring-primary text-sm text-foreground" placeholder="+251..." {...register('phone')} />
                  {errorMap.phone && <p className="text-xs text-red-500 mt-1">{errorMap.phone.message}</p>}
                </div>
              </div>
            )}

            {/* ─── Step: Education ─── */}
            {currentStep === 'Education' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">School Name *</label>
                  <input className="w-full px-3 py-2 bg-background border border-border rounded focus:ring-1 focus:ring-primary text-sm text-foreground" {...register('schoolName')} />
                  {errorMap.schoolName && <p className="text-xs text-red-500 mt-1">{errorMap.schoolName.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">Grade *</label>
                  <Select onValueChange={(v) => setValue('grade', v as string, { shouldValidate: true })}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Select grade" /></SelectTrigger>
                    <SelectContent>
                      {GRADE_OPTIONS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errorMap.grade && <p className="text-xs text-red-500 mt-1">{errorMap.grade.message}</p>}
                </div>
              </div>
            )}

            {/* ─── Step: Location ─── */}
            {currentStep === 'Location' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">City *</label>
                  <input className="w-full px-3 py-2 bg-background border border-border rounded focus:ring-1 focus:ring-primary text-sm text-foreground" {...register('city')} />
                  {errorMap.city && <p className="text-xs text-red-500 mt-1">{errorMap.city.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">Region</label>
                  <input className="w-full px-3 py-2 bg-background border border-border rounded focus:ring-1 focus:ring-primary text-sm text-foreground" {...register('region')} />
                </div>
              </div>
            )}

            {/* ─── Step: Course Selection ─── */}
            {currentStep === 'Course Selection' && (
              <>
                <div className="bg-muted/40 border border-border rounded-md p-5 flex justify-between items-center">
                  <div>
                    <span className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Selected Course</span>
                    <span className="text-base font-semibold text-foreground">{course.title}</span>
                    <p className="text-xs text-muted-foreground mt-1">{course.level} &middot; {course.durationWeeks} weeks</p>
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Tuition Fee</span>
                    <span className="text-base font-bold text-primary">{course.price > 0 ? `${course.currency} ${course.price}` : 'Free'}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Registering for the wrong course? <Link to="/courses" className="text-primary hover:underline">Browse the catalog</Link> to pick a different one.
                </p>
              </>
            )}

            {/* ─── Step: Technical Readiness ─── */}
            {currentStep === 'Technical Readiness' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">Operating System *</label>
                  <Select onValueChange={(v) => setValue('operatingSystem', v as FormValues['operatingSystem'], { shouldValidate: true })}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Select OS" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Windows">Windows</SelectItem>
                      <SelectItem value="Mac">Mac</SelectItem>
                      <SelectItem value="Linux">Linux</SelectItem>
                    </SelectContent>
                  </Select>
                  {errorMap.operatingSystem && <p className="text-xs text-red-500 mt-1">{errorMap.operatingSystem.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">Programming Experience *</label>
                  <Select onValueChange={(v) => setValue('programmingExperience', v as FormValues['programmingExperience'], { shouldValidate: true })}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Select level" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="None">None</SelectItem>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                    </SelectContent>
                  </Select>
                  {errorMap.programmingExperience && <p className="text-xs text-red-500 mt-1">{errorMap.programmingExperience.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">Do you have a personal computer? *</label>
                  <Select onValueChange={(v) => setValue('hasPersonalComputer', v as 'yes' | 'no', { shouldValidate: true })}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                  {errorMap.hasPersonalComputer && <p className="text-xs text-red-500 mt-1">{errorMap.hasPersonalComputer.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">Have you installed Discord before? *</label>
                  <Select onValueChange={(v) => setValue('hasDiscord', v as 'yes' | 'no', { shouldValidate: true })}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                  {errorMap.hasDiscord && <p className="text-xs text-red-500 mt-1">{errorMap.hasDiscord.message}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">Reason for Joining *</label>
                  <textarea rows={3} placeholder="I want to become a software engineer..." className="w-full px-3 py-2 bg-background border border-border rounded focus:ring-1 focus:ring-primary text-sm text-foreground resize-y" {...register('reasonForJoining')} />
                  {errorMap.reasonForJoining && <p className="text-xs text-red-500 mt-1">{errorMap.reasonForJoining.message}</p>}
                </div>
              </div>
            )}

            {/* ─── Step: Interests ─── */}
            {currentStep === 'Interests' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {INTEREST_OPTIONS.map((interest) => (
                  <label key={interest} className="flex items-center gap-2.5 p-2.5 rounded-md border border-border hover:bg-muted/40 cursor-pointer text-sm text-foreground">
                    <Checkbox
                      checked={selectedInterests.includes(interest)}
                      onCheckedChange={() => toggleInterest(interest)}
                    />
                    {interest}
                  </label>
                ))}
              </div>
            )}

            {/* ─── Step: Payment & Agreements ─── */}
            {currentStep === 'Payment & Agreements' && (
              <div className="space-y-6">
                <div className="space-y-3 p-4 bg-muted/40 border border-border rounded-md">
                  <h4 className="text-xs font-bold text-foreground">Billing Details</h4>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Course Fee</span>
                    <span className="font-semibold text-foreground">{course.price > 0 ? `${course.currency} ${course.price}` : 'Free'}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground border-t border-border/60 pt-2">
                    <span>Merchant account</span>
                    <span className="font-mono text-[10px]">CBE 1000403196928 (YAMLAK NEGASH DUGO)</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    Transfer the course fee to the account above using your preferred payment method, then enter your transaction reference below.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">Payment Method *</label>
                    <Select onValueChange={(v) => setValue('paymentMethod', v as FormValues['paymentMethod'], { shouldValidate: true })}>
                      <SelectTrigger className="w-full"><SelectValue placeholder="Select method" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CHAPA">Chapa</SelectItem>
                        <SelectItem value="TELEBIRR">Telebirr</SelectItem>
                        <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                        <SelectItem value="CASH">Cash</SelectItem>
                      </SelectContent>
                    </Select>
                    {errorMap.paymentMethod && <p className="text-xs text-red-500 mt-1">{errorMap.paymentMethod.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">Transaction Reference ID *</label>
                    <input placeholder="e.g. FT26071..." className="w-full px-3 py-2 bg-background border border-border rounded focus:ring-1 focus:ring-primary text-sm text-foreground" {...register('transactionReference')} />
                    {errorMap.transactionReference && <p className="text-xs text-red-500 mt-1">{errorMap.transactionReference.message}</p>}
                  </div>
                </div>

                <div className="space-y-2 border-t border-border pt-4">
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-widest mb-2">Terms &amp; Agreements</h4>
                  {AGREEMENT_ITEMS.map((item) => (
                    <label key={item.key} className="flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed cursor-pointer">
                      <Checkbox
                        className="mt-0.5"
                        checked={!!watch(item.key)}
                        onCheckedChange={(checked) => setValue(item.key, checked === true, { shouldValidate: true })}
                      />
                      {item.label}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </CardContent>

          <div className="flex items-center justify-between p-6 border-t border-border">
            <Button type="button" variant="outline" onClick={goBack}>
              <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
            </Button>

            {!isLastStep ? (
              <Button type="button" onClick={goNext}>
                Next <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            ) : intakeMode === 'full' ? (
              <Button type="submit" disabled={!allAgreed || isPending}>
                {isPending ? (
                  <><Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Submitting Registration...</>
                ) : (
                  'Register'
                )}
              </Button>
            ) : (
              <Button type="button" onClick={onSubmitFast} disabled={!allAgreed || isPending}>
                {isPending ? (
                  <><Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Submitting Registration...</>
                ) : (
                  'Register'
                )}
              </Button>
            )}
          </div>
        </Card>
      </form>
    </div>
  );
}
