/**
 * Common Types
 *
 * Commonly used types across the API.
 * These types are often inferred from Zod schemas but defined here for cleaner imports.
 */

/**
 * Response format options
 */
export type ResponseFormat = 'json' | 'text';

/**
 * Pagination query parameters
 */
export interface PaginationQuery {
  page: number;
  limit: number;
}

/**
 * Common query parameters for list endpoints
 */
export interface CommonQuery {
  format: ResponseFormat;
}

/**
 * Search query parameters
 */
export interface SearchQuery extends CommonQuery {
  query?: string;
  sortBy?: string;
  sortOrder: 'asc' | 'desc';
}
