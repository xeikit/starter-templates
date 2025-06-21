/**
 * HTTP Status Types
 *
 * Type definitions for HTTP status codes.
 * Constants and utility functions are located in constants/http-status.ts
 */

/**
 * HTTP status code values
 */
export type HttpStatusCode = 200 | 201 | 400 | 401 | 403 | 404 | 409 | 422 | 500 | 502 | 503;

/**
 * HTTP status categories
 */
export type HttpStatusCategory = 'success' | 'client-error' | 'server-error';

/**
 * HTTP status code with category information
 */
export interface HttpStatusInfo {
  code: HttpStatusCode;
  category: HttpStatusCategory;
  message: string;
}
