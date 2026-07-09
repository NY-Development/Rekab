import { SubmissionRepository } from '../repositories/submissionRepository';
import { Submission } from '../../../types';
import { AppError } from '../../../middlewares/errorHandler';
import { DBStore } from '../../../services/dbStore';

export class SubmissionService {
  constructor(private submissionRepository: SubmissionRepository) {}

  async submitAssignment(
    userId: string,
    userName: string,
    submissionData: { assignmentId: string; cohortId: string; repoUrl?: string; notes?: string }
  ): Promise<Submission> {
    const { assignmentId, cohortId, repoUrl, notes } = submissionData;

    const cohort = await DBStore.getCohortById(cohortId);
    if (!cohort) {
      throw new AppError('Cohort not found', 404);
    }

    if (!cohort.students.includes(userId)) {
      throw new AppError('You are not enrolled in this cohort', 403);
    }

    const course = await DBStore.getCourseById(cohort.courseId);
    if (!course) {
      throw new AppError('Associated course not found', 404);
    }

    let assignmentExists = false;
    let targetAssignment: any = null;
    for (const module of course.modules || []) {
      const found = module.assignments?.find((a: any) => a.id === assignmentId);
      if (found) {
        assignmentExists = true;
        targetAssignment = found;
        break;
      }
    }

    if (!assignmentExists) {
      throw new AppError('Assignment not found in this curriculum', 404);
    }

    const dueDate = new Date(targetAssignment.dueDate);
    const today = new Date();
    const status = today > dueDate ? 'late' : 'submitted';

    const submission = await this.submissionRepository.create({
      assignmentId,
      studentId: userId,
      cohortId,
      repoUrl,
      notes,
      status,
      submittedAt: new Date().toISOString()
    });

    // Update progressPercentage on enrollment
    const studentSubmissions = await this.submissionRepository.findByStudent(userId);
    const cohortSubmissions = studentSubmissions.filter(s => s.cohortId === cohortId);

    let totalAssignments = 0;
    course.modules?.forEach(m => {
      totalAssignments += m.assignments?.length ?? 0;
    });

    if (totalAssignments > 0) {
      const progress = Math.round((cohortSubmissions.length / totalAssignments) * 100);
      await DBStore.updateEnrollmentProgress(userId, cohortId, Math.min(progress, 100));
    }

    await DBStore.logActivity(
      userId,
      userName,
      'ASSIGNMENT_SUBMIT',
      `Submitted assignment "${targetAssignment.title}" for cohort "${cohort.name}"`
    );

    return submission;
  }

  async listSubmissions(filters: { cohortId?: string; studentId?: string; assignmentId?: string }): Promise<any[]> {
    let submissions = await this.submissionRepository.findAll();

    if (filters.cohortId) {
      submissions = submissions.filter(s => s.cohortId === filters.cohortId);
    }
    if (filters.studentId) {
      submissions = submissions.filter(s => s.studentId === filters.studentId);
    }
    if (filters.assignmentId) {
      submissions = submissions.filter(s => s.assignmentId === filters.assignmentId);
    }

    const users = await DBStore.getUsers();
    const userMap = new Map(users.map(u => [u.id, u.name]));

    return submissions.map(s => ({
      ...s,
      studentName: userMap.get(s.studentId) || 'Unknown Student',
      gradedByName: s.gradedBy ? userMap.get(s.gradedBy) : undefined
    }));
  }

  async gradeSubmission(
    userId: string,
    userName: string,
    id: string,
    gradeData: { points: number; feedback: string }
  ): Promise<Submission> {
    const sub = await this.submissionRepository.findById(id);
    if (!sub) {
      throw new AppError('Submission not found', 404);
    }

    const updated = await this.submissionRepository.grade(id, {
      points: gradeData.points,
      feedback: gradeData.feedback,
      gradedBy: userId
    });

    if (!updated) {
      throw new AppError('Failed to update grade', 500);
    }

    const student = await DBStore.getUserById(sub.studentId);
    const studentName = student ? student.name : 'Student';

    await DBStore.logActivity(
      userId,
      userName,
      'ASSIGNMENT_GRADE',
      `Graded submission ${id} for student "${studentName}" with ${gradeData.points} points`
    );

    return updated;
  }
}
