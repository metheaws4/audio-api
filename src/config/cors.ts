import cors from 'cors';
import type { RequestHandler } from 'express';

const envCorsOrigins = process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'];

const enableCors = process.env.ENABLE_CORS !== 'false';

/**
 * CORS middleware configuration
 */
export const corsMiddleware: RequestHandler = enableCors
  ? cors({
      origin: envCorsOrigins,
      credentials: process.env.CORS_CREDENTIALS === 'true',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      exposedHeaders: ['Content-Range', 'X-Content-Range'],
    })
  : ((req, res, next) => next());
