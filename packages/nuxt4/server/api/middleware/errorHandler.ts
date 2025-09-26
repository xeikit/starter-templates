import consola from 'consola';
import type { Context, Next } from 'hono';
import { ZodError } from 'zod';
import { createErrorResponse, ERROR_TYPES, getHttpStatusFromErrorCode } from '#shared/constants/errorCode';
import { HTTP_STATUS } from '#shared/constants/httpStatus';

/**
 * エラーオブジェクトから適切なエラーコードを決定する関数
 * @param error - 分類対象のエラー
 * @returns 適切なエラーコード
 */
const classifyError = (error: unknown): (typeof ERROR_TYPES)[keyof typeof ERROR_TYPES] => {
  if (!(error instanceof Error)) {
    return ERROR_TYPES.UNEXPECTED_ERROR;
  }

  // エラーメッセージパターンによるエラー分類
  const errorPatterns = [
    {
      patterns: ['timeout', 'TIMEOUT'],
      errorCode: ERROR_TYPES.TIMEOUT_ERROR,
    },
    {
      patterns: ['network', 'NETWORK'],
      errorCode: ERROR_TYPES.CONNECTION_ERROR,
    },
    {
      patterns: ['database', 'DB'],
      errorCode: ERROR_TYPES.DATABASE_ERROR,
    },
    {
      patterns: ['validation', 'invalid'],
      errorCode: ERROR_TYPES.VALIDATION_INVALID_FORMAT,
    },
    {
      patterns: ['file', 'FILE'],
      errorCode: ERROR_TYPES.FILE_OPERATION_ERROR,
    },
  ] as const;

  // ZodErrorの特別な処理
  if (error instanceof ZodError) {
    return ERROR_TYPES.VALIDATION_INVALID_FORMAT;
  }

  // メッセージパターンによる分類
  const matchedPattern = errorPatterns.find(({ patterns }) =>
    patterns.some((pattern) => error.message.includes(pattern)),
  );

  return matchedPattern?.errorCode ?? ERROR_TYPES.INTERNAL_SERVER_ERROR;
};

/**
 * HTTPステータスコードから定数へのマッピング関数
 * @param httpStatus - 変換対象のHTTPステータスコード
 * @returns 対応するステータス定数
 */
const mapStatusCodeToConstant = (httpStatus: number) => {
  const statusMap = {
    400: HTTP_STATUS.BAD_REQUEST,
    401: HTTP_STATUS.UNAUTHORIZED,
    403: HTTP_STATUS.FORBIDDEN,
    408: HTTP_STATUS.REQUEST_TIMEOUT,
    503: HTTP_STATUS.SERVICE_UNAVAILABLE,
  } as const;

  return statusMap[httpStatus as keyof typeof statusMap] ?? HTTP_STATUS.INTERNAL_SERVER_ERROR;
};

/**
 * エラー情報を構造化する関数
 * @param error - エラーオブジェクト
 * @param context - Honoコンテキスト
 * @returns 構造化されたエラー情報
 */
const createErrorInfo = (error: unknown, context: Context) => ({
  path: context.req.path,
  method: context.req.method,
  error: error instanceof Error ? error.message : 'Unknown error',
  stack: error instanceof Error ? error.stack : undefined,
});

/**
 * Honoアプリケーション用グローバルエラーハンドリングミドルウェア
 * アプリケーション全体で発生したエラーをキャッチし、統一されたエラーレスポンスを返却
 */
export const errorHandlerMiddleware = async (context: Context, next: Next) => {
  try {
    await next();
  } catch (error) {
    // エラー処理の実行
    const errorInfo = createErrorInfo(error, context);
    const errorCode = classifyError(error);
    const httpStatus = getHttpStatusFromErrorCode(errorCode);
    const httpStatusConstant = mapStatusCodeToConstant(httpStatus);

    // エラーの詳細をログ出力（構造化されたエラー情報を使用）
    consola.error('Unhandled error in API endpoint:', errorInfo);

    // 統一されたエラーレスポンスを生成
    const errorResponse = createErrorResponse(
      errorCode,
      undefined, // デフォルトのエラーメッセージを使用
      new Date().toISOString(),
    );

    return context.json(errorResponse, httpStatusConstant);
  }
};

/**
 * 404エラー（Not Found）用のハンドラー
 * @param context - Honoコンテキスト
 * @returns 404エラーレスポンス
 */
export const notFoundHandler = (context: Context) => {
  const errorResponse = createErrorResponse(
    ERROR_TYPES.UNKNOWN_STATE, // 不明な状態（存在しないエンドポイント）
    `Endpoint not found: ${context.req.method} ${context.req.path}`,
    new Date().toISOString(),
  );

  return context.json(errorResponse, HTTP_STATUS.NOT_FOUND);
};
