import type { UserConfig } from '@commitlint/types';

const config: UserConfig = {
  extends: ['gitmoji'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'perf',
        'update',
        'improve',
        'fix',
        'hotfix',
        'refactor',
        'delete',
        'type',
        'docs',
        'deps',
        'a11y',
        'style',
        'test',
        'chore',
        'ci',
      ],
    ],
  },
};

export default config;
