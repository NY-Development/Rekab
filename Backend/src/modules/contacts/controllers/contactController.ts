import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth';
import { ContactService } from '../services/contactService';
import { CreateContactSchema, ContactFilterSchema } from '../validators/contactValidator';

export class ContactController {
  constructor(private contactService: ContactService) {}

  async submit(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = await CreateContactSchema.parseAsync(req.body);
      const contact = await this.contactService.submit({
        ...validated,
        userId: req.user?.id,
      });
      res.status(201).json({ status: 'success', data: contact });
    } catch (error) {
      next(error);
    }
  }

  async list(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = await ContactFilterSchema.parseAsync(req.query);
      const result = await this.contactService.list(validated);
      res.status(200).json({
        status: 'success',
        data: {
          docs: result.docs,
          total: result.total,
          page: validated.page,
          limit: validated.limit,
          totalPages: Math.ceil(result.total / validated.limit),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async unreadCount(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const count = await this.contactService.unreadCount();
      res.status(200).json({ status: 'success', data: { count } });
    } catch (error) {
      next(error);
    }
  }

  async markHandled(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const contact = await this.contactService.markHandled(req.params.id, req.user!.id);
      res.status(200).json({ status: 'success', data: contact });
    } catch (error) {
      next(error);
    }
  }
}
