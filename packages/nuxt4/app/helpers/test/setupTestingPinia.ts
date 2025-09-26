import { createTestingPinia, type TestingPinia } from '@pinia/testing';
import type { StateTree } from 'pinia';
import { vi } from 'vitest';

/**
 * テスト用のPiniaインスタンスを作成するヘルパー関数
 *
 * @param initialState - Piniaストアに設定する初期状態
 * @returns テスト用Piniaインスタンス
 */
export const setupTestingPinia = (initialState: StateTree = {}): TestingPinia => {
  return createTestingPinia({
    stubActions: false,
    createSpy: vi.fn,
    initialState,
  });
};
