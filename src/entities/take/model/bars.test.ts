import { describe, expect, it } from 'vitest'
import { midi } from '@/shared/lib/music'
import { barMs, keepBars, takeBarCount } from './bars'
import type { Take } from './types'

/** At 120 in 4/4 a bar is 2000 ms: four bars. */
const TAKE: Take = {
  id: 'take-1',
  pieceId: 'bz1',
  made: 0,
  tempo: 120,
  meter: '4/4',
  fromBar: 3,
  length: 8000,
  notes: [
    { midi: midi(60), at: 500, held: 400, velocity: 80 },
    { midi: midi(62), at: 2500, held: 400, velocity: 80 },
    { midi: midi(64), at: 5900, held: 500, velocity: 80 },
    { midi: midi(65), at: 6500, held: 400, velocity: 80 },
  ],
  pedals: [
    { pedal: 'sustain', down: 1500, up: 2500 },
    { pedal: 'soft', down: 7000, up: 7500 },
  ],
}

describe('a take’s bars', () => {
  it('lasts its meter’s beats at its tempo, a bar begun counting whole', () => {
    expect(barMs(TAKE)).toBe(2000)
    expect(takeBarCount(TAKE)).toBe(4)
    expect(takeBarCount({ ...TAKE, length: 8001 })).toBe(5)
    expect(takeBarCount({ ...TAKE, length: 0 })).toBe(1)
  })
})

describe('keepBars', () => {
  it('keeps bars 2–3: what came before dropped, the rest moved back, what runs over cut', () => {
    const kept = keepBars(TAKE, 1, 2)
    expect(kept.notes).toEqual([
      { midi: 62, at: 500, held: 400, velocity: 80 },
      { midi: 64, at: 3900, held: 100, velocity: 80 },
    ])
    expect(kept.pedals).toEqual([{ pedal: 'sustain', down: 0, up: 500 }])
    expect(kept.length).toBe(4000)
    expect(kept.fromBar).toBe(4)
    expect(kept.id).toBe(TAKE.id)
  })

  it('refuses bars the take does not have', () => {
    expect(() => keepBars(TAKE, 2, 1)).toThrow(RangeError)
    expect(() => keepBars(TAKE, 0, 4)).toThrow(RangeError)
    expect(() => keepBars(TAKE, -1, 1)).toThrow(RangeError)
  })
})
