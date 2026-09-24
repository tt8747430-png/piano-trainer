import { act, render, renderHook, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { createStore } from 'zustand/vanilla'
import { createStoreContext } from './store-context'

interface Counter {
  count: number
}

const { Provider, useSelector, useStoreApi } = createStoreContext<Counter>('Counter')

function Count() {
  const count = useSelector((state) => state.count)
  return <output>{count}</output>
}

describe('createStoreContext', () => {
  it('reads the provided store through a selector and re-renders on change', () => {
    const store = createStore<Counter>()(() => ({ count: 1 }))
    render(
      <Provider store={store}>
        <Count />
      </Provider>,
    )
    expect(screen.getByRole('status')).toHaveTextContent('1')
    act(() => store.setState({ count: 2 }))
    expect(screen.getByRole('status')).toHaveTextContent('2')
  })

  it('hands out the store itself for writes', () => {
    const store = createStore<Counter>()(() => ({ count: 0 }))
    const wrapper = ({ children }: { children: ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    )
    const { result } = renderHook(() => useStoreApi(), { wrapper })
    expect(result.current).toBe(store)
  })

  it('names the missing provider when used outside one', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => renderHook(() => useStoreApi())).toThrow(
      'useCounterStore must be used inside <CounterStoreProvider>',
    )
  })
})
