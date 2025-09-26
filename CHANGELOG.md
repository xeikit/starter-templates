# Changelog


## v1.4.0

[compare changes](https://github.com/xeikit/starter-templates/compare/v1.3.0...v1.4.0)

### ✨ Enhancements

- Update Nuxt4 and TanStack Start templates ([#12](https://github.com/xeikit/starter-templates/pull/12))

### ❤️ Contributors

- KAKI ([@XeicuLy](https://github.com/XeicuLy))

## v1.3.0

[compare changes](https://github.com/xeikit/starter-templates/compare/v1.2.0...v1.3.0)

### ✨ Enhancements

- **tanstack:** Implement createRouter function and extend router interface ([ad7b297](https://github.com/xeikit/starter-templates/commit/ad7b297))
- **tanstack:** Add initial router setup with RootComponent and routing structure ([31d66c9](https://github.com/xeikit/starter-templates/commit/31d66c9))
- **tanstack:** Add route handling and file-based state management ([addc64c](https://github.com/xeikit/starter-templates/commit/addc64c))
- **tanstack:** Add vitest configuration and testing scripts to package.json ([5fdbeeb](https://github.com/xeikit/starter-templates/commit/5fdbeeb))
- **tanstack:** Add Tailwind CSS integration ([7bce893](https://github.com/xeikit/starter-templates/commit/7bce893))
- **tanstack:** Add RootNotFound component for 404 error handling ([f33f6fb](https://github.com/xeikit/starter-templates/commit/f33f6fb))
- **tanstack:** Add initial tanstack.json template configuration ([ce7d75a](https://github.com/xeikit/starter-templates/commit/ce7d75a))
- Add settings.json for claude ([2ac9062](https://github.com/xeikit/starter-templates/commit/2ac9062))

### 📝 Documentation

- **tanstack:** Add README.md with project overview, setup instructions, and features ([cdd1daa](https://github.com/xeikit/starter-templates/commit/cdd1daa))

### 🔧 Chore

- **tanstack:** Add initial package.json configuration ([504d038](https://github.com/xeikit/starter-templates/commit/504d038))
- **tanstack:** Add tsconfig.json with initial TypeScript configuration ([8dd642c](https://github.com/xeikit/starter-templates/commit/8dd642c))
- **tanstack:** Add .gitignore file with initial configuration ([c7bd451](https://github.com/xeikit/starter-templates/commit/c7bd451))
- **tanstack:** Update package.json to include module type and scripts ([afa7f45](https://github.com/xeikit/starter-templates/commit/afa7f45))
- **tanstack:** Add Vite configuration file with TypeScript paths and TanStack plugin ([fd8b463](https://github.com/xeikit/starter-templates/commit/fd8b463))
- **tanstack:** Add linter settings ([5f94fde](https://github.com/xeikit/starter-templates/commit/5f94fde))
- **tanstack:** Add husky and lint-staged configuration for pre-commit hooks ([c276b01](https://github.com/xeikit/starter-templates/commit/c276b01))
- Update settings.json to allow WebFetch for specified domains ([4e5659c](https://github.com/xeikit/starter-templates/commit/4e5659c))
- Remove unused resolve alias configuration from vitest.config.ts ([01f7da4](https://github.com/xeikit/starter-templates/commit/01f7da4))
- **tanstack:** Move dir ([24059b2](https://github.com/xeikit/starter-templates/commit/24059b2))
- Rename tanstack package to tanstack-start and update babel dependencies ([24dd4e8](https://github.com/xeikit/starter-templates/commit/24dd4e8))

### 🎨 Improvements

- **tanstack:** Fix lint issues ([e5cd550](https://github.com/xeikit/starter-templates/commit/e5cd550))

### 📦️ Dependencies

- **tanstack:** Install dependencies ([0f077d1](https://github.com/xeikit/starter-templates/commit/0f077d1))

### ❤️ Contributors

- XeicuLy ([@XeicuLy](https://github.com/XeicuLy))

## v1.2.0

[compare changes](https://github.com/xeikit/starter-templates/compare/v1.1.0...v1.2.0)

### ✨ Enhancements

- **nuxt3:** Implement Hono API integration entry point ([0ba01e6](https://github.com/xeikit/starter-templates/commit/0ba01e6))
- **nuxt3:** Add centralized API configuration ([27b58c8](https://github.com/xeikit/starter-templates/commit/27b58c8))
- **nuxt3:** Implement comprehensive type system ([f31a75c](https://github.com/xeikit/starter-templates/commit/f31a75c))
- **nuxt3:** Add HTTP constants and utility functions ([0f64f70](https://github.com/xeikit/starter-templates/commit/0f64f70))
- **nuxt3:** Implement Zod validation schemas ([2b61843](https://github.com/xeikit/starter-templates/commit/2b61843))
- **nuxt3:** Implement health monitoring endpoints ([4cfe15b](https://github.com/xeikit/starter-templates/commit/4cfe15b))
- **nuxt3:** Add main type exports for API package ([7bb6461](https://github.com/xeikit/starter-templates/commit/7bb6461))

### ♻️ Refactors

- **nuxt3:** Use dynamic HTTP status codes from types definition ([c9af6af](https://github.com/xeikit/starter-templates/commit/c9af6af))

### 📝 Documentation

- **nuxt3:** Add comprehensive API response system documentation in English and Japanese ([99dc4ef](https://github.com/xeikit/starter-templates/commit/99dc4ef))
- **nuxt3:** Correct Japanese flag emoji in README ([e84bf02](https://github.com/xeikit/starter-templates/commit/e84bf02))

### ✅ Tests

- **nuxt3:** Add comprehensive tests for API configuration ([f058b74](https://github.com/xeikit/starter-templates/commit/f058b74))
- **nuxt3:** Move test files ([880df34](https://github.com/xeikit/starter-templates/commit/880df34))
- Enhance API and system utilities tests with behavior-based validation ([c2b6d1f](https://github.com/xeikit/starter-templates/commit/c2b6d1f))
- Refactor utility tests for improved readability and behavior validation ([44410a3](https://github.com/xeikit/starter-templates/commit/44410a3))
- **nuxt3:** Refine initial state assertions in Pinia setup tests ([83cafa9](https://github.com/xeikit/starter-templates/commit/83cafa9))
- **nuxt3:** Fix undefined response assertion in API response tests ([50bf7b3](https://github.com/xeikit/starter-templates/commit/50bf7b3))

### 🤖 CI

- Add CI workflow for Nuxt3 with Prettier, ESLint, TypeScript checks, and tests ([ab34ce2](https://github.com/xeikit/starter-templates/commit/ab34ce2))

### 🎨 Improvements

- **nuxt3:** Fix lint error ([827752c](https://github.com/xeikit/starter-templates/commit/827752c))
- **nuxt3:** Enhance request body handling for various types ([8912e6b](https://github.com/xeikit/starter-templates/commit/8912e6b))
- **nuxt3:** Re-export api-response utilities in API index ([8779053](https://github.com/xeikit/starter-templates/commit/8779053))
- **nuxt3:** Improve content-type header handling ([78f9dfe](https://github.com/xeikit/starter-templates/commit/78f9dfe))
- **nuxt3:** Improve error handling to provide detailed error messages ([e3d5ace](https://github.com/xeikit/starter-templates/commit/e3d5ace))
- **nuxt3:** Correct import path for HTTP_STATUS_CODES in http-status.ts ([8af2609](https://github.com/xeikit/starter-templates/commit/8af2609))
- **nuxt3:** Enhance type guard checks for API response validation ([71be75d](https://github.com/xeikit/starter-templates/commit/71be75d))
- **nuxt3:** Improve memory usage percentage calculation to handle zero total memory ([8c23d2c](https://github.com/xeikit/starter-templates/commit/8c23d2c))
- **nuxt3:** Refine error message validation in API response tests ([f7d6a8d](https://github.com/xeikit/starter-templates/commit/f7d6a8d))

### 📦️ Dependencies

- Add Hono and validation dependencies ([32fa8b2](https://github.com/xeikit/starter-templates/commit/32fa8b2))

### ❤️ Contributors

- XeicuLy ([@XeicuLy](https://github.com/XeicuLy))

## v1.1.0

[compare changes](https://github.com/xeikit/starter-templates/compare/v1.0.2...v1.1.0)

### ✨ Enhancements

- Add nuxt3 and react-router template files ([afcd91d](https://github.com/xeikit/starter-templates/commit/afcd91d))

### ❤️ Contributors

- XeicuLy ([@XeicuLy](https://github.com/XeicuLy))

## v1.0.2

[compare changes](https://github.com/xeikit/starter-templates/compare/v1.0.1...v1.0.2)

### ✨ Enhancements

- Add nuxt3 template ([8302890](https://github.com/xeikit/starter-templates/commit/8302890))
- Add React Router v7 template ([6bbe5e7](https://github.com/xeikit/starter-templates/commit/6bbe5e7))

### 🔧 Chore

- Update @biomejs/biome dependency to version 1.9.4 and adjust meta function parameter ([06badac](https://github.com/xeikit/starter-templates/commit/06badac))

### ❤️ Contributors

- XeicuLy ([@XeicuLy](https://github.com/XeicuLy))

## v1.0.1


### 📝 Documentation

- Add README file ([732a21e](https://github.com/xeikit/starter-templates/commit/732a21e))

### 🔧 Chore

- Add @XeicuLy to code owner ([0b2fc29](https://github.com/xeikit/starter-templates/commit/0b2fc29))
- Update package.json with project description and author details ([e267b1a](https://github.com/xeikit/starter-templates/commit/e267b1a))
- Add pnpm workspace configuration ([6ee66c9](https://github.com/xeikit/starter-templates/commit/6ee66c9))
- Add commitlint configuration and husky commit-msg hook ([752db92](https://github.com/xeikit/starter-templates/commit/752db92))
- Add tsconfig.json configuration file ([a8f71da](https://github.com/xeikit/starter-templates/commit/a8f71da))
- Add changelog configuration file and release script ([1ef3f5f](https://github.com/xeikit/starter-templates/commit/1ef3f5f))

### 🤖 CI

- Add Node.js installation and release workflow ([245bdbe](https://github.com/xeikit/starter-templates/commit/245bdbe))

### 📦️ Dependencies

- Add package dependencies ([7361a98](https://github.com/xeikit/starter-templates/commit/7361a98))

### ❤️ Contributors

- XeicuLy ([@XeicuLy](https://github.com/XeicuLy))

