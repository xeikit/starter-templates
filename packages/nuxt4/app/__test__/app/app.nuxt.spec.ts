import { describe, expect, test } from 'vitest';
import App from '@/app.vue';
import { mountSuspendedComponent } from '@/helper/test';

describe('app/app.vue', () => {
  test('includes route announcer for accessibility', async () => {
    const wrapper = await mountSuspendedComponent(App);

    expect(wrapper.findComponent({ name: 'NuxtRouteAnnouncer' }).exists()).toBe(true);
  });

  test('includes loading indicator', async () => {
    const wrapper = await mountSuspendedComponent(App);

    expect(wrapper.findComponent({ name: 'NuxtLoadingIndicator' }).exists()).toBe(true);
  });

  test('includes layout system', async () => {
    const wrapper = await mountSuspendedComponent(App);

    expect(wrapper.findComponent({ name: 'NuxtLayout' }).exists()).toBe(true);
  });

  test('includes page content', async () => {
    const wrapper = await mountSuspendedComponent(App);

    expect(wrapper.findComponent({ name: 'NuxtPage' }).exists()).toBe(true);
  });

  test('builds correct component hierarchy', async () => {
    const wrapper = await mountSuspendedComponent(App);

    const layout = wrapper.findComponent({ name: 'NuxtLayout' });

    expect(layout.exists()).toBe(true);
    expect(layout.findComponent({ name: 'NuxtPage' }).exists()).toBe(true);
  });
});
