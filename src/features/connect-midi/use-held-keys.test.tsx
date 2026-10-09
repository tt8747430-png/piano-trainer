import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createFakeAudio } from '@/shared/api/audio'
import { createFakeMidi } from '@/shared/api/midi'
import { SHORTEST_PRESS_MS } from '@/shared/lib'
import { midi } from '@/shared/lib/music'
import { ServicesProvider } from '@/shared/lib/services'
import { useHeldKeys } from './use-held-keys'

function renderHeldKeys() {
  const keyboard = createFakeMidi()
  const wrapper = ({ children }: { children: ReactNode }) => (
    <ServicesProvider services={{ audio: createFakeAudio(), midi: keyboard }}>
      {children}
    </ServicesProvider>
  )
  return { keyboard, ...renderHook(() => useHeldKeys(), { wrapper }) }
}

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

describe('useHeldKeys', () => {
  it('follows the keys held on the MIDI keyboard', () => {
    const { keyboard, result } = renderHeldKeys()
    act(() => keyboard.press(midi(60)))
    act(() => vi.advanceTimersByTime(1000))
    expect([...result.current]).toEqual([60])
    act(() => keyboard.release(midi(60)))
    expect(result.current.size).toBe(0)
  })

  it('holds a staccato note down for the shortest press', () => {
    const { keyboard, result } = renderHeldKeys()
    act(() => {
      keyboard.press(midi(60))
      keyboard.release(midi(60))
    })
    expect([...result.current]).toEqual([60])
    act(() => vi.advanceTimersByTime(SHORTEST_PRESS_MS))
    expect(result.current.size).toBe(0)
  })

  it('keeps a key let go under the sustain down until the pedal comes up', () => {
    const { keyboard, result } = renderHeldKeys()
    act(() => {
      keyboard.pedal(true)
      keyboard.press(midi(60))
      keyboard.press(midi(64))
    })
    act(() => vi.advanceTimersByTime(SHORTEST_PRESS_MS))
    act(() => keyboard.release(midi(60)))
    expect([...result.current].toSorted()).toEqual([60, 64])
    act(() => keyboard.pedal(true, { pedal: 'soft' }))
    act(() => keyboard.pedal(false))
    expect([...result.current]).toEqual([64])
  })

  it('holds a key struck again under the sustain as a hand holds it', () => {
    const { keyboard, result } = renderHeldKeys()
    act(() => {
      keyboard.pedal(true)
      keyboard.press(midi(60))
    })
    act(() => vi.advanceTimersByTime(SHORTEST_PRESS_MS))
    act(() => keyboard.release(midi(60)))
    act(() => keyboard.press(midi(60)))
    act(() => keyboard.pedal(false))
    act(() => vi.advanceTimersByTime(SHORTEST_PRESS_MS))
    expect([...result.current]).toEqual([60])
  })
})
