import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import { corsMiddleware } from './middleware/cors';
import { healthRouteHandler } from './routes/health';

const app = new OpenAPIHono<{
  Bindings: CloudflareBindings;
}>();

app.use('/*', corsMiddleware);

export const routes = app.route('/', healthRouteHandler);

routes
  .doc('/openapi.yaml', {
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'API Documentation',
    },
  })
  .get('/swagger', swaggerUI<{ Bindings: CloudflareBindings }>({ url: '/openapi.yaml' }));

export type ApiType = typeof routes;
export default routes;
