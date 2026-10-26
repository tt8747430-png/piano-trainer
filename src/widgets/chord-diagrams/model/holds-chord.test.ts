import { describe, expect, it } from 'vitest'
import { midi, pitchClass } from '@/shared/lib/music'
import { holdsChord } from './holds-chord'

/** C♯m7 as its diagram folds it: G♯3 B3 C♯4 E4. */
const C_SHARP_M7 = {
  keys: [56, 59, 61, 64].map(midi),
  pitchClasses: [1, 4, 8, 11].map(pitchClass),
}
/** C/B♭: C E G over its bass B♭3. */
const C_OVER_B_FLAT = {
  keys: [58, 60, 64, 67].map(midi),
  pitchClasses: [0, 4, 7, 10].map(pitchClass),
}

const holds = (chord: typeof C_SHARP_M7, ...keys: number[]) => holdsChord(keys.map(midi), chord)

describe('holdsChord', () => {
  it('is the diagram’s notes held, in any octave, order or inversion', () => {
    expect(holds(C_SHARP_M7, 56, 59, 61, 64)).toBe(true)
    expect(holds(C_SHARP_M7, 61, 64, 68, 71)).toBe(true)
    expect(holds(C_SHARP_M7, 47, 73, 76, 80)).toBe(true)
    expect(holds(C_OVER_B_FLAT, 46, 60, 64, 67)).toBe(true)
  })

  it('is not a note of it missing, its bass either, nor a note it has not', () => {
    expect(holds(C_SHARP_M7, 59, 64, 68)).toBe(false)
    expect(holds(C_SHARP_M7, 56, 59, 61, 64, 62)).toBe(false)
    expect(holds(C_OVER_B_FLAT, 60, 64, 67)).toBe(false)
    expect(holds(C_SHARP_M7)).toBe(false)
  })
})
