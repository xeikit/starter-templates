import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import consola from 'consola';
import { ErrorResponseSchema, HealthResponseSchema } from '../schema/health';

const app = new OpenAPIHono<{
  Bindings: CloudflareBindings;
}>();

const healthRoute = createRoute({
  method: 'get',
  path: '/api/v1/health',
  tags: ['System'],
  summary: 'Health Check',
  description: 'APIサーバーが適切に稼働しているかを確認するためのエンドポイント',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: HealthResponseSchema,
        },
      },
      description: 'ISO形式のタイムスタンプを含むJSONオブジェクトを返却',
    },
    500: {
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
      description: 'サーバーエラーが発生した場合に返却',
    },
  },
});

export const healthRouteHandler = app.openapi(healthRoute, async (ctx) => {
  try {
    return ctx.json({ timestamp: new Date().toISOString() }, 200);
  } catch (error) {
    consola.error('Health check failed:', error);
    return ctx.json({ message: '予期せぬエラーが発生しました。' }, 500);
  }
});
