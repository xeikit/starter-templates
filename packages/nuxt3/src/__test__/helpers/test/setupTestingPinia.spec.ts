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
  test('creates a Pinia instance with empty initial state', () => {
    const testingPinia = setupTestingPinia();

    expect(testingPinia).toBeDefined();

    const testStore = useTestStore(testingPinia);

    expect(testStore.count).toBe(0);
    expect(testStore.name).toBe('test');

    testStore.increment();
    testStore.updateName('newName');

    expect(testStore.count).toBe(1);
    expect(testStore.name).toBe('newName');
  });

  test('creates a Pinia instance with custom initial state', () => {
    const initialState = {
      test: {
        count: 5,
        name: 'initialName',
      },
    };

    const testingPinia = setupTestingPinia(initialState);

    expect(testingPinia).toBeDefined();

    const testStore = useTestStore();

    expect(testStore.count).toBe(5);
    expect(testStore.name).toBe('initialName');

    testStore.increment();
    testStore.updateName('updatedName');

    expect(testStore.count).toBe(6);
    expect(testStore.name).toBe('updatedName');
  });
});
