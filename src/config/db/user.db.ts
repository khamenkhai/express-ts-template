import { randomUUID } from 'crypto';
import { IUser } from '../../shared/types';

// In-memory database - Replace with actual database implementation
export class UserDatabase {
  private users: Map<string, IUser> = new Map();

  async findById(id: string): Promise<IUser | null> {
    return this.users.get(id) || null;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return Array.from(this.users.values()).find((user) => user.email === email) || null;
  }

  async create(userData: Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<IUser> {
    const user: IUser = {
      id: randomUUID(),
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.set(user.id, user);
    return user;
  }

  async update(id: string, userData: Partial<IUser>): Promise<IUser | null> {
    const user = await this.findById(id);
    if (!user) return null;

    const updatedUser: IUser = {
      ...user,
      ...userData,
      updatedAt: new Date(),
    };

    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async delete(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  async findAll(): Promise<IUser[]> {
    return Array.from(this.users.values());
  }
}

export const userDb = new UserDatabase();