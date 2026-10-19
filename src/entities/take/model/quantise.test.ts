import { describe, expect, it } from 'vitest'
import { midi, type Meter } from '@/shared/lib/music'
import { ticksOf, type Duration } from '@/shared/lib/notation'
import { quantise, takeGrids } from './quantise'
import type { Take } from './types'

/** At 60 a beat is a second: 24 ticks; an eighth (12 ticks) is half a second. */
const TAKE: Take = {
  id: 'take-1',
  pieceId: 'bz1',
  made: 0,
  tempo: 60,
  meter: '4/4',
  fromBar: 1,
  length: 4000,
  bars: [0, 4000],
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
      { midi: 60, startTick: 0, durationTicks: 24 },
      { midi: 64, startTick: 36, durationTicks: 6 * 2 },
    ])
  })

  it('keeps a note a step long at least', () => {
    expect(quantise({ ...TAKE, notes: [note(60, 1000, 60)] }, EIGHTH)).toEqual([
      { midi: 60, startTick: 24, durationTicks: 12 },
    ])
  })

  it('cuts a key where it starts again, and keeps one of two strikes snapped together', () => {
    const notes = [note(60, 0, 1400), note(60, 1000, 400), note(62, 2000, 100), note(62, 2100, 300)]
    expect(quantise({ ...TAKE, notes }, EIGHTH)).toEqual([
      { midi: 60, startTick: 0, durationTicks: 24 },
      { midi: 60, startTick: 24, durationTicks: 12 },
      { midi: 62, startTick: 48, durationTicks: 12 },
    ])
  })

  it('snaps to a triplet’s step at the take’s tempo', () => {
    // At 120 a beat is half a second; an eighth triplet (8 ticks) is a sixth of a second.
    const notes = [note(60, 170, 150)]
    expect(quantise({ ...TAKE, tempo: 120, notes }, { ...EIGHTH, triplet: true })).toEqual([
      { midi: 60, startTick: 8, durationTicks: 8 },
    ])
  })

  it('snaps to a value in the take’s own meter, whatever the piece’s is now', () => {
    // In 6/8 at 60 a dotted quarter is a second: an eighth (8 ticks) is a third of it.
    const notes = [note(60, 0, 300), note(64, 333, 300), note(67, 667, 300)]
    expect(quantise({ ...TAKE, meter: '6/8', notes }, EIGHTH)).toEqual([
      { midi: 60, startTick: 0, durationTicks: 8 },
      { midi: 64, startTick: 8, durationTicks: 8 },
      { midi: 67, startTick: 16, durationTicks: 8 },
    ])
  })
})

describe('takeGrids', () => {
  it.each([
    ['4/4', [24, 12, 6, 8]],
    ['3/4', [24, 12, 6, 8]],
    ['6/8', [24, 8, 4]],
    ['12/8', [24, 8, 4]],
  ] as const)(
    'offers %s the beat, an eighth, a sixteenth, and in simple time a triplet',
    (meter: Meter, ticks) => {
      expect(takeGrids(meter).map((grid) => ticksOf(grid, meter))).toEqual(ticks)
    },
  )
})
