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
  ExternalFormRegistration,
} from '@/types';

/**
 * Two intake shapes: the full intake sections, or (fast-track) proof of a
 * completed NYDev Form registration via `externalForm` — the backend accepts
 * either, agreements are always required.
 */
export interface ApplyRegistrationPayload {
  courseId: string;
  externalForm?: ExternalFormRegistration;
  personalInfo?: RegistrationPersonalInfo;
  education?: RegistrationEducation;
  location?: RegistrationLocation;
  technicalReadiness?: RegistrationTechnicalReadiness;
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
