import { describe, expect, it } from 'vitest'
import {
  fingeringsOf,
  ownFingering,
  runFingering,
  scaleFingering,
  thumbFingering,
  type Finger,
} from './fingering'
import { isBlackKey } from './keyboard'
import { LETTERS, note } from './note'
import { pitchClass } from './pitch'
import { placeScale } from './place'
import { SCALE_KINDS, scaleHasChords, scaleRootSpelling } from './scale'

const digits = (fingers: readonly Finger[]) => fingers.join('')

describe('scaleFingering', () => {
  it('keeps the taught one-octave fingering from the tonic', () => {
    expect(digits(scaleFingering(note('C'), 'major', 'rh', 0))).toBe('12312345')
    expect(digits(scaleFingering(note('C'), 'major', 'lh', 0))).toBe('54321321')
    expect(digits(scaleFingering(note('F'), 'major', 'rh', 0))).toBe('12341234')
    expect(digits(scaleFingering(note('B', -1), 'major', 'rh', 0))).toBe('21231234')
    expect(digits(scaleFingering(note('C'), 'blues', 'lh', 0))).toBe('4214321')
  })

  it('fingers harmonic and melodic minor as natural minor, melodic as its major where a thumb would be black', () => {
    for (const hand of ['rh', 'lh'] as const) {
      expect(scaleFingering(note('A'), 'harmonic', hand, 0)).toEqual(
        scaleFingering(note('A'), 'natural', hand, 0),
      )
      expect(scaleFingering(note('A'), 'melodic', hand, 0)).toEqual(
        scaleFingering(note('A'), 'natural', hand, 0),
      )
    }
  })

  it('fingers C♯ melodic minor as C♯ major, keeping the thumb off A♯', () => {
    expect(digits(scaleFingering(note('C', 1), 'melodic', 'rh', 0))).toBe(
      digits(scaleFingering(note('C', 1), 'major', 'rh', 0)),
    )
  })

  it('ends D♭ and F♯ major’s left hand on the finger its octave takes in a longer run', () => {
    expect(digits(scaleFingering(note('D', -1), 'major', 'lh', 0))).toBe('32143213')
    expect(digits(scaleFingering(note('F', 1), 'major', 'lh', 0))).toBe('43213214')
  })

  it('never puts a thumb on a black key in a taught seven-note scale from its tonic', () => {
    for (const kind of ['major', 'natural', 'harmonic', 'melodic'] as const) {
      for (let pc = 0; pc < 12; pc++) {
        const root = scaleRootSpelling(pitchClass(pc), kind)
        const keys = placeScale(root, kind).map((placed) => placed.midi)
        for (const hand of ['rh', 'lh'] as const) {
          const fingers = scaleFingering(root, kind, hand, 0)
          const blackThumbs = keys.filter((key, i) => fingers[i] === 1 && isBlackKey(key))
          expect(blackThumbs, `${kind} on ${pc}, ${hand}`).toEqual([])
        }
      }
    }
  })

  it('gives the major pentatonic’s octave a finger', () => {
    expect(digits(scaleFingering(note('C'), 'pent', 'rh', 0))).toBe('123123')
    expect(digits(scaleFingering(note('C'), 'pent', 'lh', 0))).toBe('321213')
  })

  it('keeps each note’s finger in a longer run from any other note (PWJ’s modes)', () => {
    expect(digits(scaleFingering(note('C'), 'major', 'rh', 2))).toBe('31234123')
    expect(digits(scaleFingering(note('C'), 'major', 'lh', 2))).toBe('32132143')
    // B♭ major's thumbs are on C and F, so between octaves B♭ is the 4th finger.
    expect(digits(scaleFingering(note('B', -1), 'major', 'rh', 6))).toBe('34123123')
  })

  it('fingers a mode as its parent major', () => {
    expect(digits(scaleFingering(note('D'), 'dorian', 'rh', 0))).toBe('23123412')
    expect(digits(scaleFingering(note('D'), 'dorian', 'lh', 0))).toBe('43213214')
  })

  it('carries no pentatonic or blues fingering to another note', () => {
    expect(() => scaleFingering(note('C'), 'blues', 'rh', 2)).toThrow(RangeError)
    expect(() => scaleFingering(note('A'), 'mpent', 'rh', 0)).toThrow(RangeError)
  })
})

describe('thumbFingering', () => {
  it('fingers every white-key major scale as it is taught, both hands', () => {
    for (const letter of LETTERS) {
      const keys = placeScale(note(letter), 'major').map((placed) => placed.midi)
      for (const hand of ['rh', 'lh'] as const) {
        expect(thumbFingering(keys, hand)).toEqual(scaleFingering(note(letter), 'major', hand, 0))
      }
    }
  })

  it('keeps the later thumbs off the black keys', () => {
    const bFlat = placeScale(note('B', -1), 'major').map((placed) => placed.midi)
    expect(digits(thumbFingering(bFlat, 'rh'))).toBe('12341234')
    const blues = placeScale(note('C'), 'blues').map((placed) => placed.midi)
    expect(digits(thumbFingering(blues, 'rh'))).toBe('1234123')
  })

  it('puts the left hand’s thumb on the top note, coming down', () => {
    const fromE = placeScale(note('C'), 'major', 2).map((placed) => placed.midi)
    expect(thumbFingering(fromE, 'lh').at(-1)).toBe(1)
  })
})

describe('fingeringsOf and ownFingering', () => {
  it('offers both fingerings for a seven-note scale from any note', () => {
    expect(fingeringsOf('major', 3)).toEqual(['thumb', 'scale'])
    expect(fingeringsOf('dorian', 0)).toEqual(['thumb', 'scale'])
  })

  it('offers a pentatonic or blues scale its taught fingering from its tonic only', () => {
    expect(fingeringsOf('blues', 0)).toEqual(['scale'])
    expect(fingeringsOf('blues', 2)).toEqual(['thumb'])
    expect(fingeringsOf('mpent', 0)).toEqual(['thumb'])
  })

  it('fingers a run as taught from a taught tonic, else from the thumb', () => {
    expect(ownFingering('major', 0)).toBe('scale')
    expect(ownFingering('major', 2)).toBe('thumb')
    expect(ownFingering('dorian', 0)).toBe('thumb')
    expect(ownFingering('majorBlues', 0)).toBe('thumb')
  })
})

describe('runFingering', () => {
  it('uses only fingers 1–5 for every kind, root, start and hand it offers', () => {
    for (const kind of SCALE_KINDS) {
      for (let pc = 0; pc < 12; pc++) {
        const root = scaleRootSpelling(pitchClass(pc), kind)
        const starts = scaleHasChords(kind) ? [0, 1, 2, 3, 4, 5, 6] : [0, 1, 2]
        for (const start of starts) {
          const keys = placeScale(root, kind, start).map((placed) => placed.midi)
          for (const fingering of fingeringsOf(kind, start)) {
            for (const hand of ['rh', 'lh'] as const) {
              const fingers = runFingering(root, kind, start, keys, hand, fingering)
              expect(fingers).toHaveLength(keys.length)
              for (const finger of fingers) expect([1, 2, 3, 4, 5]).toContain(finger)
            }
          }
        }
      }
    }
  })
})
