import { defineConfig } from 'eslint/config';
import globals from 'globals';
import ts from 'typescript-eslint';

const tailwindTargets = ['**/*.{jsx,tsx}'];

export default defineConfig([
  {
    name: 'tailwindcss/react-components',
    files: tailwindTargets,
    languageOptions: {
      parser: ts.parser,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
]);
