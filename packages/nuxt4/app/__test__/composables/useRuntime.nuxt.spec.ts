import { describe, expect, test } from 'vitest';
import { useRuntime } from '@/composables/common/useRuntime';

describe('app/composables/common/useRuntime.ts', () => {
  test('実行環境に則したbooleanが返ること', () => {
    const { isProcessClient, isProcessServer } = useRuntime();

    expect(isProcessClient.value).toBe(!isProcessServer.value);
    expect(isProcessServer.value).toBe(!isProcessClient.value);
  });
});
