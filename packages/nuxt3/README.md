# 🎉 Nuxt3 Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## 🚀 Technology stack

- Nuxt3
- Pinia
- TypeScript
- Prettier
- ESLint
- Vitest
- Husky
- VSCode
- **Hono** - Fast web API framework for server-side API development

## 🔌 API Integration

This starter includes a pre-configured **Hono** integration for building fast and type-safe APIs. The API routes are available under `/api/*` and include:

- Health check endpoints (`/api/health`, `/api/ping`)
- Sample endpoints with validation and error handling
- Complete TypeScript integration with Zod validation
- Multi-language documentation support

📖 **Choose Your Learning Path:**

- 🇺🇸 **English**: [Getting Started](src/server/api/docs/en/getting-started.md) | [Complete Docs](src/server/api/README.md)
- 🇯🇵 **日本語**: [初学者ガイド](src/server/api/docs/ja/getting-started.md) | [完全ドキュメント](src/server/api/README.md)

## ✨ Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## 🧑‍💻 Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## 👷 Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
