import { Waitlist, IWaitlist } from '../models/waitlist.model';

export class WaitlistRepository {
  async create(email: string): Promise<IWaitlist> {
    return await Waitlist.create({ email });
  }

  async exists(email: string): Promise<boolean> {
    const user = await Waitlist.findOne({ email });
    return !!user;
  }
}