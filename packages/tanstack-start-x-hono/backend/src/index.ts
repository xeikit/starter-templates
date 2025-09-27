import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import consola from 'consola';
import { errorHandlerMiddleware, notFoundHandler } from './middleware/errorHandler';
import { healthHandler } from './routes/health';

const isDevelopment = process.env.NODE_ENV === 'development';

const app = new OpenAPIHono().basePath('/api');

/**
 * グローバルエラーハンドリングミドルウェアを適用
 * 予期しないエラーを適切なエラーコード（UNK_xxx等）で返却
 */
app.use('*', errorHandlerMiddleware);

/**
 * APIのエンドポイント追加
 */
healthHandler(app);

if (isDevelopment) {
  app.doc('/openapi.yaml', {
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'Nuxt Frontend Architect Sample API',
    },
  });
  app.get('/swagger', swaggerUI({ url: '/api/openapi.yaml' }));

  consola.info('API Server URLs:');
  consola.info('  Health Check: http://localhost:8787/api/health');
  consola.info('  Swagger UI: http://localhost:8787/api/swagger');
  consola.info('  OpenAPI Spec: http://localhost:8787/api/openapi.yaml');
}

/**
 * 404エラーハンドリング
 * 存在しないエンドポイントへのアクセス時に適切なエラーコードを返却
 */
app.notFound(notFoundHandler);

export default app;
