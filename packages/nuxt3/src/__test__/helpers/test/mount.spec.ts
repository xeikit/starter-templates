import { defineStore } from 'pinia';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { defineComponent, h, ref, computed, defineAsyncComponent, nextTick } from 'vue';
import { mockedStore, mountComponent, mountSuspendedComponent, setupTestingPinia } from '@/helpers/test';

const TestComponent = defineComponent({
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
      h('p', `Count: ${this.count}`),
      h('p', `Doubled: ${this.doubledCount}`),
      h('button', { onClick: this.increment }, 'Increment'),
    ]);
  },
});

const AsyncComponent = defineComponent({
  setup() {
    const asyncData = ref('Async Data');
    return { asyncData };
  },
  render() {
    return h('div', [h('p', `Async data: ${this.asyncData}`)]);
  },
});

const AsyncTestComponent = defineAsyncComponent(() => Promise.resolve(AsyncComponent));

const SlottedComponent = defineComponent({
  render() {
    return h('div', [
      h('header', {}, this.$slots.header ? this.$slots.header() : 'Default Header'),
      h('main', {}, this.$slots.default ? this.$slots.default() : 'Default Content'),
      h('footer', {}, this.$slots.footer ? this.$slots.footer() : 'Default Footer'),
    ]);
  },
});

const ChildComponent = defineComponent({
  render() {
    return h('div', 'Child Component');
  },
});

const ParentComponent = defineComponent({
  components: {
    ChildComponent,
  },
  render() {
    return h('div', [h('h1', 'Parent Component'), h(ChildComponent)]);
  },
});

const CustomButton = defineComponent({
  name: 'CustomButton',
  render() {
    return h('button', 'Complex Button');
  },
});

const StubTestComponent = defineComponent({
  components: {
    CustomButton,
  },
  render() {
    return h('div', [h('h1', 'Main Component'), h(CustomButton)]);
  },
});

const MockTestComponent = defineComponent({
  methods: {
    navigate() {
      this.$router.push('/test');
    },
  },
  render() {
    return h('button', { onClick: this.navigate }, 'Navigate');
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
      h('p', `Global count: ${this.store.globalCount}`),
      h('button', { onClick: this.incrementGlobal }, 'Increment Global'),
    ]);
  },
});

describe('src/helpers/test/mount.ts', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('can mount a basic component', async () => {
    const wrapper = mountComponent(TestComponent);

    expect(wrapper.find('h1').text()).toBe('Default Message');
    expect(wrapper.find('p').text()).toBe('Count: 0');

    await wrapper.find('button').trigger('click');
    expect(wrapper.find('p').text()).toBe('Count: 1');
  });

  test('can mount a component with props', async () => {
    const wrapper = mountComponent(TestComponent, {
      props: { message: 'Custom Message' },
    });

    expect(wrapper.find('h1').text()).toBe('Custom Message');
  });

  test('can access component instance and verify values', async () => {
    interface TestComponentInstance {
      doubledCount: number;
      increment: () => void;
      message: string;
    }

    const wrapper = mountComponent<TestComponentInstance>(TestComponent);

    expect(wrapper.vm.doubledCount).toBe(0);

    wrapper.vm.increment();
    await nextTick();

    expect(wrapper.vm.doubledCount).toBe(2);
    expect(wrapper.vm.message).toBe('Default Message');
  });

  test('can correctly mount async components', async () => {
    const wrapper = await mountSuspendedComponent(AsyncTestComponent);

    expect(wrapper.find('p').text()).toBe('Async data: Async Data');
  });

  test('can customize component content using slots', async () => {
    const wrapper = await mountSuspendedComponent(SlottedComponent, {
      slots: {
        header: () => 'Custom Header',
        default: () => 'Custom Content',
        footer: () => 'Custom Footer',
      },
    });

    expect(wrapper.find('header').text()).toBe('Custom Header');
    expect(wrapper.find('main').text()).toBe('Custom Content');
    expect(wrapper.find('footer').text()).toBe('Custom Footer');
  });

  test('can test components that use Pinia store', async () => {
    const testingPinia = setupTestingPinia();
    const wrapper = await mountSuspendedComponent(StoreComponent, { testingPinia });

    expect(wrapper.find('p').text()).toBe('Global count: 0');

    await wrapper.find('button').trigger('click');

    expect(wrapper.find('p').text()).toBe('Global count: 1');

    const store = mockedStore(useCounterStore);

    expect(store.increment).toHaveBeenCalledTimes(1);
    expect(store.globalCount).toBe(1);
  });

  test('can test components with a Pinia store that has initial values', async () => {
    const testingPinia = setupTestingPinia({
      counter: { globalCount: 10 },
    });

    const wrapper = await mountSuspendedComponent(StoreComponent, { testingPinia });

    expect(wrapper.find('p').text()).toBe('Global count: 10');
  });

  test('can stub child components using the shallow option', async () => {
    const wrapper = await mountSuspendedComponent(ParentComponent, {
      shallow: true,
    });

    expect(wrapper.findComponent(ChildComponent).exists()).toBe(true);
    expect(wrapper.text()).not.toContain('Child Component');
  });

  test('can stub specific components only', async () => {
    const wrapper = await mountSuspendedComponent(StubTestComponent, {
      stubs: {
        CustomButton: true,
      },
    });

    expect(wrapper.findComponent(CustomButton).exists()).toBe(true);
    expect(wrapper.text()).not.toContain('Complex Button');
  });

  test('can simulate external functionality in a component using mocks', async () => {
    const mockPush = vi.fn();

    const wrapper = await mountSuspendedComponent(MockTestComponent, {
      mocks: {
        $router: {
          push: mockPush,
        },
      },
    });

    await wrapper.find('button').trigger('click');
    expect(mockPush).toHaveBeenCalledWith('/test');
  });
});
