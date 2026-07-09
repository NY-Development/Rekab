import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { AuthService } from '../services/authService';
import { UserRepository } from '../../users/repositories/userRepository';
import { validateBody } from '../../../middlewares/validation';
import { requireAuthenticated, AuthenticatedRequest } from '../../../middlewares/auth';
import { SignupSchema, LoginSchema, ProfileUpdateSchema } from '../validators/authValidator';

const router = Router();
const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

router.post('/signup', validateBody(SignupSchema), (req, res, next) => authController.signup(req as AuthenticatedRequest, res, next));
router.post('/login', validateBody(LoginSchema), (req, res, next) => authController.login(req as AuthenticatedRequest, res, next));
router.get('/profile', requireAuthenticated, (req, res, next) => authController.getProfile(req, res, next));
router.put('/profile', requireAuthenticated, validateBody(ProfileUpdateSchema), (req, res, next) => authController.updateProfile(req, res, next));

export default router;
