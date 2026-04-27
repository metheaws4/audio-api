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
- Authentication endpoints: 100 requests per 15 minutes
- Upload endpoints: 10 requests per hour

## Health Check
GET `/health`
Returns application health status.

## Authentication Endpoints

### Register
POST `/api/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "role": "user"
  },
  "tokens": {
    "accessToken": "string",
    "refreshToken": "string"
  }
}
```

### Login
POST `/api/auth/login`
Authenticate a user and return access token.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "role": "user" | "admin"
  },
  "tokens": {
    "accessToken": "string",
    "refreshToken": "string"
  }
}
```

### Admin Login
POST `/api/auth/admin/login`
Authenticate an admin user and return admin access token.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "message": "Admin login successful",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "role": "admin"
  },
  "tokens": {
    "accessToken": "string",
    "refreshToken": "string"
  }
}
```

### Get Profile
GET `/api/auth/me`
Get current user profile (requires authentication).

**Response:**
```json
{
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "role": "user" | "admin",
    "createdAt": "string"
  }
}
```

## Content Endpoints

### Get All Content
GET `/api/content`
Retrieve all audio content with optional filtering.

**Query Parameters:**
- `language`: string (filter by language)
- `category`: string (filter by category)
- `isPremium`: boolean (filter by premium/free)
- `search`: string (search in title/description)

**Response:**
```json
[
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
]
```

### Get Content by ID
GET `/api/content/:id`
Retrieve a specific content item by ID.

**Response:**
```json
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
```

### Get Content by Language
GET `/api/content/language/:language`
Get content filtered by language.

### Get Free Content
GET `/api/content/category/free`
Get all free content.

### Get Premium Content
GET `/api/content/category/premium`
Get all premium content (requires authentication).

### Search Content
GET `/api/content/search`
Search content by title or description.

**Query Parameters:**
- `q`: string (search query)

## Admin Endpoints (Require Admin Authentication)

### Create Content
POST `/api/admin/content`
Create a new content item (Admin only).

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "language": "string",
  "category": "string",
  "duration": "number",
  "isPremium": "boolean",
  "artist": "string",
  "tags": "string[]"
}
```

### Upload Audio
POST `/api/admin/content/:id/audio`
Upload audio file for content (Admin only).

**Request:** multipart/form-data with `audio` file field

### Upload Thumbnail
POST `/api/admin/content/:id/thumbnail`
Upload thumbnail image for content (Admin only).

**Request:** multipart/form-data with `thumbnail` file field

### Update Content
PUT `/api/admin/content/:id`
Update an existing content item (Admin only).

**Request Body:** Same as create content

### Delete Content
DELETE `/api/admin/content/:id`
Delete a content item (Admin only).

## User Endpoints

### Get Profile
GET `/api/user/profile`
Get user profile.

### Update Profile
PUT `/api/user/profile`
Update user profile.

**Request Body:**
```json
{
  "username": "string",
  "email": "string"
}
```

### Save Progress
POST `/api/user/progress`
Save user's playback progress for content.

**Request Body:**
```json
{
  "contentId": "string",
  "lastPosition": "number",
  "completed": "boolean"
}
```

### Get Progress
GET `/api/user/progress/:contentId`
Get user's progress for specific content.

### Get Favorites
GET `/api/user/favorites`
Get user's favorite content.

### Add to Favorites
POST `/api/user/favorites/:contentId`
Add content to user's favorites.

### Remove from Favorites
DELETE `/api/user/favorites/:contentId`
Remove content from user's favorites.

## Error Responses

### Validation Error (400)
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed"
  }
}
```

### Unauthorized (401)
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}
```

### Forbidden (403)
```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Insufficient permissions"
  }
}
```

### Not Found (404)
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found"
  }
}
```

### Rate Limit Exceeded (429)
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests, please try again later."
  }
}
```

### Internal Server Error (500)
```json
{
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "Internal Server Error"
  }
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment (development/production) | development |
| PORT | Server port | 3000 |
| API_PREFIX | API route prefix | /api/v1 |
| JWT_SECRET | Secret for signing JWT tokens | (required) |
| JWT_ADMIN_SECRET | Secret for admin JWT tokens | (required) |
| JWT_EXPIRES_IN | JWT expiration time | 24h |
| RATE_LIMIT_WINDOW | Rate limit window in ms | 900000 (15 min) |
| RATE_LIMIT_MAX_REQUESTS | Max requests per window | 100 |
| AUTH_RATE_LIMIT_WINDOW | Auth rate limit window in ms | 900000 (15 min) |
| AUTH_RATE_LIMIT_MAX_REQUESTS | Max auth requests per window | 100 |
| CORS_ORIGIN | Comma-separated list of allowed origins | http://localhost:3000,http://localhost:5173,http://localhost:5174 |
| CORS_CREDENTIALS | Enable CORS credentials | true |
| LOG_LEVEL | Logging level | info |
| STORAGE_PATH | Storage directory path | ./data |
| STORAGE_MAX_SIZE | Maximum storage size | 50mb |
| UPLOADS_DIR | Uploads directory | ./data/uploads |
| MAX_FILE_SIZE | Maximum file upload size | 50000000 (50MB) |
| ALLOWED_FILE_TYPES | Allowed MIME types for upload | audio/mpeg,audio/wav,audio/ogg,audio/mp4,image/jpeg,image/png,image/jpg |

## Development Scripts

| Script | Description |
|--------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start development server with ts-node |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Start production server |
| `npx tsc --noEmit` | Type checking without emitting |

## Security Features
- CORS with configurable origins and credentials
- Rate limiting to prevent abuse
- Security headers (X-Content-Type-Options, X-Frame-Options, etc.)
- JWT-based authentication with 24h expiration
- Password hashing with bcrypt (10 rounds)
- Input validation using Zod
- File type and size validation on uploads
- Error handling without stack traces in production

## File Storage Strategy
- Audio files stored in `uploads/audio/` with UUID filenames
- Thumbnails stored in `uploads/thumbnails/` with UUID filenames
- JSON storage contains only metadata and file paths (not base64 content)
- This approach keeps JSON files small and enables efficient file serving

## Supported Languages
- Hindi
- Marathi
- Bengali
- Punjabi
- Tamil
- Telugu
- Kannada
- Malayalam
- Gujarati
- Urdu