import { User, Course, Cohort } from '../../../types';

export interface CertificateDto {
  id: string;
  studentId: string;
  courseId: string;
  cohortId: string;
  certificateNumber: string;
  issueDate: string;
  credentialUrl?: string;
  pdfUrl?: string;
  metadata?: any;
  student?: Partial<User>;
  course?: Partial<Course>;
  cohort?: Partial<Cohort>;
  createdAt: string;
  updatedAt: string;
}

export type IssueCertificateDto = {
  studentId: string;
  courseId: string;
  cohortId: string;
  credentialUrl?: string;
  pdfUrl?: string;
  metadata?: any;
};
