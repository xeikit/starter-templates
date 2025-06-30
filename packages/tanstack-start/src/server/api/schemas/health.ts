/**
 * Health Check Schemas
 *
 * Validation schemas specific to health monitoring endpoints.
 * Type definitions are located in types/health.ts
 */

import { z } from 'zod';
import { ResponseFormatSchema } from './common';

/**
 * Health check detail levels
 */
export const HealthDetailsLevelSchema = z.enum(['basic', 'full']).default('basic');

/**
 * Health check query parameters
 */
export const HealthCheckQuerySchema = z.object({
  format: ResponseFormatSchema,
  details: HealthDetailsLevelSchema,
});

/**
 * Ping endpoint query parameters
 */
export const PingQuerySchema = z.object({
  format: ResponseFormatSchema,
});

/**
 * Memory usage information
 */
export const MemoryUsageSchema = z.object({
  used: z.number().min(0),
  total: z.number().min(0),
  percentage: z.number().min(0).max(100),
});

/**
 * Basic health status
 */
export const BasicHealthStatusSchema = z.object({
  status: z.enum(['ok', 'error']),
  timestamp: z.string().datetime(),
  uptime: z.number().min(0),
});

/**
 * Full health status with system details
 */
export const FullHealthStatusSchema = BasicHealthStatusSchema.extend({
  version: z.string().optional(),
  environment: z.string().optional(),
  memory: MemoryUsageSchema.optional(),
});

/**
 * Ping response
 */
export const PingResponseSchema = z.object({
  message: z.string(),
  timestamp: z.string().datetime(),
  service: z.string(),
});
