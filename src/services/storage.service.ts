
/**
 * Generic JSON Storage Service
 * Provides CRUD operations for JSON file-based storage
 */

import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

const DATA_DIR = path.join(__dirname, '../../data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export class StorageService<T extends { id?: string }> {
  private filePath: string;

  constructor(private fileName: string) {
    this.filePath = path.join(DATA_DIR, `${fileName}.json`);
    this.initializeFile();
  }

  /**
   * Initialize the JSON file if it doesn't exist
   */
  private initializeFile(): void {
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([]));
    }
  }

  /**
   * Read all items from the JSON file
   */
  private readAll(): T[] {
    try {
      const data = fs.readFileSync(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading file ${this.filePath}:`, error);
      return [];
    }
  }

  /**
   * Write all items to the JSON file
   */
  private writeAll(items: T[]): void {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(items, null, 2));
    } catch (error) {
      console.error(`Error writing file ${this.filePath}:`, error);
      throw new Error('Failed to write data');
    }
  }

  /**
   * Find all items
   */
  findAll(): T[] {
    return this.readAll();
  }

  /**
   * Find items by filter function
   */
  findBy(filterFn: (item: T) => boolean): T[] {
    return this.readAll().filter(filterFn);
  }

  /**
   * Find item by ID
   */
  findById(id: string): T | null {
    const items = this.readAll();
    const item = items.find((item) => item.id === id);
    return item || null;
  }

  /**
   * Find a single item by filter
   */
  findOne(filterFn: (item: T) => boolean): T | null {
    const items = this.readAll();
    const item = items.find(filterFn);
    return item || null;
  }

  /**
   * Create a new item
   */
  create(data: Omit<T, 'id'>): T {
    const items = this.readAll();
    const newItem = {
      ...data,
      id: uuidv4(),
    } as T;
    items.push(newItem);
    this.writeAll(items);
    return newItem;
  }

  /**
   * Update an existing item by ID
   */
  update(id: string, data: Partial<T>): T | null {
    const items = this.readAll();
    const index = items.findIndex((item) => item.id === id);

    if (index === -1) {
      return null;
    }

    const updatedItem = {
      ...items[index],
      ...data,
      id, // preserve the original ID
    } as T;

    items[index] = updatedItem;
    this.writeAll(items);
    return updatedItem;
  }

  /**
   * Delete an item by ID
   */
  delete(id: string): boolean {
    const items = this.readAll();
    const index = items.findIndex((item) => item.id === id);

    if (index === -1) {
      return false;
    }

    items.splice(index, 1);
    this.writeAll(items);
    return true;
  }

  /**
   * Check if an item exists by ID
   */
  exists(id: string): boolean {
    const items = this.readAll();
    return items.some((item) => item.id === id);
  }

  /**
   * Count all items
   */
  count(): number {
    return this.readAll().length;
  }
}
