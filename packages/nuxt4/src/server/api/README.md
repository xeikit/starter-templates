# 🔥 Hono + Nuxt 3 API Integration

Fast, lightweight, and type-safe API development for modern web applications.

## 🌍 Choose Your Language / 言語を選択

### 🇺🇸 English

**📚 Complete Documentation**

- 🎓 **[Getting Started Guide](docs/en/getting-started.md)** - Step-by-step learning for beginners
- 📖 **[Complete Documentation](docs/en/README.md)** - Comprehensive technical guide
- 🔧 **[API Response System](docs/en/api-response-system.md)** - Type system documentation

**🚀 Quick Start**

```bash
npm run dev
curl http://localhost:3000/api/health
```

### 🇯🇵 日本語

**📚 完全ドキュメント**

- 🎓 **[初学者向けガイド](docs/ja/getting-started.md)** - ステップバイステップで学ぶ
- � **[詳細ドキュメント](docs/ja/README.md)** - 包括的な技術ガイド
- �🔧 **[APIレスポンスシステム](docs/ja/api-response-system.md)** - 型システムのドキュメント

**🚀 クイックスタート**

```bash
npm run dev
curl http://localhost:3000/api/health
```

---

## 🛠️ What's Included / 含まれるもの

- ⚡ **Hono Framework** - Ultra-fast web framework
- 🛡️ **TypeScript** - Full type safety
- ✅ **Zod Validation** - Runtime type checking
- 📋 **Health Endpoints** - System monitoring
- 🔧 **Centralized Config** - Easy configuration management
- 📖 **Comprehensive Docs** - Learning resources in multiple languages

## 🏗️ Architecture Overview / アーキテクチャ概要

```
src/server/api/
├── [...].ts                      # Main Hono integration
├── config.ts                     # API configuration
├── types/                        # Type definitions
│   ├── api-response.ts           # Response types
│   ├── common.ts                 # Common types
│   └── health.ts                 # Health-related types
├── utils/                        # Helper functions
│   ├── api-response.ts           # Response utilities
│   └── system-info.ts           # System information
├── schemas/                      # Validation schemas
│   ├── common.ts                 # Common schemas
│   └── health.ts                 # Health schemas
├── routes/                       # API endpoints
│   ├── health.ts                 # Health check routes
│   └── posts.ts                  # Example blog routes
└── docs/                         # Documentation
    ├── en/                       # English docs
    └── ja/                       # Japanese docs
```

---

## � Quick Examples / クイックサンプル

### Basic Health Check / 基本ヘルスチェック

```bash
# Start development server / 開発サーバー起動
npm run dev

# Test health endpoint / ヘルスエンドポイントのテスト
curl http://localhost:3000/api/health
```

### Create Your First Route / 最初のルートを作成

**English**: See [Getting Started Guide](docs/en/getting-started.md) for step-by-step instructions.

**日本語**: [初学者向けガイド](docs/ja/getting-started.md)でステップバイステップの手順をご覧ください。

## 🌟 Features / 機能

- ⚡ **Ultra-fast performance** with Hono framework / Honoフレームワークによる超高速パフォーマンス
- 🛡️ **Type-safe** development with TypeScript + Zod / TypeScript + Zodによる型安全な開発
- 🔄 **Standardized responses** for consistent API behavior / 一貫したAPI動作のための標準化されたレスポンス
- ✅ **Built-in validation** with comprehensive error handling / 包括的なエラーハンドリングを備えた組み込みバリデーション
- 📖 **Multi-language docs** for global development / グローバル開発のための多言語ドキュメント
- 🧪 **Test-ready** structure for reliable development / 信頼性の高い開発のためのテスト対応構造

## 📋 Available Endpoints / 利用可能なエンドポイント

| Endpoint      | Method | Description               |
| ------------- | ------ | ------------------------- |
| `/api/health` | GET    | System health status      |
| `/api/ping`   | GET    | Simple ping response      |
| `/api/posts`  | GET    | Example blog posts (demo) |
| `/api/posts`  | POST   | Create new post (demo)    |

## 🤝 Contributing / 貢献

We welcome contributions in multiple languages! Please check our documentation for contribution guidelines.

多言語での貢献を歓迎します！貢献ガイドラインについては、ドキュメントをご確認ください。

---

**Ready to start? Choose your language above and dive in! / 始める準備はできましたか？上記から言語を選んで飛び込みましょう！** 🚀

````

## ✨ Key Features

- **🚀 Fast**: Hono's minimal overhead with optimized performance
- **🔒 Type-safe**: Full TypeScript + Zod validation throughout
- **📁 Clean Architecture**: Types, utils, and schemas clearly separated
- **🧪 Tested**: Comprehensive test coverage with Vitest
- **📚 Documented**: Multi-language docs (EN/JP) with detailed guides
- **🛠️ Developer-friendly**: Clear patterns following TidyFirst principles
- **� Maintainable**: Single responsibility principle applied consistently
- **🎯 Beginner-friendly**: Intuitive file structure and clear separation of concerns

## 💡 Design Principles

### 🎯 **Separation of Concerns**

- **`types/`**: Pure type definitions only (no implementation)
- **`utils/`**: Implementation logic and helper functions
- **`schemas/`**: Validation schemas (Zod)
- **`constants/`**: Constants and utility functions

### 🔄 **Clean Import Strategy**

```typescript
// Main exports - recommended approach
import { HTTP_STATUS_CODES, createSuccessApiResponse } from '../types';
import type { ApiResponse, HealthCheckQuery } from '../types';

// Direct imports - when needed
import { createSuccessApiResponse } from '../utils/api-response';
import type { ApiResponse } from '../types/api-response';
````

## 📋 Available Endpoints

| Method | Path          | Description               | Query Parameters    |
| ------ | ------------- | ------------------------- | ------------------- |
| `GET`  | `/api/health` | System health status      | `format`, `details` |
| `GET`  | `/api/ping`   | Simple availability check | `format`            |

## 🔧 Adding New Endpoints

1. **Create route file** in `routes/` directory
2. **Define schemas** in `schemas/` if validation is needed
3. **Add types** in `types/` if new types are required
4. **Register route** in `[...].ts`
5. **Add tests** in `__test__/`

## 🎯 Design Philosophy

This integration embodies both Hono's core philosophy and modern development principles:

### Hono Philosophy

- **Simple**: Minimal abstractions, clear patterns
- **Fast**: Optimized for performance
- **Type-safe**: Leverages TypeScript fully
- **Scalable**: Easy to extend and maintain

### TidyFirst Principles

- **No abbreviations**: `honoApplication` instead of `app`, `context` instead of `c`
- **Intention-revealing names**: `createSuccessApiResponse` instead of `createApiResponse`
- **Single responsibility**: Each file has one clear purpose
- **Separation of concerns**: Types, logic, and validation are cleanly separated

## 📚 Learn More

- 📖 **[Complete Guides](docs/)** - Detailed documentation in multiple languages
- 🔧 **[Type System Guide](docs/en/api-response-system.md)** - Understanding the type architecture
- 🧪 **[Testing Guide](__test__/)** - How to test your endpoints
- 🚀 **[Deployment Guide](docs/en/README.md#deployment)** - Production deployment tips
- **Separated concerns**: Related functionality grouped in dedicated directories

Perfect for developers who want a powerful yet approachable API framework in Nuxt 3, following modern development best practices.

---

**Ready to build? Pick your language and dive into the complete documentation! 🚀**
