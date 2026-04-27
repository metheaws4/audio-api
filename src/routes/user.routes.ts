
/**
 * User Routes
 * Endpoints for user-specific functionality
 */

import { Router } from 'express';
import {
  getUserProfile,
  updateUserProfile,
  getUserFavorites,
  addToFavorites,
  removeFromFavorites,
  getUserProgressSummary
} from '../controllers/user.controller';

const router = Router();

// User profile endpoints
router.get('/:userId/profile', getUserProfile);
router.put('/:userId/profile', updateUserProfile);

// User favorites endpoints
router.get('/:userId/favorites', getUserFavorites);
router.post('/:userId/favorites/:contentId', addToFavorites);
router.delete('/:userId/favorites/:contentId', removeFromFavorites);

// User progress endpoints
router.get('/:userId/progress/summary', getUserProgressSummary);

export default router;
