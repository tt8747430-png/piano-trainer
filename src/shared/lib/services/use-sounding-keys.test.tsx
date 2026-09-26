import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { createFakeAudio } from '@/shared/api/audio'
import { midi } from '@/shared/lib/music'
import { chordSounds, type Sound } from '@/shared/lib/schedule'
import { ServicesProvider } from './ServicesProvider'
import { usePlay } from './use-play'
import { useSoundingKeys } from './use-sounding-keys'

const NOTE: Sound = { kind: 'note', midi: midi(60), at: 0, duration: 1, velocity: 0.2 }
const C_MAJOR = [60, 64, 67].map(midi)

function setup<T>(hook: () => T) {
  const audio = createFakeAudio()
  const wrapper = ({ children }: { children: ReactNode }) => (
    <ServicesProvider services={{ audio, midi: null }}>{children}</ServicesProvider>
  )
  return { audio, result: renderHook(hook, { wrapper }).result }
}

describe('useSoundingKeys', () => {
  it('follows the keys sounding as the clock moves', () => {
    const { audio, result } = setup(() => ({ play: usePlay(), sounding: useSoundingKeys() }))
    act(() => void result.current.play([NOTE]))
    expect(result.current.sounding.size).toBe(0)
    act(() => audio.setNow(0.5))
    expect([...result.current.sounding]).toEqual([60])
    act(() => audio.setNow(2))
    expect(result.current.sounding.size).toBe(0)
  })

  it('reads the keys sounding, or only the ones struck last', () => {
    const { audio, result } = setup(() => [useSoundingKeys(), useSoundingKeys('struck')])
    act(() => void audio.play(chordSounds(C_MAJOR, { arpeggio: true }), 0))
    act(() => audio.setNow(0.3))
    expect(result.current.map((keys) => [...keys])).toEqual([[60, 64], [64]])
  })
})
