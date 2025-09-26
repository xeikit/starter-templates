import { describe, expect, test } from 'vitest';
import App from '@/app.vue';
import { mountSuspendedComponent } from '@/helpers/test';

const NuxtRouteAnnouncer = {
  template: '<div id="nuxt-route-announcer"></div>',
};
const NuxtLoadingIndicator = {
  template: '<div id="nuxt-loading-indicator"></div>',
};
const NuxtLayout = {
  template: '<div id="nuxt-layout"><slot /></div>',
};
const NuxtPage = {
  template: '<div id="nuxt-page"></div>',
};

const defaultStubs = { NuxtRouteAnnouncer, NuxtLoadingIndicator, NuxtLayout, NuxtPage };

describe('app/app.vue', () => {
  test('必要な子コンポーネントが揃っていること', async () => {
    const wrapper = await mountSuspendedComponent(App, { stubs: defaultStubs });

    expect(wrapper.findComponent(NuxtRouteAnnouncer).exists()).toBe(true);
    expect(wrapper.findComponent(NuxtLoadingIndicator).exists()).toBe(true);
    expect(wrapper.findComponent(NuxtLayout).exists()).toBe(true);
    expect(wrapper.findComponent(NuxtPage).exists()).toBe(true);
  });
});
