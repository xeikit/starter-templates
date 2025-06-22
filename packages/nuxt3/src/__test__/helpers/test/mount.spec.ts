/**
 * Mount Utilities Tests - Behavior-Based
 *
 * Tests focus on the behavior and contract of the mount utilities,
 * ensuring components can be properly mounted and tested.
 */

import { defineStore } from 'pinia';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { defineComponent, h, ref, computed, defineAsyncComponent, nextTick } from 'vue';
import { mountComponent, mountSuspendedComponent } from '@/helpers/test';

// Test components for behavior verification
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

      const incrementButton = wrapper.find('[data-testid="increment-btn"]');
      await incrementButton.trigger('click');

      expect(wrapper.text()).toContain('Count: 1');
      expect(wrapper.text()).toContain('Doubled: 2');
    });

    test('should accept and respond to custom props', () => {
      const customMessage = 'Custom Test Message';
      const wrapper = mountComponent(InteractiveComponent, {
        props: { message: customMessage },
      });

      expect(wrapper.text()).toContain(customMessage);
    });
  });

  describe('Slot-based Component Composition', () => {
    test('should render with default slot content when no slots provided', () => {
      const wrapper = mountComponent(SlottedComponent);

      expect(wrapper.text()).toContain('Default Header');
      expect(wrapper.text()).toContain('Default Content');
      expect(wrapper.text()).toContain('Default Footer');
    });

    test('should render custom slot content when provided', () => {
      const wrapper = mountComponent(SlottedComponent, {
        slots: {
          header: () => 'Custom Header',
          default: () => 'Custom Main Content',
          footer: () => 'Custom Footer',
        },
      });

      expect(wrapper.text()).toContain('Custom Header');
      expect(wrapper.text()).toContain('Custom Main Content');
      expect(wrapper.text()).toContain('Custom Footer');
    });
  });

  describe('Asynchronous Component Handling', () => {
    test('should handle async components properly', async () => {
      const wrapper = await mountSuspendedComponent(AsyncTestComponent);

      await nextTick();
      expect(wrapper.text()).toContain('Async data: Async Data');
    });
  });

  describe('State Management Integration', () => {
    test('should support pinia store integration for component testing', async () => {
      const wrapper = mountComponent(StoreComponent);

      expect(wrapper.text()).toContain('Global count: 0');

      const globalIncrementButton = wrapper.find('[data-testid="global-increment"]');
      await globalIncrementButton.trigger('click');

      expect(wrapper.text()).toContain('Global count: 1');
    });

    test('should provide component testing environment compatibility', () => {
      const wrapper1 = mountComponent(InteractiveComponent, { props: { message: 'Component 1' } });
      const wrapper2 = mountComponent(InteractiveComponent, { props: { message: 'Component 2' } });

      expect(wrapper1.text()).toContain('Component 1');
      expect(wrapper2.text()).toContain('Component 2');

      expect(wrapper1.text()).not.toContain('Component 2');
      expect(wrapper2.text()).not.toContain('Component 1');
    });
  });

  describe('Testing Environment Configuration', () => {
    test('should provide clean testing environment for each test', () => {
      const wrapper = mountComponent(InteractiveComponent);

      expect(wrapper.vm).toBeDefined();
      expect(wrapper.text()).toContain('Count: 0');
    });

    test('should support vue testing utilities integration', () => {
      const wrapper = mountComponent(InteractiveComponent);

      const hasIncrementButton = wrapper.find('[data-testid="increment-btn"]').exists();
      expect(hasIncrementButton).toBeDefined();

      expect(wrapper.vm).toBeDefined();
    });
  });
});
