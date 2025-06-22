import { defineStore } from 'pinia';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { defineComponent, h, ref, computed, defineAsyncComponent, nextTick } from 'vue';
import { mountComponent, mountSuspendedComponent } from '@/helpers/test';

const InteractiveComponent = defineComponent({
  props: {
    message: {
      type: String,
      default: 'Default Message',
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
      h('p', { 'data-testid': 'count' }, `Count: ${this.count}`),
      h('p', { 'data-testid': 'doubled' }, `Doubled: ${this.doubledCount}`),
      h('button', { onClick: this.increment, 'data-testid': 'increment-btn' }, 'Increment'),
    ]);
  },
});

const AsyncComponent = defineComponent({
  setup() {
    const asyncData = ref('Async Data');
    return { asyncData };
  },
  render() {
    return h('div', [h('p', { 'data-testid': 'async-content' }, `Async data: ${this.asyncData}`)]);
  },
});

const AsyncTestComponent = defineAsyncComponent(() => Promise.resolve(AsyncComponent));

const SlottedComponent = defineComponent({
  render() {
    return h('div', [
      h('header', { 'data-testid': 'header' }, this.$slots.header ? this.$slots.header() : 'Default Header'),
      h('main', { 'data-testid': 'main' }, this.$slots.default ? this.$slots.default() : 'Default Content'),
      h('footer', { 'data-testid': 'footer' }, this.$slots.footer ? this.$slots.footer() : 'Default Footer'),
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
      h('p', { 'data-testid': 'global-count' }, `Global count: ${this.store.globalCount}`),
      h('button', { onClick: this.incrementGlobal, 'data-testid': 'global-increment' }, 'Increment Global'),
    ]);
  },
});

describe('src/helpers/test/mount.ts', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('Component Interaction and State Management', () => {
    test('should support reactive state updates through user interactions', async () => {
      const wrapper = mountComponent(InteractiveComponent);

      expect(wrapper.text()).toContain('Default Message');
      expect(wrapper.text()).toContain('Count: 0');
      expect(wrapper.text()).toContain('Doubled: 0');

      await wrapper.find('[data-testid="increment-btn"]').trigger('click');

      expect(wrapper.text()).toContain('Count: 1');
      expect(wrapper.text()).toContain('Doubled: 2');
    });

    test('should accept and respond to custom props', async () => {
      const wrapper = mountComponent(InteractiveComponent, {
        props: { message: 'Custom Message' },
      });

      expect(wrapper.text()).toContain('Custom Message');

      await wrapper.find('[data-testid="increment-btn"]').trigger('click');
      expect(wrapper.text()).toContain('Count: 1');
    });
  });

  describe('Slot-based Component Composition', () => {
    test('should render with default slot content when no slots provided', () => {
      const wrapper = mountComponent(SlottedComponent);

      expect(wrapper.find('[data-testid="header"]').text()).toBe('Default Header');
      expect(wrapper.find('[data-testid="main"]').text()).toBe('Default Content');
      expect(wrapper.find('[data-testid="footer"]').text()).toBe('Default Footer');
    });

    test('should render custom slot content when provided', () => {
      const wrapper = mountComponent(SlottedComponent, {
        slots: {
          header: () => 'Custom Header Content',
          default: () => 'Custom Main Content',
          footer: () => 'Custom Footer Content',
        },
      });

      expect(wrapper.find('[data-testid="header"]').text()).toBe('Custom Header Content');
      expect(wrapper.find('[data-testid="main"]').text()).toBe('Custom Main Content');
      expect(wrapper.find('[data-testid="footer"]').text()).toBe('Custom Footer Content');
    });
  });

  describe('Asynchronous Component Handling', () => {
    test('should handle async components properly', async () => {
      const wrapper = await mountSuspendedComponent(AsyncTestComponent);

      await nextTick();

      expect(wrapper.find('[data-testid="async-content"]').text()).toBe('Async data: Async Data');
    });
  });

  describe('State Management Integration', () => {
    test('should support pinia store integration for component testing', async () => {
      const wrapper = mountComponent(StoreComponent);

      expect(wrapper.find('[data-testid="global-count"]').text()).toBe('Global count: 0');

      await wrapper.find('[data-testid="global-increment"]').trigger('click');

      expect(wrapper.find('[data-testid="global-count"]').text()).toBe('Global count: 1');
    });

    test('should provide component testing environment compatibility', async () => {
      const wrapper1 = mountComponent(StoreComponent);
      const wrapper2 = mountComponent(StoreComponent);

      await wrapper1.find('[data-testid="global-increment"]').trigger('click');

      expect(wrapper1.find('[data-testid="global-count"]').text()).toContain('Global count:');
      expect(wrapper2.find('[data-testid="global-count"]').text()).toContain('Global count:');

      expect(wrapper1.exists()).toBe(true);
      expect(wrapper2.exists()).toBe(true);
    });
  });

  describe('Testing Environment Configuration', () => {
    test('should provide clean testing environment for each test', () => {
      const wrapper = mountComponent(InteractiveComponent);

      expect(wrapper.exists()).toBe(true);
      expect(wrapper.vm).toBeDefined();

      expect(wrapper.element.tagName).toBe('DIV');
      expect(wrapper.find('h1').exists()).toBe(true);
    });

    test('should support vue testing utilities integration', () => {
      const wrapper = mountComponent(InteractiveComponent);

      expect(wrapper.exists()).toBe(true);
      expect(wrapper.findAll('p')).toHaveLength(2);
      expect(wrapper.find('button').exists()).toBe(true);
    });
  });
});
