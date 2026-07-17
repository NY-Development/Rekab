import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/auth';
import { PaymentService } from '../services/paymentService';
import { SubmitPaymentSchema, AdminVerifyPaymentSchema, PaymentFilterSchema } from '../validators/paymentValidator';

export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  async getPaymentById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const payment = await this.paymentService.getPaymentById(req.params.id);
      res.status(200).json({ status: 'success', data: payment });
    } catch (error) {
      next(error);
    }
  }

  async getMyPayments(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ status: 'error', message: 'Unauthorized' });
        return;
      }
      const list = await this.paymentService.getStudentPayments(req.user.id);
      res.status(200).json({ status: 'success', data: list });
    } catch (error) {
      next(error);
    }
  }

  async listPayments(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = await PaymentFilterSchema.parseAsync(req.query);
      const result = await this.paymentService.listPayments(validated);
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

  async submitPayment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ status: 'error', message: 'Unauthorized' });
        return;
      }
      const validated = await SubmitPaymentSchema.parseAsync(req.body);
      const result = await this.paymentService.submitAndVerify(req.user.id, validated);
      res.status(201).json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  }

  async adminVerifyPayment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ status: 'error', message: 'Unauthorized' });
        return;
      }
      const validated = await AdminVerifyPaymentSchema.parseAsync(req.body);
      const payment = await this.paymentService.adminUpdatePayment(req.params.id, req.user.id, validated);
      res.status(200).json({ status: 'success', data: payment });
    } catch (error) {
      next(error);
    }
  }
}
