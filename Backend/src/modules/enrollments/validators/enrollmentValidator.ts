import { z } from 'zod';

const ENROLLMENT_STATUS_VALUES = [
  'PENDING', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'ACTIVE', 'SUSPENDED',
  'COMPLETED', 'DROPPED', 'REMOVED', 'enrolled', 'completed', 'dropped',
] as const;

export const PersonalInfoSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  gender: z.enum(['Male', 'Female', 'Other']),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  phone: z.string().min(6, 'Phone number is required'),
  age: z.number().int().positive().optional(),
});

export const EducationSchema = z.object({
  schoolName: z.string().min(1, 'School name is required'),
  grade: z.string().min(1, 'Grade is required'),
});

export const LocationSchema = z.object({
  city: z.string().min(1, 'City is required'),
  region: z.string().optional(),
});

export const TechnicalReadinessSchema = z.object({
  operatingSystem: z.enum(['Windows', 'Mac', 'Linux']),
  hasPersonalComputer: z.boolean(),
  hasDiscord: z.boolean(),
  programmingExperience: z.enum(['None', 'Beginner', 'Intermediate']),
  reasonForJoining: z.string().min(5, 'Please share why you want to join'),
});

export const AgreementsSchema = z.object({
  agreedToPayFee: z.literal(true),
  agreedToPrivacyPolicy: z.literal(true),
  agreedToTerms: z.literal(true),
  understandsAttendance: z.literal(true),
  understandsAssignments: z.literal(true),
  agreesToRespect: z.literal(true),
  understandsInternshipPerformanceBased: z.literal(true),
  understandsEmploymentNotGuaranteed: z.literal(true),
});

export const CreateEnrollmentSchema = z.object({
  studentId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid student ID'),
  courseId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid course ID'),
  cohortId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid cohort ID').optional(),
  personalInfo: PersonalInfoSchema,
  education: EducationSchema,
  location: LocationSchema,
  technicalReadiness: TechnicalReadinessSchema,
  interests: z.array(z.string()).default([]),
  agreements: AgreementsSchema,
});

export const UpdateEnrollmentSchema = z.object({
  teamId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid team ID').optional().nullable(),
  paymentId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid payment ID').optional().nullable(),
  progressPercentage: z.number().min(0).max(100).optional(),
  certificateIssued: z.boolean().optional(),
  certificateUrl: z.string().url('Invalid certificate URL').optional().or(z.literal('')),
  completedAt: z.string().optional().nullable(),
  status: z.enum(ENROLLMENT_STATUS_VALUES).optional(),
});

export const ReviewActionSchema = z.object({
  notes: z.string().optional(),
});

export const RejectActionSchema = z.object({
  reason: z.string().min(3, 'A rejection reason is required'),
  notes: z.string().optional(),
});

export const EnrollmentFilterSchema = z.object({
  page: z.string().optional().transform(v => (v ? parseInt(v, 10) : 1)),
  limit: z.string().optional().transform(v => (v ? parseInt(v, 10) : 10)),
  studentId: z.string().optional(),
  courseId: z.string().optional(),
  cohortId: z.string().optional(),
  status: z.string().optional(),
  paymentStatus: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});
