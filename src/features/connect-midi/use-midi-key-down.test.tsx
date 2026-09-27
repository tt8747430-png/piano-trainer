import { renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { createFakeAudio } from '@/shared/api/audio'
import { createFakeMidi, type FakeMidi } from '@/shared/api/midi'
import { midi } from '@/shared/lib/music'
import { ServicesProvider } from '@/shared/lib/services'
import { useMidiKeyDown } from './use-midi-key-down'

function wrapperWith(keyboard: FakeMidi | null) {
  return ({ children }: { children: ReactNode }) => (
    <ServicesProvider services={{ audio: createFakeAudio(), midi: keyboard }}>
      {children}
    </ServicesProvider>
  )
}

describe('useMidiKeyDown', () => {
  it('calls back for each key going down on the MIDI keyboard, not for one let go', () => {
    const keyboard = createFakeMidi()
    const onKey = vi.fn()
    renderHook(() => useMidiKeyDown(onKey), { wrapper: wrapperWith(keyboard) })
    keyboard.press(midi(64))
    keyboard.release(midi(64))
    expect(onKey.mock.calls).toEqual([[64]])
  })

  it('does nothing where the browser has no Web MIDI', () => {
    expect(() =>
      renderHook(() => useMidiKeyDown(vi.fn()), { wrapper: wrapperWith(null) }),
    ).not.toThrow()
  })
})
