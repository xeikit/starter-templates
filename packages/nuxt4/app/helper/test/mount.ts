import { mountSuspended } from '@nuxt/test-utils/runtime';
import type { VueWrapper } from '@vue/test-utils';
import { mount, RouterLinkStub } from '@vue/test-utils';
import type { Component, Slot } from 'vue';
import type { setupTestingPinia } from './setupTestingPinia';

interface MountingOptions {
  testingPinia?: ReturnType<typeof setupTestingPinia>;
  attachTo?: Element | string;
  props?: Record<string, unknown>;
  attrs?: Record<string, unknown>;
  slots?: { [key: string]: Slot } & { default?: Slot };
  shallow?: boolean;
  stubs?: Record<string, Component | boolean>;
  mocks?: Record<string, unknown>;
  config?: Record<string, unknown>;
  options?: Record<string, unknown>;
}

const DEFAULT_STUBS = {
  NuxtLink: RouterLinkStub,
} as const;

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
} as const satisfies MountingOptions;

const buildMountOptions = (options: MountingOptions = DEFAULT_OPTIONS) => {
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

  return {
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
    ...additionalOptions,
  };
};

export const mountComponent = <VMValue>(
  component: Component,
  options: MountingOptions = DEFAULT_OPTIONS,
): VueWrapper<ComponentPublicInstance & VMValue> => {
  return mount(component, buildMountOptions(options));
};

export const mountSuspendedComponent = async <VMValue>(
  component: Component,
  options: MountingOptions = DEFAULT_OPTIONS,
): Promise<VueWrapper<ComponentPublicInstance & VMValue>> => {
  return await mountSuspended(component, buildMountOptions(options));
};
