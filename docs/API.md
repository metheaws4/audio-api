
# Audio Platform API Documentation

## Overview
This document describes the RESTful API for the Audio Platform built with Express.js and TypeScript.

## Base URL
```
http://localhost:3000/api/v1
```

## Authentication
Most endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Response Format
All API responses follow this format:
```json
{
  "success": boolean,
  "data": object | array | null,
  "error": {
    "message": string,
    "code": string,
    "status": number
  } | null,
  "timestamp": string
}
```

## Rate Limiting
- General endpoints: 100 requests per 15 minutes
- Authentication endpoints: 50 requests per 15 minutes
- Upload endpoints: 10 requests per hour

## Health Check
GET `/health`
Returns application health status.

## Authentication Endpoints

### Login
POST `/api/v1/auth/login`
Authenticate a user and return access token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "email": "string",
      "username": "string",
      "role": "user" | "admin"
    },
    "tokens": {
      "accessToken": "string",
      "refreshToken": "string"
    }
  }
}
```

### Register
POST `/api/v1/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "username": "username",
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "email": "string",
      "username": "string",
      "role": "user"
    },
    "tokens": {
      "accessToken": "string",
      "refreshToken": "string"
    }
  }
}
```

### Logout
POST `/api/v1/auth/logout`
Logout the current user.

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Refresh Token
POST `/api/v1/auth/refresh-token`
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "string"
}
```

## Content Endpoints

### Get All Content
GET `/api/v1/content`
Retrieve all audio content with optional filtering.

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 10, max: 100)
- `sortBy`: string
- `sortOrder`: asc | desc

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "language": "string",
      "category": "string",
      "duration": "number",
      "fileUrl": "string",
      "thumbnailUrl": "string",
      "isPremium": "boolean",
      "artist": "string",
      "tags": "string[]",
      "createdAt": "string",
      "updatedAt": "string"
    }
  ],
  "count": "number"
}
```

### Get Content by ID
GET `/api/v1/content/:id`
Retrieve a specific content item by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "title": "string",
    "description": "string",
    "language": "string",
    "category": "string",
    "duration": "number",
    "fileUrl": "string",
    "thumbnailUrl": "string",
    "isPremium": "boolean",
    "artist": "string",
    "tags": "string[]",
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

### Create Content
POST `/api/v1/content`
Create a new content item (Admin only).

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "language": "string",
  "category": "string",
  "duration": "number",
  "fileUrl": "string",
  "thumbnailUrl": "string",
  "isPremium": "boolean",
  "artist": "string",
  "tags": "string[]"
}
```

### Update Content
PUT `/api/v1/content/:id`
Update an existing content item (Admin only).

**Request Body:** Same as create content

### Delete Content
DELETE `/api/v1/content/:id`
Delete a content item (Admin only).

## User Endpoints

### Get Profile
GET `/api/v1/users/profile`
Get the current user's profile.

### Update Profile
PUT `/api/v1/users/profile`
Update the current user's profile.

**Request Body:**
```json
{
  "username": "string",
  "email": "string"
}
```

### Get Favorites
GET `/api/v1/users/favorites`
Get the current user's favorite content IDs.

### Add to Favorites
POST `/api/v1/users/favorites/:contentId`
Add content to user's favorites.

### Remove from Favorites
DELETE `/api/v1/users/favorites/:contentId`
Remove content from user's favorites.

### Get History
GET `/api/v1/users/history`
Get the current user's playback history.

## Admin Endpoints

### Get All Users
GET `/api/v1/admin/users`
Get all users (Admin only).

### Get User by ID
GET `/api/v1/admin/users/:id`
Get a specific user by ID (Admin only).

### Update User Role
PUT `/api/v1/admin/users/:id/role`
Update a user's role (Admin only).

**Request Body:**
```json
{
  "role": "user" | "admin"
}
```

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "status": 400
  }
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "error": {
    "message": "Unauthorized access",
    "code": "UNAUTHORIZED",
    "status": 401
  }
}
```

### Forbidden (403)
```json
{
  "success": false,
  "error": {
    "message": "Forbidden access",
    "code": "FORBIDDEN",
    "status": 403
  }
}
```

### Not Found (404)
```json
{
  "success": false,
  "error": {
    "message": "Resource not found",
    "code": "NOT_FOUND",
    "status": 404
  }
}
```

### Rate Limit Exceeded (429)
```json
{
  "success": false,
  "error": {
    "message": "Too many requests, please try again later.",
    "code": "RATE_LIMIT_EXCEEDED",
    "status": 429
  }
}
```

### Internal Server Error (500)
```json
{
  "success": false,
  "error": {
    "message": "Internal Server Error",
    "code": "INTERNAL_ERROR",
    "status": 500
  }
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment (development/production/test) | development |
| PORT | Server port | 3000 |
| API_PREFIX | API route prefix | /api/v1 |
| JWT_SECRET | Secret for signing JWT tokens | (required) |
| JWT_ADMIN_SECRET | Secret for admin JWT tokens | (required) |
| JWT_EXPIRES_IN | JWT expiration time | 24h |
| RATE_LIMIT_WINDOW | Rate limit window in ms | 900000 (15 min) |
| RATE_LIMIT_MAX_REQUESTS | Max requests per window | 100 |
| AUTH_RATE_LIMIT_WINDOW | Auth rate limit window in ms | 900000 (15 min) |
| AUTH_RATE_LIMIT_MAX_REQUESTS | Max auth requests per window | 100 |
| CORS_ORIGIN | Comma-separated list of allowed origins | http://localhost:3000 |
| CORS_CREDENTIALS | Enable CORS credentials | true |
| LOG_LEVEL | Logging level | info |
| STORAGE_PATH | Storage directory path | ./data |

## Development Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with nodemon |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Start production server |
| `npm run type-check` | Check TypeScript types without emitting |
| `npm run type-check:watch` | Watch for TypeScript type errors |

## Security Features
- CORS with configurable origins and credentials
- Rate limiting to prevent abuse
- Helmet.js equivalent security headers
- JWT-based authentication
- Password hashing with bcrypt
- Input validation using Zod
- Error handling without stack traces in production
- Request logging for monitoring and debugging

## Database Support
The platform supports multiple storage options:
- Memory storage (default, for development)
- JSON file storage
- SQLite
- PostgreSQL
- MongoDB

Configure via `DB_TYPE` and related environment variables in `.env`.
