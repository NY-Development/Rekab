/* eslint-disable no-console */
/**
 * One-time migration: collapse the legacy per-course mini-cohorts (4 per
 * course, 5 seats each) into a single batch-wide cohort per course.
 *
 * A cohort now represents the entire student body for a course within a batch
 * (Summer 2026). Per course we adopt one existing cohort as the batch cohort
 * (moving any students into it) and delete the redundant extras. Aborts if any
 * team references a cohort that would be removed, to avoid orphaning teams.
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../configs/db';
import { CURRENT_BATCH } from '../services/cohortProvisioning.service';

async function main() {
  await connectDB();
  const db = mongoose.connection.db!;
  const cohortsColl = db.collection('cohorts');
  const teamsColl = db.collection('teams');
  const coursesColl = db.collection('courses');

  const courses = await coursesColl.find({}).toArray();
  console.log(`Found ${courses.length} courses.\n`);

  for (const course of courses) {
    const cohorts = await cohortsColl.find({ courseId: course._id }).toArray();
    if (cohorts.length === 0) continue;

    // Prefer an already-batched cohort as the keeper; else the first one.
    const keeper =
      cohorts.find((c) => (c.batch || '').toLowerCase() === CURRENT_BATCH.toLowerCase()) || cohorts[0];
    const removable = cohorts.filter((c) => !c._id.equals(keeper._id));

    // Guard: never delete a cohort that still has students or a team pointing at it.
    const removableIds = removable.map((c) => c._id.toString());
    const teamRefs = await teamsColl.countDocuments({
      cohortId: { $in: removable.map((c) => c._id) },
    });
    const studentsOnRemovable = removable.some((c) => (c.students || []).length > 0);
    if (teamRefs > 0 || studentsOnRemovable) {
      console.log(`  ! ${course.title}: skipping — extra cohorts have teams/students. Handle manually.`);
      continue;
    }

    // Merge any student ids from removable into the keeper (defensive; usually empty).
    const mergedStudents = Array.from(
      new Set([...(keeper.students || []), ...removable.flatMap((c) => c.students || [])].map(String))
    );

    await cohortsColl.updateOne(
      { _id: keeper._id },
      {
        $set: {
          batch: CURRENT_BATCH,
          name: `${course.title} — ${CURRENT_BATCH}`,
          students: mergedStudents,
          maxCapacity: 1000,
          capacity: 1000,
          status: 'active',
          updatedAt: new Date().toISOString(),
        },
      }
    );

    if (removable.length > 0) {
      await cohortsColl.deleteMany({ _id: { $in: removable.map((c) => c._id) } });
    }

    console.log(
      `  ✓ ${course.title}: kept ${keeper.code} as batch cohort, removed ${removable.length} extra(s)` +
        (removableIds.length ? ` [${removableIds.join(', ')}]` : '')
    );
  }

  const total = await cohortsColl.countDocuments();
  console.log(`\nDone. ${total} cohorts remain (expect one per course).`);
  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error('Migration failed:', err);
  await mongoose.disconnect();
  process.exit(1);
});
