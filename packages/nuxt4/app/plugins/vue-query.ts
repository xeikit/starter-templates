import {
  type DehydratedState,
  dehydrate,
  hydrate,
  QueryClient,
  VueQueryPlugin,
  type VueQueryPluginOptions,
} from '@tanstack/vue-query';
import { useRuntime } from '@/composables/common/useRuntime';

export default defineNuxtPlugin((nuxtApp) => {
  const { isProcessServer, isProcessClient } = useRuntime();

  const vueQueryState = useState<DehydratedState | null>('vue-query');

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5分間キャッシュ
        gcTime: 1000 * 60 * 30, // 30分間メモリに保持
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        retry: 1,
      },
    },
  });

  const options: VueQueryPluginOptions = { queryClient, enableDevtoolsV6Plugin: true };

  nuxtApp.vueApp.use(VueQueryPlugin, options);

  if (isProcessServer.value) {
    nuxtApp.hooks.hook('app:rendered', () => {
      vueQueryState.value = dehydrate(queryClient);
    });
  }

  if (isProcessClient.value) {
    nuxtApp.hooks.hook('app:created', () => {
      hydrate(queryClient, vueQueryState.value);
    });
  }
});
