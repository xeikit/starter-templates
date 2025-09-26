import { mount, RouterLinkStub, type VueWrapper } from '@vue/test-utils';
import type { Component, ComponentPublicInstance, DefineComponent, Slots, VNode } from 'vue';
import type { setupTestingPinia } from './setupTestingPinia';

export interface MountOptions {
  /** テスト用のPiniaインスタンス（setupTestingPinia関数で作成したもの） */
  testingPinia?: ReturnType<typeof setupTestingPinia>;
  /** コンポーネントをマウントするDOM要素 */
  attachTo?: Element | string;
  /** コンポーネントに渡すprops */
  props?: Record<string, unknown>;
  /** コンポーネントのスロット */
  slots?: Record<string, () => VNode | VNode[] | string> | Slots;
  /** shallowレンダリングを行うかどうか */
  shallow?: boolean;
  /** 子コンポーネントをスタブ化するためのオブジェクト */
  stubs?: Record<string, Component | boolean>;
  /** モックオブジェクト */
  mocks?: Record<string, unknown>;
  /** グローバルコンフィグ */
  config?: Record<string, unknown>;
  /** その他追加マウントオプション */
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
} satisfies MountOptions;

/**
 * マウントオプションを処理して標準化されたマウント設定を返す内部ヘルパー関数
 *
 * @param options - 部分的なマウントオプション
 * @returns Vue Test Utilsのmount関数で使用できる標準化されたオプション
 */
const prepareMount = (options: Partial<MountOptions>) => {
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
  };
};

/**
 * Vueコンポーネントをテスト用にマウントするヘルパー関数
 *
 * @template VMValue - コンポーネントインスタンスの型。コンポーネントのプロパティやメソッドへの型安全なアクセスをするために使用
 * @param component - テスト対象のVueコンポーネント
 * @param options {@link MountOptions} - マウントオプション（任意）
 * @returns テスト用のVueラッパーオブジェクト
 */
export const mountComponent = <VMValue>(
  component: Component,
  options: Partial<MountOptions> = DEFAULT_OPTIONS,
): VueWrapper<ComponentPublicInstance & VMValue> => {
  return mount(component, prepareMount(options));
};

/**
 * Vueコンポーネントをテスト用に非同期マウントするヘルパー関数
 * 注意: Nuxt環境でのみ使用可能
 *
 * @template VMValue - コンポーネントインスタンスの型。コンポーネントのプロパティやメソッドへの型安全なアクセスをするために使用
 * @param component - テスト対象のVueコンポーネント
 * @param options {@link MountOptions} - マウントオプション（任意）
 * @returns テスト用のVueラッパーオブジェクト
 */
export const mountSuspendedComponent = async <VMValue>(
  component: Component,
  options: Partial<MountOptions> = DEFAULT_OPTIONS,
): Promise<VueWrapper<ComponentPublicInstance & VMValue & DefineComponent>> => {
  const { mountSuspended } = await import('@nuxt/test-utils/runtime');
  return await mountSuspended(component, prepareMount(options));
};
