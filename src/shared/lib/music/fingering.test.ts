import { describe, expect, it } from 'vitest'
import { scaleFingering } from './fingering'
import { pitchClass } from './pitch'
import { SCALE_KINDS } from './scale'

describe('scaleFingering', () => {
  it('fingers C major with both hands', () => {
    expect(scaleFingering(pitchClass(0), 'major', 'rh')).toEqual([1, 2, 3, 1, 2, 3, 4, 5])
    expect(scaleFingering(pitchClass(0), 'major', 'lh')).toEqual([5, 4, 3, 2, 1, 3, 2, 1])
  })

  it('fingers F and B♭ major from their own tables', () => {
    expect(scaleFingering(pitchClass(5), 'major', 'rh')).toEqual([1, 2, 3, 4, 1, 2, 3, 4])
    expect(scaleFingering(pitchClass(10), 'major', 'rh')).toEqual([2, 1, 2, 3, 1, 2, 3, 4])
  })

  it('fingers harmonic and melodic minor as natural minor', () => {
    for (const hand of ['rh', 'lh'] as const) {
      const natural = scaleFingering(pitchClass(9), 'natural', hand)
      expect(scaleFingering(pitchClass(9), 'harmonic', hand)).toEqual(natural)
      expect(scaleFingering(pitchClass(9), 'melodic', hand)).toEqual(natural)
    }
  })

  it('has no fingering for the minor pentatonic', () => {
    expect(scaleFingering(pitchClass(9), 'mpent', 'rh')).toBeNull()
  })

  it('uses only fingers 1–5', () => {
    for (const kind of SCALE_KINDS) {
      for (let pc = 0; pc < 12; pc++) {
        for (const hand of ['rh', 'lh'] as const) {
          for (const finger of scaleFingering(pitchClass(pc), kind, hand) ?? []) {
            expect([1, 2, 3, 4, 5]).toContain(finger)
          }
        }
      }
    }
  })
})
