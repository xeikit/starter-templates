/**
 * Health Check Routes
 *
 * Health monitoring endpoints for system status and availability checks.
 * Demonstrates clean Hono route structure with proper validation and formatting.
 */

import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { HTTP_STATUS_CODES } from '../constants/http-status';
import { HealthCheckQuerySchema, PingQuerySchema } from '../schemas/health';
import { createSuccessApiResponse } from '../utils/api-response';
import {
  getCurrentEnvironment,
  getCurrentTimestamp,
  getMemoryUsageInformation,
  getNodeVersion,
  getSystemUptime,
} from '../utils/system-info';
import {
  formatBasicHealthStatusAsText,
  formatFullHealthStatusAsText,
  formatPingResponseAsText,
} from '../utils/text-formatting';

// Create route instance for health-related endpoints
export const healthRoutes = new Hono();

/**
 * GET /health - System health status
 *
 * Returns basic or detailed system health information.
 * Supports both JSON and text response formats.
 */
healthRoutes.get('/health', zValidator('query', HealthCheckQuerySchema), (context) => {
  const { format, details } = context.req.valid('query');

  // Gather basic health information
  const basicHealthStatus = {
    status: 'ok' as const,
    timestamp: getCurrentTimestamp(),
    uptime: getSystemUptime(),
  };

  // Add detailed system information if requested
  if (details === 'full') {
    const fullHealthStatus = {
      ...basicHealthStatus,
      version: getNodeVersion(),
      environment: getCurrentEnvironment(),
      memory: getMemoryUsageInformation(),
    };

    // Return formatted response based on requested format
    if (format === 'text') {
      const textResponse = formatFullHealthStatusAsText(fullHealthStatus);
      return context.text(textResponse);
    }

    return context.json(createSuccessApiResponse(fullHealthStatus), HTTP_STATUS_CODES.OK);
  }

  // Return basic health status
  if (format === 'text') {
    const textResponse = formatBasicHealthStatusAsText(basicHealthStatus);
    return context.text(textResponse);
  }

  return context.json(createSuccessApiResponse(basicHealthStatus), HTTP_STATUS_CODES.OK);
});

/**
 * GET /ping - Simple availability check
 *
 * Returns a simple pong response to verify service availability.
 * Supports both JSON and text response formats.
 */
healthRoutes.get('/ping', zValidator('query', PingQuerySchema), (context) => {
  const { format } = context.req.valid('query');

  const pingResponse = {
    message: 'pong',
    timestamp: getCurrentTimestamp(),
    service: 'hono-api',
  };

  if (format === 'text') {
    const textResponse = formatPingResponseAsText(pingResponse);
    return context.text(textResponse);
  }

  return context.json(createSuccessApiResponse(pingResponse), HTTP_STATUS_CODES.OK);
});
