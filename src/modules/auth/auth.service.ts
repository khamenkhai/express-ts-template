import { userDb } from "../../config/db/user.db";
import { IUser, IUserPayload, TokenPair, UserRole } from "../../shared/types";
import { ConflictError, UnauthorizedError } from "../../shared/types/error";
import {
  generateTokenPair,
  verifyRefreshToken,
} from "../../shared/utils/jwt.utils";
import {
  comparePassword,
  hashPassword,
} from "../../shared/utils/password.utils";
import { LoginInput, RegisterInput } from "./auth.validation";

export class AuthService {
  async register(
    data: RegisterInput,
  ): Promise<{ user: Omit<IUser, "password">; tokens: TokenPair }> {
    // Check if user already exists
    const existingUser = await userDb.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictError("User with this email already exists");
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create user
    const user = await userDb.create({
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      role: UserRole.ADMIN,
      isActive: true,
    });

    // Generate tokens
    const tokens = generateTokenPair({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      tokens,
    };
  }

  async login(
    data: LoginInput,
  ): Promise<{ user: Omit<IUser, "password">; tokens: TokenPair }> {
    // Find user
    const user = await userDb.findByEmail(data.email);
    if (!user) {
      throw new UnauthorizedError("Invalid credentials");
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedError("Account is deactivated");
    }

    // Verify password
    const isPasswordValid = await comparePassword(data.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid credentials");
    }

    // Generate tokens
    const tokens = generateTokenPair({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      tokens,
    };
  }

  async refreshToken(refreshToken: string): Promise<TokenPair> {
    // Verify refresh token
    const payload = verifyRefreshToken(refreshToken);

    // Generate new token pair
    return generateTokenPair({
      id: payload.id,
      email: payload.email,
      role: payload.role,
    });
  }

  async getProfile(userId: string): Promise<Omit<IUser, "password">> {
    const user = await userDb.findById(userId);
    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

export const authService = new AuthService();
