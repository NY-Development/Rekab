import { Router } from 'express';

// Domain-driven module routes
import authRoutes from '../modules/auth/routes/authRoutes';
import courseRoutes from '../modules/courses/routes/courseRoutes';
import cohortRoutes from '../modules/cohorts/routes/cohortRoutes';
import submissionRoutes from '../modules/submissions/routes/submissionRoutes';
import adminRoutes from '../modules/admins/routes/adminRoutes';

// New module routes
import studentRoutes from '../modules/students/routes/studentRoutes';
import instructorRoutes from '../modules/instructors/routes/instructorRoutes';
import mentorRoutes from '../modules/mentors/routes/mentorRoutes';
import curriculumRoutes from '../modules/curriculum/routes/curriculumRoutes';
import teamRoutes from '../modules/teams/routes/teamRoutes';
import enrollmentRoutes from '../modules/enrollments/routes/enrollmentRoutes';
import paymentRoutes from '../modules/payments/routes/paymentRoutes';
import sessionRoutes from '../modules/sessions/routes/sessionRoutes';
import attendanceRoutes from '../modules/attendance/routes/attendanceRoutes';
import assignmentRoutes from '../modules/assignments/routes/assignmentRoutes';
import resourceRoutes from '../modules/resources/routes/resourceRoutes';
import announcementRoutes from '../modules/announcements/routes/announcementRoutes';
import notificationRoutes from '../modules/notifications/routes/notificationRoutes';
import healthScoreRoutes from '../modules/healthScores/routes/healthScoreRoutes';
import analyticsRoutes from '../modules/analytics/routes/analyticsRoutes';
import auditLogRoutes from '../modules/auditLogs/routes/auditLogRoutes';
import certificateRoutes from '../modules/certificates/routes/certificateRoutes';
import settingRoutes from '../modules/settings/routes/settingRoutes';

const router = Router();

// Mount module-specific routes
router.use('/auth', authRoutes);
router.use('/courses', courseRoutes);
router.use('/cohorts', cohortRoutes);
router.use('/submissions', submissionRoutes);
router.use('/admin', adminRoutes);

// New module routes
router.use('/students', studentRoutes);
router.use('/instructors', instructorRoutes);
router.use('/mentors', mentorRoutes);
router.use('/curriculum', curriculumRoutes);
router.use('/teams', teamRoutes);
router.use('/enrollments', enrollmentRoutes);
router.use('/payments', paymentRoutes);
router.use('/sessions', sessionRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/assignments', assignmentRoutes);
router.use('/resources', resourceRoutes);
router.use('/announcements', announcementRoutes);
router.use('/notifications', notificationRoutes);
router.use('/health-scores', healthScoreRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/audit-logs', auditLogRoutes);
router.use('/certificates', certificateRoutes);
router.use('/settings', settingRoutes);

export default router;

