# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a monorepo containing starter templates for the `create-xeikit-app` CLI tool. Templates are distributed as JSON files in `/templates/` that reference GitHub tar.gz archives of template packages in `/packages/`.

## Monorepo Structure

- **Root-level**: Template registry with minimal build tooling
- **packages/**: Individual template packages (nuxt3, react-router, tanstack)
- **templates/**: JSON configuration files that define download URLs and subdirectories

Each template package is a complete, standalone project with its own dependencies and build configuration.

## Common Commands

### Root Level (Registry)

- `pnpm release` - Generate changelog and create release
- `pnpm prepare` - Set up git hooks with husky

### Template Packages

Navigate to specific package directory first (e.g., `cd packages/tanstack`):

#### TanStack Template

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm test` - Run tests once
- `pnpm test:ui` - Run tests with UI and coverage
- `pnpm lint` - Check code quality (biome + prettier + typecheck)
- `pnpm lint:fix` - Auto-fix linting issues
- `pnpm typecheck` - TypeScript type checking

#### Nuxt3 Template

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm test` - Run tests once
- `pnpm test:ui` - Run tests with UI and coverage
- `pnpm lint` - ESLint checking
- `pnpm lint:fix` - Auto-fix ESLint issues
- `pnpm typecheck` - Nuxt type checking

## Architecture Notes

### Template Distribution System

Templates are packaged as GitHub releases and referenced by JSON files. Each template JSON contains:

- `name`: Template identifier
- `tar`: GitHub codeload URL to main branch tarball
- `subdir`: Path within the archive to the template package

### Linting Strategy

- **TanStack**: Uses Biome + Prettier + TypeScript
- **Nuxt3**: Uses ESLint + Prettier + Nuxt's built-in typecheck
- **React Router**: Uses Biome + Prettier (similar to TanStack)

### Testing

All templates use Vitest with coverage via `@vitest/coverage-v8` and Happy DOM for browser environment simulation.

## Commit Conventions

Uses gitmoji-based commits with commitlint enforcement. Common prefixes: feat, fix, docs, refactor, test, chore, ci.
