import { describe, expect, it } from 'vitest'
import { midi, pitchClass } from '@/shared/lib/music'
import { holdsChord } from './holds-chord'

/** C#m7 as the Player's right hand plays it, B3 E4 G#4, among its notes C# E G# B. */
const C_SHARP_M7 = {
  keys: [59, 64, 68].map(midi),
  pitchClasses: [1, 4, 8, 11].map(pitchClass),
}
/** C/Bb: C E G over its bass. */
const C_OVER_B_FLAT = { keys: [60, 64, 67].map(midi), pitchClasses: [0, 4, 7, 10].map(pitchClass) }

const holds = (chord: typeof C_SHARP_M7, ...keys: number[]) => holdsChord(keys.map(midi), chord)

describe('holdsChord', () => {
  it('is the diagram’s notes held, in any octave or order', () => {
    expect(holds(C_SHARP_M7, 59, 64, 68)).toBe(true)
    expect(holds(C_SHARP_M7, 64, 68, 71)).toBe(true)
    expect(holds(C_SHARP_M7, 47, 76, 80)).toBe(true)
  })

  it('takes the whole chord, its root that the hand leaves to the bass too', () => {
    expect(holds(C_SHARP_M7, 49, 64, 68, 71)).toBe(true)
    expect(holds(C_OVER_B_FLAT, 46, 60, 64, 67)).toBe(true)
  })

  it('is not a note of it missing, nor a note it has not', () => {
    expect(holds(C_SHARP_M7, 64, 68)).toBe(false)
    expect(holds(C_SHARP_M7, 59, 64, 68, 62)).toBe(false)
    expect(holds(C_SHARP_M7)).toBe(false)
  })
})
