import { z } from '@hono/zod-openapi';
import { ERROR_TYPES } from '#shared/constants/errorCode';

/**
 * ヘルスチェック成功時のレスポンススキーマ
 * システムの稼働状況とタイムスタンプを含む
 */
export const healthResponseSchema = z.object({
  status: z.string().openapi({ example: 'ok' }),
  timestamp: z.iso.datetime().openapi({ example: new Date().toISOString() }),
});

/**
 * ヘルスチェックエラー時のレスポンススキーマ
 * 統一されたエラーコード体系に準拠したエラー情報を提供
 */
export const healthErrorSchema = z.object({
  error: z.string().openapi({ example: 'Service temporarily unavailable' }),
  errorCode: z.enum(Object.values(ERROR_TYPES)).openapi({
    example: 'SVR_002',
    description:
      '統一エラーコード: NET_xxx(ネットワーク), SVR_xxx(サーバー), VAL_xxx(バリデーション), AUTH_xxx(認証), UNK_xxx(不明)',
  }),
  timestamp: z.iso.datetime().openapi({ example: new Date().toISOString() }),
});
