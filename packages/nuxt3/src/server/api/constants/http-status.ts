/**
 * HTTP Status Constants
 *
 * Standard HTTP status codes used throughout the API.
 * Centralized to ensure consistency and avoid magic numbers.
 * Type definitions are located in types/http-status.ts
 */

export const HTTP_STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const;

/**
 * Check if a status code indicates success (2xx)
 */
export function isSuccessStatusCode(statusCode: number): boolean {
  return statusCode >= 200 && statusCode < 300;
}

/**
 * Check if a status code indicates a client error (4xx)
 */
export function isClientErrorStatusCode(statusCode: number): boolean {
  return statusCode >= 400 && statusCode < 500;
}

/**
 * Check if a status code indicates a server error (5xx)
 */
export function isServerErrorStatusCode(statusCode: number): boolean {
  return statusCode >= 500 && statusCode < 600;
}
