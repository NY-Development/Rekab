import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth';
import { ResourceService } from '../services/resourceService';
import { CreateResourceSchema, UpdateResourceSchema, ResourceFilterSchema } from '../validators/resourceValidator';

export class ResourceController {
  constructor(private resourceService: ResourceService) {}

  async getResourceById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const resource = await this.resourceService.getResourceById(req.params.id);
      res.status(200).json({ status: 'success', data: resource });
    } catch (error) {
      next(error);
    }
  }

  async listResources(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = await ResourceFilterSchema.parseAsync(req.query);
      const result = await this.resourceService.listResources(validated);
      res.status(200).json({
        status: 'success',
        data: result.docs,
        pagination: {
          page: validated.page,
          limit: validated.limit,
          total: result.total,
          pages: Math.ceil(result.total / validated.limit),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async createResource(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ status: 'error', message: 'Unauthorized' });
        return;
      }
      const validated = await CreateResourceSchema.parseAsync(req.body);
      const resource = await this.resourceService.createResource(req.user.id, validated);
      res.status(251).json({ status: 'success', data: resource });
    } catch (error) {
      next(error);
    }
  }

  async updateResource(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = await UpdateResourceSchema.parseAsync(req.body);
      const resource = await this.resourceService.updateResource(req.params.id, validated);
      res.status(200).json({ status: 'success', data: resource });
    } catch (error) {
      next(error);
    }
  }

  async deleteResource(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.resourceService.deleteResource(req.params.id);
      res.status(200).json({ status: 'success', message: 'Resource deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}
