import { defineConfig } from 'eslint/config';
import tailwind from 'eslint-plugin-tailwindcss';
import globals from 'globals';
import ts from 'typescript-eslint';

const tailwindTargets = ['**/*.{jsx,tsx}'];
const tailwindRules = tailwind.configs['flat/recommended'][1]?.rules ?? {};

export default defineConfig([
  {
    name: 'tailwindcss/react-components',
    files: tailwindTargets,
    plugins: { tailwindcss: tailwind },
    languageOptions: {
      parser: ts.parser,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: { ...tailwindRules },
  },
]);
