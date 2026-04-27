import { Router } from 'express';
import { register, login, adminLogin, getProfile } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', authLimiter, register);

/**
 * @route POST /api/auth/login
 * @desc Login user and return JWT token
 * @access Public
 */
router.post('/login', authLimiter, login);

/**
 * @route POST /api/auth/admin/login
 * @desc Login admin user and return admin JWT token
 * @access Public
 */
router.post('/admin/login', authLimiter, adminLogin);

/**
 * @route GET /api/auth/me
 * @desc Get current user profile
 * @access Private
 */
router.get('/me', authenticate, getProfile);

export default router;
