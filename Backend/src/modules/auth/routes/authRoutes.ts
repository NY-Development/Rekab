import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { AuthService } from '../services/authService';
import { UserRepository } from '../../users/repositories/userRepository';
import { StudentRepository } from '../../students/repositories/studentRepository';
import { validateBody } from '../../../middlewares/validation';
import { requireAuthenticated, AuthenticatedRequest } from '../../../middlewares/auth';
import { authRateLimiter } from '../../../middlewares/rateLimiter';
import { SignupSchema, LoginSchema, ProfileUpdateSchema } from '../validators/authValidator';

const router = Router();
const userRepository = new UserRepository();
const studentRepository = new StudentRepository();
const authService = new AuthService(userRepository, studentRepository);
const authController = new AuthController(authService);

router.post('/signup', authRateLimiter, validateBody(SignupSchema), (req, res, next) => authController.signup(req as AuthenticatedRequest, res, next));
router.post('/login', authRateLimiter, validateBody(LoginSchema), (req, res, next) => authController.login(req as AuthenticatedRequest, res, next));
router.post('/refresh-token', authRateLimiter, (req, res, next) => authController.refresh(req as AuthenticatedRequest, res, next));
router.post('/logout', requireAuthenticated, (req, res, next) => authController.logout(req as AuthenticatedRequest, res, next));
router.get('/github', (req, res, next) => authController.githubRedirect(req, res, next));
router.get('/github/callback', (req, res, next) => authController.githubCallback(req, res, next));
router.get('/profile', requireAuthenticated, (req, res, next) => authController.getProfile(req, res, next));
router.put('/profile', requireAuthenticated, validateBody(ProfileUpdateSchema), (req, res, next) => authController.updateProfile(req, res, next));

export default router;
