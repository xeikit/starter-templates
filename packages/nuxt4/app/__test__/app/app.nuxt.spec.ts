import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, expect, test } from 'vitest';
import App from '@/app.vue';

describe('app/app.vue', () => {
  test('renders root element', async () => {
    const wrapper = await mountSuspended(App);

    expect(wrapper.find('div').exists()).toBe(true);
  });

  test('includes route announcer for accessibility', async () => {
    const wrapper = await mountSuspended(App);

    expect(wrapper.findComponent({ name: 'NuxtRouteAnnouncer' }).exists()).toBe(true);
  });

  test('includes loading indicator', async () => {
    const wrapper = await mountSuspended(App);

    expect(wrapper.findComponent({ name: 'NuxtLoadingIndicator' }).exists()).toBe(true);
  });

  test('includes layout system', async () => {
    const wrapper = await mountSuspended(App);

    expect(wrapper.findComponent({ name: 'NuxtLayout' }).exists()).toBe(true);
  });

  test('includes page content', async () => {
    const wrapper = await mountSuspended(App);

    expect(wrapper.findComponent({ name: 'NuxtPage' }).exists()).toBe(true);
  });

  test('builds correct component hierarchy', async () => {
    const wrapper = await mountSuspended(App);

    const layout = wrapper.findComponent({ name: 'NuxtLayout' });
    expect(layout.exists()).toBe(true);

    expect(layout.findComponent({ name: 'NuxtPage' }).exists()).toBe(true);
  });
});
