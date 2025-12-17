import { createTestingPinia, type TestingPinia } from '@pinia/testing';
import type { StateTree } from 'pinia';
import { vi } from 'vitest';

export const setupTestingPinia = (initialState: StateTree = {}): TestingPinia => {
  const testingPinia = createTestingPinia({ stubActions: false, createSpy: vi.fn, initialState });
  return testingPinia;
};
