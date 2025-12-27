import { z } from '@hono/zod-openapi';

export const HealthResponseSchema = z
  .object({
    timestamp: z.iso.date().openapi({ example: new Date().toISOString() }),
  })
  .openapi('HealthResponse');

export const ErrorResponseSchema = z
  .object({
    message: z.string().openapi({ example: '意図せぬエラーが発生しました。', description: 'エラーメッセージ' }),
  })
  .openapi('ErrorResponse');
