import { CohortRepository } from '../modules/cohorts/repositories/cohortRepository';
import { Course, Cohort } from '../types';

/**
 * The active enrollment batch. A cohort is the entire student body for a course
 * within one batch (e.g. every student taking Mobile in Summer 2026) — exactly
 * one cohort per course per batch, holding all its students. Teams are the
 * small 3–6 person project groups that live *inside* a cohort.
 */
export const CURRENT_BATCH = 'Summer 2026';

/** Large ceiling so a batch cohort effectively holds the whole course intake. */
const COHORT_CAPACITY = 1000;

function batchCode(batch: string): string {
  return batch.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
}

function buildCohortPayload(course: Course, batch: string): Omit<Cohort, 'id'> {
  const now = new Date();
  const endDate = new Date();
  endDate.setDate(now.getDate() + (course.durationWeeks ? course.durationWeeks * 7 : 84));

  const courseCodeClean = (course.code || course.title.substring(0, 4)).replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

  return {
    courseId: course.id as any,
    name: `${course.title} — ${batch}`,
    code: `${courseCodeClean}-${batchCode(batch)}`,
    batch,
    startDate: now.toISOString(),
    endDate: endDate.toISOString(),
    enrollmentStart: now.toISOString(),
    enrollmentEnd: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    capacity: COHORT_CAPACITY,
    maxCapacity: COHORT_CAPACITY,
    enrolledStudents: [],
    students: [],
    instructorIds: [],
    instructors: [],
    mentorIds: [],
    schedule: 'Flexible Online Schedule',
    status: 'active' as any,
  };
}

/**
 * Ensures exactly one cohort exists for the course's current batch, creating it
 * if missing. Legacy per-course cohorts (created before the batch model) are
 * adopted as the batch cohort so no student data is orphaned.
 */
export async function ensureCourseCohort(
  cohortRepository: CohortRepository,
  course: Course,
  batch: string = CURRENT_BATCH
): Promise<Cohort> {
  const { docs: existing } = await cohortRepository.findPaginated({ page: 1, limit: 100, courseId: course.id });

  const batchCohort = existing.find((c) => (c.batch || '').toLowerCase() === batch.toLowerCase());
  if (batchCohort) return batchCohort;

  // Adopt a legacy (batch-less) cohort as this batch's cohort if one exists.
  const legacy = existing.find((c) => !c.batch);
  if (legacy) {
    const updated = await cohortRepository.update(legacy.id, {
      batch,
      name: `${course.title} — ${batch}`,
      maxCapacity: COHORT_CAPACITY,
      capacity: COHORT_CAPACITY,
      status: 'active' as any,
    });
    return updated || legacy;
  }

  return cohortRepository.create(buildCohortPayload(course, batch));
}
