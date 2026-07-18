// ─── User & Auth ───
export interface User {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  avatar: string;
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
// userId is a Mongoose-populated ref: the User document arrives on this same key
export interface StudentProfile {
  id: string;
  userId: Populated<User>;
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

// ─── Instructor ───
export interface Instructor {
  id: string;
  userId: Populated<User>;
  specialization: string;
  bio: string;
  assignedCourses: string[];
  createdAt: string;
  updatedAt: string;
}

// ─── Mentor ───
export interface Mentor {
  id: string;
  userId: Populated<User>;
  expertise: string;
  bio: string;
  assignedTeams: string[];
  createdAt: string;
  updatedAt: string;
}

// ─── Course ───
export interface Course {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  thumbnail: string;
  category: string;
  level: string;
  duration: string;
  price: number;
  currency: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  maxStudents: number;
  enrolledCount: number;
  tags: string[];
  prerequisites: string[];
  learningOutcomes: string[];
  createdAt: string;
  updatedAt: string;
}

// ─── Curriculum Module ───
export interface CurriculumModule {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  duration: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Cohort ───
// courseId is a Mongoose-populated ref
export interface Cohort {
  id: string;
  name: string;
  code: string;
  batch?: string;
  courseId: Populated<Course>;
  startDate: string;
  endDate: string;
  maxCapacity: number;
  students: string[];
  schedule: string;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled' | string;
  instructors: string[];
  createdAt: string;
  updatedAt: string;
}

// ─── Team ───
// cohortId/mentorId/leaderId are Mongoose-populated refs
export interface Team {
  id: string;
  name: string;
  teamCode: string;
  cohortId: Populated<Cohort>;
  leaderId?: Populated<User>;
  memberIds: string[];
  mentorId?: Populated<User>;
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

// A field that is either a raw ObjectId string, or the populated document (same key, Mongoose populate semantics)
export type Populated<T> = string | (Partial<T> & { id: string });

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

// ─── Enrollment ───
export interface Enrollment {
  id: string;
  studentId: Populated<User>;
  courseId: Populated<Course>;
  cohortId: Populated<Cohort>;
  teamId?: Populated<Team>;
  paymentId?: Populated<Payment>;
  reviewerId?: Populated<User>;
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

  reviewNotes?: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
}

// ─── Payment ───
export interface Payment {
  id: string;
  enrollmentId?: Populated<Enrollment>;
  studentId: Populated<User>;
  courseId?: Populated<Course>;
  amount: number;
  currency: string;
  paymentMethod: 'CHAPA' | 'TELEBIRR' | 'BANK_TRANSFER' | 'CASH';
  transactionReference?: string;
  paidAt?: string;
  verifiedBy?: Populated<User>;
  verificationDate?: string;
  notes?: string;
  status: 'PENDING' | 'VERIFIED' | 'FAILED';
  createdAt: string;
  updatedAt: string;
}

// ─── Session ───
export interface Session {
  id: string;
  cohortId: Populated<Cohort>;
  courseId?: Populated<Course>;
  title: string;
  description: string;
  type: string;
  scheduledAt: string;
  duration: number;
  meetLink: string;
  status: 'SCHEDULED' | 'LIVE' | 'COMPLETED' | 'CANCELLED';
  recordingUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Attendance ───
// studentId/sessionId are Mongoose-populated refs
export interface Attendance {
  id: string;
  sessionId: Populated<Session>;
  studentId: Populated<User>;
  enrollmentId?: Populated<Enrollment>;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  checkInTime?: string;
  remarks?: string;
  createdAt: string;
}

// ─── Assignment ───
// courseId/cohortId are Mongoose-populated refs
export interface Assignment {
  id: string;
  courseId: Populated<Course>;
  cohortId?: Populated<Cohort>;
  moduleId: string;
  title: string;
  description: string;
  type: string;
  dueDate: string;
  maxScore: number;
  status: 'DRAFT' | 'PUBLISHED' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
}

// ─── Submission ───
export interface Submission {
  id: string;
  assignmentId: string;
  assignmentTitle?: string;
  assignmentMaxScore?: number;
  studentId: string;
  studentName?: string;
  cohortId: string;
  repoUrl?: string;
  content?: string;
  notes?: string;
  submittedAt: string;
  points?: number;
  feedback?: string;
  gradedBy?: string;
  gradedByName?: string;
  gradedAt?: string;
  status: 'submitted' | 'graded' | 'late';
  createdAt?: string;
  updatedAt?: string;
}

// ─── Resource ───
export interface Resource {
  id: string;
  courseId: string;
  moduleId: string;
  title: string;
  description: string;
  type: 'VIDEO' | 'PDF' | 'DOCUMENT' | 'CODE' | 'LINK';
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
  targetScope: string;
  targetId?: string;
  authorId: string;
  author?: User;
  publishedAt?: string;
  expiresAt?: string;
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

// ─── Health Score ───
// studentId is a Mongoose-populated User ref
export interface HealthScore {
  id: string;
  studentId: Populated<User>;
  score: number;
  attendanceWeight: number;
  assignmentWeight: number;
  participationWeight: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  calculatedAt: string;
  createdAt: string;
}

// ─── Analytics ───
export interface AnalyticsSummary {
  totalStudents: number;
  totalInstructors: number;
  totalMentors: number;
  totalCourses: number;
  totalCohorts: number;
  activeEnrollments: number;
  completedEnrollments: number;
  totalRevenue: number;
  averageAttendance: number;
  averageHealthScore: number;
}

// ─── Audit Log ───
export interface AuditLog {
  id: string;
  userId: string;
  user?: User;
  action: string;
  entity: string;
  entityId: string;
  details: string;
  ipAddress: string;
  createdAt: string;
}

// ─── Certificate ───
// studentId/courseId/cohortId are Mongoose-populated refs
export interface Certificate {
  id: string;
  studentId: Populated<User>;
  courseId: Populated<Course>;
  cohortId: Populated<Cohort>;
  certificateNumber: string;
  issueDate: string;
  credentialUrl?: string;
  pdfUrl?: string;
  createdAt: string;
}

// ─── Setting ───
export interface SystemSetting {
  id: string;
  key: string;
  value: string;
  category: string;
  description: string;
  updatedAt: string;
}

// ─── Generic Responses ───
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
