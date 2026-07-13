import { Router } from 'express';
import { joinWaitlist } from '../controllers/waitlist.controller';
import { waitlistRateLimiter } from '../../../middlewares/rateLimiter';

const router = Router();
router.post('/join', waitlistRateLimiter, joinWaitlist);

export default router;