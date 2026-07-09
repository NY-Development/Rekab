import UserModel from '../models/User';
import { User } from '../../../types';
import { DBStore } from '../../../services/dbStore';
import { isMongoConnected } from '../../../configs/db';

const UserM = UserModel as any;

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    if (isMongoConnected) {
      const doc = await UserM.findOne({ email: email.toLowerCase() });
      return doc ? (doc.toJSON() as User) : null;
    }
    return DBStore.getUserByEmail(email);
  }

  async findById(id: string): Promise<User | null> {
    if (isMongoConnected) {
      const doc = await UserM.findById(id);
      return doc ? (doc.toJSON() as User) : null;
    }
    return DBStore.getUserById(id);
  }

  async create(userData: Omit<User, 'id'>): Promise<User> {
    if (isMongoConnected) {
      const doc = await UserM.create(userData);
      return doc.toJSON() as User;
    }
    return DBStore.createUser(userData);
  }

  async update(id: string, updateData: Partial<User>): Promise<User | null> {
    if (isMongoConnected) {
      const doc = await UserM.findByIdAndUpdate(id, { $set: updateData }, { new: true });
      return doc ? (doc.toJSON() as User) : null;
    }
    return DBStore.updateUser(id, updateData);
  }

  async findAll(): Promise<User[]> {
    if (isMongoConnected) {
      const docs = await UserM.find({});
      return docs.map((d: any) => d.toJSON() as User);
    }
    return DBStore.getUsers();
  }
}

