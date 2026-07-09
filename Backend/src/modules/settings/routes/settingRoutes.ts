import { Router } from 'express';
import { SettingController } from '../controllers/settingController';
import { SettingService } from '../services/settingService';
import { SettingRepository } from '../repositories/settingRepository';
import { requireAuthenticated, authorize } from '../../../middlewares/auth';
import { validateBody } from '../../../middlewares/validation';
import { UpsertSettingSchema } from '../validators/settingValidator';

const router = Router();
const settingRepository = new SettingRepository();
const settingService = new SettingService(settingRepository);
const settingController = new SettingController(settingService);

// Public settings
router.get('/public', (req: any, res: any, next: any) => settingController.getPublicSettings(req, res, next));

// Authenticated admin routes
router.get('/', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN'), (req, res, next) => settingController.getAllSettings(req, res, next));
router.get('/category/:category', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN'), (req, res, next) => settingController.getByCategory(req, res, next));
router.get('/:key', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN'), (req, res, next) => settingController.getByKey(req, res, next));
router.put('/', requireAuthenticated, authorize('ADMIN', 'SUPER_ADMIN'), validateBody(UpsertSettingSchema), (req, res, next) => settingController.upsertSetting(req, res, next));
router.delete('/:key', requireAuthenticated, authorize('SUPER_ADMIN'), (req, res, next) => settingController.deleteSetting(req, res, next));

export default router;
