import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: 'http://localhost:8787/api/openapi.yaml',
  output: '..//shared/types/api',
  plugins: ['@hey-api/typescript', { name: 'zod', exportFromIndex: true }],
});
