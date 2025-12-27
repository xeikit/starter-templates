import { cors } from 'hono/cors';

export const corsMiddleware = cors({
  origin: (origin) => {
    if (!origin) {
      return null;
    }

    // NOTE: 許可するオリジンを必要に応じて追加
    const ALLOWED_ORIGINS = ['http://localhost:3000'];

    if (!ALLOWED_ORIGINS.includes(origin)) {
      return null;
    }

    return origin;
  },
  allowMethods: ['GET', 'POST'],
  allowHeaders: ['Content-Type', 'Authorization', 'User-Agent'],
  credentials: true,
});
