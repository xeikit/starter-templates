import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { useRenderEnvironment } from '@/composables/common/useRenderEnvironment';

const { mockUseNuxtApp, mockUseRuntime } = vi.hoisted(() => ({
  mockUseNuxtApp: vi.fn(),
  mockUseRuntime: vi.fn(),
}));

vi.mock('@/composables/common/useRuntime', () => ({
  useRuntime: mockUseRuntime,
}));

mockNuxtImport('useNuxtApp', async () => {
  const { useNuxtApp } = await vi.importActual<typeof import('#app')>('#app');
  return () => ({
    ...useNuxtApp(),
    ...mockUseNuxtApp(),
  });
});

describe('app/composables/common/useRenderEnvironment.ts', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('isInitialClientRender', () => {
    test.each([
      {
        description: 'SSR後の初期クライアント描画時はtrueを返すこと',
        isProcessClient: true,
        isHydrating: true,
        serverRendered: true,
        expected: true,
      },
      {
        description: 'サーバーサイドでの実行時はfalseを返すこと',
        isProcessClient: false,
        isHydrating: false,
        serverRendered: false,
        expected: false,
      },
      {
        description: 'クライアントサイドでのナビゲーション時はfalseを返すこと',
        isProcessClient: true,
        isHydrating: false,
        serverRendered: true,
        expected: false,
      },
      {
        description: 'SPAモードでの初回描画時はfalseを返すこと',
        isProcessClient: true,
        isHydrating: false,
        serverRendered: false,
        expected: false,
      },
    ])('$description', ({ isProcessClient, isHydrating, serverRendered, expected }) => {
      mockUseRuntime.mockReturnValue({ isProcessClient: { value: isProcessClient } });
      mockUseNuxtApp.mockReturnValue({ isHydrating, payload: { serverRendered } });

      const { isInitialClientRender } = useRenderEnvironment();

      expect(isInitialClientRender.value).toBe(expected);
    });
  });
});
