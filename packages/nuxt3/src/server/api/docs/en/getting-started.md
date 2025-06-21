# 🚀 Beginner's Guide to Hono + Nuxt3

This guide will teach you how to build APIs with Hono integrated into Nuxt3, step by step.

## 🎯 Learning Goals

After reading this guide, you will be able to:

- ✅ Understand the basic concepts of Hono
- ✅ Create new API endpoints
- ✅ Implement request validation
- ✅ Handle errors properly
- ✅ Standardize response formats

## 🧠 Basic Concepts

### What is Hono?

```typescript
// Hono means "flame" in Japanese
// 🔥 Fast and lightweight web framework
// 🌐 Optimized for edge runtimes
// 🛡️ TypeScript-first with type safety
```

### Why Choose Hono?

1. **🚀 Performance**: Faster than Express.js
2. **🪶 Lightweight**: Small bundle size
3. **🛡️ Type Safety**: Great TypeScript integration
4. **🌏 Modern**: Web standards compliant

## 📚 Step 1: Understanding the Basic Structure

### Directory Structure

```bash
src/server/api/
├── [...].ts              # Main Hono application
├── config.ts             # Configuration file
├── types/                # Type definitions
├── utils/                # Helper functions
├── schemas/              # Validation schemas
└── routes/               # API routes
    └── health.ts         # Sample route
```

### Role of Each Part

- **`[...].ts`**: Connects Hono to Nuxt3 using catch-all functionality
- **`config.ts`**: Configuration for CORS, logging, error handling
- **`types/`**: Centralized TypeScript type definitions
- **`utils/`**: Reusable helper functions
- **`schemas/`**: Request validation using Zod
- **`routes/`**: Actual API endpoints

## 📚 Step 2: Creating Your First API

### 1. Create a New Route File

```typescript
// routes/users.ts
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { createSuccessApiResponse, HTTP_STATUS_CODES } from '../types';

// 🎯 Create route instance
export const userRoutes = new Hono();

// 📋 Define validation schema
const CreateUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
});

// 📝 Get user list
userRoutes.get('/', (context) => {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  ];

  return context.json(createSuccessApiResponse(users));
});

// ✨ Create new user
userRoutes.post('/', zValidator('json', CreateUserSchema), (context) => {
  const userData = context.req.valid('json');

  const newUser = {
    id: Date.now(), // In real projects, generate with DB
    ...userData,
  };

  return context.json(createSuccessApiResponse(newUser), HTTP_STATUS_CODES.CREATED);
});
```

### 2. Register in Main Router

```typescript
// [...].ts - Add route
import { userRoutes } from './routes/users';

// Add after existing code
honoApplication.route('/users', userRoutes);
```

### 3. Test It Out

```bash
# Get user list
curl http://localhost:3000/api/users

# Create new user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Bob Johnson","email":"bob@example.com"}'
```

## 📚 Step 3: Validation and Error Handling

### How Validation Works

```typescript
// Validate requests with Zod schema
const schema = z.object({
  name: z.string().min(1), // Required string
  age: z.number().min(0), // Number >= 0
  email: z.string().email(), // Valid email format
});

// Automatic validation with zValidator middleware
userRoutes.post('/', zValidator('json', schema), (context) => {
  // At this point, validation is complete
  const validData = context.req.valid('json');
});
```

### Standardized Error Responses

```typescript
import { createErrorApiResponse } from '../utils/api-response';

// When an error occurs
return context.json(createErrorApiResponse('User not found'), HTTP_STATUS_CODES.NOT_FOUND);
```

## 📚 Step 4: More Practical Example

### Blog API Example

```typescript
// routes/posts.ts
export const postRoutes = new Hono();

// 📰 Get posts list (with search & pagination)
postRoutes.get(
  '/',
  zValidator(
    'query',
    z.object({
      search: z.string().optional(),
      page: z.string().transform(Number).optional(),
      limit: z.string().transform(Number).optional(),
    }),
  ),
  (context) => {
    const { search, page = 1, limit = 10 } = context.req.valid('query');

    // Actual search logic
    const posts = mockPosts.filter((post) => !search || post.title.includes(search));

    const offset = (page - 1) * limit;
    const paginatedPosts = posts.slice(offset, offset + limit);

    return context.json(
      createSuccessApiResponse({
        posts: paginatedPosts,
        pagination: {
          page,
          limit,
          total: posts.length,
          hasNext: offset + limit < posts.length,
        },
      }),
    );
  },
);

// 📝 Create post
postRoutes.post('/', zValidator('json', CreatePostSchema), async (context) => {
  const postData = context.req.valid('json');

  try {
    // Save to database process
    const newPost = await savePost(postData);

    return context.json(createSuccessApiResponse(newPost), HTTP_STATUS_CODES.CREATED);
  } catch (error) {
    return context.json(createErrorApiResponse('Failed to create post'), HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
});
```

## 🎉 Summary

Great aspects of this implementation:

1. **🏗️ Clear Structure**: Easy to understand with separated responsibilities
2. **🛡️ Type Safety**: Robust with TypeScript + Zod
3. **🔄 Consistency**: Unified response formats
4. **📝 Maintainable**: Configuration and logic are separated
5. **🧪 Testable**: Each part can be tested independently

---

Hope this guide helps you understand API development with Hono + Nuxt3! 🎯
