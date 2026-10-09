import { describe, expect, it } from 'vitest'
import { midi } from '@/shared/lib/music'
import type { PedalKind } from '@/shared/lib/schedule'
import { isKept, takeOf, type Heard } from './take-of'

const key = (n: number, on: boolean, at: number, velocity = on ? 80 : 0): Heard => ({
  kind: 'note',
  midi: midi(n),
  on,
  velocity,
  at,
})
const pedal = (down: boolean, at: number, kind: PedalKind = 'sustain'): Heard => ({
  kind: 'pedal',
  pedal: kind,
  down,
  at,
})

/** At 120 a beat is half a second: the downbeat at 10 s on the audio clock. */
const AT_120 = { downbeat: 10, tempo: 120 }

describe('takeOf', () => {
  it('keeps each key from the downbeat, in milliseconds, with its velocity', () => {
    const played = takeOf([key(60, true, 10.5, 90), key(64, true, 10.75), key(60, false, 11)], {
      ...AT_120,
      stop: 12,
    })
    expect(played.length).toBe(2000)
    expect(played.notes).toEqual([
      { midi: 60, at: 500, held: 500, velocity: 90 },
      { midi: 64, at: 750, held: 1250, velocity: 80 },
    ])
  })

  it('counts a key struck within half a beat before the downbeat as on it, and drops the count-in’s', () => {
    const played = takeOf(
      [key(48, true, 9.5), key(60, true, 9.8), key(60, false, 10.3), key(48, false, 10.4)],
      { ...AT_120, stop: 11 },
    )
    expect(played.notes).toEqual([{ midi: 60, at: 0, held: 500, velocity: 80 }])
  })

  it('keeps only the piano’s keys: one a controller sends past them is not the piano’s', () => {
    const played = takeOf(
      [key(110, true, 10.1), key(20, true, 10.2), key(108, true, 10.3), key(21, true, 10.4)],
      { ...AT_120, stop: 11 },
    )
    expect(played.notes.map((n) => n.midi)).toEqual([108, 21])
  })

  it('ends a key struck again while it is held, and starts it anew', () => {
    const played = takeOf([key(60, true, 10), key(60, true, 10.4, 100), key(60, false, 10.6)], {
      ...AT_120,
      stop: 11,
    })
    expect(played.notes).toEqual([
      { midi: 60, at: 0, held: 400, velocity: 80 },
      { midi: 60, at: 400, held: 200, velocity: 100 },
    ])
  })

  it('ends the keys and the pedal still down at Stop, and ignores what comes after it', () => {
    const played = takeOf(
      [pedal(true, 10.2), key(60, true, 10.5), key(62, true, 11.5), pedal(false, 11.5)],
      { ...AT_120, stop: 11 },
    )
    expect(played.notes).toEqual([{ midi: 60, at: 500, held: 500, velocity: 80 }])
    expect(played.pedals).toEqual([{ pedal: 'sustain', down: 200, up: 1000 }])
  })

  it('keeps the pedal’s presses, one held from the count-in starting on the downbeat', () => {
    const played = takeOf(
      [
        pedal(true, 9),
        pedal(false, 10.5),
        pedal(true, 10.6),
        pedal(true, 10.7),
        pedal(false, 11),
        pedal(false, 11.2),
        pedal(true, 8),
        pedal(false, 8.5),
      ].sort((a, b) => a.at - b.at),
      { ...AT_120, stop: 12 },
    )
    expect(played.pedals).toEqual([
      { pedal: 'sustain', down: 0, up: 500 },
      { pedal: 'sustain', down: 600, up: 1000 },
    ])
  })

  it('keeps each pedal’s presses on their own, overlapping', () => {
    const played = takeOf(
      [
        pedal(true, 10.1),
        pedal(true, 10.2, 'soft'),
        pedal(false, 10.5),
        pedal(true, 10.6, 'sostenuto'),
        pedal(false, 10.8, 'soft'),
      ],
      { ...AT_120, stop: 11 },
    )
    expect(played.pedals).toEqual([
      { pedal: 'sustain', down: 100, up: 500 },
      { pedal: 'soft', down: 200, up: 800 },
      { pedal: 'sostenuto', down: 600, up: 1000 },
    ])
  })

  it('keeps nothing from a take stopped before its downbeat', () => {
    expect(takeOf([key(60, true, 9.9)], { ...AT_120, stop: 9.95 })).toEqual({
      notes: [],
      pedals: [],
      length: 0,
    })
  })
})

describe('isKept', () => {
  it('keeps a key on the piano struck from half a beat before the downbeat', () => {
    expect(isKept(midi(60), 9.75, AT_120)).toBe(true)
    expect(isKept(midi(60), 9.74, AT_120)).toBe(false)
    expect(isKept(midi(109), 10, AT_120)).toBe(false)
  })
})
