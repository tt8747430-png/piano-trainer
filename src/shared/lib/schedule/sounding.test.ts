import { describe, expect, it } from 'vitest'
import { midi } from '@/shared/lib/music'
import { keysSoundingAt, keysStruckAt, keyWindows } from './sounding'
import { chordSounds } from './sounds'
import type { Sound } from './schedule'

const note = (key: number, at: number, duration: number): Sound => ({
  kind: 'note',
  midi: midi(key),
  at,
  duration,
  velocity: 0.2,
})

describe('keyWindows', () => {
  it('places each note on the clock from when its sounds start', () => {
    expect(keyWindows([note(60, 0, 1), note(64, 0.5, 1)], 10)).toEqual([
      { midi: 60, from: 10, to: 11 },
      { midi: 64, from: 10.5, to: 11.5 },
    ])
  })

  it('has no window for a click', () => {
    expect(keyWindows([{ kind: 'click', at: 0, accent: true }], 0)).toEqual([])
  })
})

describe('keysSoundingAt', () => {
  const arpeggio = keyWindows([note(60, 0, 1), note(64, 0.25, 1), note(67, 0.5, 1)], 0)

  it('has the keys whose notes have started and not yet ended', () => {
    expect([...keysSoundingAt(arpeggio, 0.3)]).toEqual([60, 64])
    expect([...keysSoundingAt(arpeggio, 1.1)]).toEqual([64, 67])
  })

  it('has nothing before the first note or after the last', () => {
    expect(keysSoundingAt(arpeggio, -0.1).size).toBe(0)
    expect(keysSoundingAt(arpeggio, 1.5).size).toBe(0)
  })

  it('keeps a key down while another note on it still sounds', () => {
    const again = keyWindows([note(60, 0, 1), note(60, 0.8, 1)], 0)
    expect([...keysSoundingAt(again, 1.2)]).toEqual([60])
  })
})

describe('keysStruckAt', () => {
  const C_MAJOR = [midi(60), midi(64), midi(67)]

  it('finds the keys struck last: a chord’s together, an arpeggio’s one by one', () => {
    const block = keyWindows(chordSounds(C_MAJOR, { arpeggio: false }), 0)
    expect([...keysStruckAt(block, 0.5)]).toEqual([60, 64, 67])
    const rolled = keyWindows(chordSounds(C_MAJOR, { arpeggio: true }), 0)
    expect([...keysStruckAt(rolled, -0.1)]).toEqual([])
    expect([...keysStruckAt(rolled, 0.3)]).toEqual([64])
    expect([...keysStruckAt(rolled, 0.5)]).toEqual([67])
    // C has ended, E and G ring: G was struck last.
    expect([...keysStruckAt(rolled, 1.5)]).toEqual([67])
    expect([...keysStruckAt(rolled, 3)]).toEqual([])
  })
})
