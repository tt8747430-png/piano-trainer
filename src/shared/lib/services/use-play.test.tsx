import { renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { createFakeAudio } from '@/shared/api/audio'
import { midi, note } from '@/shared/lib/music'
import type { Sound } from '@/shared/lib/schedule'
import { ServicesProvider } from './ServicesProvider'
import { usePlay, usePlayChord } from './use-play'

const NOTE: Sound = { kind: 'note', midi: midi(60), at: 0, duration: 1, velocity: 0.2 }

function setup<T>(hook: () => T) {
  const audio = createFakeAudio()
  const wrapper = ({ children }: { children: ReactNode }) => (
    <ServicesProvider services={{ audio, midi: null }}>{children}</ServicesProvider>
  )
  const { result } = renderHook(hook, { wrapper })
  return { audio, current: result.current }
}

const keysPlayed = (sounds: readonly Sound[]) =>
  sounds.flatMap((sound) => (sound.kind === 'note' ? [sound.midi] : []))

describe('usePlay', () => {
  it('unlocks audio and plays from just after now', () => {
    const { audio, current: play } = setup(usePlay)
    audio.setNow(2)
    const at = play([NOTE])
    expect(audio.unlocks).toBe(1)
    expect(audio.played).toEqual([{ sounds: [NOTE], at }])
    expect(at).toBeCloseTo(2.1)
  })

  it('cuts off what was sounding before the next tap sounds', () => {
    const { audio, current: play } = setup(usePlay)
    play([NOTE])
    play([NOTE])
    expect(audio.stops).toBe(2)
    expect(audio.played).toHaveLength(2)
  })
})

describe('usePlayChord', () => {
  it('strikes a chord from middle C, with the root below for both hands', () => {
    const { audio, current: playChord } = setup(usePlayChord)
    playChord({ root: note('C'), quality: 'maj' }, { bothHands: true })
    expect(keysPlayed(audio.played[0]?.sounds ?? [])).toEqual([48, 60, 64, 67])
  })

  it('plays an inversion', () => {
    const { audio, current: playChord } = setup(usePlayChord)
    playChord({ root: note('C'), quality: 'maj' }, { inversion: 1 })
    expect(keysPlayed(audio.played[0]?.sounds ?? [])).toEqual([64, 67, 72])
  })
})
