/**
 * Utility module for mounting Vue components in tests
 * Provides helper functions to easily mount components with common testing configurations
 */

import { mountSuspended } from '@nuxt/test-utils/runtime';
import { mount, RouterLinkStub, type VueWrapper } from '@vue/test-utils';
import type { setupTestingPinia } from './setupTestingPinia';
import type { Component, ComponentPublicInstance, DefineComponent, Slots } from 'vue';

/** Interface defining options for mounting components in tests */
interface MountOptions {
  /** Pinia store instance for testing */
  testingPinia?: ReturnType<typeof setupTestingPinia>;
  /** Element to attach the component to */
  attachTo?: Element | string;
  /** Component props */
  props?: Record<string, unknown>;
  /** Component slots */
  slots?: Record<string, () => VNode | VNode[] | string> | Slots;
  /** Whether to use shallow mounting */
  shallow?: boolean;
  /** Components to stub */
  stubs?: Record<string, Component | boolean>;
  /** Properties to mock */
  mocks?: Record<string, unknown>;
  /** Global configuration */
  config?: Record<string, unknown>;
  /** Additional mounting options */
  options?: Record<string, unknown>;
}

/**
 * Default stubs used when mounting components
 * NuxtLink is automatically stubbed with RouterLinkStub
 */
const DEFAULT_STUBS = {
  NuxtLink: RouterLinkStub,
} as const;

/**
 * Default options used when mounting components
 * Provides reasonable defaults for all mount options
 */
const DEFAULT_OPTIONS = {
  testingPinia: undefined,
  attachTo: undefined,
  props: {},
  slots: {},
  shallow: false,
  stubs: DEFAULT_STUBS,
  mocks: {},
  config: {},
  options: {},
} as const satisfies MountOptions;

/**
 * Mounts a Vue component for testing with specified options
 *
 * @template VMValue - Type to extend the component instance with
 * @param component - The Vue component to mount
 * @param options {@link MountOptions} - Options for mounting the component
 * @returns Mounted component wrapper
 *
 * @example
 * const wrapper = mountComponent(MyComponent, {
 *   props: { title: 'Test' },
 *   testingPinia
 * });
 */
export const mountComponent = <VMValue>(
  component: Component,
  options: Partial<MountOptions> = DEFAULT_OPTIONS,
): VueWrapper<ComponentPublicInstance & VMValue & DefineComponent> => {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  const {
    testingPinia,
    attachTo,
    props,
    slots,
    shallow,
    stubs,
    mocks,
    config,
    options: additionalOptions,
  } = mergedOptions;

  return mount(component, {
    ...additionalOptions,
    attachTo,
    props,
    slots,
    shallow,
    global: {
      plugins: testingPinia ? [testingPinia] : [],
      stubs: { ...DEFAULT_STUBS, ...stubs },
      mocks,
      config,
    },
  });
};

/**
 * Mounts a Vue component that uses suspense for testing with specified options
 * This is useful for components that use async setup() or async components
 *
 * @template VMValue - Type to extend the component instance with
 * @param component - The Vue component to mount
 * @param options {@link MountOptions} - Options for mounting the component
 * @returns Promise resolving to mounted component wrapper
 *
 * @example
 * const wrapper = await mountSuspendedComponent(MyAsyncComponent, {
 *   props: { id: '123' },
 *   testingPinia
 * });
 */
export const mountSuspendedComponent = async <VMValue>(
  component: Component,
  options: Partial<MountOptions> = DEFAULT_OPTIONS,
): Promise<VueWrapper<ComponentPublicInstance & VMValue & DefineComponent>> => {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  const {
    testingPinia,
    attachTo,
    props,
    slots,
    shallow,
    stubs,
    mocks,
    config,
    options: additionalOptions,
  } = mergedOptions;

  return await mountSuspended(component, {
    ...additionalOptions,
    attachTo,
    props,
    slots,
    shallow,
    global: {
      plugins: testingPinia ? [testingPinia] : [],
      stubs: { ...DEFAULT_STUBS, ...stubs },
      mocks,
      config,
    },
  });
};
