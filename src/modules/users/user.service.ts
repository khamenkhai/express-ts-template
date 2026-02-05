import { db } from "../../db"; // Ensure this points to your Drizzle instance
import { usersTable, User, NewUser } from "../../db/schema";
import { eq } from "drizzle-orm";
import { UserRole } from "../../shared/types";
import {
  ForbiddenError,
  NotFoundError,
  ConflictError,
} from "../../shared/types/error";
import { UpdateUserInput } from "./user.validation";

export class UserService {
  private omitPassword(user: User): Omit<User, "password"> {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getAllUsers(): Promise<Omit<User, "password">[]> {
    const users = await db.select().from(usersTable);
    return users.map(this.omitPassword);
  }

  async getUserById(id: number): Promise<Omit<User, "password">> {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id));

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return this.omitPassword(user);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    return user || null;
  }

  async createUser(data: NewUser): Promise<Omit<User, "password">> {
    const [result] = await db.insert(usersTable).values(data);

    // Fetch newly created user using the insertId
    const newUser = await this.getUserById(result.insertId);
    return newUser;
  }

  async updateUser(
    id: number,
    data: UpdateUserInput,
  ): Promise<Omit<User, "password">> {
    // Check if user exists
    const [existing] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id));
    if (!existing) throw new NotFoundError("User not found");

    await db.update(usersTable).set(data).where(eq(usersTable.id, id));

    return await this.getUserById(id);
  }

  async updateUserRole(
    id: number,
    role: UserRole,
    requestingUserId: number,
  ): Promise<Omit<User, "password">> {
    if (id === requestingUserId) {
      throw new ForbiddenError("You cannot change your own role");
    }

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id));
    if (!user) throw new NotFoundError("User not found");

    await db
      .update(usersTable)
      .set({ role: role as string }) // Casting role if needed for Drizzle varchar
      .where(eq(usersTable.id, id));

    return await this.getUserById(id);
  }

  async deleteUser(id: number, requestingUserId: number): Promise<void> {
    if (id === requestingUserId) {
      throw new ForbiddenError("You cannot delete your own account");
    }

    const [result] = await db.delete(usersTable).where(eq(usersTable.id, id));

    // In MySQL, result.affectedRows tells us if something was actually deleted
    if (result.affectedRows === 0) {
      throw new NotFoundError("User not found");
    }
  }
}

export const userService = new UserService();
