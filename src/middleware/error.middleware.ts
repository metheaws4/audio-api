import type { Request, Response, NextFunction } from 'express';

/**
 * Error response interface
 */
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Cannot ${req.method} ${req.path}`,
    },
  });
};

/**
 * Global error handler
 * Must be the last middleware - after all routes
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log error in non-production environments
  if (process.env.NODE_ENV !== 'production') {
    console.error('[ERROR]', {
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method,
      error: err.message,
      stack: err.stack,
      body: req.body,
    });
  }

  // Handle ApiError instances
  if (err.code && err.statusCode) {
    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        ...(err.details && { details: err.details }),
      },
    });
    return;
  }

  // Handle JSON parse errors
  if (err.type === 'entity.parse.failed') {
    res.status(400).json({
      error: {
        code: 'INVALID_JSON',
        message: 'Malformed JSON in request body',
      },
    });
    return;
  }

  // Handle multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    res.status(413).json({
      error: {
        code: 'FILE_TOO_LARGE',
        message: 'File size exceeds the limit',
      },
    });
    return;
  }

  // Handle multer file type errors
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    res.status(400).json({
      error: {
        code: 'INVALID_FILE_TYPE',
        message: err.message || 'Invalid file type',
      },
    });
    return;
  }

  // Default 500 error
  res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: process.env.NODE_ENV === 'production'
        ? 'An internal server error occurred'
        : err.message,
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    },
  });
};
