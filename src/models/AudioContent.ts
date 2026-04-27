
/**
 * AudioContent model interface
 * Represents an audio content item in the platform
 */

export interface AudioContent {
  id: string;
  title: string;
  description: string;
  language: string; // Hindi, Marathi, Bengali, etc.
  category: string; // e.g., Music, Podcast, Audiobook, Educational
  duration: number; // duration in seconds
  fileUrl: string; // path to audio file
  thumbnailUrl: string; // path to thumbnail image
  isPremium: boolean;
  artist: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * UserProgress model interface
 * Tracks user progress for audio content
 */

export interface UserProgress {
  id: string;
  userId: string;
  contentId: string;
  lastPosition: number; // last played position in seconds
  completed: boolean;
  startedAt: string;
  updatedAt: string;
  finishedAt: string | null;
}

/**
 * User model interface
 * Represents a platform user
 */

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  favorites: string[]; // array of content IDs
  createdAt: string;
  updatedAt: string;
}
