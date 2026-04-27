import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();
const authController = new AuthController();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', authLimiter, authController.register.bind(authController));

/**
 * @route POST /api/auth/login
 * @desc Login user and return JWT token
 * @access Public
 */
router.post('/login', authLimiter, authController.login.bind(authController));

/**
 * @route POST /api/auth/admin/login
 * @desc Login admin user and return admin JWT token
 * @access Public
 */
router.post('/admin/login', authLimiter, authController.adminLogin.bind(authController));

/**
 * @route GET /api/auth/me
 * @desc Get current user profile
 * @access Private
 */
router.get('/me', authenticate, authController.getProfile.bind(authController));

export default router;
