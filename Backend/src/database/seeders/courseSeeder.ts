import { CourseModel } from '@/modules/courses/models/Course';
import { CohortRepository } from '@/modules/cohorts/repositories/cohortRepository';
import { ensureCourseCohorts } from '@/services/cohortProvisioning.service';
import { COURSE_SEEDS, withIds } from './courseCurriculumData';

const cohortRepository = new CohortRepository();

export async function seedCourses(): Promise<void> {
  for (const course of COURSE_SEEDS) {
    const existing = await CourseModel.findOne({ slug: course.slug });
    const modules = withIds(course.modules);

    const fields = {
      title: course.title,
      code: course.code,
      shortDescription: course.shortDescription,
      description: course.description,
      category: course.category,
      level: course.difficulty,
      language: 'English',
      durationWeeks: course.durationWeeks,
      skills: course.skills,
      learningOutcomes: course.learningOutcomes,
      prerequisites: course.prerequisites || [],
      price: course.price,
      currency: 'ETB',
      status: 'published',
      enrollmentEnabled: true,
      image: '/preview.png',
      thumbnail: '/preview.png',
      syllabusSummary: course.syllabusSummary,
      modules,
    };

    let courseDoc = existing;
    if (!existing) {
      courseDoc = await CourseModel.create({ slug: course.slug, ...fields });
      console.log(`Seeded course: ${course.title}`);
    } else {
      // Source-of-truth self-heal: keep seeded courses in sync with this file
      // (price, curriculum, description, etc.) on every boot.
      await CourseModel.updateOne({ _id: existing._id }, { $set: fields });
    }

    // Every course keeps exactly 4 cohorts (5 seats each) ready for registration.
    await ensureCourseCohorts(cohortRepository, courseDoc!.toJSON() as any);
  }
}

export default seedCourses;
