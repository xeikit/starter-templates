# 🚀 初学者向け Hono + Nuxt3 ガイド

このガイドでは、HonoをNuxt3に組み込んだAPIの作り方を、ステップバイステップで学習します。

## 🎯 学習目標

このガイドを読み終えると、以下ができるようになります：

- ✅ Honoの基本概念を理解する
- ✅ 新しいAPIエンドポイントを作成する
- ✅ リクエストバリデーションを実装する
- ✅ エラーハンドリングを適切に行う
- ✅ レスポンス形式を統一する

## 🧠 基本概念

### Honoとは？

```typescript
// Honoは「炎」という意味の日本語
// 🔥 速くて軽量なWebフレームワーク
// 🌐 エッジランタイムに最適化
// 🛡️ TypeScriptファーストで型安全
```

### なぜHonoを選ぶのか？

1. **🚀 パフォーマンス**: Express.jsより高速
2. **🪶 軽量**: バンドルサイズが小さい
3. **🛡️ 型安全**: TypeScriptとの親和性が高い
4. **🌏 モダン**: Web標準に準拠

## 📚 ステップ1: 基本構造を理解する

### ディレクトリ構造

```bash
src/server/api/
├── [...].ts              # メインのHonoアプリケーション
├── config.ts             # 設定ファイル
├── types/                # 型定義
├── utils/                # ヘルパー関数
├── schemas/              # バリデーションスキーマ
└── routes/               # APIルート
    └── health.ts         # サンプルルート
```

### それぞれの役割

- **`[...].ts`**: Nuxt3のキャッチオール機能でHonoに接続
- **`config.ts`**: CORS、ログ、エラーハンドリングの設定
- **`types/`**: TypeScriptの型定義を集約
- **`utils/`**: 再利用可能なヘルパー関数
- **`schemas/`**: Zodを使ったリクエスト検証
- **`routes/`**: 実際のAPIエンドポイント

## 📚 ステップ2: 最初のAPIを作ってみる

### 1. 新しいルートファイルを作成

```typescript
// routes/users.ts
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { createSuccessApiResponse, HTTP_STATUS_CODES } from '../types';

// 🎯 ルートインスタンスを作成
export const userRoutes = new Hono();

// 📋 バリデーションスキーマを定義
const CreateUserSchema = z.object({
  name: z.string().min(1, '名前は必須です'),
  email: z.string().email('有効なメールアドレスを入力してください'),
});

// 📝 ユーザー一覧を取得
userRoutes.get('/', (context) => {
  const users = [
    { id: 1, name: '山田太郎', email: 'yamada@example.com' },
    { id: 2, name: '佐藤花子', email: 'sato@example.com' },
  ];

  return context.json(createSuccessApiResponse(users));
});

// ✨ 新しいユーザーを作成
userRoutes.post('/', zValidator('json', CreateUserSchema), (context) => {
  const userData = context.req.valid('json');

  const newUser = {
    id: Date.now(), // 実際のプロジェクトではDBで生成
    ...userData,
  };

  return context.json(createSuccessApiResponse(newUser), HTTP_STATUS_CODES.CREATED);
});
```

### 2. メインルーターに登録

```typescript
// [...].ts にルートを追加
import { userRoutes } from './routes/users';

// 既存のコードの後に追加
honoApplication.route('/users', userRoutes);
```

### 3. テストしてみる

```bash
# ユーザー一覧を取得
curl http://localhost:3000/api/users

# 新しいユーザーを作成
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"田中次郎","email":"tanaka@example.com"}'
```

## 📚 ステップ3: バリデーションとエラーハンドリング

### バリデーションの仕組み

```typescript
// Zodスキーマでリクエストを検証
const schema = z.object({
  name: z.string().min(1), // 必須の文字列
  age: z.number().min(0), // 0以上の数値
  email: z.string().email(), // 有効なメール形式
});

// zValidatorミドルウェアで自動検証
userRoutes.post('/', zValidator('json', schema), (context) => {
  // ここに到達する時点でバリデーション済み
  const validData = context.req.valid('json');
});
```

### エラーレスポンスの統一

```typescript
import { createErrorApiResponse } from '../utils/api-response';

// エラーが発生した場合
return context.json(createErrorApiResponse('ユーザーが見つかりません'), HTTP_STATUS_CODES.NOT_FOUND);
```

## 📚 ステップ4: より実践的な例

### ブログAPIの例

```typescript
// routes/posts.ts
export const postRoutes = new Hono();

// 📰 記事一覧取得（検索・ページング対応）
postRoutes.get(
  '/',
  zValidator(
    'query',
    z.object({
      search: z.string().optional(),
      page: z.string().transform(Number).optional(),
      limit: z.string().transform(Number).optional(),
    }),
  ),
  (context) => {
    const { search, page = 1, limit = 10 } = context.req.valid('query');

    // 実際の検索ロジック
    const posts = mockPosts.filter((post) => !search || post.title.includes(search));

    const offset = (page - 1) * limit;
    const paginatedPosts = posts.slice(offset, offset + limit);

    return context.json(
      createSuccessApiResponse({
        posts: paginatedPosts,
        pagination: {
          page,
          limit,
          total: posts.length,
          hasNext: offset + limit < posts.length,
        },
      }),
    );
  },
);

// 📝 記事作成
postRoutes.post('/', zValidator('json', CreatePostSchema), async (context) => {
  const postData = context.req.valid('json');

  try {
    // データベースに保存する処理
    const newPost = await savePost(postData);

    return context.json(createSuccessApiResponse(newPost), HTTP_STATUS_CODES.CREATED);
  } catch (error) {
    return context.json(createErrorApiResponse('記事の作成に失敗しました'), HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
});
```

## 🎉 まとめ

この実装の良い点：

1. **🏗️ 構造が明確**: 責任分離により理解しやすい
2. **🛡️ 型安全**: TypeScript + Zodで堅牢
3. **🔄 一貫性**: レスポンス形式が統一されている
4. **📝 保守性**: 設定とロジックが分離されている
5. **🧪 テスト可能**: 各部分が独立してテストできる

---

このガイドが Hono + Nuxt3 での API 開発の理解に役立てば幸いです！ 🎯
