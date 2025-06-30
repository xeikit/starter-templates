/**
 * Common Validation Schemas
 *
 * Reusable Zod schemas for request validation across the API.
 * Type definitions are located in types/common.ts
 */

import { z } from 'zod';

/**
 * Common response format options
 */
export const ResponseFormatSchema = z.enum(['json', 'text']).default('json');

/**
 * Pagination parameters
 */
export const PaginationQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

/**
 * Common query parameters for list endpoints
 */
export const CommonQuerySchema = z.object({
  format: ResponseFormatSchema,
});

/**
 * Search query parameters
 */
export const SearchQuerySchema = CommonQuerySchema.extend({
  query: z.string().min(1).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});
