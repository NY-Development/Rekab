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
  createdAt: string;
  updatedAt: string;
}

// ─── Cohort ───
export interface Cohort {
  id: string;
  name: string;
  code: string;
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

// ─── Enrollment ───
export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  cohortId: string;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'DROPPED' | 'SUSPENDED';
  enrolledAt: string;
  completedAt?: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Payment ───
export interface Payment {
  id: string;
  enrollmentId: string;
  studentId: string;
  amount: number;
  currency: string;
  transactionReference: string;
  paymentMethod: string;
  status: 'PENDING' | 'VERIFIED' | 'FAILED' | 'REFUNDED';
  verifiedAt?: string;
  verificationData?: Record<string, unknown>;
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
  type: 'LECTURE' | 'LAB' | 'WORKSHOP' | 'STANDUP' | 'REVIEW' | 'OTHER';
  meetLink: string;
  scheduledAt: string;
  duration: number;
  status: 'SCHEDULED' | 'LIVE' | 'COMPLETED' | 'CANCELLED';
  recordingUrl?: string;
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
  dueDate: string;
  maxScore: number;
  type: 'INDIVIDUAL' | 'TEAM' | 'PROJECT';
  status: 'DRAFT' | 'PUBLISHED' | 'CLOSED';
  submissionType: 'FILE' | 'LINK' | 'TEXT';
  createdAt: string;
  updatedAt: string;
}

// ─── Submission ───
export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  content: string;
  fileUrl?: string;
  linkUrl?: string;
  score?: number;
  feedback?: string;
  status: 'SUBMITTED' | 'GRADED' | 'RETURNED' | 'LATE';
  submittedAt: string;
  gradedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Resource ───
export interface Resource {
  id: string;
  title: string;
  description: string;
  courseId: string;
  moduleId?: string;
  type: 'PDF' | 'VIDEO' | 'LINK' | 'DOCUMENT' | 'CODE' | 'OTHER';
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
export interface Team {
  id: string;
  name: string;
  courseId: string;
  cohortId: string;
  leaderId?: string;
  memberIds: string[];
  mentorId?: string;
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
