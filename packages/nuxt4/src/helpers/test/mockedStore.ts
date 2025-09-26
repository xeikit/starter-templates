import type { Store, StoreDefinition } from 'pinia';
import type { Mock } from 'vitest';
import type { UnwrapRef } from 'vue';

export const mockedStore = <TStoreDef extends () => unknown>(
  useStore: TStoreDef,
): TStoreDef extends StoreDefinition<infer Id, infer State, infer Getters, infer Actions>
  ? Store<
      Id,
      State,
      Record<string, never>,
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [K in keyof Actions]: Actions[K] extends (...args: any[]) => any
          ? // 👇 depends on your testing framework
            Mock<Actions[K]>
          : Actions[K];
      }
    > & {
      [K in keyof Getters]: UnwrapRef<Getters[K]>;
    }
  : ReturnType<TStoreDef> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return useStore() as any;
};
