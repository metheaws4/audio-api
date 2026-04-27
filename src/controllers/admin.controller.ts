
/**
 * Admin Controller
 * Handles admin-only endpoints for content management
 */

import { Request, Response, NextFunction } from 'express';
import { ContentService } from '../services/content.service';
import { AudioContent } from '../models/AudioContent';
import { validationResult } from 'express-validator';

const contentService = new ContentService();

/**
 * Create new audio content (Admin only)
 */
export const createContent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
      return;
    }

    const contentData = req.body as Omit<AudioContent, 'id'>;
    const newContent = contentService.create(contentData);

    res.status(201).json({
      success: true,
      message: 'Content created successfully',
      data: newContent
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update audio content (Admin only)
 */
export const updateContent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
      return;
    }

    const contentData = req.body as Partial<AudioContent>;
    const updatedContent = contentService.update(id, contentData);

    if (!updatedContent) {
      res.status(404).json({
        success: false,
        message: 'Content not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Content updated successfully',
      data: updatedContent
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete audio content (Admin only)
 */
export const deleteContent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const deleted = contentService.delete(id);

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: 'Content not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Content deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all content (Admin view - no filters applied by default)
 */
export const getAllContentAdmin = async (req: Request, res: Response, next: NextFunction) => {
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
 * Get content statistics
 */
export const getContentStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const allContent = contentService.getAll();
    const premiumContent = contentService.getPremiumContent();
    const freeContent = contentService.getFreeContent();

    // Get language distribution
    const languageCounts: Record<string, number> = {};
    allContent.forEach(content => {
      languageCounts[content.language] = (languageCounts[content.language] || 0) + 1;
    });

    // Get category distribution
    const categoryCounts: Record<string, number> = {};
    allContent.forEach(content => {
      categoryCounts[content.category] = (categoryCounts[content.category] || 0) + 1;
    });

    res.status(200).json({
      success: true,
      data: {
        total: allContent.length,
        premium: premiumContent.length,
        free: freeContent.length,
        byLanguage: languageCounts,
        byCategory: categoryCounts
      }
    });
  } catch (error) {
    next(error);
  }
};
