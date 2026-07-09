import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../../users/repositories/userRepository';
import { User, UserRole } from '../../../types';
import { AppError } from '../../../middlewares/errorHandler';
import { DBStore } from '../../../services/dbStore';

const JWT_SECRET = process.env.JWT_SECRET || 'nydev-learning-master-secret-key-2026';

export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async signup(signupData: { name: string; email: string; password: string; role: UserRole }): Promise<{ token: string; user: User }> {
    const { name, email, password, role } = signupData;

    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new AppError('A user with this email address already exists', 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.userRepository.create({
      name,
      firstName: name.split(' ')[0] || name,
      lastName: name.split(' ').slice(1).join(' ') || name,
      email: email.toLowerCase(),
      passwordHash,
      role,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    await DBStore.logActivity(user.id, user.name, 'USER_SIGNUP', `Created account with role: ${role}`);

    return { token, user };
  }

  async login(loginData: { email: string; password: string }): Promise<{ token: string; user: User }> {
    const { email, password } = loginData;

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    await DBStore.logActivity(user.id, user.name, 'USER_LOGIN', 'Logged into the platform successfully.');

    return { token, user };
  }

  async updateProfile(userId: string, updateData: { name?: string; avatar?: string }): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const updated = await this.userRepository.update(userId, updateData);
    if (!updated) {
      throw new AppError('Failed to update user', 500);
    }

    await DBStore.logActivity(user.id, user.name, 'USER_UPDATE', `Updated user profile metadata`);

    return updated;
  }
}
