import { Request, Response } from 'express';
import { WaitlistService } from '../services/waitlist.service';
import { waitlistSchema } from '../validators/waitlist.validator';

const service = new WaitlistService();

export const joinWaitlist = async (req: Request, res: Response) => {
  try {
    const { error } = waitlistSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const result = await service.joinWaitlist(req.body.email);
    res.status(201).json({ message: 'Added to waitlist', data: result });
  } catch (err: any) {
    res.status(409).json({ message: err.message });
  }
};