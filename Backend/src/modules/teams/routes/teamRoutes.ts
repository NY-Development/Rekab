import { Router } from 'express';
import { TeamController } from '../controllers/teamController';
import { TeamService } from '../services/teamService';
import { TeamRepository } from '../repositories/teamRepository';
import { requireAuthenticated, authorize } from '../../../middlewares/auth';
import { validateBody } from '../../../middlewares/validation';
import { CreateTeamSchema, UpdateTeamSchema } from '../validators/teamValidator';

const router = Router();
const teamRepository = new TeamRepository();
const teamService = new TeamService(teamRepository);
const teamController = new TeamController(teamService);

// Team routes
router.get('/', requireAuthenticated, (req, res, next) => teamController.listTeams(req, res, next));
router.get('/:id', requireAuthenticated, (req, res, next) => teamController.getTeamById(req, res, next));
router.post('/', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR'), validateBody(CreateTeamSchema), (req, res, next) => teamController.createTeam(req, res, next));
router.put('/:id', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR', 'MENTOR'), validateBody(UpdateTeamSchema), (req, res, next) => teamController.updateTeam(req, res, next));
router.delete('/:id', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN'), (req, res, next) => teamController.deleteTeam(req, res, next));

// Team membership routes
router.post('/:id/members', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR', 'MENTOR'), (req, res, next) => teamController.addMember(req, res, next));
router.delete('/:id/members', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR', 'MENTOR'), (req, res, next) => teamController.removeMember(req, res, next));

export default router;
