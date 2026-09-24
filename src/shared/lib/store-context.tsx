import { createContext, type ReactNode, use } from 'react'
import { type StoreApi, useStore } from 'zustand'

/**
 * A React context for one zustand store, so screens read a store they were handed (tests hand in
 * their own) instead of a module singleton. Reads go through a selector; writes through the store.
 */
export function createStoreContext<State>(name: string) {
  const Context = createContext<StoreApi<State> | null>(null)
  Context.displayName = `${name}StoreContext`

  function Provider({ store, children }: { store: StoreApi<State>; children: ReactNode }) {
    return <Context value={store}>{children}</Context>
  }

  function useStoreApi(): StoreApi<State> {
    const store = use(Context)
    if (!store) throw new Error(`use${name}Store must be used inside <${name}StoreProvider>`)
    return store
  }

  function useSelector<Selected>(selector: (state: State) => Selected): Selected {
    return useStore(useStoreApi(), selector)
  }

  return { Provider, useStoreApi, useSelector }
}
