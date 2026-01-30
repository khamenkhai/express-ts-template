import { userDb } from "../../config/db/user.db";
import { IUser, UserRole } from "../../shared/types";
import { ForbiddenError, NotFoundError } from "../../shared/types/error";
import { UpdateUserInput } from "./user.validation";

export class UserService {
  async getAllUsers(): Promise<Omit<IUser, "password">[]> {
    const users = await userDb.findAll();
    return users.map(({ password, ...user }) => user);
  }

  async getUserById(id: string): Promise<Omit<IUser, "password">> {
    const user = await userDb.findById(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateUser(
    id: string,
    data: UpdateUserInput,
  ): Promise<Omit<IUser, "password">> {
    const user = await userDb.findById(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const updatedUser = await userDb.update(id, data);
    if (!updatedUser) {
      throw new NotFoundError("User not found");
    }

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async updateUserRole(
    id: string,
    role: UserRole,
    requestingUserId: string,
  ): Promise<Omit<IUser, "password">> {
    // Prevent users from changing their own role
    if (id === requestingUserId) {
      throw new ForbiddenError("You cannot change your own role");
    }

    const user = await userDb.findById(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const updatedUser = await userDb.update(id, { role });
    if (!updatedUser) {
      throw new NotFoundError("User not found");
    }

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async deleteUser(id: string, requestingUserId: string): Promise<void> {
    // Prevent users from deleting themselves
    if (id === requestingUserId) {
      throw new ForbiddenError("You cannot delete your own account");
    }

    const deleted = await userDb.delete(id);
    if (!deleted) {
      throw new NotFoundError("User not found");
    }
  }
}

export const userService = new UserService();
