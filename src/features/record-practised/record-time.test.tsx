import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createProgressStore, ProgressStoreProvider, practiceSeconds } from '@/entities/progress'
import { createMemoryStorage } from '@/shared/lib'
import { usePracticeClock } from './record-time'

afterEach(() => vi.useRealTimers())

function clock(playing: boolean) {
  const store = createProgressStore({ storage: createMemoryStorage() })
  const wrapper = ({ children }: { children: ReactNode }) => (
    <ProgressStoreProvider store={store}>{children}</ProgressStoreProvider>
  )
  const hook = renderHook(({ on }) => usePracticeClock(on), {
    wrapper,
    initialProps: { on: playing },
  })
  return { store, hook }
}

describe('usePracticeClock', () => {
  it('counts the time the transport runs', () => {
    vi.useFakeTimers({ now: new Date(2026, 10, 4, 9) })
    const { store, hook } = clock(true)
    act(() => vi.advanceTimersByTime(40_000))
    hook.rerender({ on: false })
    act(() => vi.advanceTimersByTime(60_000))
    hook.unmount()
    expect(practiceSeconds(store.getState())).toBe(40)
    expect(store.getState().seconds).toEqual({ '2026-11-04': 40 })
  })

  it('counts a key pressed and the silence after it, at most 30 seconds of it', () => {
    vi.useFakeTimers({ now: new Date(2026, 10, 4, 9) })
    const { store, hook } = clock(false)
    act(() => hook.result.current.touch())
    act(() => vi.advanceTimersByTime(10_000))
    act(() => hook.result.current.touch())
    // A long pause: only 30 seconds of it count.
    act(() => vi.advanceTimersByTime(120_000))
    act(() => hook.result.current.touch())
    act(() => vi.advanceTimersByTime(5_000))
    hook.unmount()
    expect(practiceSeconds(store.getState())).toBe(10 + 30 + 5)
  })
})
