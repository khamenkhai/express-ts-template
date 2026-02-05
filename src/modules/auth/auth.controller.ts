import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { RegisterInput, LoginInput, RefreshTokenInput } from './auth.validation';
import { AuthRequest } from '../../shared/types';
import { logger } from '../../shared/utils/logger';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data: RegisterInput = req.body;
      const result = await authService.register(data);

      logger.info(`User registered: ${result.user.email}`);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data: LoginInput = req.body;
      const result = await authService.login(data);

      logger.info(`User logged in: ${result.user.email}`);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken }: RefreshTokenInput = req.body;
      const tokens = await authService.refreshToken(refreshToken);

      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: tokens,
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
     
      if (!req.user) {
        throw new Error('User not authenticated');
      }

      const user = await authService.getProfile(req.user.id);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // In a real application, you would invalidate the token here
      // For example, add it to a blacklist or remove it from a database

      res.status(200).json({
        success: true,
        message: 'Logout successful',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();