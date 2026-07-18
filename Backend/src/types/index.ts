export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'INSTRUCTOR' | 'MENTOR' | 'STUDENT' | 'student' | 'instructor' | 'admin';

export interface User {
  id: string;
  // Existing fields for compatibility with views
  name: string;
  email: string;
  passwordHash?: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;

  // New fields
  firstName?: string;
  middleName?: string;
  lastName?: string;
  username?: string;
  phone?: string;
  isEmailVerified?: boolean;
  emailVerifiedAt?: string;
  profileImage?: string;
  bio?: string;
  isActive?: boolean;
  isBlocked?: boolean;
  blockReason?: string;
  lastLogin?: string;
  refreshTokenVersion?: number;
  passwordChangedAt?: string;
  updatedAt?: string;
  githubId?: string;
  authProvider?: 'LOCAL' | 'GITHUB';
}

export interface StudentProfile {
  id: string;
  userId: string; // Ref to User
  studentCode: string;
  currentLevel?: string;
  github?: string;
  linkedin?: string;
  portfolio?: string;
  interests?: string[];
  experienceLevel?: string;
  // Statistics
  totalCourses: number;
  completedCourses: number;
  attendanceAverage: number;
  assignmentAverage: number;
  participationScore: number;
  healthScore: number;
  currentActiveEnrollmentId?: string; // Ref to Enrollment
  graduationStatus?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InstructorProfile {
  id: string;
  userId: string; // Ref to User
  specialization?: string;
  yearsExperience?: number;
  bio?: string;
  skills?: string[];
  assignedCourses?: string[]; // Course IDs
  assignedCohorts?: string[]; // Cohort IDs
  rating?: number;
  totalStudents?: number;
  createdAt: string;
  updatedAt: string;
}

export interface MentorProfile {
  id: string;
  userId: string; // Ref to User
  specialization?: string;
  assignedTeams?: string[]; // Team IDs
  assignedStudents?: string[]; // Student Profile or User IDs
  availability?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: 'Frontend' | 'Backend' | 'DevOps' | 'Full-Stack' | string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | string;
  durationWeeks: number;
  image: string;
  syllabusSummary: string;
  modules?: Module[]; // Left for compatibility

  // New fields
  slug?: string;
  code?: string;
  shortDescription?: string;
  thumbnail?: string;
  coverImage?: string;
  level?: string;
  language?: string;
  estimatedHours?: number;
  price?: number;
  discountPrice?: number;
  currency?: string;
  prerequisites?: string[];
  learningOutcomes?: string[];
  skills?: string[];
  instructors?: string[]; // Ref to User/Instructor IDs
  mentors?: string[]; // Ref to User/Mentor IDs
  enrollmentEnabled?: boolean;
  maxStudentsPerCohort?: number;
  defaultTeamSize?: number;
  allowWaitlist?: boolean;
  totalEnrollments?: number;
  totalRevenue?: number;
  status?: 'draft' | 'published' | 'archived' | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Curriculum {
  id: string;
  courseId: string; // Ref to Course
  title: string;
  description?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Module {
  id: string;
  courseId: string; // Ref to Course
  title: string;
  description: string;
  order: number;
  lessons?: Lesson[]; // compatibility
  assignments?: Assignment[]; // compatibility
  curriculumId?: string; // Ref to Curriculum
  createdAt?: string;
  updatedAt?: string;
}

export interface Lesson {
  id: string;
  moduleId?: string; // Ref to Module
  title: string;
  content: string;
  durationMinutes: number; // for compatibility
  videoUrl?: string;
  resources?: { title: string; url: string }[];
  description?: string;
  lessonType?: 'VIDEO' | 'TEXT' | 'LIVE' | 'PRACTICE' | 'QUIZ' | string;
  duration?: number; // minutes
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Cohort {
  id: string;
  courseId: string; // Ref to Course
  name: string;
  code: string; // e.g. NYDL-2026-FS-A
  batch?: string; // e.g. "Summer 2026" — one cohort per course per batch
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled' | 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | string;
  maxCapacity: number;
  instructors: string[]; // User IDs (left for compatibility)
  students: string[]; // User IDs (left for compatibility)
  schedule: string; // e.g. "Mon, Wed 7:00 PM - 9:00 PM EST"

  // New fields
  enrollmentStart?: string;
  enrollmentEnd?: string;
  capacity?: number;
  enrolledStudents?: string[]; // Ref to User IDs
  instructorIds?: string[]; // Ref to User IDs
  mentorIds?: string[]; // Ref to User IDs
  discordInvite?: string;
  googleMeetInfo?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Team {
  id: string;
  cohortId: string; // Ref to Cohort
  name: string;
  teamCode: string;
  mentorId?: string; // Ref to User (Mentor)
  leaderId?: string; // Ref to User (Student)
  maxMembers?: number;
  memberIds?: string[]; // Ref to User (Student) IDs
  score?: number;
  createdAt: string;
  updatedAt: string;
}

export interface RegistrationPersonalInfo {
  fullName: string;
  gender: 'Male' | 'Female' | 'Other' | string;
  dateOfBirth: string;
  phone: string;
  age?: number;
}

export interface RegistrationEducation {
  schoolName: string;
  grade: string;
}

export interface RegistrationLocation {
  city: string;
  region?: string;
}

export interface RegistrationTechnicalReadiness {
  operatingSystem: 'Windows' | 'Mac' | 'Linux' | string;
  hasPersonalComputer: boolean;
  hasDiscord: boolean;
  programmingExperience: 'None' | 'Beginner' | 'Intermediate' | string;
  reasonForJoining: string;
}

export interface RegistrationAgreements {
  agreedToPayFee: boolean;
  agreedToPrivacyPolicy: boolean;
  agreedToTerms: boolean;
  understandsAttendance: boolean;
  understandsAssignments: boolean;
  agreesToRespect: boolean;
  understandsInternshipPerformanceBased: boolean;
  understandsEmploymentNotGuaranteed: boolean;
}

/**
 * Proof of a completed registration on the external NYDev Form. Students who
 * already filled that form skip the intake steps (it collected the same
 * data) and only provide their form registration ID and/or the QR code image
 * the form issued, plus payment.
 */
export interface ExternalFormRegistration {
  registrationId?: string;
  /** Data-URI of the QR code image issued by the NYDev Form. */
  qrCodeImage?: string;
}

export interface Enrollment {
  id: string;
  studentId: string; // Ref to User
  cohortId: string; // Ref to Cohort
  status: 'enrolled' | 'completed' | 'dropped' | 'PENDING' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'SUSPENDED' | 'COMPLETED' | 'DROPPED' | 'REMOVED' | string;
  progressPercentage: number;
  enrolledAt: string;
  certificateIssued?: boolean;
  certificateUrl?: string;

  // New fields
  courseId?: string; // Ref to Course
  teamId?: string; // Ref to Team
  paymentId?: string; // Ref to Payment
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;

  // Registration intake fields
  personalInfo?: RegistrationPersonalInfo;
  education?: RegistrationEducation;
  location?: RegistrationLocation;
  technicalReadiness?: RegistrationTechnicalReadiness;
  interests?: string[];
  agreements?: RegistrationAgreements;
  externalForm?: ExternalFormRegistration;

  // Review tracking
  reviewerId?: string; // Ref to User (Admin)
  reviewNotes?: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
}

export interface Payment {
  id: string;
  studentId: string; // Ref to User
  enrollmentId?: string; // Ref to Enrollment
  courseId: string; // Ref to Course
  amount: number;
  currency: string;
  paymentMethod: 'CBE' | 'TELEBIRR' | 'BOA' | 'CBEBIRR' | 'MPESA' | 'DASHEN' | 'AWASH' | 'SIINQEE' | 'KAAFI_EBIRR' | 'CHAPA' | 'BANK_TRANSFER' | 'CASH' | string;
  transactionReference?: string;
  screenshot?: string;
  paidAt?: string;
  verifiedBy?: string; // Ref to User (Admin)
  verificationDate?: string;
  notes?: string;
  status: 'PENDING' | 'VERIFIED' | 'FAILED' | string;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  courseId: string; // Ref to Course
  cohortId: string; // Ref to Cohort
  instructorId: string; // Ref to User (Instructor)
  title: string;
  description?: string;
  type?: 'LECTURE' | 'LAB' | 'WORKSHOP' | 'STANDUP' | 'REVIEW' | 'OTHER' | string;
  sessionDate: string;
  duration: number; // minutes
  meetLink?: string;
  recordingLink?: string;
  status: 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | string;
  createdAt: string;
  updatedAt: string;
}

export interface Attendance {
  id: string;
  studentId: string; // Ref to User
  sessionId: string; // Ref to Session
  enrollmentId: string; // Ref to Enrollment
  status: 'PRESENT' | 'LATE' | 'ABSENT' | string;
  checkInTime?: string;
  remarks?: string;
  markedBy?: string; // Ref to User
  createdAt: string;
  updatedAt: string;
}

export interface Assignment {
  id: string;
  moduleId: string; // Ref to Module
  title: string;
  description: string;
  maxPoints: number; // compatible
  dueDate: string;
  submissionType: 'github' | 'text' | 'file' | string;

  // New fields
  courseId?: string; // Ref to Course
  cohortId?: string; // Ref to Cohort
  assignmentType?: 'INDIVIDUAL' | 'TEAM' | string;
  maxScore?: number;
  attachments?: string[];
  createdBy?: string; // Ref to User
  rubric?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Submission {
  id: string;
  assignmentId: string; // Ref to Assignment
  studentId: string; // Ref to User
  cohortId: string; // Ref to Cohort
  repoUrl?: string; // compatible
  content?: string;
  notes?: string;
  status: 'submitted' | 'graded' | 'late' | string;
  points?: number;
  feedback?: string;
  gradedBy?: string; // Instructor User ID
  submittedAt: string;

  // New fields
  teamId?: string; // Ref to Team
  githubLink?: string;
  liveLink?: string;
  attachments?: string[];
  score?: number;
  gradedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Resource {
  id: string;
  courseId: string; // Ref to Course
  title: string;
  description?: string;
  resourceType: 'PDF' | 'VIDEO' | 'LINK' | 'ZIP' | 'GITHUB' | 'SLIDES' | string;
  url: string;
  uploadedBy: string; // Ref to User
  createdAt: string;
  updatedAt: string;
}

export interface Announcement {
  id: string;
  courseId?: string; // Ref to Course
  cohortId?: string; // Ref to Cohort
  teamId?: string; // Ref to Team
  title: string;
  content: string;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT' | string;
  publishDate: string;
  createdBy: string; // Ref to User
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string; // Ref to User
  title: string;
  message: string;
  type?: string;
  actionUrl?: string;
  isRead: boolean;
  sentAt: string;
}

export interface StudentActivity {
  id: string;
  studentId: string; // Ref to User
  action: 'LOGIN' | 'LOGOUT' | 'JOIN_SESSION' | 'SUBMIT_ASSIGNMENT' | 'DOWNLOAD_RESOURCE' | 'OPEN_COURSE' | 'VIEW_ANNOUNCEMENT' | string;
  metadata?: any;
  timestamp: string;
}

export interface StudentHealth {
  id: string;
  studentId: string; // Ref to User
  enrollmentId: string; // Ref to Enrollment
  attendanceScore: number;
  assignmentScore: number;
  participationScore: number;
  engagementScore: number;
  overallScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | string;
  lastCalculatedAt: string;
}

export interface AuditLog {
  id: string;
  userId: string; // Ref to User
  action: string;
  entityType: string;
  entityId: string;
  changes?: any;
  ipAddress?: string;
  createdAt: string;
}

export interface CourseStaffAssignment {
  id: string;
  courseId: string; // Ref to Course
  cohortId?: string; // Ref to Cohort
  userId: string; // Ref to User
  role: 'LEAD_INSTRUCTOR' | 'ASSISTANT_INSTRUCTOR' | 'MENTOR' | string;
  assignedBy: string; // Ref to User (Admin)
  assignedAt: string;
  status: 'ACTIVE' | 'INACTIVE' | string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
}

// --- Payment Verification & Verify.ET Types ---
export type VerificationStatus = 'success' | 'failed' | 'pending';
export type MatchConfidence = 'high' | 'medium' | 'low' | 'none';

export interface SettlementAccountMatch {
  matched: boolean;
  matchType: string;
  matchConfidence: MatchConfidence;
  source: string;
  bank: string;
  receiverAccount?: string | null;
  matchedSettlementAccount?: string | null;
  matchedUserBankAccountId?: string | null;
  matchedBusinessBankAccountId?: string | null;
  candidateCount: number;
  ambiguous: boolean;
  reason: string;
}

export interface ConfirmationHistory {
  scope: string;
  isFirstConfirmation: boolean;
  confirmedBefore: boolean;
  firstConfirmedAt: Date | string;
  lastConfirmedAt: Date | string;
  confirmationCount: number;
}

export interface BankSpecific {
  senderName?: string;
  senderAccount?: string;
  senderAccountLast4?: string;
  receiverName?: string;
  receiverAccount?: string;
  receiverAccountLast4?: string;
  transactionDateRaw?: string;
  transactionDateIsoUtc?: Date | string;
  amountValue?: number;
  reference?: string;
  branch?: string;
  payerAccount?: string;
  reason?: string;
  dateRaw?: string;
  amountRaw?: string;
  serviceCharge?: number;
  serviceChargeRaw?: string;
  vatOnCommission?: number;
  vatOnCommissionRaw?: string;
  totalDebited?: number;
  totalDebitedRaw?: string;
  amountInWords?: string;
  currency?: string;
  source?: string;
  [key: string]: unknown;
}

export interface VerifiedTransaction {
  success: boolean;
  bank: string;
  status: VerificationStatus;
  verified: boolean;
  senderName: string;
  receiverName?: string;
  amount: number;
  currency: string;
  referenceNumber: string;
  accountSuffix?: string;
  timestamp: Date | string;
  bankSpecific?: BankSpecific;
  confirmationHistory?: ConfirmationHistory;
  settlementAccountMatch?: SettlementAccountMatch;
  raw?: any;
}

export interface VerificationPayload {
  requestId: string;
  processingStatus: string;
  status: VerificationStatus;
  verified: boolean;
  result?: VerifiedTransaction;
}

export interface VerificationEngineResponse {
  success: boolean;
  message: string;
  requestId: string;
  data: VerifiedTransaction[];
  verification: VerificationPayload;
  links?: {
    statusUrl: string;
    pollAfterMs?: number;
    webhookRegistered?: boolean;
  };
}

