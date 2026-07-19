import { Router } from 'express';
import { CohortController } from '../controllers/cohortController';
import { CohortService } from '../services/cohortService';
import { CohortRepository } from '../repositories/cohortRepository';
import { TeamRepository } from '../../teams/repositories/teamRepository';
import { requireAuthenticated, authorize } from '../../../middlewares/auth';
import { validateBody } from '../../../middlewares/validation';
import { CohortSchema } from '../validators/cohortValidator';

const router = Router();
const cohortRepository = new CohortRepository();
const teamRepository = new TeamRepository();
const cohortService = new CohortService(cohortRepository, teamRepository);
const cohortController = new CohortController(cohortService);

const requireCohortEditor = authorize('INSTRUCTOR', 'ADMIN', 'SUPER_ADMIN');

router.get('/', requireAuthenticated, (req, res, next) => cohortController.listCohorts(req, res, next));
// Team-formation roster (students + teams) — must precede '/:id'.
router.get('/:id/roster', requireAuthenticated, requireCohortEditor, (req, res, next) => cohortController.getRoster(req, res, next));
router.get('/:id', requireAuthenticated, (req, res, next) => cohortController.getCohortDetails(req, res, next));
// Cohort creation is an administrative act; instructors work within assigned cohorts.
router.post('/', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN'), validateBody(CohortSchema), (req, res, next) => cohortController.createCohort(req, res, next));
router.post('/:cohortId/enroll', requireAuthenticated, (req, res, next) => cohortController.enrollInCohort(req, res, next));
// Instructors may update only their assigned cohorts (ownership asserted in the controller).
router.put('/:id/status', requireAuthenticated, requireCohortEditor, (req, res, next) => cohortController.updateCohortStatus(req, res, next));
router.put('/:id', requireAuthenticated, requireCohortEditor, (req, res, next) => cohortController.updateCohort(req, res, next));
router.delete('/:id', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN'), (req, res, next) => cohortController.deleteCohort(req, res, next));

export default router;
