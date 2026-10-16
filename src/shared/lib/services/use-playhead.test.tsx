import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { createFakeAudio } from '@/shared/api/audio'
import { midi } from '@/shared/lib/music'
import type { Sound } from '@/shared/lib/schedule'
import { ServicesProvider } from './ServicesProvider'
import { usePlayback } from './use-playback'
import { usePlayhead } from './use-playhead'

const note = (key: number, at: number): Sound => ({
  kind: 'note',
  midi: midi(key),
  at,
  duration: 0.5,
  velocity: 0.2,
})
const LINE = [note(60, 0), note(62, 0.5), note(64, 1)]
const ONSETS = [0, 0.5, 1]

describe('usePlayhead', () => {
  it('follows a play note by note on the audio clock, and lets go once it ends', () => {
    const audio = createFakeAudio()
    const wrapper = ({ children }: { children: ReactNode }) => (
      <ServicesProvider services={{ audio, midi: null }}>{children}</ServicesProvider>
    )
    const { result } = renderHook(
      () => {
        const playback = usePlayback<'line'>()
        return { playback, at: usePlayhead(playback.handle, ONSETS) }
      },
      { wrapper },
    )
    expect(result.current.at).toBeNull()
    act(() => result.current.playback.toggle('line', () => LINE))
    const from = result.current.playback.handle?.from ?? 0
    act(() => audio.setNow(from))
    expect(result.current.at).toBe(0)
    act(() => audio.setNow(from + 0.6))
    expect(result.current.at).toBe(1)
    act(() => audio.setNow(from + 1.1))
    expect(result.current.at).toBe(2)
    act(() => audio.setNow(from + 3))
    expect(result.current.at).toBeNull()
  })
})
