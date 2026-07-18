// ─── User & Auth ───
export interface User {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar: string;
  authProvider?: 'LOCAL' | 'GITHUB';
  isActive: boolean;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'STUDENT' | 'INSTRUCTOR' | 'MENTOR' | 'ADMIN' | 'SUPER_ADMIN';

export interface AuthResponse {
  status: string;
  data: {
    token: string;
    user: User;
  };
}

// ─── Student Profile ───
export interface StudentProfile {
  id: string;
  userId: string;
  studentCode: string;
  currentLevel: string;
  graduationStatus: string;
  totalCourses: number;
  completedCourses: number;
  attendanceAverage: number;
  assignmentAverage: number;
  participationScore: number;
  healthScore: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Course ───
export interface Course {
  id: string;
  title: string;
  slug: string;
  code: string;
  description: string;
  shortDescription: string;
  thumbnail: string;
  image: string;
  coverImage?: string;
  category: string;
  level: string;
  language: string;
  durationWeeks: number;
  estimatedHours?: number;
  price: number;
  discountPrice?: number;
  currency: string;
  status: 'draft' | 'published' | 'archived';
  enrollmentEnabled: boolean;
  totalEnrollments: number;
  skills: string[];
  prerequisites: string[];
  learningOutcomes: string[];
  syllabusSummary: string;
  modules?: CourseModule[];
  createdAt: string;
  updatedAt: string;
}

export interface CourseModule {
  id: string;
  title: string;
  description?: string;
  order?: number;
  lessons?: { id: string; title: string; content?: string }[];
}

// ─── Cohort ───
export interface Cohort {
  id: string;
  name: string;
  code: string;
  batch?: string;
  courseId: string;
  startDate: string;
  endDate: string;
  maxCapacity: number;
  students: string[];
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  schedule: string;
  instructors: string[];
  createdAt: string;
  updatedAt: string;
}

// ─── Registration (extended Enrollment intake data) ───
export interface RegistrationPersonalInfo {
  fullName: string;
  gender: 'Male' | 'Female' | 'Other';
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
  operatingSystem: 'Windows' | 'Mac' | 'Linux';
  hasPersonalComputer: boolean;
  hasDiscord: boolean;
  programmingExperience: 'None' | 'Beginner' | 'Intermediate';
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

/** Proof of prior registration on the external NYDev Form (fast-track intake). */
export interface ExternalFormRegistration {
  registrationId?: string;
  /** Data-URI of the QR code image issued by the NYDev Form. */
  qrCodeImage?: string;
}

// ─── Enrollment ───
export type EnrollmentStatus =
  | 'PENDING'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'COMPLETED'
  | 'DROPPED'
  | 'REMOVED';

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  cohortId: string;
  paymentId?: string;
  status: EnrollmentStatus | string;
  enrolledAt: string;
  completedAt?: string;
  progressPercentage: number;
  createdAt: string;
  updatedAt: string;

  personalInfo?: RegistrationPersonalInfo;
  education?: RegistrationEducation;
  location?: RegistrationLocation;
  technicalReadiness?: RegistrationTechnicalReadiness;
  interests?: string[];
  agreements?: RegistrationAgreements;
  externalForm?: ExternalFormRegistration;

  reviewerId?: string;
  reviewNotes?: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
}

// ─── Payment ───
export interface Payment {
  id: string;
  enrollmentId: string;
  studentId: string;
  courseId?: string;
  amount: number;
  currency: string;
  transactionReference: string;
  paymentMethod: 'CBE' | 'TELEBIRR' | 'BOA' | 'CBEBIRR' | 'MPESA' | 'DASHEN' | 'AWASH' | 'SIINQEE' | 'KAAFI_EBIRR' | 'CHAPA' | 'BANK_TRANSFER' | 'CASH';
  status: 'PENDING' | 'VERIFIED' | 'FAILED';
  verificationDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Session ───
export interface Session {
  id: string;
  title: string;
  description: string;
  courseId: string;
  cohortId: string;
  instructorId: string;
  type?: 'LECTURE' | 'LAB' | 'WORKSHOP' | 'STANDUP' | 'REVIEW' | 'OTHER';
  meetLink: string;
  sessionDate: string;
  duration: number;
  status: 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  recordingLink?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Assignment ───
export interface Assignment {
  id: string;
  title: string;
  description: string;
  courseId: string;
  cohortId: string;
  moduleId: string;
  dueDate: string;
  maxScore: number;
  maxPoints: number;
  assignmentType: 'INDIVIDUAL' | 'TEAM';
  submissionType: 'github' | 'text' | 'file';
  attachments?: string[];
  rubric?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Submission ───
export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  cohortId: string;
  repoUrl?: string;
  content?: string;
  notes?: string;
  points?: number;
  score?: number;
  feedback?: string;
  gradedBy?: string;
  status: 'submitted' | 'graded' | 'late';
  submittedAt: string;
  gradedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ─── Resource ───
export interface Resource {
  id: string;
  title: string;
  description: string;
  courseId: string;
  moduleId?: string;
  resourceType: 'PDF' | 'VIDEO' | 'LINK' | 'ZIP' | 'GITHUB' | 'SLIDES';
  url: string;
  fileSize?: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Announcement ───
export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  courseId?: string;
  cohortId?: string;
  teamId?: string;
  publishDate?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Team ───
/** A user ref as populated by the teams API (falls back to a bare id string). */
export interface TeamMemberRef {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  avatar?: string;
}

export interface Team {
  id: string;
  name: string;
  teamCode?: string;
  courseId: string | TeamMemberRef;
  cohortId: string | { id: string; name?: string; code?: string };
  leaderId?: string | TeamMemberRef;
  memberIds: (string | TeamMemberRef)[];
  mentorId?: string | TeamMemberRef;
  score?: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Notification ───
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

// ─── Attendance ───
export interface Attendance {
  id: string;
  sessionId: string;
  studentId: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  joinedAt?: string;
  leftAt?: string;
  createdAt: string;
}

// ─── Paginated Response ───
export interface PaginatedResponse<T> {
  status: string;
  data: {
    docs: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  status: string;
  data: T;
}
