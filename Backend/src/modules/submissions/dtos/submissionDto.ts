import { Submission } from '../../../types';

export interface SubmitAssignmentDto {
  assignmentId: string;
  cohortId: string;
  repoUrl?: string;
  notes?: string;
}

export interface GradeSubmissionDto {
  points: number;
  feedback: string;
}

export interface SubmissionResponseDto {
  submission: Submission;
}
