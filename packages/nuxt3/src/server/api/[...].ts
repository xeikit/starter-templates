/**
 * Hono API Integration for Nuxt 3
 *
 * This catch-all route integrates Hono with Nuxt's server.
 * All requests to /api/* are processed by the Hono application.
 *
 * 💡 What is Hono?
 * Hono is a fast, lightweight web framework for building APIs.
 * It's similar to Express.js but more modern and optimized for edge runtimes.
 *
 * 📋 How it works:
 * 1. Nuxt catches all /api/* requests with this [...].ts file
 * 2. Requests are forwarded to the Hono application
 * 3. Hono processes routes, middleware, and returns responses
 */

import { consola } from 'consola';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { apiConfig } from './config';
import { healthRoutes } from './routes/health';
import { HTTP_STATUS_CODES, createErrorApiResponse } from './types';

// Create main Hono application
const honoApplication = new Hono();

// Apply global middleware
if (apiConfig.logging.enabled) {
  honoApplication.use('*', logger());
}
honoApplication.use('*', cors(apiConfig.cors));

// Register route modules
honoApplication.route('/', healthRoutes);

// 📝 Add new routes here:
// honoApplication.route('/users', userRoutes);
// honoApplication.route('/posts', postRoutes);

// Handle 404 responses
honoApplication.notFound((context) => {
  const errorResponse = createErrorApiResponse('Not Found');
  return context.json({ ...errorResponse, path: context.req.path }, HTTP_STATUS_CODES.NOT_FOUND);
});

// Handle application errors
honoApplication.onError((error, context) => {
  consola.error('API Error:', error);
  const errorResponse = createErrorApiResponse('Internal Server Error');
  return context.json(errorResponse, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
});

// Export types for development tools
export type HonoApplication = typeof honoApplication;

export default defineEventHandler(async (event) => {
  // Get the path from Nuxt's catch-all route
  const pathParams = event.context.params?._ || [];
  const requestPath = Array.isArray(pathParams) ? `/${pathParams.join('/')}` : `/${pathParams}`;

  // Build the full URL for Hono
  const requestUrl = getRequestURL(event);
  const honoUrl = new URL(requestPath, requestUrl.origin);
  honoUrl.search = requestUrl.search;

  // Get request body for non-GET requests
  let requestBody: BodyInit | null = null;
  if (event.node.req.method !== 'GET' && event.node.req.method !== 'HEAD') {
    const rawBody = await readBody(event);
    if (rawBody) {
      // Handle different body types appropriately
      if (typeof rawBody === 'string') {
        requestBody = rawBody;
      } else if (rawBody instanceof FormData || rawBody instanceof ArrayBuffer) {
        requestBody = rawBody;
      } else {
        requestBody = JSON.stringify(rawBody);
      }
    }
  }

  // Create request for Hono
  const honoRequest = new Request(honoUrl, {
    method: event.node.req.method || 'GET',
    headers: {
      ...getHeaders(event),
      ...(getHeader(event, 'content-type') ? { 'content-type': getHeader(event, 'content-type') } : {}),
    },
    body: requestBody,
  });

  try {
    // Process with Hono
    return await honoApplication.fetch(honoRequest);
  } catch (error) {
    consola.error('API Error:', error);

    const errorDetails = apiConfig.errors.showDetails && error instanceof Error ? error.message : undefined;

    return new Response(
      JSON.stringify({
        error: 'Internal Server Error',
        ...(errorDetails && { details: errorDetails }),
      }),
      {
        status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
});
