import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth';
import { SettingService } from '../services/settingService';
import { UpsertSettingSchema, SettingFilterSchema } from '../validators/settingValidator';

export class SettingController {
  constructor(private settingService: SettingService) {}

  async getByKey(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const setting = await this.settingService.getByKey(req.params.key);
      res.status(200).json({ status: 'success', data: setting });
    } catch (error) {
      next(error);
    }
  }

  async getPublicSettings(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const settings = await this.settingService.getPublicSettings();
      res.status(200).json({ status: 'success', data: settings });
    } catch (error) {
      next(error);
    }
  }

  async getAllSettings(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const settings = await this.settingService.getAllSettings();
      res.status(200).json({ status: 'success', data: settings });
    } catch (error) {
      next(error);
    }
  }

  async getByCategory(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const settings = await this.settingService.getByCategory(req.params.category);
      res.status(200).json({ status: 'success', data: settings });
    } catch (error) {
      next(error);
    }
  }

  async upsertSetting(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ status: 'error', message: 'Unauthorized' });
        return;
      }
      const validated = await UpsertSettingSchema.parseAsync(req.body);
      const setting = await this.settingService.upsertSetting(req.user.id, validated);
      res.status(200).json({ status: 'success', data: setting });
    } catch (error) {
      next(error);
    }
  }

  async deleteSetting(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.settingService.deleteSetting(req.params.key);
      res.status(200).json({ status: 'success', message: 'Setting deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}
