import { renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { createFakeAudio } from '@/shared/api/audio'
import { midi } from '@/shared/lib/music'
import { ServicesProvider } from './ServicesProvider'
import { useLiveVoice } from './use-live-voice'

const C = midi(60)
const E = midi(64)
const G = midi(67)

function setUp() {
  const audio = createFakeAudio()
  const wrapper = ({ children }: { children: ReactNode }) => (
    <ServicesProvider services={{ audio, midi: null }}>{children}</ServicesProvider>
  )
  const hook = renderHook(useLiveVoice, { wrapper })
  return { audio, voice: hook.result.current, hook }
}

describe('useLiveVoice', () => {
  it('sounds a key from the hand’s press until it lets go, at a tap’s velocity', () => {
    const { audio, voice } = setUp()
    voice.down(C, [C])
    expect(audio.unlocks).toBe(1)
    voice.up(C)
    expect(audio.voice).toEqual([
      { kind: 'press', midi: C, velocity: 100 },
      { kind: 'release', midi: C },
    ])
  })

  it('strikes and lets go every key of the chord a key stands for', () => {
    const { audio, voice } = setUp()
    voice.down(C, [C, E, G], 80)
    voice.up(C)
    expect(audio.voice.map((event) => event.kind)).toEqual([
      'press',
      'press',
      'press',
      'release',
      'release',
      'release',
    ])
    expect(audio.voice[0]).toEqual({ kind: 'press', midi: C, velocity: 80 })
  })

  it('lets go of a key two presses hold only as the second lets go', () => {
    const { audio, voice } = setUp()
    voice.down(C, [C])
    voice.down(C, [C])
    voice.up(C)
    expect(audio.voice.filter((event) => event.kind === 'release')).toEqual([])
    voice.up(C)
    expect(audio.voice.at(-1)).toEqual({ kind: 'release', midi: C })
  })

  it('lets go of a key two chords share with the last of them', () => {
    const { audio, voice } = setUp()
    voice.down(C, [C, G])
    voice.down(E, [E, G])
    voice.up(C)
    expect(audio.voice.filter((event) => event.kind === 'release')).toEqual([
      { kind: 'release', midi: C },
    ])
    voice.up(E)
    expect(audio.voice.slice(-2)).toEqual([
      { kind: 'release', midi: E },
      { kind: 'release', midi: G },
    ])
  })

  it('lets go of what its press played, though the hand lets go of a key it never pressed', () => {
    const { audio, voice } = setUp()
    voice.up(C)
    expect(audio.voice).toEqual([])
  })

  it('lets go of every key still held as the screen goes', () => {
    const { audio, voice, hook } = setUp()
    voice.down(C, [C, E])
    hook.unmount()
    expect(audio.voice.slice(-2)).toEqual([
      { kind: 'release', midi: C },
      { kind: 'release', midi: E },
    ])
  })
})
