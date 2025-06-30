# 🔥 Hono + TanStack Start API統合ガイド

> **📖 言語**: [English](../en/README.md) | [日本語](README.md)

高速で軽量、型安全なAPI開発のための統合実装です。

## 🎯 改善されたポイント

この実装は、Honoの公式ベストプラクティスに準拠するよう改善されました：

### ✅ **Honoらしいシンプルさ**

- 過度な抽象化を排除
- 直接的でわかりやすいコード構造
- 最小限の概念で最大の効果

### ✅ **初心者に優しい設計**

- コメントをシンプル化
- 一目でわかるファイル構成
- 実用的な例を重視

### ✅ **型安全性の向上**

- Zodバリデーションの適切な活用
- 冗長な型チェックを排除
- TypeScriptの力を最大限活用

### ✅ **クリーンアーキテクチャ**

- 型、ユーティリティ、スキーマの完全分離
- 直感的なファイル構成
- 単一責任原則の徹底

## 🚀 クイックスタート

### 1. 開発サーバー起動

```bash
npm run dev  # または pnpm dev
```

### 2. エンドポイントのテスト

```bash
# 基本的なヘルスチェック
curl http://localhost:5173/api/health

# 詳細なシステム情報
curl http://localhost:5173/api/health?details=full

# テキスト形式
curl http://localhost:5173/api/health?format=text

# シンプルなping
curl http://localhost:5173/api/ping
```

### 3. 新しいルートの追加

新しいルートファイルを作成：

```typescript
// routes/users.ts
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { HTTP_STATUS_CODES, createSuccessApiResponse } from '../types';

const UserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

export const userRoutes = new Hono();

userRoutes.get('/users', (context) => {
  return context.json(createSuccessApiResponse([]));
});

userRoutes.post('/users', zValidator('json', UserSchema), (context) => {
  const userData = context.req.valid('json');
  return context.json(createSuccessApiResponse(userData), HTTP_STATUS_CODES.CREATED);
});
```

メインルーターに登録：

```typescript
// $.ts
import { userRoutes } from './routes/users';
honoApplication.route('/users', userRoutes);
```

## 📁 改善された構造

責任の分離により、以下のような明確な構造になりました：

```
src/server/api/
├── $.ts                          # メインHono統合（キャッチオールルート）
├── config.ts                     # 集約されたAPI設定
├── index.ts                      # パッケージのメインエントリーポイント
├── types.ts                      # メイン型エクスポートファイル
├── types/                        # 型定義のみ
│   ├── index.ts                  # 中央型エクスポート
│   ├── api-response.ts           # APIレスポンス型
│   ├── common.ts                 # 共通型
│   ├── health.ts                 # ヘルス関連型
│   └── http-status.ts            # HTTPステータス型
├── utils/                        # 実装・ヘルパー関数
│   ├── api-response.ts           # APIレスポンスユーティリティ
│   ├── system-info.ts            # システム情報取得ユーティリティ
│   └── text-formatting.ts       # テキストフォーマット機能
├── constants/
│   └── http-status.ts            # HTTPステータスコード定数
├── schemas/                      # バリデーションスキーマ（Zod）
│   ├── common.ts                 # 共通バリデーションスキーマ
│   └── health.ts                 # ヘルスチェック専用スキーマ
├── routes/                       # ルートモジュール（リソース毎）
│   └── health.ts                 # ヘルスチェックエンドポイント
├── docs/                         # 多言語ドキュメント
│   ├── en/                       # 英語ドキュメント
│   │   ├── README.md             # 完全な英語ガイド
│   │   └── api-response-system.md # 型システムドキュメント
│   └── ja/                       # 日本語ドキュメント
│       ├── README.md             # 完全な日本語ガイド
│       └── api-response-system.md # 型システムドキュメント
└── __test__/                     # テストファイル
```

## 🧪 APIのテスト

開発サーバー起動後、エンドポイントをテストできます：

```bash
# ヘルスチェック
curl http://localhost:5173/api/health
# レスポンス: {"data":{"status":"ok","timestamp":"2025-06-21T10:17:44.471Z","uptime":262.92}}

# Pingエンドポイント
curl http://localhost:5173/api/ping
# レスポンス: {"data":{"message":"pong","timestamp":"2025-06-21T10:17:44.471Z","service":"hono-api"}}
```

すべてのエンドポイントは適切なHTTPステータスコードと一貫したデータ構造でJSONレスポンスを返します。

## 🏗️ TanStack Start統合

### サーバー関数 vs APIルート

TanStack Startでは、サーバーサイドロジックを処理する2つの方法があります：

1. **サーバー関数** - フロントエンドと統合され、型安全
2. **APIルート** - Honoを使用した従来のRESTエンドポイント

```typescript
// サーバー関数アプローチ（フロントエンド統合におすすめ）
import { createServerFn } from '@tanstack/react-start';

const getUsers = createServerFn({
  method: 'GET',
}).handler(async () => {
  // ロジックをここに記述
  return { users: [] };
});

// コンポーネントでの使用
function UserList() {
  const users = await getUsers();
  return <div>{/* usersをレンダリング */}</div>;
}
```

```typescript
// APIルートアプローチ（外部API用）
// routes/users.ts
export const userRoutes = new Hono();

userRoutes.get('/users', (context) => {
  return context.json(createSuccessApiResponse({ users: [] }));
});
```

### リファクタリングされた構造

TidyFirstの原則に従い、責任を専用ファイルに分離しました：

```bash
src/server/api/
├── $.ts                          # メインHono統合（キャッチオールルート）
├── config.ts                     # 集約されたAPI設定
├── index.ts                      # パッケージのメインエントリーポイント
├── types.ts                      # 統合型エクスポート
├── constants/
│   └── http-status.ts           # HTTPステータスコード定数
├── types/
│   └── api-response.ts          # APIレスポンス型とユーティリティ
├── schemas/
│   ├── common.ts                # 共通バリデーションスキーマ
│   └── health.ts                # ヘルス関連スキーマ
├── utils/
│   ├── system-info.ts           # システム情報ユーティリティ
│   └── text-formatting.ts      # テキストフォーマット機能
├── routes/                      # ルートモジュール（リソース毎）
│   └── health.ts                # ヘルスチェックエンドポイント
├── docs/                        # 多言語ドキュメント
│   ├── en/                      # 英語ドキュメント
│   └── ja/                      # 日本語ドキュメント
└── __test__/                    # テストファイル
```

### 🔄 **従来構造との違い**

| 役割               | 従来             | 現在                        |
| ------------------ | ---------------- | --------------------------- |
| **型定義**         | 各ファイルに分散 | `types/` ディレクトリに集約 |
| **HTTP定数**       | `types.ts`内     | `constants/http-status.ts`  |
| **レスポンス関数** | 型と混在         | `utils/api-response.ts`     |
| **バリデーション** | ルートファイル内 | `schemas/` ディレクトリ     |
| **ユーティリティ** | 機能別に分散     | `utils/` ディレクトリ       |

### 📦 **新しいインポート方法**

```typescript
// メインエントリーポイントから（推奨）
import { HTTP_STATUS_CODES, createSuccessApiResponse } from '../types';
import type { ApiResponse, HealthCheckQuery } from '../types';

// または直接インポート
import { HTTP_STATUS_CODES } from '../constants/http-status';
import { createSuccessApiResponse } from '../utils/api-response';
import type { ApiResponse } from '../types/api-response';
```

### ✨ **改善のメリット**

1. **責任の分離**: 各ファイルが単一の責任を持つ
2. **型定義の統合**: すべての型が`types/`ディレクトリに集約
3. **保守性向上**: 変更時の影響範囲を最小化
4. **テスタビリティ**: 独立した関数によりテストが容易
5. **型安全性**: より詳細で正確な型定義
6. **チーム開発**: 衝突を避けやすいファイル構造
7. **拡張性**: 新機能追加時の既存コードへの影響を最小化
8. **初学者に優しい**: ファイルの役割が直感的に分かる

### 🚀 **TidyFirst改善**

- **省略禁止**: `app` → `honoApplication`, `c` → `context`
- **意図を表す名前**: `createApiResponse` → `createSuccessApiResponse`
- **具体的な型名**: `HttpStatus` → `HttpStatusCode`

## ➕ 新しいAPIエンドポイントの追加

### ステップ1: 新しいルートファイルの作成

`routes/`ディレクトリに新しいファイルを作成します（例：`routes/users.ts`）：

```typescript
/**
 * ユーザールート（新しい構造に対応）
 * 改善された分離構造とTidyFirst命名規約を使用
 */
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { HTTP_STATUS_CODES, createSuccessApiResponse, createErrorApiResponse } from '../types';

// バリデーションスキーマ
const CreateUserSchema = z.object({
  name: z.string().min(1, '名前は必須です').max(100, '名前は100文字以内で入力してください'),
  email: z.string().email('有効なメールアドレスを入力してください'),
  age: z.number().int().min(0, '年齢は0以上である必要があります').max(120, '年齢は120以下である必要があります').optional(),
});

const UserParamsSchema = z.object({
  id: z.string().regex(/^\d+$/, 'IDは数値である必要があります'),
});

const PaginationQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('10'),
  search: z.string().optional(),
});

// 型推論
type CreateUserInput = z.infer<typeof CreateUserSchema>;
type UserParams = z.infer<typeof UserParamsSchema>;
type PaginationQuery = z.infer<typeof PaginationQuerySchema>;

// ルートインスタンス作成
export const userRoutes = new Hono();

// 📖 GET - ページネーション付きユーザー取得
userRoutes.get('/', zValidator('query', PaginationQuerySchema), (context) => {
  const { page, limit, search } = context.req.valid('query');

  let users = [
    { id: 1, name: '田中太郎', email: 'tanaka@example.com', age: 30 },
    { id: 2, name: '佐藤花子', email: 'sato@example.com', age: 25 },
  ];

  // 検索フィルタリング
  if (search) {
    users = users.filter((user) => user.name.includes(search) || user.email.includes(search));
  }

  // ページネーション
  const startIndex = (page - 1) * limit;
  const paginatedUsers = users.slice(startIndex, startIndex + limit);

  return context.json(
    createSuccessApiResponse({
      users: paginatedUsers,
      pagination: {
        page,
        limit,
        total: users.length,
        totalPages: Math.ceil(users.length / limit),
      },
    }),
    HTTP_STATUS_CODES.OK,
  );
});

// 📖 GET - 特定ユーザー取得
userRoutes.get('/:id', zValidator('param', UserParamsSchema), (context) => {
  const { id } = context.req.valid('param');

  const user = {
    id: parseInt(id),
    name: '田中太郎',
    email: 'tanaka@example.com',
    age: 30,
  };

  return context.json(createSuccessApiResponse(user), HTTP_STATUS_CODES.OK);
});

// ✏️ POST - 新しいユーザー作成
userRoutes.post('/', zValidator('json', CreateUserSchema), async (context) => {
  const validatedUserData = context.req.valid('json');

  const newUser = {
    id: Date.now(), // シンプルなID生成
    ...validatedUserData,
    createdAt: new Date().toISOString(),
  };

  return context.json(createSuccessApiResponse(newUser), HTTP_STATUS_CODES.CREATED);
});

// 🗑️ DELETE - ユーザー削除
userRoutes.delete('/:id', zValidator('param', UserParamsSchema), (context) => {
  const { id } = context.req.valid('param');

  const deleteResult = {
    id: parseInt(id),
    message: `ID ${id}のユーザーが削除されました`,
    deletedAt: new Date().toISOString(),
  };

  return context.json(createSuccessApiResponse(deleteResult), HTTP_STATUS_CODES.OK);
});
```

### ステップ2: ルートの登録

`$.ts`にルートを追加します：

```typescript
// ファイル上部にインポートを追加
import { userRoutes } from './routes/users';

// ルート登録を追加（healthRoutesの後）
honoApplication.route('/users', userRoutes);
```

### ステップ3: エンドポイントのテスト

```bash
# 📖 GET - 全ユーザーの一覧
curl http://localhost:5173/api/users

# 📖 GET - 特定ユーザーの取得
curl http://localhost:5173/api/users/1

# ✏️ POST - 新しいユーザーの作成
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"鈴木一郎","email":"suzuki@example.com"}'

# 🗑️ DELETE - ユーザーの削除
curl -X DELETE http://localhost:3000/api/users/1
```

## 🔧 HTTPメソッドリファレンス

| メソッド | 用途               | 使用例                                 |
| -------- | ------------------ | -------------------------------------- |
| `GET`    | データ取得         | ユーザー一覧取得、IDによるユーザー取得 |
| `POST`   | 新しいリソース作成 | 新しいユーザー作成、フォーム送信       |
| `PUT`    | リソース全体の更新 | ユーザーデータの完全置換               |
| `PATCH`  | 部分更新           | ユーザー名のみ更新                     |
| `DELETE` | リソースの削除     | ユーザーアカウント削除                 |

## 🔍 よく使うパターン

### クエリパラメータ

```typescript
userRoutes.get('/', (context) => {
  const page = context.req.query('page') || '1';
  const limit = context.req.query('limit') || '10';
  const search = context.req.query('search') || '';

  // パラメータをロジックで使用
  return context.json(createSuccessApiResponse({ page, limit, search }));
});

// テスト: GET /api/users?page=2&limit=5&search=田中
```

### パスパラメータ

```typescript
userRoutes.get('/:id/posts/:postId', (context) => {
  const userId = context.req.param('id');
  const postId = context.req.param('postId');

  return context.json(createSuccessApiResponse({ userId, postId }));
});

// テスト: GET /api/users/123/posts/456
```

### ヘッダー

```typescript
userRoutes.get('/profile', (context) => {
  const authorization = context.req.header('Authorization');
  const userAgent = context.req.header('User-Agent');

  if (!authorization) {
    return context.json(createErrorApiResponse('認証が必要です'), HTTP_STATUS_CODES.UNAUTHORIZED);
  }

  return context.json(createSuccessApiResponse({ authorized: true }));
});
```

### リクエストボディ（JSON）

```typescript
userRoutes.post('/', async (context) => {
  const body = await context.req.json();

  // 特定のフィールドを分割代入
  const { name, email, age } = body;

  return context.json(createSuccessApiResponse({ name, email, age }));
});
```

### フォームデータ

```typescript
userRoutes.post('/upload', async (context) => {
  const formData = await context.req.formData();
  const file = formData.get('file');
  const description = formData.get('description');

  return context.json(createSuccessApiResponse({ file: file?.name, description }));
});
```

## 🛡️ ミドルウェアの例

### カスタムミドルウェアの追加

#### グローバルミドルウェア（`$.ts`内）

```typescript
// リクエストログ
honoApplication.use('*', async (context, next) => {
  console.log(`${context.req.method} ${context.req.url}`);
  await next();
});

// 認証ミドルウェア
honoApplication.use('/api/admin/*', async (context, next) => {
  const token = context.req.header('Authorization');
  if (!token || !token.startsWith('Bearer ')) {
    return context.json(createErrorApiResponse('認証が必要です'), HTTP_STATUS_CODES.UNAUTHORIZED);
  }
  await next();
});
```

#### ルート固有のミドルウェア

```typescript
// ルートファイル内
userRoutes.use('/protected/*', async (context, next) => {
  const token = context.req.header('authorization');
  if (!token) {
    return context.json(createErrorApiResponse('認証が必要です'), HTTP_STATUS_CODES.UNAUTHORIZED);
  }
  await next();
});

// 保護されたルート
userRoutes.get('/protected/profile', (context) => {
  return context.json(createSuccessApiResponse({ message: 'これは保護されています！' }));
});
```

## ⚙️ 設定

### 環境変数

`config.ts`で環境に基づいてAPIを設定：

```typescript
export const apiConfig = {
  cors: {
    origin: IS_PRODUCTION ? (process.env.ALLOWED_ORIGINS?.split(',') ?? ['https://yourdomain.com']) : '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'] as string[],
    allowHeaders: ['Content-Type', 'Authorization'] as string[],
  },
  rateLimit: {
    enabled: IS_PRODUCTION,
    windowMs: 15 * 60 * 1000, // 15分
    max: 100, // ウィンドウあたりのリクエスト数
  },
};
```

### カスタム環境変数

プロジェクトルートに`.env`ファイルを作成：

```env
# API設定
ALLOWED_ORIGINS=https://yourapp.com,https://www.yourapp.com
API_SECRET_KEY=your-secret-key-here
DATABASE_URL=your-database-connection-string
```

## 🎯 ベストプラクティス

1. **📁 ファイル整理**: 責任別にファイルを分離し、関連する機能をグループ化
2. **🔧 型システム**: `types/`ディレクトリに型定義を集約し、実装と分離
3. **🛡️ Zodバリデーション**: 型安全なランタイム検証を使用
4. **📊 一貫したレスポンス**: `createSuccessApiResponse()`と`createErrorApiResponse()`を使用
5. **🚨 エラーハンドリング**: 適切なHTTPステータスコードで優雅にエラーを処理
6. **📝 型安全性**: ZodスキーマからTypeScript型を自動生成
7. **🧪 テスト**: curlやAPIテストツールで全エンドポイントをテスト
8. **🔗 RESTful URL**: URLパターンでREST規約に従う
9. **🔄 データ変換**: Zodのtransform機能を活用してデータを適切な形式に変換
10. **📛 明確な命名**: TidyFirstの原則に従い、説明的な変数・関数名を使用
11. **🔧 単一責任**: 各ファイル・関数が単一の責任を持つよう設計

## 🚨 トラブルシューティング

### よくある問題

| 問題                            | 解決方法                                 |
| ------------------------------- | ---------------------------------------- |
| **ルートが見つからない（404）** | `$.ts`でルートが登録されているか確認     |
| **CORSエラー**                  | `config.ts`の`cors`設定を更新            |
| **型エラー**                    | 適切なインポートと型定義を確認           |
| **ミドルウェア競合**            | ミドルウェア登録順序を確認               |
| **JSON解析エラー**              | リクエストボディの形式を検証             |

### デバッグのコツ

```typescript
// デバッグログを追加
userRoutes.get('/debug', (context) => {
  console.log('ヘッダー:', context.req.header());
  console.log('クエリ:', context.req.query());
  console.log('URL:', context.req.url);

  return context.json(createSuccessApiResponse({ debug: 'ログ出力済み' }));
});
```

## 📚 リソース

- [Hono ドキュメント](https://hono.dev/)
- [TanStack Start ドキュメント](https://tanstack.com/start)
- [HTTPステータスコード](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [REST API ベストプラクティス](https://restfulapi.net/)