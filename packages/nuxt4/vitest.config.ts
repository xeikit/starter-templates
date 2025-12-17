import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineVitestProject } from '@nuxt/test-utils/config';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    globals: true,
    reporters: ['verbose'],
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      exclude: ['**/types/*'],
      include: ['app/**/*', 'server/**/*'],
    },
    projects: [
      {
        plugins: [vue()],
        test: {
          name: 'unit',
          include: ['**/*.{test,spec}.ts'],
          exclude: ['node_modules/', '**/*.nuxt.{test,spec}.ts'],
          environment: 'happy-dom',
        },
        resolve: {
          alias: {
            '@': path.resolve(rootDir, './app/'),
            '~': path.resolve(rootDir, './app/'),
          },
        },
      },
      await defineVitestProject({
        test: {
          name: 'nuxt',
          include: ['**/*.nuxt.{test,spec}.ts'],
          exclude: ['node_modules/'],
          environment: 'nuxt',
        },
      }),
    ],
  },
});
