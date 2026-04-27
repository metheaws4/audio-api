/**
 * Admin Authorization Middleware
 * Verifies that authenticated user has admin role
 */

import { Request, Response, NextFunction } from 'express';

/**
 * Admin authorization middleware
 * Checks if the authenticated user has admin role
 * Must be used after authentication middleware
 *
 * @returns Express middleware function
 */
export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Check if user is attached to request (from authentication middleware)
    if (!req.user) {
      res.status(401).json({
        error: {
          code: 'AUTH_REQUIRED',
          message: 'Authentication required'
        }
      });
      return;
    }

    // Check if user has admin role
    if (req.user.role !== 'admin') {
      res.status(403).json({
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: 'Admin access required'
        }
      });
      return;
    }

    // User is authenticated and has admin role
    next();
  } catch (error) {
    res.status(403).json({
      error: {
        code: 'AUTHORIZATION_FAILED',
        message: 'Failed to verify admin permissions'
      }
    });
  }
};

/**
 * Combined authentication and admin middleware
 * Verifies JWT token AND checks for admin role
 */
import { authenticateAdmin } from './auth.middleware';

export const authAndAdmin = [
  authenticateAdmin,
  requireAdmin
];
