import { HTTP_STATUS_CODES, createErrorApiResponse } from '@/server/api';
import { apiConfig } from '@/server/api/config';
import { healthRoutes } from '@/server/api/routes/health';
import { createServerFileRoute } from '@tanstack/react-start/server';
import consola from 'consola';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

// Create main Hono application
const honoApplication = new Hono();

// Apply global middleware
if (apiConfig.logging.enabled) {
  honoApplication.use('*', logger());
}
honoApplication.use('*', cors(apiConfig.cors));

// 📝 Register route modules
honoApplication.route('/', healthRoutes);

// Handle 404 responses
honoApplication.notFound((context) => {
  const errorResponse = createErrorApiResponse('Not Found');
  return context.json({ ...errorResponse, path: context.req.path }, HTTP_STATUS_CODES.NOT_FOUND);
});

// Handle application errors
honoApplication.onError((error, context) => {
  consola.error('API Error:', error);
  const errorMessage = apiConfig.errors.showDetails && error instanceof Error ? error.message : 'Internal Server Error';
  const errorResponse = createErrorApiResponse(errorMessage);
  return context.json(errorResponse, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
});

// Export types for development tools
export type HonoApplication = typeof honoApplication;

export const ServerRoute = createServerFileRoute('/api/$');
