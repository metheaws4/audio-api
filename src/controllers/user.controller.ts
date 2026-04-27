
/**
 * User Controller
 * Handles user-specific endpoints (profile, progress, favorites)
 */

import { Request, Response, NextFunction } from 'express';
import { ContentService } from '../services/content.service';
import { ProgressService } from '../services/progress.service';
import { User } from '../models/AudioContent';
import { StorageService } from '../services/storage.service';

const contentService = new ContentService();
const progressService = new ProgressService();
const userService = new StorageService<User>('users');

/**
 * Get user profile
 */
export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const user = userService.findById(userId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      data: userWithoutPassword
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const userData = req.body;

    // Remove sensitive fields that shouldn't be updated this way
    delete userData.password;
    delete userData.id;

    const updatedUser = userService.update(userId, userData);

    if (!updatedUser) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = updatedUser;

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: userWithoutPassword
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user favorites
 */
export const getUserFavorites = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const user = userService.findById(userId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    const favoriteIds = user.favorites || [];
    const favorites = contentService.getByIds(favoriteIds);

    res.status(200).json({
      success: true,
      count: favorites.length,
      data: favorites
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add content to favorites
 */
export const addToFavorites = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, contentId } = req.params;

    // Verify user exists
    const user = userService.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
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

    // Add to favorites if not already there
    const favorites = user.favorites || [];
    if (!favorites.includes(contentId)) {
      favorites.push(contentId);
      userService.update(userId, { favorites });
    }

    res.status(200).json({
      success: true,
      message: 'Added to favorites successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove content from favorites
 */
export const removeFromFavorites = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, contentId } = req.params;

    // Verify user exists
    const user = userService.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    // Remove from favorites if present
    const favorites = user.favorites || [];
    const index = favorites.indexOf(contentId);
    if (index !== -1) {
      favorites.splice(index, 1);
      userService.update(userId, { favorites });
    }

    res.status(200).json({
      success: true,
      message: 'Removed from favorites successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user progress summary
 */
export const getUserProgressSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const userProgress = progressService.getUserProgress(userId);

    // Calculate summary statistics
    const totalItems = userProgress.length;
    const completedItems = userProgress.filter(p => p.completed).length;
    const inProgressItems = userProgress.filter(p => !p.completed && p.lastPosition > 0).length;
    const notStartedItems = userProgress.filter(p => p.lastPosition === 0 && !p.completed).length;

    // Get details for completed and in-progress items
    const completedContentIds = userProgress
      .filter(p => p.completed)
      .map(p => p.contentId);
    const inProgressContentIds = userProgress
      .filter(p => !p.completed && p.lastPosition > 0)
      .map(p => p.contentId);

    const completedContent = contentService.getByIds(completedContentIds);
    const inProgressContent = contentService.getByIds(inProgressContentIds);

    res.status(200).json({
      success: true,
      data: {
        summary: {
          total: totalItems,
          completed: completedItems,
          inProgress: inProgressItems,
          notStarted: notStartedItems,
          completionRate: totalItems > 0 ? (completedItems / totalItems) * 100 : 0
        },
        completed: completedContent,
        inProgress: inProgressContent
      }
    });
  } catch (error) {
    next(error);
  }
};
