
/**
 * Progress Service
 * Handles user progress tracking for audio content
 */

import { UserProgress } from '../models/AudioContent';
import { StorageService } from './storage.service';

export class ProgressService {
  private storage: StorageService<UserProgress>;

  constructor() {
    this.storage = new StorageService<UserProgress>('user-progress');
  }

  /**
   * Get user progress for a specific content
   */
  getProgress(userId: string, contentId: string): UserProgress | null {
    return this.storage.findOne(
      (progress) => progress.userId === userId && progress.contentId === contentId
    );
  }

  /**
   * Get all progress for a user
   */
  getUserProgress(userId: string): UserProgress[] {
    return this.storage.findBy((progress) => progress.userId === userId);
  }

  /**
   * Get progress for specific content (across all users)
   */
  getContentProgress(contentId: string): UserProgress[] {
    return this.storage.findBy((progress) => progress.contentId === contentId);
  }

  /**
   * Create or update progress
   */
  saveProgress(userId: string, contentId: string, lastPosition: number, completed?: boolean): UserProgress {
    const existing = this.getProgress(userId, contentId);
    const now = new Date().toISOString();

    if (existing) {
      const updated = {
        ...existing,
        lastPosition,
        completed: completed ?? existing.completed,
        updatedAt: now,
        ...(completed && { finishedAt: now }),
      };
      return this.storage.update(existing.id, updated);
    } else {
      const newProgress = {
        userId,
        contentId,
        lastPosition,
        completed: completed ?? false,
        startedAt: now,
        updatedAt: now,
        finishedAt: completed ? now : null,
      };
      return this.storage.create(newProgress);
    }
  }

  /**
   * Mark content as completed
   */
  markCompleted(userId: string, contentId: string): UserProgress | null {
    const existing = this.getProgress(userId, contentId);
    if (!existing) {
      return null;
    }

    const updated = {
      ...existing,
      completed: true,
      lastPosition: existing.lastPosition || 0, // ensure lastPosition is set
      updatedAt: new Date().toISOString(),
      finishedAt: new Date().toISOString(),
    };

    return this.storage.update(existing.id, updated);
  }

  /**
   * Reset progress (set to beginning)
   */
  resetProgress(userId: string, contentId: string): UserProgress | null {
    const existing = this.getProgress(userId, contentId);
    if (!existing) {
      return null;
    }

    const updated = {
      ...existing,
      lastPosition: 0,
      completed: false,
      updatedAt: new Date().toISOString(),
      finishedAt: null,
    };

    return this.storage.update(existing.id, updated);
  }

  /**
   * Delete progress entry
   */
  deleteProgress(userId: string, contentId: string): boolean {
    const existing = this.getProgress(userId, contentId);
    if (!existing) {
      return false;
    }
    return this.storage.delete(existing.id);
  }

  /**
   * Get completion percentage for content (average across users)
   */
  getCompletionRate(contentId: string): number {
    const progressEntries = this.getContentProgress(contentId);
    if (progressEntries.length === 0) return 0;

    const completedCount = progressEntries.filter((p) => p.completed).length;
    return (completedCount / progressEntries.length) * 100;
  }

  /**
   * Get average last position for content
   */
  getAveragePosition(contentId: string): number {
    const progressEntries = this.getContentProgress(contentId);
    if (progressEntries.length === 0) return 0;

    const totalPosition = progressEntries.reduce((sum, p) => sum + p.lastPosition, 0);
    return totalPosition / progressEntries.length;
  }
}
