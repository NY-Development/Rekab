import api from './axios';
import type {
  Enrollment,
  PaginatedResponse,
  ApiResponse,
  RegistrationPersonalInfo,
  RegistrationEducation,
  RegistrationLocation,
  RegistrationTechnicalReadiness,
  RegistrationAgreements,
} from '@/types';

export interface ApplyRegistrationPayload {
  courseId: string;
  personalInfo: RegistrationPersonalInfo;
  education: RegistrationEducation;
  location: RegistrationLocation;
  technicalReadiness: RegistrationTechnicalReadiness;
  interests: string[];
  agreements: RegistrationAgreements;
}

export const enrollmentsApi = {
  getMyEnrollments: () =>
    api.get<ApiResponse<Enrollment[]>>('/enrollments/me'),

  apply: (data: ApplyRegistrationPayload) =>
    api.post<ApiResponse<Enrollment>>('/enrollments/apply', data),

  getById: (id: string) =>
    api.get<ApiResponse<Enrollment>>(`/enrollments/${id}`),
};

export type { PaginatedResponse };
