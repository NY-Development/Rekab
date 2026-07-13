import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { AdminService } from '../services/adminService';
import { AdminRepository } from '../repositories/adminRepository';
import { UserRepository } from '../../users/repositories/userRepository';
import { requireAdmin } from '../../../middlewares/auth';

const router = Router();
const adminRepository = new AdminRepository();
const userRepository = new UserRepository();
const adminService = new AdminService(adminRepository, userRepository);
const adminController = new AdminController(adminService);

router.get('/users', requireAdmin, (req, res, next) => adminController.listUsers(req, res, next));
router.get('/users/:id', requireAdmin, (req, res, next) => adminController.getUserById(req, res, next));
router.post('/users', requireAdmin, (req, res, next) => adminController.createUser(req, res, next));
router.put('/users/:id', requireAdmin, (req, res, next) => adminController.updateUser(req, res, next));
router.delete('/users/:id', requireAdmin, (req, res, next) => adminController.deleteUser(req, res, next));
router.get('/logs', requireAdmin, (req, res, next) => adminController.getSystemLogs(req, res, next));
router.get('/stats', requireAdmin, (req, res, next) => adminController.getDashboardStats(req, res, next));

export default router;
