import { describe, expect, it } from 'vitest'
import { note } from './note'
import { lastInversion, placeChord, placeScale } from './place'

const keys = (placed: readonly { midi: number }[]) => placed.map((p) => p.midi)

describe('placeChord', () => {
  it('plays C major from middle C in root position', () => {
    const placed = placeChord(note('C'), 'maj', { inversion: 0, bothHands: false })
    expect(keys(placed.rh)).toEqual([60, 64, 67])
    expect(placed.lh).toEqual([])
  })

  it('moves the lowest tones up an octave for each inversion', () => {
    expect(keys(placeChord(note('C'), 'maj', { inversion: 1, bothHands: false }).rh)).toEqual([
      64, 67, 72,
    ])
    expect(keys(placeChord(note('C'), 'maj', { inversion: 2, bothHands: false }).rh)).toEqual([
      67, 72, 76,
    ])
    expect(keys(placeChord(note('G'), 'd7', { inversion: 3, bothHands: false }).rh)).toEqual([
      77, 79, 83, 86,
    ])
  })

  it('refuses an inversion the chord does not have', () => {
    expect(() => placeChord(note('C'), 'maj', { inversion: 3, bothHands: false })).toThrow(
      RangeError,
    )
  })

  it('adds the root an octave below in the left hand for both hands', () => {
    const placed = placeChord(note('B', -1), 'maj7', { inversion: 0, bothHands: true })
    expect(keys(placed.lh)).toEqual([58])
    expect(placed.lh[0]?.tone.role).toBe('root')
    expect(placed.rh.map((p) => p.tone.degree)).toEqual(['1', '3', '5', '7'])
  })
})

describe('lastInversion', () => {
  it('offers as many inversions as the chord has tones after its root, at most three', () => {
    expect(lastInversion('maj')).toBe(2)
    expect(lastInversion('d7')).toBe(3)
    expect(lastInversion('m69')).toBe(3)
  })
})

describe('placeScale', () => {
  it('runs from the root at or above middle C to the root an octave up', () => {
    expect(keys(placeScale(note('C'), 'major'))).toEqual([60, 62, 64, 65, 67, 69, 71, 72])
    const eFlat = placeScale(note('E', -1), 'harmonic')
    expect(eFlat[0]?.midi).toBe(63)
    expect(eFlat.at(-1)?.tone.degree).toBe('1')
    expect(eFlat.at(-1)?.midi).toBe(75)
  })
})
