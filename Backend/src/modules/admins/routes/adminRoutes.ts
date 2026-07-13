import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { AdminService } from '../services/adminService';
import { AdminRepository } from '../repositories/adminRepository';
import { UserRepository } from '../../users/repositories/userRepository';
import { requireAuthenticated, requireAdmin } from '../../../middlewares/auth';

const router = Router();
const adminRepository = new AdminRepository();
const userRepository = new UserRepository();
const adminService = new AdminService(adminRepository, userRepository);
const adminController = new AdminController(adminService);

router.get('/users', requireAuthenticated, requireAdmin, (req, res, next) => adminController.listUsers(req, res, next));
router.get('/users/:id', requireAuthenticated, requireAdmin, (req, res, next) => adminController.getUserById(req, res, next));
router.post('/users', requireAuthenticated, requireAdmin, (req, res, next) => adminController.createUser(req, res, next));
router.put('/users/:id', requireAuthenticated, requireAdmin, (req, res, next) => adminController.updateUser(req, res, next));
router.delete('/users/:id', requireAuthenticated, requireAdmin, (req, res, next) => adminController.deleteUser(req, res, next));
router.get('/logs', requireAuthenticated, requireAdmin, (req, res, next) => adminController.getSystemLogs(req, res, next));
router.get('/stats', requireAuthenticated, requireAdmin, (req, res, next) => adminController.getDashboardStats(req, res, next));

export default router;
