import type { Request, Response, NextFunction } from 'express';
import type { RateLimiterOptions } from '../types/rateLimiter';

// Rate limit store
type RateLimitStore = {
  [key: string]: {
    count: number;
    resetTime: number;
  };
};

const store: RateLimitStore = {};

// Cleanup expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const key of Object.keys(store)) {
    if (store[key].resetTime <= now) {
      delete store[key];
    }
  }
}, 60000); // Cleanup every minute

/**
 * Creates a rate limiter middleware
 */
export const createRateLimiter = (
  windowMs: number = 15 * 60 * 1000, // 15 minutes default
  maxRequests: number = 100
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const enableRateLimit = process.env.ENABLE_RATE_LIMITING !== 'false';

    if (!enableRateLimit) {
      next();
      return;
    }

    const identifier = req.ip || req.socket.remoteAddress || 'unknown';
    const key = `${identifier}:${req.path}`;
    const now = Date.now();

    const record = store[key];

    if (!record) {
      store[key] = {
        count: 1,
        resetTime: now + windowMs,
      };
      next();
      return;
    }

    if (now >= record.resetTime) {
      // Reset the window
      record.count = 1;
      record.resetTime = now + windowMs;
      next();
      return;
    }

    record.count++;

    if (record.count > maxRequests) {
      const retryAfter = Math.ceil((record.resetTime - now) / 1000);
      res.setHeader('Retry-After', retryAfter.toString());
      res.status(429).json({
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: `Too many requests. Please try again in ${retryAfter} seconds.`,
          retryAfter,
        },
      });
      return;
    }

    next();
  };
};

/**
 * General rate limiter applied to all routes
 */
export const generalLimiter = createRateLimiter(
  parseInt(process.env.RATE_LIMIT_WINDOW || '900000', 10),
  parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10)
);

/**
 * Auth-specific rate limiter (stricter)
 */
export const authLimiter = createRateLimiter(
  parseInt(process.env.AUTH_RATE_LIMIT_WINDOW || '900000', 10),
  parseInt(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS || '100', 10)
);
