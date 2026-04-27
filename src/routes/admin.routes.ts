
/**
 * Admin Routes
 * Admin-only endpoints for content management
 */

import { Router } from 'express';
import {
  createContent,
  updateContent,
  deleteContent,
  getAllContentAdmin,
  getContentStats
} from '../controllers/admin.controller';
import { validateContent } from '../utils/validate';

const router = Router();

// Admin content management endpoints (would typically require admin auth middleware)
router.post('/', validateContent, createContent);
router.put('/:id', validateContent, updateContent);
router.delete('/:id', deleteContent);
router.get('/', getAllContentAdmin);
router.get('/stats', getContentStats);

export default router;
