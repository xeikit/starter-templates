/**
 * HTTP Status Types
 *
 * Type definitions for HTTP status codes.
 * Constants and utility functions are located in constants/http-status.ts
 */

import type { HTTP_STATUS_CODES } from '../constants/http-status';

/**
 * HTTP status code values
 */
export type HttpStatusCode = (typeof HTTP_STATUS_CODES)[keyof typeof HTTP_STATUS_CODES];

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
