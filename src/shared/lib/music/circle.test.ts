import { describe, expect, it } from 'vitest'
import { CIRCLE_OF_FIFTHS, circleKey, randomKey } from './circle'
import { keySymbol } from './key'
import { note, noteName } from './note'
import { pitchClass } from './pitch'

describe('CIRCLE_OF_FIFTHS', () => {
  it('goes round by fifths from C, each major over its relative minor with the same signature', () => {
    expect(CIRCLE_OF_FIFTHS.map((place) => keySymbol(place.major))).toEqual([
      'C',
      'G',
      'D',
      'A',
      'E',
      'B',
      'F#',
      'D♭',
      'A♭',
      'E♭',
      'B♭',
      'F',
    ])
    expect(CIRCLE_OF_FIFTHS.map((place) => keySymbol(place.minor))).toEqual([
      'Am',
      'Em',
      'Bm',
      'F#m',
      'C#m',
      'G#m',
      'D#m',
      'B♭m',
      'Fm',
      'Cm',
      'Gm',
      'Dm',
    ])
  })
})

describe('circleKey', () => {
  it('spells a key as the circle does, so a key found by its tonic is on the circle', () => {
    expect(keySymbol(circleKey(pitchClass(3), true))).toBe('D#m')
    expect(keySymbol(circleKey(pitchClass(6), false))).toBe('F#')
    expect(keySymbol(circleKey(pitchClass(1), false))).toBe('D♭')
  })
})

describe('randomKey', () => {
  it('picks any of the 24 keys but the one shown', () => {
    const c = { tonic: note('C'), minor: false }
    expect(randomKey(() => 0, c)).toEqual({ tonic: note('A'), minor: true })
    expect(randomKey(() => 0.9999, c)).toEqual({ tonic: note('D'), minor: true })
  })
})
