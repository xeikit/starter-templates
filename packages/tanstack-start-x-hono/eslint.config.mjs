import { defineConfig } from 'eslint/config';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import ts from 'typescript-eslint';

const reactFileTargets = ['**/*.{jsx,tsx}'];

export default defineConfig([
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/.wrangler/**'],
  },
  {
    name: 'react-hooks/react-components',
    files: reactFileTargets,
    languageOptions: {
      parser: ts.parser,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    ...reactHooks.configs.flat['recommended-latest'],
  },
]);
