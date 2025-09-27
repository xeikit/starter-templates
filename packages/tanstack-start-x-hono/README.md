# TanStack Start x Hono

This is a starter template for building web applications using [TanStack Start](https://tanstack.com/start) and [Hono](https://hono.dev/). It provides a solid foundation for developing scalable and maintainable web applications with modern technologies.

## MCP Setup

```bash
claude mcp add playwright npx @playwright/mcp@latest
claude mcp add context7 -- npx --yes @upstash/context7-mcp
claude mcp add serena -- uvx --from git+https://github.com/oraios/serena serena-mcp-server --context ide-assistant --project $(pwd)
```
