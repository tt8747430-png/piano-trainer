import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { createFakeAudio } from '@/shared/api/audio'
import { createFakeMidi, type FakeMidi } from '@/shared/api/midi'
import { ServicesProvider } from '@/shared/lib/services'
import { useMidiConnection } from './use-midi-connection'

function setup(midi: FakeMidi | null) {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <ServicesProvider services={{ audio: createFakeAudio(), midi }}>{children}</ServicesProvider>
  )
  return renderHook(() => useMidiConnection(), { wrapper })
}

describe('useMidiConnection', () => {
  it('is unsupported without Web MIDI', () => {
    expect(setup(null).result.current.connection).toEqual({ kind: 'unsupported' })
  })

  it('connects and then follows the keyboard being unplugged', async () => {
    const keyboard = createFakeMidi()
    const { result } = setup(keyboard)
    expect(result.current.connection).toEqual({ kind: 'idle' })
    await act(async () => result.current.connect())
    expect(result.current.connection).toEqual({
      kind: 'ready',
      status: { state: 'connected', devices: ['Keyboard'] },
    })
    act(() => keyboard.setStatus({ state: 'no-device' }))
    expect(result.current.connection).toEqual({ kind: 'ready', status: { state: 'no-device' } })
  })
})
