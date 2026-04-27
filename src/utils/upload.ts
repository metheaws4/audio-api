
/**
 * File Upload Utility
 * Multer configuration for audio files and thumbnails
 */

import multer, { StorageEngine, FileFilterCallback } from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';

// File type validation
const audioFileTypes = /mp3|wav|ogg|m4a|aac/;
const imageFileTypes = /jpeg|jpg|png|gif|webp/;

// File upload destinations
const AUDIO_UPLOAD_PATH = path.join(process.cwd(), 'uploads', 'audio');
const THUMBNAIL_UPLOAD_PATH = path.join(process.cwd(), 'uploads', 'thumbnails');

// Ensure upload directories exist
import * as fs from 'fs';
[AUDIO_UPLOAD_PATH, THUMBNAIL_UPLOAD_PATH].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

/**
 * Check if file type is valid
 */
const checkFileType = (file: Express.Multer.File, fileTypes: RegExp): boolean => {
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);
  return extname && mimetype;
};

/**
 * Storage configuration for audio files
 */
const audioStorage: StorageEngine = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, AUDIO_UPLOAD_PATH);
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const uniqueId = uuidv4();
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueId}${ext}`);
  }
});

/**
 * Storage configuration for thumbnail images
 */
const thumbnailStorage: StorageEngine = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, THUMBNAIL_UPLOAD_PATH);
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const uniqueId = uuidv4();
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueId}${ext}`);
  }
});

/**
 * File filter for audio files
 */
const audioFileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (checkFileType(file, audioFileTypes)) {
    cb(null, true);
  } else {
    cb(new Error('Error: Audio files only! (mp3, wav, ogg, m4a, aac)'));
  }
};

/**
 * File filter for image files
 */
const imageFileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (checkFileType(file, imageFileTypes)) {
    cb(null, true);
  } else {
    cb(new Error('Error: Image files only! (jpeg, jpg, png, gif, webp)'));
  }
};

/**
 * Audio upload middleware
 */
export const uploadAudio = multer({
  storage: audioStorage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: audioFileFilter
});

/**
 * Thumbnail upload middleware
 */
export const uploadThumbnail = multer({
  storage: thumbnailStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: imageFileFilter
});

/**
 * Get file URL for served static files
 */
export const getFileUrl = (filename: string, type: 'audio' | 'thumbnail'): string => {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  return `${baseUrl}/uploads/${type}/${filename}`;
};
