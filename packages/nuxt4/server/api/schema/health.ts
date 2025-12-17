import { z } from '@hono/zod-openapi';

export const healthResponseSchema = z.object({
  timestamp: z.iso.date().openapi({ example: new Date().toISOString() }),
});
