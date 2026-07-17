import InstructorProfileModel from '../modules/instructors/models/InstructorProfile';
import MentorProfileModel from '../modules/mentors/models/MentorProfile';
import TeamModel from '../modules/teams/models/Team';
import CohortModel from '../modules/cohorts/models/Cohort';
import SessionModel from '../modules/sessions/models/Session';
import EnrollmentModel from '../modules/enrollments/models/Enrollment';
import { isMongoConnected } from '../configs/db';
import { AppError } from '../middlewares/errorHandler';
import { isAdminRole, normalizeRole } from '../configs/permissions';
import { User } from '../types';

const InstructorM = InstructorProfileModel as any;
const MentorM = MentorProfileModel as any;
const TeamM = TeamModel as any;
const CohortM = CohortModel as any;
const SessionM = SessionModel as any;
const EnrollmentM = EnrollmentModel as any;

const ACTIVE_ENROLLMENT_STATUSES = ['ACTIVE', 'COMPLETED', 'active', 'enrolled', 'completed'];

export interface ContentScope {
  courseIds: string[];
  cohortIds: string[];
  teamIds: string[];
}

const EMPTY_SCOPE: ContentScope = { courseIds: [], cohortIds: [], teamIds: [] };

function toIds(values: unknown[]): string[] {
  return [...new Set(values.map((v: any) => v?.toString()).filter(Boolean))] as string[];
}

/**
 * Ownership scope for an instructor: the courses and cohorts explicitly
 * assigned to them on their InstructorProfile.
 */
export async function getInstructorScope(userId: string): Promise<ContentScope> {
  if (!isMongoConnected) return EMPTY_SCOPE;
  const profile = await InstructorM.findOne({ userId }).select('assignedCourses assignedCohorts').lean();
  const cohortIds = toIds(profile?.assignedCohorts || []);
  const courseIds = toIds(profile?.assignedCourses || []);

  // Cohorts where this user is listed as an assigned instructor (set from
  // cohort management) also count — this is how admins actually assign
  // instructors to cohorts in practice, independent of the InstructorProfile.
  const assignedCohorts = await CohortM.find({
    $or: [{ instructors: userId }, { instructorIds: userId }],
  }).select('courseId').lean();
  cohortIds.push(...toIds(assignedCohorts.map((c: any) => c._id)));
  courseIds.push(...toIds(assignedCohorts.map((c: any) => c.courseId)));

  // Cohorts imply their parent course for content that is course-scoped.
  if (cohortIds.length > 0) {
    const cohorts = await CohortM.find({ _id: { $in: cohortIds } }).select('courseId').lean();
    courseIds.push(...toIds(cohorts.map((c: any) => c.courseId)));
  }

  return { courseIds: [...new Set(courseIds)], cohortIds: [...new Set(cohortIds)], teamIds: [] };
}

/**
 * Ownership scope for a mentor: assigned teams (and the cohorts/courses those
 * teams belong to) plus explicitly assigned students.
 */
export async function getMentorScope(userId: string): Promise<ContentScope & { studentIds: string[] }> {
  if (!isMongoConnected) return { ...EMPTY_SCOPE, studentIds: [] };
  const profile = await MentorM.findOne({ userId }).select('assignedTeams assignedStudents').lean();
  const teamIds = toIds(profile?.assignedTeams || []);
  const studentIds = toIds(profile?.assignedStudents || []);

  // Teams where this mentor is set directly also count as assigned.
  const directTeams = await TeamM.find({ mentorId: userId }).select('_id cohortId').lean();
  teamIds.push(...toIds(directTeams.map((t: any) => t._id)));

  let cohortIds: string[] = toIds(directTeams.map((t: any) => t.cohortId));
  if (teamIds.length > 0) {
    const teams = await TeamM.find({ _id: { $in: teamIds } }).select('cohortId').lean();
    cohortIds.push(...toIds(teams.map((t: any) => t.cohortId)));
  }
  cohortIds = [...new Set(cohortIds)];

  let courseIds: string[] = [];
  if (cohortIds.length > 0) {
    const cohorts = await CohortM.find({ _id: { $in: cohortIds } }).select('courseId').lean();
    courseIds = toIds(cohorts.map((c: any) => c.courseId));
  }

  return { courseIds, cohortIds, teamIds: [...new Set(teamIds)], studentIds };
}

/** Access scope for a student: cohorts/courses of their granted enrollments. */
export async function getStudentScope(userId: string): Promise<ContentScope> {
  if (!isMongoConnected) return EMPTY_SCOPE;
  const docs = await EnrollmentM.find({ studentId: userId, status: { $in: ACTIVE_ENROLLMENT_STATUSES } })
    .select('courseId cohortId teamId')
    .lean();
  return {
    courseIds: toIds(docs.map((d: any) => d.courseId)),
    cohortIds: toIds(docs.map((d: any) => d.cohortId)),
    teamIds: toIds(docs.map((d: any) => d.teamId)),
  };
}

/**
 * Unified content scope used by list endpoints.
 * Returns null for admins, meaning "no scoping — see everything".
 */
export async function getContentScope(user: User): Promise<ContentScope | null> {
  const role = normalizeRole(user.role);
  if (isAdminRole(role)) return null;
  if (role === 'INSTRUCTOR') return getInstructorScope(user.id);
  if (role === 'MENTOR') return getMentorScope(user.id);
  return getStudentScope(user.id);
}

// ─── Ownership assertions (403 unless admin or record is in scope) ───

export async function assertCourseAccess(user: User, courseId: string | undefined): Promise<void> {
  if (isAdminRole(user.role)) return;
  if (!courseId) throw new AppError('You do not have permission to perform this action.', 403);
  const scope = await getContentScope(user);
  if (!scope || !scope.courseIds.includes(courseId.toString())) {
    throw new AppError('You are not assigned to this course.', 403);
  }
}

export async function assertCohortAccess(user: User, cohortId: string | undefined): Promise<void> {
  if (isAdminRole(user.role)) return;
  if (!cohortId) throw new AppError('You do not have permission to perform this action.', 403);
  const scope = await getContentScope(user);
  if (!scope || !scope.cohortIds.includes(cohortId.toString())) {
    throw new AppError('You are not assigned to this cohort.', 403);
  }
}

export async function assertTeamAccess(user: User, teamId: string | undefined): Promise<void> {
  if (isAdminRole(user.role)) return;
  if (!teamId) throw new AppError('You do not have permission to perform this action.', 403);
  const role = normalizeRole(user.role);

  if (role === 'MENTOR') {
    const scope = await getMentorScope(user.id);
    if (scope.teamIds.includes(teamId.toString())) return;
    throw new AppError('You are not assigned to this team.', 403);
  }

  if (role === 'INSTRUCTOR') {
    // Instructors manage teams that belong to their assigned cohorts.
    const team = await TeamM.findById(teamId).select('cohortId').lean();
    if (team?.cohortId) {
      const scope = await getInstructorScope(user.id);
      if (scope.cohortIds.includes(team.cohortId.toString())) return;
    }
    throw new AppError('This team is not in one of your assigned cohorts.', 403);
  }

  throw new AppError('You do not have permission to manage teams.', 403);
}

/** Asserts the session's cohort is in the user's scope (for attendance etc.). */
export async function assertSessionCohortAccess(user: User, sessionId: string | undefined): Promise<void> {
  if (isAdminRole(user.role)) return;
  if (!sessionId) throw new AppError('You do not have permission to perform this action.', 403);
  const session = await SessionM.findById(sessionId).select('cohortId').lean();
  if (!session) throw new AppError('Session not found', 404);
  await assertCohortAccess(user, session.cohortId?.toString());
}

/** Extracts a plain id from a value that may be a raw id or a populated document. */
export function refId(value: unknown): string | undefined {
  if (!value) return undefined;
  if (typeof value === 'string') return value;
  const candidate = value as { id?: string; _id?: unknown };
  if (candidate.id) return candidate.id.toString();
  if (candidate._id) return String(candidate._id);
  return String(value);
}
