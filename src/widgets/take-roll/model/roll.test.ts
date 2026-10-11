import { describe, expect, it } from 'vitest'
import type { Take } from '@/entities/take'
import { midi } from '@/shared/lib/music'
import { rollOf } from './roll'

/** At 120 in 3/4 a bar is 1500 ms, a beat 500. */
const TAKE: Take = {
  id: 'take-1',
  pieceId: 'bz1',
  made: 0,
  tempo: 120,
  meter: '3/4',
  fromBar: 3,
  length: 4000,
  bars: [0, 1500, 3000, 4500],
  notes: [
    { midi: midi(60), at: 0, held: 400, velocity: 10 },
    { midi: midi(64), at: 500, held: 400, velocity: 40 },
    { midi: midi(60), at: 1500, held: 400, velocity: 100 },
    { midi: midi(64), at: 2000, held: 400, velocity: 127 },
  ],
  pedals: [{ pedal: 'sustain', down: 100, up: 900 }],
}

describe('rollOf', () => {
  it('gives a lane to each key from the take’s highest to its lowest, a key spare either side', () => {
    expect(rollOf(TAKE).lanes).toEqual([65, 64, 63, 62, 61, 60, 59])
    expect(rollOf({ ...TAKE, notes: [] }).lanes).toEqual([
      72, 71, 70, 69, 68, 67, 66, 65, 64, 63, 62, 61, 60,
    ])
  })

  it('shades each note by how hard it was struck', () => {
    expect(rollOf(TAKE).notes.map((note) => note.shade)).toEqual([1, 2, 4, 4])
  })

  it('numbers its bars from the bar it was recorded at, and marks the beats between', () => {
    const roll = rollOf(TAKE)
    expect(roll.bars).toEqual([
      { at: 0, number: 3 },
      { at: 1500, number: 4 },
      { at: 3000, number: 5 },
    ])
    expect(roll.beats).toEqual([500, 1000, 2000, 2500, 3500, 4000])
    expect(roll.length).toBe(4500)
  })

  it('lays each pedal’s presses in its own lane', () => {
    expect(rollOf(TAKE).pedals).toEqual({
      sustain: [{ down: 100, up: 900 }],
      soft: [],
      sostenuto: [],
    })
  })

  it('draws each bar as long as it fell in the piece: a pickup’s bar a beat', () => {
    const pickup = rollOf({
      ...TAKE,
      tempo: 60,
      meter: '4/4',
      length: 6000,
      bars: [0, 1000, 5000, 9000],
    })
    expect(pickup.bars.map((bar) => bar.at)).toEqual([0, 1000, 5000])
    expect(pickup.beats).toEqual([2000, 3000, 4000, 6000, 7000, 8000])
    expect(pickup.length).toBe(9000)
  })
})
