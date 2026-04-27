/**
 * Authentication Middleware
 * Verifies JWT tokens and attaches user to request object
 */

import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayloadExtended } from '../utils/jwt';
import { StorageService } from '../services/storage.service';
import { User } from '../models/AudioContent';

// Initialize storage service for users
const userStorage = new StorageService<User>('users');

/**
 * Extend Express Request to include user property
 */
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayloadExtended;
    }
  }
}

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request object
 * Can be used for both regular users and admins based on requireAdmin flag
 *
 * @param requireAdmin - If true, requires admin role. Default: false
 * @returns Express middleware function
 */
export const authenticate = (requireAdmin: boolean = false) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Extract token from Authorization header
      const authHeader = req.headers.authorization;
      const token = authHeader?.split(' ')[1];

      if (!token) {
        res.status(401).json({
          error: {
            code: 'AUTH_NO_TOKEN',
            message: 'No authentication token provided'
          }
        });
        return;
      }

      // Verify token (check if it's an admin token if requireAdmin is true)
      const decoded = verifyToken(token, requireAdmin);

      // Check if user still exists in storage
      const user = await userStorage.findById(decoded.userId);

      if (!user) {
        res.status(401).json({
          error: {
            code: 'AUTH_USER_NOT_FOUND',
            message: 'User no longer exists'
          }
        });
        return;
      }

      // Check if user is banned/inactive (optional)
      if (user.role !== decoded.role) {
        res.status(403).json({
          error: {
            code: 'AUTH_ROLE_MISMATCH',
            message: 'User role has changed'
          }
        });
        return;
      }

      // Attach user to request object
      req.user = decoded;

      next();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';

      res.status(401).json({
        error: {
          code: 'AUTH_FAILED',
          message: errorMessage
        }
      });
    }
  };
};

/**
 * Convenience middleware for regular user authentication
 */
export const authenticateUser = authenticate(false);

/**
 * Convenience middleware for admin authentication
 */
export const authenticateAdmin = authenticate(true);
