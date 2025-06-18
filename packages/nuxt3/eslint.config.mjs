// @ts-check
import tsEslintParser from '@typescript-eslint/parser';
import vitest from '@vitest/eslint-plugin';
import pluginXeiculy from 'eslint-plugin-xeiculy';
import globals from 'globals';
import vueEslintParser from 'vue-eslint-parser';
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt([
  {
    languageOptions: {
      parser: vueEslintParser,
      parserOptions: {
        parser: tsEslintParser,
        project: './tsconfig.json',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: { xeiculy: pluginXeiculy },
    rules: {
      'no-console': 'warn',
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
          pathGroups: [{ pattern: '@/**', group: 'parent', position: 'before' }],
          pathGroupsExcludedImportTypes: ['builtin'],
          alphabetize: { order: 'asc' },
          'newlines-between': 'never',
        },
      ],
      'xeiculy/require-reactive-value-suffix': ['error', { functionNamesToIgnoreValueCheck: [] }],
      'xeiculy/store-state-suffix': 'error',
    },
  },
  {
    files: ['**/*.vue'],
    rules: {
      'vue/html-self-closing': 'off',
      'vue/multi-word-component-names': 'off',
    },
  },
  {
    files: ['**/*.spec.js', '**/*.spec.ts', '**/*.test.js', '**/*.test.ts'],
    plugins: { vitest },
    rules: {
      ...vitest.configs.recommended.rules,
      'vitest/consistent-test-it': ['error', { fn: 'test', withinDescribe: 'test' }],
      'vitest/no-conditional-expect': 'error',
      'vitest/no-conditional-in-test': 'error',
      'vitest/no-conditional-tests': 'error',
      'vitest/no-disabled-tests': 'error',
      'vitest/no-duplicate-hooks': 'error',
      'vitest/no-test-return-statement': 'error',
      'vitest/prefer-mock-promise-shorthand': 'error',
      'vitest/require-hook': 'error',
      'vitest/require-to-throw-message': 'error',
      'vitest/require-top-level-describe': ['error', { maxNumberOfTopLevelDescribes: 2 }],
    },
  },
]);
