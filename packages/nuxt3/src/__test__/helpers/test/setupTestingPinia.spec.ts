/**
 * Testing Pinia Setup Tests - Behavior-Based
 *
 * Tests focus on the behavior and contract of the Pinia testing setup,
 * ensuring stores work correctly in test environments.
 */

import { defineStore } from 'pinia';
import { describe, expect, test } from 'vitest';
import { setupTestingPinia } from '@/helpers/test';

const useTestStore = defineStore('test', {
  state: () => ({
    count: 0,
    name: 'test',
  }),
  actions: {
    increment() {
      this.count++;
    },
    updateName(name: string) {
      this.name = name;
    },
  },
});

describe('src/helpers/test/setupTestingPinia.ts', () => {
  describe('Store Initialization', () => {
    test('should provide functional store instance with default state', () => {
      const pinia = setupTestingPinia();
      const store = useTestStore(pinia);

      expect(store.count).toBe(0);
      expect(store.name).toBe('test');
    });

    test('should support store state mutations through actions', () => {
      const pinia = setupTestingPinia();
      const store = useTestStore(pinia);

      const initialCount = store.count;
      const newName = 'newName';

      store.increment();
      store.updateName(newName);

      expect(store.count).toBe(initialCount + 1);
      expect(store.name).toBe(newName);
    });
  });

  describe('Custom Initial State', () => {
    test('should accept and apply custom initial state', () => {
      const customInitialCount = 5;
      const customInitialName = 'initialName';
      const customState = {
        test: {
          count: customInitialCount,
          name: customInitialName,
        },
      };

      const pinia = setupTestingPinia(customState);
      const store = useTestStore(pinia);

      expect(store.count).toBe(customInitialCount);
      expect(store.name).toBe(customInitialName);
    });

    test('should maintain action functionality with custom state', () => {
      const customState = {
        test: {
          count: 10,
          name: 'customName',
        },
      };

      const pinia = setupTestingPinia(customState);
      const store = useTestStore(pinia);

      const initialCount = store.count;
      const updatedName = 'updatedName';

      store.increment();
      store.updateName(updatedName);

      expect(store.count).toBe(initialCount + 1);
      expect(store.name).toBe(updatedName);
    });
  });

  describe('Testing Environment Compatibility', () => {
    test('should provide independent testing capabilities', () => {
      const pinia1 = setupTestingPinia();
      const pinia2 = setupTestingPinia();

      // 動作契約: 異なるPiniaインスタンスが独立していること
      expect(pinia1).not.toBe(pinia2);

      expect(pinia1).toBeDefined();
      expect(pinia2).toBeDefined();
      expect(typeof pinia1).toBe('object');
      expect(typeof pinia2).toBe('object');

      const store1 = useTestStore(pinia1);
      const store2 = useTestStore(pinia2);

      expect(store1).toBeDefined();
      expect(store2).toBeDefined();

      expect(typeof store1.count).toBe('number');
      expect(typeof store1.name).toBe('string');
      expect(typeof store1.increment).toBe('function');
      expect(typeof store1.updateName).toBe('function');

      expect(typeof store2.count).toBe('number');
      expect(typeof store2.name).toBe('string');
      expect(typeof store2.increment).toBe('function');
      expect(typeof store2.updateName).toBe('function');
    });

    test('should create valid pinia instance for component testing', () => {
      const pinia = setupTestingPinia();

      expect(pinia).toBeDefined();
      expect(typeof pinia).toBe('object');

      const store = useTestStore(pinia);
      expect(store).toBeDefined();
      expect(typeof store.count).toBe('number');
      expect(typeof store.name).toBe('string');
    });
  });
});
