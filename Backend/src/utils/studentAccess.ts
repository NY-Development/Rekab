import EnrollmentModel from '../modules/enrollments/models/Enrollment';
import { isMongoConnected } from '../configs/db';

const EnrollmentM = EnrollmentModel as any;

const ACTIVE_STATUSES = ['ACTIVE', 'COMPLETED', 'active', 'enrolled', 'completed'];

export interface StudentAccessScope {
  courseIds: string[];
  cohortIds: string[];
}

/**
 * Returns the course/cohort IDs a student currently has approved access to
 * (i.e. their registration has reached ACTIVE / COMPLETED). Used to gate
 * course-scoped resources (assignments, sessions, resources, announcements)
 * so pending/rejected students cannot see content for courses they
 * haven't been granted access to yet.
 */
export async function getStudentAccessScope(studentId: string): Promise<StudentAccessScope> {
  if (!isMongoConnected) {
    return { courseIds: [], cohortIds: [] };
  }

  const docs = await EnrollmentM.find({
    studentId,
    status: { $in: ACTIVE_STATUSES },
  }).select('courseId cohortId').lean();

  const courseIds = [...new Set(docs.map((d: any) => d.courseId?.toString()).filter(Boolean))] as string[];
  const cohortIds = [...new Set(docs.map((d: any) => d.cohortId?.toString()).filter(Boolean))] as string[];

  return { courseIds, cohortIds };
}
