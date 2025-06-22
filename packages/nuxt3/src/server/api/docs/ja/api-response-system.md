# API Response System

このディレクトリには、APIレスポンスの型定義とユーティリティ関数が含まれています。

## ディレクトリ構造

```bash
api/
├── types/           # 型定義のみ
│   ├── index.ts         # 中央エクスポートポイント
│   ├── api-response.ts  # APIレスポンス型
│   ├── common.ts        # 共通型
│   ├── health.ts        # ヘルス関連型
│   └── http-status.ts   # HTTPステータス型
├── utils/           # 実装・ヘルパー関数
│   └── api-response.ts
├── schemas/         # バリデーションスキーマ（Zod）
│   ├── common.ts
│   └── health.ts
├── constants/       # 定数・ユーティリティ
│   └── http-status.ts
└── types.ts         # メインエクスポートファイル
```

## 設計思想

### 責任の分離

- **`types/`**: 純粋な型定義のみを配置
- **`utils/`**: 実装ロジックとヘルパー関数を配置
- **`schemas/`**: バリデーションスキーマを配置（Zod）
- **`constants/`**: 定数とユーティリティ関数を配置

### 初学者にやさしい構造

- 型と実装が明確に分離されている
- ファイルの役割が直感的に分かる
- 新しいエンドポイント追加時に修正するファイルが限定される

## 基本的な使用方法

### 型定義の使用

```typescript
import type { ApiResponse, SuccessApiResponse } from '~/server/api/types';

// 型として使用
function handleResponse(response: ApiResponse<User>) {
  // ...
}
```

### ヘルパー関数の使用

```typescript
import { createSuccessApiResponse, createErrorApiResponse } from '~/server/api/types';

// レスポンス作成
export default defineEventHandler(async (event) => {
  try {
    const users = await fetchUsers();
    return createSuccessApiResponse(users);
  } catch (error) {
    return createErrorApiResponse('Failed to fetch users');
  }
});
```

## 新しいエンドポイント追加時の手順

1. **型定義**: 必要に応じて `types/` に新しい型を追加
2. **スキーマ**: バリデーションが必要なら `schemas/` にスキーマを追加
3. **ルート**: `routes/` にエンドポイントを実装
4. **テスト**: `__test__/` にテストを追加

## 型ガード

型安全性を向上させるため、以下の型ガードが利用可能です：

```typescript
import { isSuccessApiResponse, isErrorApiResponse } from '~/server/api/types';

if (isSuccessApiResponse(response)) {
  // response.data が確実に存在
  console.log(response.data);
}

if (isErrorApiResponse(response)) {
  // response.error が確実に存在
  console.error(response.error);
}
```

## レガシーサポート

既存のコードとの互換性のため、以下のレガシーエクスポートも利用可能です：

```typescript
import { createApiResponse, createApiError } from '~/server/api/types';
```

> **注意**: これらは将来のメジャーバージョンで削除予定です。新しいコードでは新しい関数名を使用してください。

## マイグレーションガイド

### スキーマ/型混在ファイルからの移行

```typescript
// 従来の方法（スキーマと型が混在）
import type { ResponseFormat } from '~/server/api/schemas/common';

// 新しい方法（純粋な型）
import type { ResponseFormat } from '~/server/api/types';
```

### ユーティリティ内の型定義からの移行

```typescript
// 従来の方法（型と関数が混在）
import { ApiResponse, createSuccessApiResponse } from '~/server/api/types/api-response';

// 新しい方法（明確な分離）
import type { ApiResponse } from '~/server/api/types';
import { createSuccessApiResponse } from '~/server/api/types';
```

> **注意**: これらは将来のメジャーバージョンで削除予定です。新しいコードでは新しい関数名を使用してください。

## 利用可能な型

### APIレスポンス型

- `ApiResponse<T>` - ベースレスポンスインターフェース
- `SuccessApiResponse<T>` - データを含む成功レスポンス
- `ErrorApiResponse` - エラーメッセージを含むエラーレスポンス
- `MessageApiResponse` - カスタムメッセージを含むレスポンス
- `SuccessApiResponseWithMessage<T>` - データとメッセージの両方を含む成功レスポンス

### 共通型

- `ResponseFormat` - レスポンス形式オプション（'json' | 'text'）
- `PaginationQuery` - ページネーションパラメータ
- `CommonQuery` - 共通クエリパラメータ
- `SearchQuery` - 検索クエリパラメータ

### ヘルス関連型

- `HealthDetailsLevel` - ヘルスチェック詳細レベル
- `HealthCheckQuery` - ヘルスチェッククエリパラメータ
- `MemoryUsage` - メモリ使用量情報
- `BasicHealthStatus` - 基本ヘルスステータス
- `FullHealthStatus` - システム詳細を含む完全ヘルスステータス

### HTTPステータス型

- `HttpStatusCode` - HTTPステータスコード値
- `HttpStatusCategory` - HTTPステータスカテゴリ
- `HttpStatusInfo` - カテゴリ情報を含むHTTPステータス
