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
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
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
