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

export const ServerRoute = createServerFileRoute('/api/$').methods({
  GET: async ({ request, params }) => {
    return await handleHonoRequest(request, params);
  },
  POST: async ({ request, params }) => {
    return await handleHonoRequest(request, params);
  },
  PUT: async ({ request, params }) => {
    return await handleHonoRequest(request, params);
  },
  PATCH: async ({ request, params }) => {
    return await handleHonoRequest(request, params);
  },
  DELETE: async ({ request, params }) => {
    return await handleHonoRequest(request, params);
  },
  HEAD: async ({ request, params }) => {
    return await handleHonoRequest(request, params);
  },
  OPTIONS: async ({ request, params }) => {
    return await handleHonoRequest(request, params);
  },
});

/**
 * Handle requests by forwarding them to the Hono application
 */
async function handleHonoRequest(request: Request, params: Record<string, unknown>): Promise<Response> {
  try {
    // Get the catch-all path from TanStack Start params
    // Try multiple possible parameter names for catch-all routes
    const pathSegments = (params._ || params['*'] || params.splat) as string | string[] | undefined;

    // Alternative: Extract path from the request URL directly
    const url = new URL(request.url);
    const urlPath = url.pathname.replace(/^\/api/, '') || '/';

    const requestPath = pathSegments
      ? Array.isArray(pathSegments)
        ? `/${pathSegments.join('/')}`
        : `/${pathSegments}`
      : urlPath;

    // Build the full URL for Hono
    const requestUrl = new URL(request.url);
    const honoUrl = new URL(requestPath, requestUrl.origin);
    honoUrl.search = requestUrl.search;

    // Create a new request for Hono with the corrected path
    const honoRequest = new Request(honoUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });

    // Process with Hono
    return await honoApplication.fetch(honoRequest);
  } catch (error) {
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
}
