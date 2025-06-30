/**
 * Main Type Exports
 *
 * Re-exports all commonly used types and utilities from their respective modules.
 * This provides a single entry point for importing shared types across the API.
 */

// HTTP Status constants and utilities
export {
  HTTP_STATUS_CODES,
  isSuccessStatusCode,
  isClientErrorStatusCode,
  isServerErrorStatusCode,
} from './constants/http-status';

// All type definitions
export type * from './types';

// API Response helper functions
export {
  createSuccessApiResponse,
  createErrorApiResponse,
  createMessageApiResponse,
  createSuccessApiResponseWithMessage,
  isSuccessApiResponse,
  isErrorApiResponse,
  isMessageApiResponse,
} from './utils/api-response';

// Common validation schemas
export { ResponseFormatSchema, PaginationQuerySchema, CommonQuerySchema, SearchQuerySchema } from './schemas/common';

// Health-specific schemas
export {
  HealthDetailsLevelSchema,
  HealthCheckQuerySchema,
  PingQuerySchema,
  MemoryUsageSchema,
  BasicHealthStatusSchema,
  FullHealthStatusSchema,
  PingResponseSchema,
} from './schemas/health';

// System utilities
export {
  getSystemUptime,
  getCurrentTimestamp,
  getNodeVersion,
  getCurrentEnvironment,
  getMemoryUsageInformation,
  isDevelopmentEnvironment,
  isProductionEnvironment,
} from './utils/system-info';

// Text formatting utilities
export {
  formatBasicHealthStatusAsText,
  formatFullHealthStatusAsText,
  formatPingResponseAsText,
  formatAsJsonString,
} from './utils/text-formatting';

// Legacy exports for backward compatibility
// TODO: Remove these in the next major version
export { HTTP_STATUS_CODES as HTTP_STATUS } from './constants/http-status';
export { createSuccessApiResponse as createApiResponse } from './utils/api-response';
export { createErrorApiResponse as createApiError } from './utils/api-response';
