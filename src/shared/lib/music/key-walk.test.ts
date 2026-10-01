import { describe, expect, it } from 'vitest'
import type { Key } from './key'
import { walkKeys } from './key-walk'
import { note, noteName } from './note'

const C: Key = { tonic: note('C'), minor: false }
const names = (keys: readonly Key[]) =>
  keys.map((key) => noteName(key.tonic) + (key.minor ? 'm' : ''))

describe('walkKeys', () => {
  it('walks up and down by semitones, twelve keys and home', () => {
    expect(names(walkKeys(C, 'semitones-up'))).toEqual([
      'C',
      'D♭',
      'D',
      'E♭',
      'E',
      'F',
      'F#',
      'G',
      'A♭',
      'A',
      'B♭',
      'B',
      'C',
    ])
    expect(names(walkKeys(C, 'semitones-down'))).toEqual([
      'C',
      'B',
      'B♭',
      'A',
      'A♭',
      'G',
      'F#',
      'F',
      'E',
      'E♭',
      'D',
      'D♭',
      'C',
    ])
  })

  it('walks by whole tones, six keys and home', () => {
    expect(names(walkKeys(C, 'tones-up'))).toEqual(['C', 'D', 'E', 'F#', 'A♭', 'B♭', 'C'])
    expect(names(walkKeys(C, 'tones-down'))).toEqual(['C', 'B♭', 'A♭', 'F#', 'E', 'D', 'C'])
  })

  it('goes round the circle of fifths, each key a 5th lower', () => {
    expect(names(walkKeys(C, 'fifths'))).toEqual([
      'C',
      'F',
      'B♭',
      'E♭',
      'A♭',
      'D♭',
      'F#',
      'B',
      'E',
      'A',
      'D',
      'G',
      'C',
    ])
  })

  it('keeps a minor key minor', () => {
    expect(names(walkKeys({ tonic: note('A'), minor: true }, 'tones-up'))).toEqual([
      'Am',
      'Bm',
      'C#m',
      'E♭m',
      'Fm',
      'Gm',
      'Am',
    ])
  })
})
