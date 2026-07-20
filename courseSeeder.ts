import { CourseModel } from '@/modules/courses/models/Course';
import { CohortRepository } from '@/modules/cohorts/repositories/cohortRepository';
import { ensureCourseCohort } from '@/services/cohortProvisioning.service';
import { COURSE_SEEDS, withIds } from './courseCurriculumData';
import { CurriculumModel } from '@/modules/curriculum/models/Curriculum';
import { ModuleModel } from '@/modules/curriculum/models/Module';
import { LessonModel } from '@/modules/curriculum/models/Lesson';

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

    const finalCourseDoc = courseDoc || await CourseModel.findOne({ slug: course.slug });
    if (finalCourseDoc) {
      // Seed Curriculum Model
      let curriculum = await CurriculumModel.findOne({ courseId: finalCourseDoc._id });
      if (!curriculum) {
        curriculum = await CurriculumModel.create({
          courseId: finalCourseDoc._id,
          title: `${course.title} Curriculum`,
          description: `Official curriculum for ${course.title}`,
          order: 1,
        });
      }

      // Sync Modules and Lessons
      // 1. Delete existing lessons for this course's modules
      const oldModules = await ModuleModel.find({ courseId: finalCourseDoc._id });
      const oldModuleIds = oldModules.map((m: any) => m._id);
      await LessonModel.deleteMany({ moduleId: { $in: oldModuleIds } });
      await ModuleModel.deleteMany({ courseId: finalCourseDoc._id });

      // 2. Re-create modules and lessons
      for (let mIdx = 0; mIdx < modules.length; mIdx++) {
        const modSeed = modules[mIdx];
        const moduleDoc = await ModuleModel.create({
          courseId: finalCourseDoc._id,
          curriculumId: curriculum._id,
          title: modSeed.title,
          description: modSeed.description || modSeed.title,
          order: modSeed.order || (mIdx + 1),
        });

        const days = modSeed.lessons || (modSeed as any).days || [];
        for (let lIdx = 0; lIdx < days.length; lIdx++) {
          const day = days[lIdx];
          await LessonModel.create({
            moduleId: moduleDoc._id,
            title: day.title,
            description: day.description || day.title,
            lessonType: day.lessonType || 'TEXT',
            content: day.content || `Content for ${day.title}`,
            duration: day.duration || 30,
            durationMinutes: day.duration || 30,
            resources: day.resources || [],
            order: lIdx + 1,
            learningObjectives: day.learningObjectives || [],
            videoUrl: day.videoUrl || '',
            notesMarkdown: day.notesMarkdown || day.content || '',
            practiceActivities: day.practiceActivities || [],
            externalLinks: day.externalLinks || [],
            estimatedMinutes: day.estimatedMinutes || day.duration || 30,
            difficulty: day.difficulty || 'Intermediate',
            isPublished: day.isPublished !== false,
            isMandatory: day.isMandatory !== false,
          });
        }
      }
    }

    // Every course keeps one batch-wide cohort ready for registration.
    await ensureCourseCohort(cohortRepository, finalCourseDoc!.toJSON() as any);
  }
}

export default seedCourses;
