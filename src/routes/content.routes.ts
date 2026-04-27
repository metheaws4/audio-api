
/**
 * Content Routes
 * Public endpoints for accessing audio content
 */

import { Router } from 'express';
import {
  getAllContent,
  getContentById,
  getContentByLanguage,
  getContentByCategory,
  getPremiumContent,
  getFreeContent,
  searchContent,
  saveProgress,
  getUserProgress
} from '../controllers/content.controller';

const router = Router();

// Public content endpoints
router.get('/', getAllContent);
router.get('/search', searchContent);
router.get('/premium', getPremiumContent);
router.get('/free', getFreeContent);
router.get('/language/:language', getContentByLanguage);
router.get('/category/:category', getContentByCategory);
router.get('/:id', getContentById);

// User progress endpoints (these would typically require auth middleware)
router.post('/progress/:userId/:contentId', saveProgress);
router.get('/progress/:userId/:contentId', getUserProgress);

export default router;
