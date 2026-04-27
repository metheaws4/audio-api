
/**
 * Main Express Application
 * Sets up middleware, routes, and server configuration
 */

import express, { Request, Response, NextFunction } from 'express';
import httpErrors from 'http-errors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { createServer } from 'http';

// Load environment variables
dotenv.config();

// Import routes
import contentRoutes from './routes/content.routes';
import adminRoutes from './routes/admin.routes';
import userRoutes from './routes/user.routes';

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware setup
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded bodies
app.use(morgan('dev')); // HTTP request logger

// Serve static files (uploads)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Audio Platform API is healthy',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/content', contentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);

// 404 handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(httpErrors(404, 'Route not found'));
});

// Error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }

  // Render error page
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Create HTTP server
const server = createServer(app);

// Export app and server for testing
export { app };
export default server;
