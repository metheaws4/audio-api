
/**
 * Content Service
 * Handles CRUD operations for audio content
 */

import { AudioContent } from '../models/AudioContent';
import { StorageService } from './storage.service';

export class ContentService {
  private storage: StorageService<AudioContent>;

  constructor() {
    this.storage = new StorageService<AudioContent>('audio-content');
  }

  /**
   * Get all audio content with optional filters
   */
  getAll(filters?: {
    language?: string;
    category?: string;
    isPremium?: boolean;
    freeOnly?: boolean;
    premiumOnly?: boolean;
  }): AudioContent[] {
    let items = this.storage.findAll();

    if (filters) {
      if (filters.language) {
        items = items.filter((item) => item.language === filters.language);
      }
      if (filters.category) {
        items = items.filter((item) => item.category === filters.category);
      }
      if (filters.isPremium !== undefined) {
        items = items.filter((item) => item.isPremium === filters.isPremium);
      }
      if (filters.freeOnly) {
        items = items.filter((item) => !item.isPremium);
      }
      if (filters.premiumOnly) {
        items = items.filter((item) => item.isPremium);
      }
    }

    return items;
  }

  /**
   * Get audio content by ID
   */
  getById(id: string): AudioContent | null {
    return this.storage.findById(id);
  }

  /**
   * Get audio content by multiple IDs
   */
  getByIds(ids: string[]): AudioContent[] {
    return this.storage.findBy((item) => ids.includes(item.id));
  }

  /**
   * Get content by category
   */
  getByCategory(category: string): AudioContent[] {
    return this.storage.findBy((item) => item.category === category);
  }

  /**
   * Get content by language
   */
  getByLanguage(language: string): AudioContent[] {
    return this.storage.findBy((item) => item.language === language);
  }

  /**
   * Get content by tags
   */
  getByTag(tag: string): AudioContent[] {
    return this.storage.findBy((item) => item.tags.includes(tag));
  }

  /**
   * Get premium content
   */
  getPremiumContent(): AudioContent[] {
    return this.storage.findBy((item) => item.isPremium);
  }

  /**
   * Get free content
   */
  getFreeContent(): AudioContent[] {
    return this.storage.findBy((item) => !item.isPremium);
  }

  /**
   * Search content by title or description
   */
  search(query: string): AudioContent[] {
    const q = query.toLowerCase();
    return this.storage.findBy(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.artist.toLowerCase().includes(q) ||
        item.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }

  /**
   * Create new audio content
   */
  create(content: Omit<AudioContent, 'id'>): AudioContent {
    const now = new Date().toISOString();
    const newContent = {
      ...content,
      createdAt: now,
      updatedAt: now,
    };
    return this.storage.create(newContent);
  }

  /**
   * Update audio content
   */
  update(id: string, content: Partial<AudioContent>): AudioContent | null {
    const existing = this.storage.findById(id);
    if (!existing) {
      return null;
    }

    const updated = {
      ...existing,
      ...content,
      id,
      updatedAt: new Date().toISOString(),
    };

    return this.storage.update(id, updated);
  }

  /**
   * Delete audio content
   */
  delete(id: string): boolean {
    return this.storage.delete(id);
  }

  /**
   * Get content count
   */
  getCount(): number {
    return this.storage.count();
  }

  /**
   * Check if content exists
   */
  exists(id: string): boolean {
    return this.storage.exists(id);
  }
}
