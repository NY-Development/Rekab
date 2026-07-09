import { WaitlistRepository } from '../repositories/waitlist.repository';

export class WaitlistService {
  private repo = new WaitlistRepository();

  async joinWaitlist(email: string) {
    if (await this.repo.exists(email)) {
      throw new Error('Email already registered.');
    }
    return await this.repo.create(email);
  }
}