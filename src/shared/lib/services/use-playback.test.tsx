import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { createFakeAudio, createWebAudioOutput, type AudioOutput } from '@/shared/api/audio'
import { midi } from '@/shared/lib/music'
import type { Sound } from '@/shared/lib/schedule'
import { ServicesProvider } from './ServicesProvider'
import { useSoundKey } from './use-play'
import { usePlayback } from './use-playback'

const NOTE: Sound = { kind: 'note', midi: midi(60), at: 0, duration: 1, velocity: 0.2 }

function setup<T>(hook: () => T, audio: AudioOutput = createFakeAudio()) {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <ServicesProvider services={{ audio, midi: null }}>{children}</ServicesProvider>
  )
  return { audio, result: renderHook(hook, { wrapper }).result }
}

describe('usePlayback', () => {
  it('is playing its id from the tap until the last note ends', () => {
    const audio = createFakeAudio()
    const { result } = setup(() => usePlayback<'chord'>(), audio)
    act(() => result.current.toggle('chord', [NOTE]))
    expect(result.current.playing).toBe('chord')
    act(() => audio.setNow(1.05))
    expect(result.current.playing).toBe('chord')
    act(() => audio.setNow(1.2))
    expect(result.current.playing).toBeNull()
  })

  it('stops on a second tap, even before the first note sounded', () => {
    const audio = createFakeAudio()
    const { result } = setup(() => usePlayback<'chord'>(), audio)
    act(() => result.current.toggle('chord', [NOTE]))
    act(() => result.current.toggle('chord', [NOTE]))
    expect(result.current.playing).toBeNull()
    expect(audio.stops).toBe(2)
  })

  it('turns back when another sound cuts it off, but not under a tapped key', () => {
    const audio = createFakeAudio()
    const { result } = setup(
      () => ({ a: usePlayback<'a'>(), b: usePlayback<'b'>(), tap: useSoundKey() }),
      audio,
    )
    act(() => result.current.a.toggle('a', [NOTE]))
    act(() => result.current.tap(midi(64)))
    expect(result.current.a.playing).toBe('a')
    act(() => result.current.b.toggle('b', [NOTE]))
    expect(result.current.a.playing).toBeNull()
    expect(result.current.b.playing).toBe('b')
  })

  it('never turns into Stop where nothing can sound', () => {
    const silent = createWebAudioOutput({ createContext: () => null, frame: () => {} })
    const { result } = setup(() => usePlayback<'chord'>(), silent)
    act(() => result.current.toggle('chord', [NOTE]))
    expect(result.current.playing).toBeNull()
  })
})
