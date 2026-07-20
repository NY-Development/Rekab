import { useParams } from 'react-router-dom';
import { useCourse, useCourseModules } from '@/hooks/useCourses';
import { useCohorts } from '@/hooks/useCohorts';
import { useEnrollments } from '@/hooks/useEnrollments';
import { useAuthStore } from '@/store/auth.store';
import PublicCourseView from '../components/PublicCourseView';
import StudentLearningHub from '../components/StudentLearningHub';
import type { Enrollment } from '@/types';

/**
 * Course Detail — Mode-switching controller.
 *
 * • Public users / non-enrolled students → PublicCourseView (marketing)
 * • Enrolled ACTIVE students             → StudentLearningHub (learning dashboard)
 */
export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // Fetch the course
  const { data: courseRes, isLoading, error } = useCourse(id || '');
  const { data: modulesRes, isLoading: isModulesLoading } = useCourseModules(id || '');
  const { data: cohortsRes, isLoading: isCohortsLoading } = useCohorts({ courseId: id, limit: 5 });

  // Check enrollments for enrolled student detection
  const { data: enrollmentsRes } = useEnrollments();

  const course = courseRes?.data;
  const modules = modulesRes?.data?.modules || [];
  const cohorts = cohortsRes?.data?.docs || [];
  const enrollments: Enrollment[] = enrollmentsRes?.data || [];

  // Find an active enrollment for this course
  const activeEnrollment = enrollments.find((e) => {
    const courseRef = e.courseId;
    const enrolledCourseId = typeof courseRef === 'string' ? courseRef : courseRef?.id;
    return enrolledCourseId === id && (e.status === 'ACTIVE' || e.status === 'COMPLETED');
  });

  const isEnrolledActive = isAuthenticated && !!activeEnrollment;

  // ─── Loading & Error ───
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="bg-red-50 text-red-800 dark:bg-red-950/30 dark:text-red-300 p-4 rounded-md text-sm">
          Failed to load course details. Please try again.
        </div>
      </div>
    );
  }

  // ─── Mode Switch ───
  if (isEnrolledActive && activeEnrollment) {
    return <StudentLearningHub course={course} enrollment={activeEnrollment} />;
  }

  return (
    <PublicCourseView
      course={course}
      modules={modules}
      isModulesLoading={isModulesLoading}
      cohorts={cohorts}
      isCohortsLoading={isCohortsLoading}
    />
  );
}
