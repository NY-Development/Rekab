import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { AdminService } from '../services/adminService';
import { AdminRepository } from '../repositories/adminRepository';
import { requireAdmin } from '../../../middlewares/auth';

const router = Router();
const adminRepository = new AdminRepository();
const adminService = new AdminService(adminRepository);
const adminController = new AdminController(adminService);

router.get('/users', requireAdmin, (req, res, next) => adminController.listUsers(req, res, next));
router.get('/logs', requireAdmin, (req, res, next) => adminController.getSystemLogs(req, res, next));
router.get('/stats', requireAdmin, (req, res, next) => adminController.getDashboardStats(req, res, next));

export default router;
