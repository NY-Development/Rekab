import { SubmissionRepository } from '../repositories/submissionRepository';
import { AssignmentRepository } from '../../assignments/repositories/assignmentRepository';
import { EnrollmentRepository } from '../../enrollments/repositories/enrollmentRepository';
import { Submission } from '../../../types';
import { AppError } from '../../../middlewares/errorHandler';
import { DBStore } from '../../../services/dbStore';

const ACTIVE_STATUSES = ['ACTIVE', 'COMPLETED', 'active', 'enrolled', 'completed'];

export class SubmissionService {
  constructor(
    private submissionRepository: SubmissionRepository,
    private assignmentRepository: AssignmentRepository,
    private enrollmentRepository: EnrollmentRepository
  ) {}

  async submitAssignment(
    userId: string,
    userName: string,
    submissionData: { assignmentId: string; repoUrl?: string; content?: string; notes?: string }
  ): Promise<Submission> {
    const { assignmentId, repoUrl, content, notes } = submissionData;

    const assignment = await this.assignmentRepository.findById(assignmentId);
    if (!assignment) {
      throw new AppError('Assignment not found', 404);
    }

    const courseId = (assignment.courseId as any)?.id || assignment.courseId;
    const cohortId = (assignment.cohortId as any)?.id || assignment.cohortId;

    const enrollment = await this.enrollmentRepository.findByStudentAndCourse(userId, courseId as string);
    if (!enrollment || !ACTIVE_STATUSES.includes(enrollment.status)) {
      throw new AppError('You do not have course access for this assignment yet', 403);
    }

    const dueDate = new Date(assignment.dueDate);
    const status = new Date() > dueDate ? 'late' : 'submitted';

    const submission = await this.submissionRepository.create({
      assignmentId,
      studentId: userId,
      cohortId: cohortId as string,
      repoUrl,
      content,
      notes,
      status,
      submittedAt: new Date().toISOString()
    });

    // Update progressPercentage on the student's enrollment
    const cohortAssignments = await this.assignmentRepository.findByCohortId(cohortId as string);
    const studentSubmissions = await this.submissionRepository.findByStudent(userId);
    const cohortSubmissions = studentSubmissions.filter(s => s.cohortId === cohortId);

    if (cohortAssignments.length > 0) {
      const progress = Math.round((cohortSubmissions.length / cohortAssignments.length) * 100);
      await this.enrollmentRepository.update(enrollment.id, { progressPercentage: Math.min(progress, 100) });
    }

    await DBStore.logActivity(
      userId,
      userName,
      'ASSIGNMENT_SUBMIT',
      `Submitted assignment "${assignment.title}"`
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
