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

      store.increment();
      store.updateName('newName');

      expect(store.count).toBe(1);
      expect(store.name).toBe('newName');
    });
  });

  describe('Custom Initial State', () => {
    test('should accept and apply custom initial state', () => {
      const customState = {
        test: {
          count: 5,
          name: 'initialName',
        },
      };

      const pinia = setupTestingPinia(customState);
      const store = useTestStore(pinia);

      expect(store.count).toBe(5);
      expect(store.name).toBe('initialName');
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

      store.increment();
      store.updateName('updatedName');

      expect(store.count).toBe(11);
      expect(store.name).toBe('updatedName');
    });
  });

  describe('Testing Environment Compatibility', () => {
    test('should provide independent testing capabilities', () => {
      const pinia1 = setupTestingPinia();
      const pinia2 = setupTestingPinia();

      expect(pinia1).not.toBe(pinia2);

      const store1 = useTestStore(pinia1);
      const store2 = useTestStore(pinia2);

      store1.increment();
      store1.updateName('store1');

      expect(store1.count).toBe(1);
      expect(store1.name).toBe('store1');

      expect(typeof store2.count).toBe('number');
      expect(typeof store2.name).toBe('string');
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
