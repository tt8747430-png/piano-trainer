import { describe, expect, it } from 'vitest'
import { midi, type Meter } from '@/shared/lib/music'
import { ticksOf, type Duration } from '@/shared/lib/notation'
import { quantise, takeGrids } from './quantise'
import type { Take } from './types'

/** At 60 a beat is a second: 12 ticks; an eighth (6 ticks) is half a second. */
const TAKE: Take = {
  id: 'take-1',
  pieceId: 'bz1',
  made: 0,
  tempo: 60,
  meter: '4/4',
  fromBar: 1,
  length: 4000,
  notes: [],
  pedals: [],
}
const note = (key: number, at: number, held: number) => ({
  midi: midi(key),
  at,
  held,
  velocity: 80,
})
const EIGHTH: Duration = { value: 8, dots: 0, triplet: false }

describe('quantise', () => {
  it('snaps each onset and release to the nearest step', () => {
    const notes = [note(60, 40, 930), note(64, 1260, 230)]
    expect(quantise({ ...TAKE, notes }, EIGHTH)).toEqual([
      { midi: 60, startTick: 0, durationTicks: 12 },
      { midi: 64, startTick: 18, durationTicks: 3 * 2 },
    ])
  })

  it('keeps a note a step long at least', () => {
    expect(quantise({ ...TAKE, notes: [note(60, 1000, 60)] }, EIGHTH)).toEqual([
      { midi: 60, startTick: 12, durationTicks: 6 },
    ])
  })

  it('cuts a key where it starts again, and keeps one of two strikes snapped together', () => {
    const notes = [note(60, 0, 1400), note(60, 1000, 400), note(62, 2000, 100), note(62, 2100, 300)]
    expect(quantise({ ...TAKE, notes }, EIGHTH)).toEqual([
      { midi: 60, startTick: 0, durationTicks: 12 },
      { midi: 60, startTick: 12, durationTicks: 6 },
      { midi: 62, startTick: 24, durationTicks: 6 },
    ])
  })

  it('snaps to a triplet’s step at the take’s tempo', () => {
    // At 120 a beat is half a second; an eighth triplet (4 ticks) is a sixth of a second.
    const notes = [note(60, 170, 150)]
    expect(quantise({ ...TAKE, tempo: 120, notes }, { ...EIGHTH, triplet: true })).toEqual([
      { midi: 60, startTick: 4, durationTicks: 4 },
    ])
  })

  it('snaps to a value in the take’s own meter, whatever the piece’s is now', () => {
    // In 6/8 at 60 a dotted quarter is a second: an eighth (4 ticks) is a third of it.
    const notes = [note(60, 0, 300), note(64, 333, 300), note(67, 667, 300)]
    expect(quantise({ ...TAKE, meter: '6/8', notes }, EIGHTH)).toEqual([
      { midi: 60, startTick: 0, durationTicks: 4 },
      { midi: 64, startTick: 4, durationTicks: 4 },
      { midi: 67, startTick: 8, durationTicks: 4 },
    ])
  })
})

describe('takeGrids', () => {
  it.each([
    ['4/4', [12, 6, 3, 4]],
    ['3/4', [12, 6, 3, 4]],
    ['6/8', [12, 4, 2]],
    ['12/8', [12, 4, 2]],
  ] as const)(
    'offers %s the beat, an eighth, a sixteenth, and in simple time a triplet',
    (meter: Meter, ticks) => {
      expect(takeGrids(meter).map((grid) => ticksOf(grid, meter))).toEqual(ticks)
    },
  )
})
