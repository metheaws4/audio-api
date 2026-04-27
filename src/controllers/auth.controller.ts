/**
 * Authentication Controller
 * Handles user registration, login, and admin login
 */

import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

// Initialize user service
const userService = new UserService();

/**
 * Register a new user
 */
export const register = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username, password, email } = req.body;

    // Validate required fields
    if (!username || !password || !email) {
      res.status(400).json({
        error: {
          code: 'MISSING_FIELDS',
          message: 'Username, password, and email are required'
        }
      });
      return;
    }

    // Register user
    const user = await userService.registerUser({ username, password, email });

    // Generate tokens
    const tokens = await userService.loginUser({ username, password });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      tokens: tokens.tokens
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Registration failed';
    res.status(400).json({
      error: {
        code: 'REGISTRATION_FAILED',
        message
      }
    });
  }
};

/**
 * Login user
 */
export const login = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username, password } = req.body;

    // Validate required fields
    if (!username || !password) {
      res.status(400).json({
        error: {
          code: 'MISSING_FIELDS',
          message: 'Username and password are required'
        }
      });
      return;
    }

    // Login user
    const result = await userService.loginUser({ username, password });

    res.status(200).json({
      message: 'Login successful',
      user: result.user,
      tokens: result.tokens
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed';
    res.status(401).json({
      error: {
        code: 'LOGIN_FAILED',
        message
      }
    });
  }
};

/**
 * Login admin
 */
export const adminLogin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username, password } = req.body;

    // Validate required fields
    if (!username || !password) {
      res.status(400).json({
        error: {
          code: 'MISSING_FIELDS',
          message: 'Username and password are required'
        }
      });
      return;
    }

    // Login admin
    const result = await userService.loginAdmin({ username, password });

    res.status(200).json({
      message: 'Admin login successful',
      user: result.user,
      tokens: result.tokens
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Admin login failed';
    res.status(401).json({
      error: {
        code: 'ADMIN_LOGIN_FAILED',
        message
      }
    });
  }
};

/**
 * Get current user profile
 */
export const getProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required'
        }
      });
      return;
    }

    const userService = new UserService();
    const user = await userService.findUserById(req.user.userId);

    if (!user) {
      res.status(404).json({
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
      return;
    }

    res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get profile';
    res.status(500).json({
      error: {
        code: 'PROFILE_FETCH_FAILED',
        message
      }
    });
  }
};
