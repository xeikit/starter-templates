import tailwindcss from '@tailwindcss/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', '@nuxt/eslint', '@nuxt/test-utils'],
  css: ['./app/assets/css/tailwind.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  serverHandlers: [{ route: '/api/**', handler: '~~/server/api/index.ts', middleware: false }],
});
