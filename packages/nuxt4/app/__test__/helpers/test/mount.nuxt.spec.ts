import { flushPromises } from '@vue/test-utils';
import { defineStore, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, test } from 'vitest';
import { mountComponent, mountSuspendedComponent, setupTestingPinia } from '@/helpers/test';

const TEST_MESSAGES = {
  DEFAULT: 'Default Message',
  CUSTOM: 'Custom Test Message',
  COMPONENT_1: 'Component 1',
  COMPONENT_2: 'Component 2',
} as const;

const TEST_CONTENT = {
  HEADER: {
    DEFAULT: 'Default Header',
    CUSTOM: 'Custom Header',
  },
  MAIN: {
    DEFAULT: 'Default Content',
    CUSTOM: 'Custom Main Content',
  },
  FOOTER: {
    DEFAULT: 'Default Footer',
    CUSTOM: 'Custom Footer',
  },
  ASYNC_DATA: 'Async Data',
} as const;

const TEST_IDS = {
  COUNT: 'count',
  DOUBLED: 'doubled',
  INCREMENT_BTN: 'increment-btn',
  GLOBAL_COUNT: 'global-count',
  GLOBAL_INCREMENT: 'global-increment',
  ASYNC_CONTENT: 'async-content',
  HEADER: 'header',
  MAIN: 'main',
  FOOTER: 'footer',
} as const;

const InteractiveComponent = defineComponent({
  props: {
    message: {
      type: String,
      default: TEST_MESSAGES.DEFAULT,
    },
  },
  setup(props) {
    const count = ref(0);
    const doubledCount = computed(() => count.value * 2);

    const increment = () => {
      count.value++;
    };

    return {
      count,
      doubledCount,
      increment,
      message: props.message,
    };
  },
  render() {
    return h('div', [
      h('h1', this.message),
      h('p', { 'data-testid': TEST_IDS.COUNT }, `Count: ${this.count}`),
      h('p', { 'data-testid': TEST_IDS.DOUBLED }, `Doubled: ${this.doubledCount}`),
      h('button', { onClick: this.increment, 'data-testid': TEST_IDS.INCREMENT_BTN }, 'Increment'),
    ]);
  },
});

const AsyncComponent = defineComponent({
  setup() {
    const asyncData = ref(TEST_CONTENT.ASYNC_DATA);
    return { asyncData };
  },
  render() {
    return h('div', [h('p', { 'data-testid': TEST_IDS.ASYNC_CONTENT }, `Async data: ${this.asyncData}`)]);
  },
});

const AsyncTestComponent = defineAsyncComponent(() => Promise.resolve(AsyncComponent));

const SlottedComponent = defineComponent({
  render() {
    return h('div', [
      h(
        'header',
        { 'data-testid': TEST_IDS.HEADER },
        this.$slots.header ? this.$slots.header() : TEST_CONTENT.HEADER.DEFAULT,
      ),
      h(
        'main',
        { 'data-testid': TEST_IDS.MAIN },
        this.$slots.default ? this.$slots.default() : TEST_CONTENT.MAIN.DEFAULT,
      ),
      h(
        'footer',
        { 'data-testid': TEST_IDS.FOOTER },
        this.$slots.footer ? this.$slots.footer() : TEST_CONTENT.FOOTER.DEFAULT,
      ),
    ]);
  },
});

const useCounterStore = defineStore('counter', {
  state: () => ({
    globalCount: 0,
  }),
  actions: {
    increment() {
      this.globalCount++;
    },
  },
});

const StoreComponent = defineComponent({
  setup() {
    const store = useCounterStore();

    return {
      store,
      incrementGlobal: () => store.increment(),
    };
  },
  render() {
    return h('div', [
      h('p', { 'data-testid': TEST_IDS.GLOBAL_COUNT }, `Global count: ${this.store.globalCount}`),
      h('button', { onClick: this.incrementGlobal, 'data-testid': TEST_IDS.GLOBAL_INCREMENT }, 'Increment Global'),
    ]);
  },
});

describe('app/helpers/test/mount.ts', () => {
  beforeEach(() => {
    setActivePinia(setupTestingPinia());
  });

  describe('コンポーネントの相互作用と状態管理', () => {
    test('ユーザーの操作によってリアクティブな状態更新をサポートする', async () => {
      const wrapper = mountComponent(InteractiveComponent);

      expect(wrapper.text()).toContain(TEST_MESSAGES.DEFAULT);
      expect(wrapper.text()).toContain('Count: 0');
      expect(wrapper.text()).toContain('Doubled: 0');

      const incrementButton = wrapper.find(`[data-testid="${TEST_IDS.INCREMENT_BTN}"]`);
      await incrementButton.trigger('click');

      expect(wrapper.text()).toContain('Count: 1');
      expect(wrapper.text()).toContain('Doubled: 2');
    });

    test('カスタムpropsを受け入れて適切に反応する', () => {
      const wrapper = mountComponent(InteractiveComponent, {
        props: { message: TEST_MESSAGES.CUSTOM },
      });

      expect(wrapper.text()).toContain(TEST_MESSAGES.CUSTOM);
    });
  });

  describe('スロットベースのコンポーネント構成', () => {
    test('スロットが提供されない場合はデフォルトのスロット内容をレンダリングする', () => {
      const wrapper = mountComponent(SlottedComponent);

      expect(wrapper.text()).toContain(TEST_CONTENT.HEADER.DEFAULT);
      expect(wrapper.text()).toContain(TEST_CONTENT.MAIN.DEFAULT);
      expect(wrapper.text()).toContain(TEST_CONTENT.FOOTER.DEFAULT);
    });

    test('カスタムスロット内容が提供された場合はそれをレンダリングする', () => {
      const wrapper = mountComponent(SlottedComponent, {
        slots: {
          header: () => TEST_CONTENT.HEADER.CUSTOM,
          default: () => TEST_CONTENT.MAIN.CUSTOM,
          footer: () => TEST_CONTENT.FOOTER.CUSTOM,
        },
      });

      expect(wrapper.text()).toContain(TEST_CONTENT.HEADER.CUSTOM);
      expect(wrapper.text()).toContain(TEST_CONTENT.MAIN.CUSTOM);
      expect(wrapper.text()).toContain(TEST_CONTENT.FOOTER.CUSTOM);
    });
  });

  describe('非同期コンポーネントの処理', () => {
    test('非同期コンポーネントを適切に処理する', async () => {
      const wrapper = await mountSuspendedComponent(AsyncTestComponent);
      await flushPromises();

      expect(wrapper.text()).toContain(`Async data: ${TEST_CONTENT.ASYNC_DATA}`);
    });
  });

  describe('状態管理の統合', () => {
    test('コンポーネントテスト用のPiniaストア統合をサポートする', async () => {
      const wrapper = mountComponent(StoreComponent);

      expect(wrapper.text()).toContain('Global count: 0');

      const globalIncrementButton = wrapper.find(`[data-testid="${TEST_IDS.GLOBAL_INCREMENT}"]`);
      await globalIncrementButton.trigger('click');

      expect(wrapper.text()).toContain('Global count: 1');
    });

    test('コンポーネントテスト環境の互換性を提供する', () => {
      const wrapper1 = mountComponent(InteractiveComponent, { props: { message: TEST_MESSAGES.COMPONENT_1 } });
      const wrapper2 = mountComponent(InteractiveComponent, { props: { message: TEST_MESSAGES.COMPONENT_2 } });

      expect(wrapper1.text()).toContain(TEST_MESSAGES.COMPONENT_1);
      expect(wrapper2.text()).toContain(TEST_MESSAGES.COMPONENT_2);
      expect(wrapper1.text()).not.toContain(TEST_MESSAGES.COMPONENT_2);
      expect(wrapper2.text()).not.toContain(TEST_MESSAGES.COMPONENT_1);
    });
  });

  describe('テスト環境の設定', () => {
    test('各テストに対してクリーンなテスト環境を提供する', () => {
      const wrapper = mountComponent(InteractiveComponent);

      expect(wrapper.vm).toBeDefined();
      expect(wrapper.text()).toContain('Count: 0');
    });

    test('テストに必要な基本機能が提供されること', () => {
      const wrapper = mountComponent(InteractiveComponent);

      const incrementButton = wrapper.find(`[data-testid="${TEST_IDS.INCREMENT_BTN}"]`);
      expect(incrementButton.exists()).toBe(true);
      expect(wrapper.text()).toBeTruthy();
    });
  });

  describe('テストヘルパーの信頼性', () => {
    test('一貫したテスト環境を提供すること', () => {
      const wrapper1 = mountComponent(InteractiveComponent);
      const wrapper2 = mountComponent(InteractiveComponent);

      expect(wrapper1.text()).toContain('Count: 0');
      expect(wrapper2.text()).toContain('Count: 0');
    });

    test('テスト間での状態漏洩がないこと', () => {
      const wrapper1 = mountComponent(InteractiveComponent, {
        props: { message: 'Test 1' },
      });
      const wrapper2 = mountComponent(InteractiveComponent, {
        props: { message: 'Test 2' },
      });

      expect(wrapper1.text()).toContain('Test 1');
      expect(wrapper1.text()).not.toContain('Test 2');
      expect(wrapper2.text()).toContain('Test 2');
      expect(wrapper2.text()).not.toContain('Test 1');
    });
  });
});
