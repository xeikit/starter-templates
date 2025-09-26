export const useRuntime = () => {
  const isProcessClient = computed<boolean>(() => Boolean(import.meta.client));
  const isProcessServer = computed<boolean>(() => Boolean(import.meta.server));

  return { isProcessClient, isProcessServer };
};
