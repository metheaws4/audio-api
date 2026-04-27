import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { corsMiddleware } from './config/cors';
import { generalLimiter } from './middleware/rateLimiter';

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware setup - ORDER MATTERS
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

// CORS middleware
app.use(corsMiddleware);

// Request logging (simple console logger)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Apply general rate limiting to all routes
app.use(generalLimiter);

// Health check endpoint (no rate limiting)
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRoutes);

// 404 handler - must be last
app.use(notFoundHandler);

// Error handler - must be after all routes
app.use(errorHandler);

export default app;

// Only start server if this file is run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Audio Platform API running on http://localhost:${PORT}`);
    console.log(`📊 Health check available at http://localhost:${PORT}/health`);
    console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}