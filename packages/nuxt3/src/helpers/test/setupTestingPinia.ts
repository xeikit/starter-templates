import { createTestingPinia, type TestingPinia } from '@pinia/testing';
import { vi } from 'vitest';
import type { StateTree } from 'pinia';

/**
 * Helper function to create a Pinia instance for testing
 *
 * @param initialState Object to set the initial state of the store (optional)
 * @returns Pinia instance configured for testing
 *
 * @example
 * const testingPinia = setupTestingPinia();
 * const wrapper = mountComponent(TestComponent, { testingPinia });
 */
export const setupTestingPinia = (initialState: StateTree = {}): TestingPinia => {
  const testingPinia = createTestingPinia({
    stubActions: false,
    createSpy: vi.fn,
    initialState,
  });
  return testingPinia;
};
