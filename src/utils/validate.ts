
/**
 * Request Validation Middleware
 * Zod-based validation for request bodies and parameters
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AudioContent } from '../models/AudioContent';

/**
 * Validation schema for audio content
 */
const audioContentSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description too long'),
  language: z.string().min(1, 'Language is required').max(50, 'Language too long'),
  category: z.string().min(1, 'Category is required').max(50, 'Category too long'),
  duration: z.number().positive('Duration must be positive'),
  fileUrl: z.string().url('Invalid file URL'),
  thumbnailUrl: z.string().url('Invalid thumbnail URL'),
  isPremium: z.boolean().optional(),
  artist: z.string().min(1, 'Artist is required').max(100, 'Artist too long'),
  tags: z.array(z.string()).optional().default([])
});

/**
 * Validation schema for progress updates
 */
const progressSchema = z.object({
  lastPosition: z.number().min(0, 'Last position cannot be negative'),
  completed: z.boolean().optional()
});

/**
 * Validation schema for user ID parameters
 */
const userIdSchema = z.string().min(1, 'User ID is required');

/**
 * Validation schema for content ID parameters
 */
const contentIdSchema = z.string().min(1, 'Content ID is required');

/**
 * Validation middleware for audio content
 */
export const validateContent = (req: Request, res: Response, next: NextFunction) => {
  try {
    audioContentSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: typeof error === "object" && error !== null && "message" in error ? error.message : 'Unknown validation error'
      });
    }
  }
};

/**
 * Validation middleware for progress data
 */
export const validateProgress = (req: Request, res: Response, next: NextFunction) => {
  try {
    progressSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: typeof error === "object" && error !== null && "message" in error ? error.message : 'Unknown validation error'
      });
    }
  }
};

/**
 * Validation middleware for user ID parameter
 */
export const validateUserId = (req: Request, res: Response, next: NextFunction) => {
  try {
    userIdSchema.parse(req.params.userId);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: 'Invalid user ID',
        errors: error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid user ID',
        error: typeof error === "object" && error !== null && "message" in error ? error.message : 'Unknown validation error'
      });
    }
  }
};

/**
 * Validation middleware for content ID parameter
 */
export const validateContentId = (req: Request, res: Response, next: NextFunction) => {
  try {
    contentIdSchema.parse(req.params.contentId);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: 'Invalid content ID',
        errors: error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid content ID',
        error: typeof error === "object" && error !== null && "message" in error ? error.message : 'Unknown validation error'
      });
    }
  }
};

/**
 * Validation middleware for search queries
 */
export const validateSearchQuery = (req: Request, res: Response, next: NextFunction) => {
  const { q } = req.query;

  if (q !== undefined && typeof q !== 'string') {
    res.status(400).json({
      success: false,
      message: 'Search query must be a string'
    });
    return;
  }

  if (q !== undefined && q.length > 100) {
    res.status(400).json({
      success: false,
      message: 'Search query too long (max 100 characters)'
    });
    return;
  }

  next();
};

/**
 * Validation middleware for pagination parameters
 */
export const validatePagination = (req: Request, res: Response, next: NextFunction) => {
  const { limit, offset } = req.query;

  if (limit !== undefined) {
    const limitNum = parseInt(limit as string, 10);
    if (isNaN(limitNum) || limitNum <= 0) {
      res.status(400).json({
        success: false,
        message: 'Limit must be a positive integer'
      });
      return;
    }

    if (limitNum > 100) {
      res.status(400).json({
        success: false,
        message: 'Limit cannot exceed 100'
      });
      return;
    }
  }

  if (offset !== undefined) {
    const offsetNum = parseInt(offset as string, 10);
    if (isNaN(offsetNum) || offsetNum < 0) {
      res.status(400).json({
        success: false,
        message: 'Offset must be a non-negative integer'
      });
      return;
    }
  }

  next();
};
