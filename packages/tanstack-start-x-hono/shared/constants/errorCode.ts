/**
 * アプリケーション全体で使用するエラータイプ定数
 *
 * 可読性を重視したキー名でエラーの種類を明確に表現
 * エラーコード命名規則:
 * - NET_xxx: ネットワーク関連エラー
 * - SVR_xxx: サーバー内部エラー
 * - VAL_xxx: バリデーションエラー
 * - AUTH_xxx: 認証・認可エラー
 * - UNK_xxx: 不明・予期しないエラー
 */
export const ERROR_TYPES = {
  // ネットワーク関連エラー (NET_xxx)
  CONNECTION_ERROR: 'NET_001', // 接続エラー
  TIMEOUT_ERROR: 'NET_002', // タイムアウトエラー
  NETWORK_DISCONNECTED: 'NET_003', // ネットワーク切断
  DNS_RESOLUTION_ERROR: 'NET_004', // DNS解決エラー

  // サーバー内部エラー (SVR_xxx)
  INTERNAL_SERVER_ERROR: 'SVR_001', // 内部サーバーエラー
  SERVICE_UNAVAILABLE: 'SVR_002', // サービス利用不可
  DATABASE_ERROR: 'SVR_003', // データベースエラー
  EXTERNAL_API_ERROR: 'SVR_004', // 外部API通信エラー
  FILE_OPERATION_ERROR: 'SVR_005', // ファイル操作エラー

  // バリデーションエラー (VAL_xxx)
  VALIDATION_MISSING_PARAMS: 'VAL_001', // 必須パラメータ不足
  VALIDATION_INVALID_FORMAT: 'VAL_002', // 不正な形式
  VALIDATION_OUT_OF_RANGE: 'VAL_003', // 値の範囲外
  VALIDATION_LENGTH_EXCEEDED: 'VAL_004', // 文字数制限超過

  // 認証・認可エラー (AUTH_xxx)
  AUTH_FAILED: 'AUTH_001', // 認証失敗
  AUTH_INSUFFICIENT_PERMISSIONS: 'AUTH_002', // 権限不足
  AUTH_SESSION_EXPIRED: 'AUTH_003', // セッション期限切れ
  AUTH_ACCESS_DENIED: 'AUTH_004', // アクセス拒否

  // 不明・予期しないエラー (UNK_xxx)
  UNEXPECTED_ERROR: 'UNK_001', // 予期しないエラー
  SYSTEM_ERROR: 'UNK_002', // システムエラー
  PROCESSING_INTERRUPTED: 'UNK_003', // 処理中断
  UNKNOWN_STATE: 'UNK_004', // 不明な状態
} as const;

export type ErrorCode = (typeof ERROR_TYPES)[keyof typeof ERROR_TYPES];

/**
 * エラーメッセージマップ
 * エラーコードから対応するメッセージを取得
 */
export const ERROR_MESSAGES = {
  // ネットワーク関連エラー
  [ERROR_TYPES.CONNECTION_ERROR]: '接続エラーが発生しました',
  [ERROR_TYPES.TIMEOUT_ERROR]: 'リクエストがタイムアウトしました',
  [ERROR_TYPES.NETWORK_DISCONNECTED]: 'ネットワーク接続が切断されました',
  [ERROR_TYPES.DNS_RESOLUTION_ERROR]: 'DNS解決に失敗しました',

  // サーバー内部エラー
  [ERROR_TYPES.INTERNAL_SERVER_ERROR]: 'サーバー内部でエラーが発生しました',
  [ERROR_TYPES.SERVICE_UNAVAILABLE]: 'サービスが一時的に利用できません',
  [ERROR_TYPES.DATABASE_ERROR]: 'データベースへのアクセスに失敗しました',
  [ERROR_TYPES.EXTERNAL_API_ERROR]: '外部サービスとの通信に失敗しました',
  [ERROR_TYPES.FILE_OPERATION_ERROR]: 'ファイル操作に失敗しました',

  // バリデーションエラー
  [ERROR_TYPES.VALIDATION_MISSING_PARAMS]: '必須パラメータが不足しています',
  [ERROR_TYPES.VALIDATION_INVALID_FORMAT]: 'パラメータの形式が正しくありません',
  [ERROR_TYPES.VALIDATION_OUT_OF_RANGE]: 'パラメータの値が許可範囲外です',
  [ERROR_TYPES.VALIDATION_LENGTH_EXCEEDED]: '文字数制限を超えています',

  // 認証・認可エラー
  [ERROR_TYPES.AUTH_FAILED]: '認証に失敗しました',
  [ERROR_TYPES.AUTH_INSUFFICIENT_PERMISSIONS]: 'このリソースにアクセスする権限がありません',
  [ERROR_TYPES.AUTH_SESSION_EXPIRED]: 'セッションの有効期限が切れています',
  [ERROR_TYPES.AUTH_ACCESS_DENIED]: 'アクセスが拒否されました',

  // 不明・予期しないエラー
  [ERROR_TYPES.UNEXPECTED_ERROR]: '予期しないエラーが発生しました',
  [ERROR_TYPES.SYSTEM_ERROR]: 'システムエラーが発生しました',
  [ERROR_TYPES.PROCESSING_INTERRUPTED]: '処理が中断されました',
  [ERROR_TYPES.UNKNOWN_STATE]: '不明な状態です',
} as const satisfies Record<ErrorCode, string>;

/**
 * エラーコードからHTTPステータスコードを取得する
 */
export const getHttpStatusFromErrorCode = (errorCode: ErrorCode): number => {
  // ネットワークエラー → 408 (Request Timeout) または 503 (Service Unavailable)
  if (errorCode.startsWith('NET_')) {
    return errorCode === ERROR_TYPES.TIMEOUT_ERROR ? 408 : 503;
  }

  // サーバーエラー → 500 (Internal Server Error) または 503 (Service Unavailable)
  if (errorCode.startsWith('SVR_')) {
    return errorCode === ERROR_TYPES.SERVICE_UNAVAILABLE ? 503 : 500;
  }

  // バリデーションエラー → 400 (Bad Request)
  if (errorCode.startsWith('VAL_')) {
    return 400;
  }

  // 認証・認可エラー → 401 (Unauthorized) または 403 (Forbidden)
  if (errorCode.startsWith('AUTH_')) {
    const authUnauthorizedCodes = [ERROR_TYPES.AUTH_FAILED, ERROR_TYPES.AUTH_SESSION_EXPIRED] as const;
    return (authUnauthorizedCodes as readonly ErrorCode[]).includes(errorCode) ? 401 : 403;
  }

  // 不明エラー → 500 (Internal Server Error)
  return 500;
};

/**
 * エラーレスポンスを生成するヘルパー関数
 * @param errorCode - エラーコード
 * @param customMessage - カスタムエラーメッセージ（省略時はデフォルトメッセージを使用）
 * @param timestamp - タイムスタンプ（省略時は現在時刻を使用）
 * @returns エラーレスポンスオブジェクト
 */
export const createErrorResponse = (errorCode: ErrorCode, customMessage?: string, timestamp?: string) => ({
  error: customMessage || ERROR_MESSAGES[errorCode],
  errorCode,
  timestamp: timestamp || new Date().toISOString(),
});

/**
 * 構造化されたエラー情報を管理するERROR_MAP
 * 各エラータイプのCODEとMESSAGEを提供
 *
 * @example
 * ```typescript
 * ERROR_MAP.TIMEOUT_ERROR.CODE // 'NET_002'
 * ERROR_MAP.TIMEOUT_ERROR.MESSAGE // 'リクエストがタイムアウトしました'
 * ```
 */
export const ERROR_MAP = {
  CONNECTION_ERROR: {
    CODE: ERROR_TYPES.CONNECTION_ERROR,
    MESSAGE: ERROR_MESSAGES[ERROR_TYPES.CONNECTION_ERROR],
  },
  TIMEOUT_ERROR: {
    CODE: ERROR_TYPES.TIMEOUT_ERROR,
    MESSAGE: ERROR_MESSAGES[ERROR_TYPES.TIMEOUT_ERROR],
  },
  NETWORK_DISCONNECTED: {
    CODE: ERROR_TYPES.NETWORK_DISCONNECTED,
    MESSAGE: ERROR_MESSAGES[ERROR_TYPES.NETWORK_DISCONNECTED],
  },
  DNS_RESOLUTION_ERROR: {
    CODE: ERROR_TYPES.DNS_RESOLUTION_ERROR,
    MESSAGE: ERROR_MESSAGES[ERROR_TYPES.DNS_RESOLUTION_ERROR],
  },

  INTERNAL_SERVER_ERROR: {
    CODE: ERROR_TYPES.INTERNAL_SERVER_ERROR,
    MESSAGE: ERROR_MESSAGES[ERROR_TYPES.INTERNAL_SERVER_ERROR],
  },
  SERVICE_UNAVAILABLE: {
    CODE: ERROR_TYPES.SERVICE_UNAVAILABLE,
    MESSAGE: ERROR_MESSAGES[ERROR_TYPES.SERVICE_UNAVAILABLE],
  },
  DATABASE_ERROR: {
    CODE: ERROR_TYPES.DATABASE_ERROR,
    MESSAGE: ERROR_MESSAGES[ERROR_TYPES.DATABASE_ERROR],
  },
  EXTERNAL_API_ERROR: {
    CODE: ERROR_TYPES.EXTERNAL_API_ERROR,
    MESSAGE: ERROR_MESSAGES[ERROR_TYPES.EXTERNAL_API_ERROR],
  },
  FILE_OPERATION_ERROR: {
    CODE: ERROR_TYPES.FILE_OPERATION_ERROR,
    MESSAGE: ERROR_MESSAGES[ERROR_TYPES.FILE_OPERATION_ERROR],
  },

  VALIDATION_MISSING_PARAMS: {
    CODE: ERROR_TYPES.VALIDATION_MISSING_PARAMS,
    MESSAGE: ERROR_MESSAGES[ERROR_TYPES.VALIDATION_MISSING_PARAMS],
  },
  VALIDATION_INVALID_FORMAT: {
    CODE: ERROR_TYPES.VALIDATION_INVALID_FORMAT,
    MESSAGE: ERROR_MESSAGES[ERROR_TYPES.VALIDATION_INVALID_FORMAT],
  },
  VALIDATION_OUT_OF_RANGE: {
    CODE: ERROR_TYPES.VALIDATION_OUT_OF_RANGE,
    MESSAGE: ERROR_MESSAGES[ERROR_TYPES.VALIDATION_OUT_OF_RANGE],
  },
  VALIDATION_LENGTH_EXCEEDED: {
    CODE: ERROR_TYPES.VALIDATION_LENGTH_EXCEEDED,
    MESSAGE: ERROR_MESSAGES[ERROR_TYPES.VALIDATION_LENGTH_EXCEEDED],
  },

  AUTH_FAILED: {
    CODE: ERROR_TYPES.AUTH_FAILED,
    MESSAGE: ERROR_MESSAGES[ERROR_TYPES.AUTH_FAILED],
  },
  AUTH_INSUFFICIENT_PERMISSIONS: {
    CODE: ERROR_TYPES.AUTH_INSUFFICIENT_PERMISSIONS,
    MESSAGE: ERROR_MESSAGES[ERROR_TYPES.AUTH_INSUFFICIENT_PERMISSIONS],
  },
  AUTH_SESSION_EXPIRED: {
    CODE: ERROR_TYPES.AUTH_SESSION_EXPIRED,
    MESSAGE: ERROR_MESSAGES[ERROR_TYPES.AUTH_SESSION_EXPIRED],
  },
  AUTH_ACCESS_DENIED: {
    CODE: ERROR_TYPES.AUTH_ACCESS_DENIED,
    MESSAGE: ERROR_MESSAGES[ERROR_TYPES.AUTH_ACCESS_DENIED],
  },

  UNEXPECTED_ERROR: {
    CODE: ERROR_TYPES.UNEXPECTED_ERROR,
    MESSAGE: ERROR_MESSAGES[ERROR_TYPES.UNEXPECTED_ERROR],
  },
  SYSTEM_ERROR: {
    CODE: ERROR_TYPES.SYSTEM_ERROR,
    MESSAGE: ERROR_MESSAGES[ERROR_TYPES.SYSTEM_ERROR],
  },
  PROCESSING_INTERRUPTED: {
    CODE: ERROR_TYPES.PROCESSING_INTERRUPTED,
    MESSAGE: ERROR_MESSAGES[ERROR_TYPES.PROCESSING_INTERRUPTED],
  },
  UNKNOWN_STATE: {
    CODE: ERROR_TYPES.UNKNOWN_STATE,
    MESSAGE: ERROR_MESSAGES[ERROR_TYPES.UNKNOWN_STATE],
  },
} as const satisfies Record<string, { CODE: ErrorCode; MESSAGE: (typeof ERROR_MESSAGES)[ErrorCode] }>;
