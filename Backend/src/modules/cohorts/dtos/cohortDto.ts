import { Cohort, Enrollment } from '../../../types';

export interface CreateCohortDto {
  courseId: string;
  name: string;
  code: string;
  startDate: string;
  endDate: string;
  maxCapacity: number;
  instructors: string[];
  schedule: string;
}

export interface CohortDetailsResponseDto {
  cohort: Cohort;
}

export interface EnrollmentResponseDto {
  enrollment: Enrollment;
}
