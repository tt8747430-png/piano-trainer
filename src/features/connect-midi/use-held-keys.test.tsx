import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { createFakeAudio } from '@/shared/api/audio'
import { createFakeMidi } from '@/shared/api/midi'
import { midi } from '@/shared/lib/music'
import { ServicesProvider } from '@/shared/lib/services'
import { useHeldKeys } from './use-held-keys'

describe('useHeldKeys', () => {
  it('follows the keys held on the MIDI keyboard', () => {
    const keyboard = createFakeMidi()
    const wrapper = ({ children }: { children: ReactNode }) => (
      <ServicesProvider services={{ audio: createFakeAudio(), midi: keyboard }}>
        {children}
      </ServicesProvider>
    )
    const { result } = renderHook(() => useHeldKeys(), { wrapper })
    act(() => keyboard.press(midi(60)))
    expect([...result.current]).toEqual([60])
    act(() => keyboard.release(midi(60)))
    expect(result.current.size).toBe(0)
  })
})
