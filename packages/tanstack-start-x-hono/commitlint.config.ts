import type { UserConfig } from '@commitlint/types';

const config = {
  extends: ['gitmoji'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'perf',
        'improve',
        'update',
        'fix',
        'hotfix',
        'refactor',
        'delete',
        'type',
        'docs',
        'deps',
        'test',
        'chore',
        'ci',
      ],
    ],
  },
} satisfies UserConfig;

export default config;
