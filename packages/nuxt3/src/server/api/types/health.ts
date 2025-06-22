/**
 * Health Check Types
 *
 * Type definitions for health monitoring endpoints.
 * These types are often inferred from Zod schemas but defined here for cleaner imports.
 */

import type { ResponseFormat } from './common';

/**
 * Health check detail levels
 */
export type HealthDetailsLevel = 'basic' | 'full';

/**
 * Health check query parameters
 */
export interface HealthCheckQuery {
  format: ResponseFormat;
  details: HealthDetailsLevel;
}

/**
 * Ping endpoint query parameters
 */
export interface PingQuery {
  format: ResponseFormat;
}

/**
 * Memory usage information
 */
export interface MemoryUsage {
  used: number;
  total: number;
  percentage: number;
}

/**
 * Basic health status
 */
export interface BasicHealthStatus {
  status: 'ok' | 'error';
  timestamp: string;
  uptime: number;
}

/**
 * Full health status with system details
 */
export interface FullHealthStatus extends BasicHealthStatus {
  version?: string;
  environment?: string;
  memory?: MemoryUsage;
}

/**
 * Ping response
 */
export interface PingResponse {
  message: string;
  timestamp: string;
  service: string;
}
