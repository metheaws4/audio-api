# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Installation:**
```bash
npm install
```

**Development Server:**
```bash
npm run dev
```
Starts the server with ts-node for instant TypeScript compilation and restart on changes.

**Production Build:**
```bash
npm run build
```
Compiles TypeScript to JavaScript in the `dist/` directory.

**Production Start:**
```bash
npm start
```
Runs the compiled JavaScript from `dist/index.js`.

**Type Checking:**
```bash
npx tsc --noEmit
```
Performs type checking without emitting output files.

**Testing:**
Currently, no test framework is configured. To add tests:
1. Install testing dependencies: `npm install --save-dev jest @types/jest ts-jest`
2. Create Jest configuration
3. Add test files in `__tests__` directory or using `.test.ts` suffix
4. Add test script to package.json: `"test": "jest"`

## Architecture Overview

### Layered Structure
The backend follows a clean layered architecture that separates concerns and enables easy maintenance and future database migration:

1. **Routes Layer** (`src/routes/`)
   - Defines API endpoints and HTTP methods
   - Maps URLs to controller methods
   - Contains route-specific middleware (validation, rate limiting)

2. **Controllers Layer** (`src/controllers/`)
   - Handles HTTP request/response logic
   - Validates input and orchestrates service calls
   - Contains no business logic - only coordination

3. **Services Layer** (`src/services/`)
   - Implements business logic
   - Handles data processing and workflow orchestration
   - Communicates with storage layer
   - Each service has a single responsibility (auth, content, user, progress, storage)

4. **Storage Layer** (`src/services/storage.service.ts`)
   - Generic JSON-based storage service with CRUD operations
   - Implements Repository pattern for easy database migration
   - File-based storage in `/data` directory with JSON files

5. **Models Layer** (`src/models/`)
   - TypeScript interfaces defining data shapes
   - Shared between layers for type safety
   - Includes User, AudioContent, and UserProgress interfaces

6. **Middleware Layer** (`src/middleware/`)
   - Cross-cutting concerns: authentication, validation, error handling
   - Applied globally or per-route as needed
   - Includes JWT verification, role checking, request validation

7. **Utilities Layer** (`src/utils/`)
   - Helper functions: JWT handling, password hashing, file uploads
   - Reusable across multiple layers

### Data Flow
```
HTTP Request → Routes → Middleware → Controllers → Services → Storage → Database
```

### Key Design Patterns

- **Repository Pattern**: StorageService abstracts data access, enabling easy swap to MongoDB
- **Dependency Injection**: Services receive dependencies through constructors
- **Middleware Chain**: Express middleware for cross-cutting concerns
- **Separation of Concerns**: Each layer has a single responsibility

### File Storage Strategy
- Audio files stored in `uploads/audio/` with UUID filenames
- Thumbnails stored in `uploads/thumbnails/` with UUID filenames
- JSON storage contains only metadata and file paths (not base64 content)
- This approach keeps JSON files small and enables efficient file serving

### Extensibility Points
1. **Database Migration**: Replace `StorageService` implementation with MongoDB version
2. **Caching Layer**: Add Redis service in front of storage for frequent reads
3. **File Storage**: Switch to cloud storage (S3, GCS) by modifying upload service
4. **Authentication**: Extend JWT payload or add refresh token rotation
5. **Search**: Add search service layer (Elasticsearch, MongoDB text search)

### Security Implementation
- Passwords hashed with bcrypt (10 rounds)
- JWT tokens expire in 24 hours
- Separate secrets for user and admin tokens
- Rate limiting on authentication endpoints
- Input validation with Zod schema validation
- File type and size restrictions on uploads
- Security headers (HSTS, X-Frame-Options, etc.)
- Path traversal prevention in file uploads

### Environment Configuration
- `.env` file manages configuration
- Separate secrets for development/production
- Configurable port, CORS origins, rate limits
- Storage paths and file upload limits

This architecture provides a solid foundation that's easy to understand, maintain, and extend while following Node.js/Express best practices.