import { createRoute, type OpenAPIHono } from '@hono/zod-openapi';
import { createErrorResponse, ERROR_TYPES, type ErrorCode } from '#shared/constants/errorCode';
import { HTTP_STATUS } from '#shared/constants/httpStatus';
import { healthErrorSchema, healthResponseSchema } from '../schema/health';

const healthRoute = createRoute({
  method: 'get',
  path: '/health',
  tags: ['System'],
  summary: 'Health Check',
  description: 'APIサーバーが適切に稼働しているかを確認するためのエンドポイント。',
  responses: {
    [HTTP_STATUS.OK]: {
      content: {
        'application/json': { schema: healthResponseSchema },
      },
      description: 'システムの稼働状況とISO形式のタイムスタンプを含むJSONオブジェクトを返却',
    },
    [HTTP_STATUS.SERVICE_UNAVAILABLE]: {
      content: {
        'application/json': { schema: healthErrorSchema },
      },
      description: 'サービス利用不可エラー（ヘルスチェックが失敗した場合）',
    },
    [HTTP_STATUS.INTERNAL_SERVER_ERROR]: {
      content: {
        'application/json': { schema: healthErrorSchema },
      },
      description: '内部サーバーエラー（予期しないエラーが発生した場合）',
    },
  },
});

const ERROR_CODE_VALUES = Object.values(ERROR_TYPES) as ErrorCode[];

const isErrorCode = (value: unknown): value is ErrorCode =>
  typeof value === 'string' && ERROR_CODE_VALUES.includes(value as ErrorCode);

type HealthErrorStatus = typeof HTTP_STATUS.SERVICE_UNAVAILABLE | typeof HTTP_STATUS.INTERNAL_SERVER_ERROR;

const HEALTH_ERROR_STATUSES = [HTTP_STATUS.SERVICE_UNAVAILABLE, HTTP_STATUS.INTERNAL_SERVER_ERROR] as const;

const isHealthErrorStatus = (value: unknown): value is HealthErrorStatus =>
  typeof value === 'number' && HEALTH_ERROR_STATUSES.includes(value as HealthErrorStatus);

const resolveStatusFromCode = (errorCode: ErrorCode): HealthErrorStatus => {
  if (errorCode === ERROR_TYPES.SERVICE_UNAVAILABLE || errorCode.startsWith('NET_')) {
    return HTTP_STATUS.SERVICE_UNAVAILABLE;
  }

  return HTTP_STATUS.INTERNAL_SERVER_ERROR;
};

export class HealthCheckError extends Error {
  constructor(
    public readonly errorCode: ErrorCode,
    message?: string,
    public readonly httpStatus?: HealthErrorStatus,
  ) {
    super(message);
    this.name = 'HealthCheckError';
  }
}

type ResolvedHealthError = {
  errorCode: ErrorCode;
  message?: string;
  httpStatus: HealthErrorStatus;
};

const resolveHealthError = (error: unknown): ResolvedHealthError => {
  if (error instanceof HealthCheckError) {
    return {
      errorCode: error.errorCode,
      message: error.message,
      httpStatus: error.httpStatus ?? resolveStatusFromCode(error.errorCode),
    };
  }

  if (typeof error === 'object' && error !== null) {
    const { errorCode, message, httpStatus } = error as {
      errorCode?: unknown;
      message?: unknown;
      httpStatus?: unknown;
    };

    if (isErrorCode(errorCode)) {
      return {
        errorCode,
        message: typeof message === 'string' ? message : undefined,
        httpStatus: isHealthErrorStatus(httpStatus) ? httpStatus : resolveStatusFromCode(errorCode),
      };
    }
  }

  const fallbackCode = ERROR_TYPES.SERVICE_UNAVAILABLE;
  return {
    errorCode: fallbackCode,
    message: 'Health check failed',
    httpStatus: resolveStatusFromCode(fallbackCode),
  };
};

export const healthHandler = (app: OpenAPIHono) => {
  app.openapi(healthRoute, async (context) => {
    try {
      return context.json({ status: 'ok', timestamp: new Date().toISOString() }, HTTP_STATUS.OK);
    } catch (error) {
      const resolvedError = resolveHealthError(error);
      console.log('Health check error:', error);
      const errorResponse = createErrorResponse(resolvedError.errorCode, resolvedError.message);

      return context.json(errorResponse, resolvedError.httpStatus);
    }
  });
};
