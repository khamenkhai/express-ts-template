import { User } from "../../db/schema";
import { TokenPair, UserRole } from "../../shared/types";
import { ConflictError, UnauthorizedError } from "../../shared/types/error";
import {
  generateTokenPair,
  verifyRefreshToken,
} from "../../shared/utils/jwt.utils";
import {
  comparePassword,
  hashPassword,
} from "../../shared/utils/password.utils";
import { userService } from "../users/user.service";
import { LoginInput, RegisterInput } from "./auth.validation";

export class AuthService {
  async register(
    data: RegisterInput,
  ): Promise<{ user: Omit<User, "password">; tokens: TokenPair }> {
    // 1. Check if user already exists
    const existingUser = await userService.getUserByEmail(data.email);
    if (existingUser) {
      throw new ConflictError("User with this email already exists");
    }

    // 2. Hash password
    const hashedPassword = await hashPassword(data.password);

    // 3. Create user via userService
    const userWithoutPassword = await userService.createUser({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      age: 20,
      role: UserRole.ADMIN,
    });

    // 4. Generate tokens
    const tokens = generateTokenPair({
      id: userWithoutPassword.id,
      email: userWithoutPassword.email,
      role: userWithoutPassword.role as UserRole,
    });

    return {
      user: userWithoutPassword,
      tokens,
    };
  }

  async login(
    data: LoginInput,
  ): Promise<{ user: Omit<User, "password">; tokens: TokenPair }> {
    // 1. Find user (we need the password for comparison, so we use the internal email search)
    const user = await userService.getUserByEmail(data.email);
    if (!user) {
      throw new UnauthorizedError("Invalid credentials");
    }

    // 2. Verify password
    const isPasswordValid = await comparePassword(data.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid credentials");
    }

    // 3. Generate tokens
    const tokens = generateTokenPair({
      id: user.id,
      email: user.email,
      role: user.role as UserRole,
    });

    // 4. Remove password from response
    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      tokens,
    };
  }

  async refreshToken(refreshToken: string): Promise<TokenPair> {
    const payload = verifyRefreshToken(refreshToken);

    return generateTokenPair({
      id: payload.id,
      email: payload.email,
      role: payload.role,
    });
  }

  async getProfile(userId: number): Promise<Omit<User, "password">> {
    // Simply proxy the request to the userService
    return await userService.getUserById(userId);
  }
}

export const authService = new AuthService();