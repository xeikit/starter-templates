import { createRoute } from '@hono/zod-openapi';
import { healthResponseSchema } from '../schema/health';

export const healthRoute = createRoute({
  method: 'get',
  path: '/health',
  tags: ['System'],
  summary: 'Health Check',
  description: 'APIサーバーが適切に稼働しているかを確認するためのエンドポイント',
  responses: {
    200: {
      content: {
        'application/json': { schema: healthResponseSchema },
      },
      description: 'ISO形式のタイムスタンプを含むJSONオブジェクトを返却',
    },
  },
});
