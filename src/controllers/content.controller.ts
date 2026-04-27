
/**
 * Content Controller
 * Handles content-related endpoints (public access)
 */

import { Request, Response, NextFunction } from 'express';
import { ContentService } from '../services/content.service';
import { ProgressService } from '../services/progress.service';
import { AudioContent, UserProgress } from '../models/AudioContent';

const contentService = new ContentService();
const progressService = new ProgressService();

/**
 * Get all content with optional filtering
 */
export const getAllContent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      language,
      category,
      premium,
      free,
      search,
      limit,
      offset
    } = req.query;

    let items: AudioContent[] = [];

    if (search && typeof search === 'string') {
      items = contentService.search(search);
    } else {
      const filters: any = {};
      if (language && typeof language === 'string') filters.language = language;
      if (category && typeof category === 'string') filters.category = category;
      if (premium && typeof premium === 'string') filters.isPremium = premium === 'true';
      if (free && typeof free === 'string') filters.freeOnly = free === 'true';
      if (premium && typeof premium === 'string' && premium === 'true') filters.premiumOnly = true;

      items = contentService.getAll(filters);
    }

    // Apply pagination
    const pageLimit = limit ? parseInt(limit as string, 10) : items.length;
    const pageOffset = offset ? parseInt(offset as string, 10) : 0;
    const paginatedItems = items.slice(pageOffset, pageOffset + pageLimit);

    res.status(200).json({
      success: true,
      count: paginatedItems.length,
      total: items.length,
      data: paginatedItems
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get content by ID
 */
export const getContentById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const content = contentService.getById(id);

    if (!content) {
      res.status(404).json({
        success: false,
        message: 'Content not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: content
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get content by language
 */
export const getContentByLanguage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { language } = req.params;
    const items = contentService.getByLanguage(language);

    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get content by category
 */
export const getContentByCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category } = req.params;
    const items = contentService.getByCategory(category);

    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get premium content
 */
export const getPremiumContent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = contentService.getPremiumContent();

    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get free content
 */
export const getFreeContent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = contentService.getFreeContent();

    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Search content
 */
export const searchContent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
      return;
    }

    const items = contentService.search(q);

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
      query: q
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Save user progress
 */
export const saveProgress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, contentId } = req.params;
    const { lastPosition, completed } = req.body;

    // Validate inputs
    if (!userId || !contentId) {
      res.status(400).json({
        success: false,
        message: 'User ID and Content ID are required'
      });
      return;
    }

    // Verify content exists
    const content = contentService.getById(contentId);
    if (!content) {
      res.status(404).json({
        success: false,
        message: 'Content not found'
      });
      return;
    }

    // Validate lastPosition
    if (typeof lastPosition !== 'number' || lastPosition < 0) {
      res.status(400).json({
        success: false,
        message: 'Last position must be a non-negative number'
      });
      return;
    }

    const progress = progressService.saveProgress(
      userId,
      contentId,
      lastPosition,
      completed
    );

    res.status(200).json({
      success: true,
      data: progress
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user progress for content
 */
export const getUserProgress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, contentId } = req.params;

    if (!userId || !contentId) {
      res.status(400).json({
        success: false,
        message: 'User ID and Content ID are required'
      });
      return;
    }

    const progress = progressService.getProgress(userId, contentId);

    res.status(200).json({
      success: true,
      data: progress
    });
  } catch (error) {
    next(error);
  }
};
