import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: './public/openapi.yaml',
  output: './shared/types/api',
  plugins: ['@hey-api/typescript', { name: 'zod', exportFromIndex: true }],
});
