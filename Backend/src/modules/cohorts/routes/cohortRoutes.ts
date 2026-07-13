import { Router } from 'express';
import { CohortController } from '../controllers/cohortController';
import { CohortService } from '../services/cohortService';
import { CohortRepository } from '../repositories/cohortRepository';
import { requireAuthenticated, authorize } from '../../../middlewares/auth';
import { validateBody } from '../../../middlewares/validation';
import { CohortSchema } from '../validators/cohortValidator';

const router = Router();
const cohortRepository = new CohortRepository();
const cohortService = new CohortService(cohortRepository);
const cohortController = new CohortController(cohortService);

const requireStaff = authorize('INSTRUCTOR', 'MENTOR', 'ADMIN', 'SUPER_ADMIN');

router.get('/', requireAuthenticated, (req, res, next) => cohortController.listCohorts(req, res, next));
router.get('/:id', requireAuthenticated, (req, res, next) => cohortController.getCohortDetails(req, res, next));
router.post('/', requireStaff, validateBody(CohortSchema), (req, res, next) => cohortController.createCohort(req, res, next));
router.post('/:cohortId/enroll', requireAuthenticated, (req, res, next) => cohortController.enrollInCohort(req, res, next));
router.put('/:id/status', requireStaff, (req, res, next) => cohortController.updateCohortStatus(req, res, next));
router.put('/:id', requireStaff, (req, res, next) => cohortController.updateCohort(req, res, next));
router.delete('/:id', authorize('ADMIN', 'SUPER_ADMIN'), (req, res, next) => cohortController.deleteCohort(req, res, next));

export default router;
