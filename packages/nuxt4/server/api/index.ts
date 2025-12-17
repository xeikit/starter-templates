import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import consola from 'consola';
import { healthRoute } from './routes/health';

const app = new OpenAPIHono().basePath('/api').openapi(healthRoute, (c) => {
  return c.json({ timestamp: new Date().toISOString() });
});

app.doc('/openapi.yaml', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'API Documentation',
  },
});
app.get('/swagger', swaggerUI({ url: '/api/openapi.yaml' }));

consola.info('Swagger UI: http://localhost:3000/api/swagger');

export type HonoApp = typeof app;

export default defineEventHandler(async (event) => {
  const webReq = toWebRequest(event);
  return await app.fetch(webReq);
});
