import { CohortRepository } from '../modules/cohorts/repositories/cohortRepository';
import { Course, Cohort } from '../types';

export const COHORTS_PER_COURSE = 4;
export const SEATS_PER_COHORT = 5;

function buildCohortPayload(course: Course, index: number): Omit<Cohort, 'id'> {
  const now = new Date();
  const endDate = new Date();
  endDate.setDate(now.getDate() + 84); // 12 weeks duration

  const courseCodeClean = (course.code || course.title.substring(0, 4)).replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  const randSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();

  return {
    courseId: course.id as any,
    name: `${course.title} - Cohort ${index}`,
    code: `${courseCodeClean}-C${index}-${randSuffix}`,
    startDate: now.toISOString(),
    endDate: endDate.toISOString(),
    enrollmentStart: now.toISOString(),
    enrollmentEnd: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    capacity: SEATS_PER_COHORT,
    maxCapacity: SEATS_PER_COHORT,
    enrolledStudents: [],
    students: [],
    instructorIds: [],
    instructors: [],
    mentorIds: [],
    schedule: 'Flexible Online Schedule',
    status: 'upcoming' as any,
  };
}

/**
 * Ensures a course has exactly COHORTS_PER_COURSE cohorts (creating whichever
 * are missing). Called both when a course is created and defensively before
 * enrollment, so courses created before this behavior existed self-heal.
 */
export async function ensureCourseCohorts(cohortRepository: CohortRepository, course: Course): Promise<Cohort[]> {
  const { docs: existing } = await cohortRepository.findPaginated({ page: 1, limit: 50, courseId: course.id });
  if (existing.length >= COHORTS_PER_COURSE) {
    return existing;
  }

  const created: Cohort[] = [];
  for (let i = existing.length + 1; i <= COHORTS_PER_COURSE; i++) {
    created.push(await cohortRepository.create(buildCohortPayload(course, i)));
  }

  return [...existing, ...created];
}
