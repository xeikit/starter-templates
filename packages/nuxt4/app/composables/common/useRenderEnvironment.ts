import { useRuntime } from '@/composables/common/useRuntime';

export const useRenderEnvironment = () => {
  const nuxtApp = useNuxtApp();
  const { isProcessClient } = useRuntime();

  const isInitialClientRender = computed<boolean>(() => {
    return Boolean(isProcessClient.value && nuxtApp.isHydrating && nuxtApp.payload.serverRendered);
  });

  return { isInitialClientRender };
};
