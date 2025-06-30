# API Response System

This directory contains type definitions and utility functions for API responses.

## Directory Structure

```bash
api/
├── types/           # Type definitions only
│   ├── index.ts         # Central export point
│   ├── api-response.ts  # API response types
│   ├── common.ts        # Common types
│   ├── health.ts        # Health-related types
│   └── http-status.ts   # HTTP status types
├── utils/           # Implementation & helper functions
│   ├── api-response.ts  # API response utilities
│   ├── system-info.ts   # System information utilities
│   └── text-formatting.ts # Text formatting functions
├── schemas/         # Validation schemas (Zod)
│   ├── common.ts
│   └── health.ts
├── constants/       # Constants & utilities
│   └── http-status.ts
├── routes/          # Route modules (by resource)
│   └── health.ts    # Health check endpoints
└── types.ts         # Main export file
```

## Design Philosophy

### Separation of Concerns

- **`types/`**: Pure type definitions only
- **`utils/`**: Implementation logic and helper functions
- **`schemas/`**: Validation schemas (Zod)
- **`constants/`**: Constants and utility functions
- **`routes/`**: Route modules organized by resource

### Beginner-Friendly Structure

- Clear separation between types and implementation
- Intuitive file organization
- Limited files to modify when adding new endpoints

## Basic Usage

### Using Type Definitions

```typescript
import type { ApiResponse, SuccessApiResponse } from '@/server/api/types';

// Use as type annotation
function handleResponse(response: ApiResponse<User>) {
  // ...
}
```

### Using Helper Functions

```typescript
import { createSuccessApiResponse, createErrorApiResponse } from '@/server/api/types';

// Create responses in Hono routes
userRoutes.get('/', (context) => {
  try {
    const users = await fetchUsers();
    return context.json(createSuccessApiResponse(users));
  } catch (error) {
    return context.json(createErrorApiResponse('Failed to fetch users'), HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
});
```

### TanStack Start Integration

```typescript
// Server Functions (recommended for frontend integration)
import { createServerFn } from '@tanstack/react-start';
import { createSuccessApiResponse, createErrorApiResponse } from '@/server/api/types';

const getUsers = createServerFn({
  method: 'GET',
}).handler(async () => {
  try {
    const users = await fetchUsers();
    return createSuccessApiResponse(users);
  } catch (error) {
    return createErrorApiResponse('Failed to fetch users');
  }
});

// Usage in component
function UserList() {
  const users = await getUsers();
  return <div>{/* render users */}</div>;
}
```

## Adding New Endpoints

1. **Types**: Add new types to `types/` if needed
2. **Schemas**: Add validation schemas to `schemas/` if needed
3. **Routes**: Implement endpoint in `routes/`
4. **Registration**: Register route in `$.ts`
5. **Tests**: Add tests in `__test__/`

## Type Guards

Type guards are available for improved type safety:

```typescript
import { isSuccessApiResponse, isErrorApiResponse } from '@/server/api/types';

if (isSuccessApiResponse(response)) {
  // response.data is guaranteed to exist
  console.log(response.data);
}

if (isErrorApiResponse(response)) {
  // response.error is guaranteed to exist
  console.error(response.error);
}
```

## Available Types

### API Response Types

- `ApiResponse<T>` - Base response interface
- `SuccessApiResponse<T>` - Success response with data
- `ErrorApiResponse` - Error response with error message
- `MessageApiResponse` - Response with custom message
- `SuccessApiResponseWithMessage<T>` - Success response with both data and message

### Common Types

- `ResponseFormat` - Response format options ('json' | 'text')
- `PaginationQuery` - Pagination parameters
- `CommonQuery` - Common query parameters
- `SearchQuery` - Search query parameters

### Health Types

- `HealthDetailsLevel` - Health check detail levels
- `HealthCheckQuery` - Health check query parameters
- `MemoryUsage` - Memory usage information
- `BasicHealthStatus` - Basic health status
- `FullHealthStatus` - Full health status with system details

### HTTP Status Types

- `HttpStatusCode` - HTTP status code values
- `HttpStatusCategory` - HTTP status categories
- `HttpStatusInfo` - HTTP status with category information

## Legacy Support

For backward compatibility, the following legacy exports are available:

```typescript
import { createApiResponse, createApiError } from '@/server/api/types';
```

> **Note**: These will be removed in the next major version. Use the new function names in new code.

## Migration Guide

### From Mixed Schema/Type Files

```typescript
// Old way (schemas with types)
import type { ResponseFormat } from '@/server/api/schemas/common';

// New way (pure types)
import type { ResponseFormat } from '@/server/api/types';
```

### From Type Definitions in Utils

```typescript
// Old way (types mixed with functions)
import { ApiResponse, createSuccessApiResponse } from '@/server/api/types/api-response';

// New way (clean separation)
import type { ApiResponse } from '@/server/api/types';
import { createSuccessApiResponse } from '@/server/api/types';
```

## TanStack Start Specific Features

### Server Functions vs API Routes

Choose the appropriate approach based on your use case:

**Server Functions** (Type-safe, integrated with frontend):
```typescript
const getUserData = createServerFn({
  method: 'GET',
}).handler(async () => {
  // Server-side logic here
  return createSuccessApiResponse(userData);
});
```

**API Routes** (Traditional REST endpoints):
```typescript
// routes/users.ts
export const userRoutes = new Hono();

userRoutes.get('/users', (context) => {
  return context.json(createSuccessApiResponse(users));
});

// Register in $.ts
honoApplication.route('/users', userRoutes);
```

### Error Handling

```typescript
// Global error handler in $.ts
honoApplication.onError((error, context) => {
  consola.error('API Error:', error);
  const errorMessage = apiConfig.errors.showDetails && error instanceof Error ? error.message : 'Internal Server Error';
  const errorResponse = createErrorApiResponse(errorMessage);
  return context.json(errorResponse, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
});
```

### Configuration

API behavior is configured in `config.ts`:

```typescript
export const apiConfig = {
  cors: {
    origin: IS_PRODUCTION ? allowedOrigins : '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  },
  errors: {
    showDetails: !IS_PRODUCTION,
  },
  logging: {
    enabled: true,
  },
};
```

This ensures consistent error handling and CORS configuration across all API endpoints.