import { UserRepository } from '../repositories/userRepository';
import { User } from '../../../types';

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async createUser(userData: Omit<User, 'id'>): Promise<User> {
    return this.userRepository.create(userData);
  }

  async updateUser(id: string, updateData: Partial<User>): Promise<User | null> {
    return this.userRepository.update(id, updateData);
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }
}
