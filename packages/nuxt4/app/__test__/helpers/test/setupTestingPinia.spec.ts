import { defineStore } from 'pinia';
import { describe, expect, test } from 'vitest';
import { setupTestingPinia } from '@/helpers/test';

const TEST_STORE_VALUES = {
  DEFAULT: {
    COUNT: 0,
    NAME: 'test',
  },
  CUSTOM: {
    INITIAL_COUNT: 5,
    INITIAL_NAME: 'initialName',
    COUNT_10: 10,
    CUSTOM_NAME: 'customName',
    NEW_NAME: 'newName',
    UPDATED_NAME: 'updatedName',
  },
} as const;

const useTestStore = defineStore('test', {
  state: (): { count: number; name: string } => ({
    count: TEST_STORE_VALUES.DEFAULT.COUNT,
    name: TEST_STORE_VALUES.DEFAULT.NAME,
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

describe('app/helpers/test/setupTestingPinia.ts', () => {
  describe('テスト用ストアの初期化', () => {
    test('テスト環境でストアが正常に動作すること', () => {
      const pinia = setupTestingPinia();
      const store = useTestStore(pinia);

      expect(store.count).toBe(TEST_STORE_VALUES.DEFAULT.COUNT);
      expect(store.name).toBe(TEST_STORE_VALUES.DEFAULT.NAME);
    });

    test('ストアの状態変更機能がテスト環境で正常に動作すること', () => {
      const pinia = setupTestingPinia();
      const store = useTestStore(pinia);

      const initialCount = store.count;

      store.increment();
      store.updateName(TEST_STORE_VALUES.CUSTOM.NEW_NAME);

      expect(store.count).toBe(initialCount + 1);
      expect(store.name).toBe(TEST_STORE_VALUES.CUSTOM.NEW_NAME);
    });
  });

  describe('テストシナリオ別のストア状態設定', () => {
    test('テストに必要な初期状態を設定できること', () => {
      const customState = {
        test: {
          count: TEST_STORE_VALUES.CUSTOM.INITIAL_COUNT,
          name: TEST_STORE_VALUES.CUSTOM.INITIAL_NAME,
        },
      };

      const pinia = setupTestingPinia(customState);
      const store = useTestStore(pinia);

      expect(store.count).toBe(TEST_STORE_VALUES.CUSTOM.INITIAL_COUNT);
      expect(store.name).toBe(TEST_STORE_VALUES.CUSTOM.INITIAL_NAME);
    });

    test('カスタム初期状態でもストアの機能が正常に動作すること', () => {
      const customState = {
        test: {
          count: TEST_STORE_VALUES.CUSTOM.COUNT_10,
          name: TEST_STORE_VALUES.CUSTOM.CUSTOM_NAME,
        },
      };

      const pinia = setupTestingPinia(customState);
      const store = useTestStore(pinia);

      const initialCount = store.count;

      store.increment();
      store.updateName(TEST_STORE_VALUES.CUSTOM.UPDATED_NAME);

      expect(store.count).toBe(initialCount + 1);
      expect(store.name).toBe(TEST_STORE_VALUES.CUSTOM.UPDATED_NAME);
    });
  });

  describe('テストの分離と信頼性', () => {
    test('テスト間でのストア状態の分離が適切に機能すること', () => {
      const pinia = setupTestingPinia({
        test: { count: 10, name: 'test-isolation' },
      });
      const store = useTestStore(pinia);

      expect(store.count).toBe(10);
      expect(store.name).toBe('test-isolation');

      store.increment();
      store.updateName('modified');

      expect(store.count).toBe(11);
      expect(store.name).toBe('modified');

      const freshPinia = setupTestingPinia();
      const freshStore = useTestStore(freshPinia);

      expect(freshStore.count).toBe(TEST_STORE_VALUES.DEFAULT.COUNT);
      expect(freshStore.name).toBe(TEST_STORE_VALUES.DEFAULT.NAME);
    });

    test('テスト用ストアが必要な機能をすべて提供すること', () => {
      const pinia = setupTestingPinia();
      const store = useTestStore(pinia);

      expect(typeof store.count).toBe('number');
      expect(typeof store.name).toBe('string');
      expect(typeof store.increment).toBe('function');
      expect(typeof store.updateName).toBe('function');

      const initialCount = store.count;
      store.increment();
      expect(store.count).toBe(initialCount + 1);
    });
  });
});
