# 🔥 Hono + Nuxt 3 API Integration Guide

> **📖 Language**: [English](README.md) | [日本語](../ja/README.md)

Fast, lightweight, and type-safe API development integration.

## 🎯 Improved Features

This implementation has been improved to follow Hono's official best practices:

### ✅ **Hono-like Simplicity**

- Eliminated excessive abstraction
- Direct and understandable code structure
- Maximum effect with minimal concepts

### ✅ **Beginner-Friendly Design**

- Simplified comments
- Clear file structure at a glance
- Focus on practical examples

### ✅ **Enhanced Type Safety**

- Proper use of Zod validation
- Eliminated redundant type checking
- Maximum utilization of TypeScript's power

### ✅ **Clean Architecture**

- Complete separation of types, utilities, and schemas
- Intuitive file organization
- Single responsibility principle

## 🚀 Quick Start

### 1. Start Development Server

```bash
npm run dev  # or pnpm dev
```

### 2. Test Endpoints

```bash
# Basic health check
curl http://localhost:3000/api/health

# Detailed system information
curl http://localhost:3000/api/health?details=full

# Text format
curl http://localhost:3000/api/health?format=text

# Simple ping
curl http://localhost:3000/api/ping
```

### 3. Add New Routes

Create a new route file:

```typescript
// routes/users.ts
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { HTTP_STATUS_CODES, createSuccessApiResponse } from '../types';

const UserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

export const userRoutes = new Hono();

userRoutes.get('/users', (context) => {
  return context.json(createSuccessApiResponse([]));
});

userRoutes.post('/users', zValidator('json', UserSchema), (context) => {
  const userData = context.req.valid('json');
  return context.json(createSuccessApiResponse(userData), HTTP_STATUS_CODES.CREATED);
});
```

Register in main router:

```typescript
// [...].ts
import { userRoutes } from './routes/users';
honoApplication.route('/users', userRoutes);
```

## 📁 Improved Architecture

With proper separation of concerns, we now have a clear structure:

```
src/server/api/
├── [...].ts                      # Main Hono integration (catch-all route)
├── config.ts                     # Centralized API configuration
├── index.ts                      # Package main entry point
├── types.ts                      # Main type export file
├── types/                        # Type definitions only
│   ├── index.ts                  # Central type exports
│   ├── api-response.ts           # API response types
│   ├── common.ts                 # Common types
│   ├── health.ts                 # Health-related types
│   └── http-status.ts            # HTTP status types
├── utils/                        # Implementation & helper functions
│   ├── api-response.ts           # API response utilities
│   ├── system-info.ts            # System information utilities
│   └── text-formatting.ts       # Text formatting functions
├── constants/
│   └── http-status.ts            # HTTP status code constants
├── schemas/                      # Validation schemas (Zod)
│   ├── common.ts                 # Common validation schemas
│   └── health.ts                 # Health-specific schemas
├── routes/                       # Route modules (by resource)
│   └── health.ts                 # Health check endpoints
├── docs/                         # Multi-language documentation
│   ├── en/                       # English documentation
│   │   ├── README.md             # Complete English guide
│   │   └── api-response-system.md # Type system documentation
│   └── ja/                       # Japanese documentation
│       ├── README.md             # Complete Japanese guide
│       └── api-response-system.md # Type system documentation
└── __test__/                     # Test files
```

## 🧪 Testing the API

After starting the development server, you can test the endpoints:

```bash
# Health check
curl http://localhost:3000/api/health
# Response: {"data":{"status":"ok","timestamp":"2025-06-21T10:17:44.471Z","uptime":262.92}}

# Ping endpoint
curl http://localhost:3000/api/ping
# Response: {"data":{"message":"pong","timestamp":"2025-06-21T10:17:44.471Z","service":"hono-api"}}
```

All endpoints return JSON responses with appropriate HTTP status codes and consistent data structure.

## 🏗️ Architecture

### Refactored Structure

Following TidyFirst principles, we've separated responsibilities into dedicated files:

```bash
src/server/api/
├── [...].ts                      # Main Hono integration (catch-all route)
├── config.ts                     # Centralized API configuration
├── index.ts                      # Package main entry point
├── types.ts                      # Unified type exports
├── constants/
│   └── http-status.ts           # HTTP status code constants
├── types/
│   └── api-response.ts          # API response types and utilities
├── schemas/
│   ├── common.ts                # Common validation schemas
│   └── health.ts                # Health-specific schemas
├── utils/
│   ├── system-info.ts           # System information utilities
│   └── text-formatting.ts      # Text formatting functions
├── routes/                      # Route modules (one per resource)
│   └── health.ts                # Health check endpoints
├── docs/                        # Multi-language documentation
│   ├── en/                      # English documentation
│   └── ja/                      # Japanese documentation
└── __test__/                    # Test files
```

### 🔄 **Comparison with Previous Structure**

| Role                   | Previous               | Current                    |
| ---------------------- | ---------------------- | -------------------------- |
| **Type Definitions**   | Scattered in files     | Centralized in `types/`    |
| **HTTP Constants**     | Inside `types.ts`      | `constants/http-status.ts` |
| **Response Functions** | Mixed with types       | `utils/api-response.ts`    |
| **Validation**         | Inside route files     | `schemas/` directory       |
| **Utilities**          | Distributed by feature | `utils/` directory         |

### 📦 **New Import Methods**

```typescript
// From main entry point (recommended)
import { HTTP_STATUS_CODES, createSuccessApiResponse } from '../types';
import type { ApiResponse, HealthCheckQuery } from '../types';

// Or direct import
import { HTTP_STATUS_CODES } from '../constants/http-status';
import { createSuccessApiResponse } from '../utils/api-response';
import type { ApiResponse } from '../types/api-response';
```

### ✨ **Benefits of Improvements**

1. **Separation of Concerns**: Each file has a single responsibility
2. **Type Centralization**: All types consolidated in `types/` directory
3. **Better Maintainability**: Minimized scope of changes
4. **Enhanced Testability**: Independent functions make testing easier
5. **Type Safety**: More detailed and accurate type definitions
6. **Team Development**: File structure that avoids conflicts
7. **Scalability**: Minimized impact on existing code when adding new features
8. **Beginner-Friendly**: Intuitive understanding of file roles

9. **Separation of concerns**: Each file has a single responsibility
10. **Improved maintainability**: Changes have minimal impact on other parts
11. **Better testability**: Independent functions are easier to test
12. **Enhanced type safety**: More detailed and accurate type definitions
13. **Team-friendly**: Reduced conflicts during collaborative development
14. **Scalability**: Easier to add new features without affecting existing code

### 🚀 **TidyFirst Improvements**

- **No abbreviations**: `app` → `honoApplication`, `c` → `context`
- **Intention-revealing names**: `createApiResponse` → `createSuccessApiResponse`
- **Specific type names**: `HttpStatus` → `HttpStatusCode`

For detailed technical changes, see [`REFACTORING.md`](../../REFACTORING.md).

## ➕ Adding New API Endpoints

### Step 1: Create a New Route File

Create a new file in `routes/` directory (e.g., `routes/users.ts`) with Zod validation:

```typescript
/**
 * User Routes with Updated Structure
 * Using the refactored file structure and TidyFirst naming conventions
 */
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { HTTP_STATUS_CODES, createSuccessApiResponse, createErrorApiResponse } from '../types';

// Validation schemas
const CreateUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be under 100 characters'),
  email: z.string().email('Valid email address required'),
  age: z.number().int().min(0, 'Age must be 0 or greater').max(120, 'Age must be 120 or less').optional(),
});

const UserParamsSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID must be a number'),
});

const PaginationQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('10'),
  search: z.string().optional(),
});

// Type inference
type CreateUserInput = z.infer<typeof CreateUserSchema>;
type UserParams = z.infer<typeof UserParamsSchema>;
type PaginationQuery = z.infer<typeof PaginationQuerySchema>;

// Create route instance
export const userRoutes = new Hono();

// 📖 GET - Retrieve users with pagination
userRoutes.get('/', zValidator('query', PaginationQuerySchema), (context) => {
  const { page, limit, search } = context.req.valid('query');

  let users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', age: 30 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25 },
  ];

  // Search filtering
  if (search) {
    users = users.filter((user) => user.name.includes(search) || user.email.includes(search));
  }

  // Pagination
  const startIndex = (page - 1) * limit;
  const paginatedUsers = users.slice(startIndex, startIndex + limit);

  return context.json(
    createSuccessApiResponse({
      users: paginatedUsers,
      pagination: {
        page,
        limit,
        total: users.length,
        totalPages: Math.ceil(users.length / limit),
      },
    }),
    HTTP_STATUS_CODES.OK,
  );
});

// 📖 GET - Get specific user
userRoutes.get('/:id', zValidator('param', UserParamsSchema), (context) => {
  const { id } = context.req.valid('param');

  const user = {
    id: parseInt(id),
    name: 'John Doe',
    email: 'john@example.com',
    age: 30,
  };

  return context.json(createSuccessApiResponse(user), HTTP_STATUS_CODES.OK);
});

// ✏️ POST - Create new user
userRoutes.post('/', zValidator('json', CreateUserSchema), async (context) => {
  const validatedUserData = context.req.valid('json');

  const newUser = {
    id: Date.now(), // Simple ID generation
    ...validatedUserData,
    createdAt: new Date().toISOString(),
  };

  return context.json(createSuccessApiResponse(newUser), HTTP_STATUS_CODES.CREATED);
});

// �️ DELETE - Remove user
userRoutes.delete('/:id', zValidator('param', UserParamsSchema), (context) => {
  const { id } = context.req.valid('param');

  const deleteResult = {
    id: parseInt(id),
    message: `User with ID ${id} has been deleted`,
    deletedAt: new Date().toISOString(),
  };

  return context.json(createSuccessApiResponse(deleteResult), HTTP_STATUS_CODES.OK);
});
```

### Step 2: Register the Route

Add your route to `[...].ts`:

```typescript
// Add import at the top
import { userRoutes } from './routes/users';

// Add route registration (after healthRoutes)
honoApplication.route('/users', userRoutes);
```

### Step 3: Test Your Endpoints

```bash
# 📖 GET - List all users
curl http://localhost:3000/api/users

# 📖 GET - Get specific user
curl http://localhost:3000/api/users/1

# ✏️ POST - Create new user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice Johnson","email":"alice@example.com"}'

# 🔄 PUT - Update entire user
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"John Updated","email":"john.updated@example.com"}'

# 🔧 PATCH - Partial update
curl -X PATCH http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"John Partially Updated"}'

# 🗑️ DELETE - Remove user
curl -X DELETE http://localhost:3000/api/users/1
```

## 🔧 HTTP Methods Reference

| Method   | Purpose                | Example Use Case              |
| -------- | ---------------------- | ----------------------------- |
| `GET`    | Retrieve data          | Get user list, get user by ID |
| `POST`   | Create new resource    | Create new user, submit form  |
| `PUT`    | Update entire resource | Replace user data completely  |
| `PATCH`  | Partial update         | Update only user's name       |
| `DELETE` | Remove resource        | Delete user account           |

## 🔍 Common Patterns

### Query Parameters

```typescript
userRoutes.get('/', (context) => {
  const page = context.req.query('page') || '1';
  const limit = context.req.query('limit') || '10';
  const search = context.req.query('search') || '';

  // Use parameters in your logic
  return context.json(createSuccessApiResponse({ page, limit, search }));
});

// Test: GET /api/users?page=2&limit=5&search=john
```

### Path Parameters

```typescript
userRoutes.get('/:id/posts/:postId', (context) => {
  const userId = context.req.param('id');
  const postId = context.req.param('postId');

  return context.json(createSuccessApiResponse({ userId, postId }));
});

// Test: GET /api/users/123/posts/456
```

### Headers

```typescript
userRoutes.get('/profile', (context) => {
  const authorization = context.req.header('Authorization');
  const userAgent = context.req.header('User-Agent');

  if (!authorization) {
    return context.json(createErrorApiResponse('Unauthorized'), HTTP_STATUS_CODES.UNAUTHORIZED);
  }

  return context.json(createSuccessApiResponse({ authorized: true }));
});
```

### Request Body (JSON)

```typescript
userRoutes.post('/', async (context) => {
  const body = await context.req.json();

  // Destructure specific fields
  const { name, email, age } = body;

  return context.json(createSuccessApiResponse({ name, email, age }));
});
```

### Form Data

```typescript
userRoutes.post('/upload', async (context) => {
  const formData = await context.req.formData();
  const file = formData.get('file');
  const description = formData.get('description');

  return context.json(createSuccessApiResponse({ file: file?.name, description }));
});
```

## 🛡️ Middleware Examples

### Adding Custom Middleware

#### Global Middleware (in `[...].ts`)

```typescript
// Request logging
honoApplication.use('*', async (context, next) => {
  console.log(`${context.req.method} ${context.req.url}`);
  await next();
});

// Authentication middleware
honoApplication.use('/api/admin/*', async (context, next) => {
  const token = context.req.header('Authorization');
  if (!token || !token.startsWith('Bearer ')) {
    return context.json(createErrorApiResponse('Unauthorized'), HTTP_STATUS_CODES.UNAUTHORIZED);
  }
  await next();
});
```

#### Route-Specific Middleware

```typescript
// In your route file
userRoutes.use('/protected/*', async (context, next) => {
  const token = context.req.header('authorization');
  if (!token) {
    return context.json(createErrorApiResponse('Unauthorized'), HTTP_STATUS_CODES.UNAUTHORIZED);
  }
  await next();
});

// Protected route
userRoutes.get('/protected/profile', (context) => {
  return context.json(createSuccessApiResponse({ message: 'This is protected!' }));
});
```

## ⚙️ Configuration

### Environment Variables

Configure your API in `config.ts` based on environment:

```typescript
export const apiConfig = {
  cors: {
    origin: IS_PRODUCTION ? (process.env.ALLOWED_ORIGINS?.split(',') ?? ['https://yourdomain.com']) : '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'] as string[],
    allowHeaders: ['Content-Type', 'Authorization'] as string[],
  },
  rateLimit: {
    enabled: IS_PRODUCTION,
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // requests per window
  },
};
```

### Custom Environment Variables

Create a `.env` file in your project root:

```env
# API Configuration
ALLOWED_ORIGINS=https://yourapp.com,https://www.yourapp.com
API_SECRET_KEY=your-secret-key-here
DATABASE_URL=your-database-connection-string
```

## 🎯 Best Practices

1. **📁 File Organization**: Separate files by responsibility and group related functionality
2. **🔧 Type System**: Centralize type definitions in `types/` directory, separate from implementation
3. **🛡️ Zod Validation**: Use type-safe runtime validation
4. **📊 Consistent Responses**: Use `createSuccessApiResponse()` and `createErrorApiResponse()`
5. **🚨 Error Handling**: Handle errors gracefully with appropriate HTTP status codes
6. **📝 Type Safety**: Auto-generate TypeScript types from Zod schemas
7. **🧪 Testing**: Test all endpoints with curl or API testing tools
8. **🔗 RESTful URLs**: Follow REST conventions in URL patterns
9. **🔄 Data Transformation**: Leverage Zod's transform features for proper data formatting
10. **📛 Clear Naming**: Follow TidyFirst principles with descriptive variable/function names
11. **🔧 Single Responsibility**: Design each file/function to have a single responsibility

## 🚨 Troubleshooting

### Common Issues

| Issue                     | Solution                                   |
| ------------------------- | ------------------------------------------ |
| **Route not found (404)** | Check if route is registered in `[...].ts` |
| **CORS errors**           | Update `cors` configuration in `config.ts` |
| **Type errors**           | Ensure proper imports and type definitions |
| **Middleware conflicts**  | Check middleware registration order        |
| **JSON parsing errors**   | Validate request body format               |

### Debugging Tips

```typescript
// Add debug logging
userRoutes.get('/debug', (context) => {
  console.log('Headers:', context.req.header());
  console.log('Query:', context.req.query());
  console.log('URL:', context.req.url);

  return context.json(createSuccessApiResponse({ debug: 'info logged' }));
});
```

## 📚 Resources

- [Hono Documentation](https://hono.dev/)
- [Nuxt 3 Server API](https://nuxt.com/docs/guide/directory-structure/server)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [REST API Best Practices](https://restfulapi.net/)
