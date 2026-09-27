import { describe, expect, it } from 'vitest'
import { spellChord, type ChordQuality } from './chord'
import { rangeOf } from './keyboard'
import { note, type SpelledNote } from './note'
import {
  lastInversion,
  placeBorrowedChords,
  placeChord,
  placeScale,
  placeScaleChords,
  walkChords,
} from './place'
import { CHORD_NOTES } from './scale-chord'

const keys = (placed: readonly { midi: number }[]) => placed.map((p) => p.midi)
const tones = (root: SpelledNote, quality: ChordQuality) => spellChord(root, quality)

describe('placeChord', () => {
  it('plays C major from middle C in root position', () => {
    const placed = placeChord(tones(note('C'), 'maj'), { inversion: 0, bothHands: false })
    expect(keys(placed.rh)).toEqual([60, 64, 67])
    expect(placed.lh).toEqual([])
  })

  it('moves the lowest tones up an octave for each inversion', () => {
    expect(
      keys(placeChord(tones(note('C'), 'maj'), { inversion: 1, bothHands: false }).rh),
    ).toEqual([64, 67, 72])
    expect(
      keys(placeChord(tones(note('C'), 'maj'), { inversion: 2, bothHands: false }).rh),
    ).toEqual([67, 72, 76])
    expect(keys(placeChord(tones(note('G'), 'd7'), { inversion: 3, bothHands: false }).rh)).toEqual(
      [77, 79, 83, 86],
    )
  })

  it('refuses an inversion the chord does not have', () => {
    expect(() => placeChord(tones(note('C'), 'maj'), { inversion: 3, bothHands: false })).toThrow(
      RangeError,
    )
  })

  it('adds the root an octave below in the left hand for both hands', () => {
    const placed = placeChord(tones(note('B', -1), 'maj7'), { inversion: 0, bothHands: true })
    expect(keys(placed.lh)).toEqual([58])
    expect(placed.lh[0]?.tone.role).toBe('root')
    expect(placed.rh.map((p) => p.tone.degree)).toEqual(['1', '3', '5', '7'])
  })
})

describe('lastInversion', () => {
  it('offers as many inversions as the chord has tones after its root, at most three', () => {
    expect(lastInversion(3)).toBe(2)
    expect(lastInversion(4)).toBe(3)
    expect(CHORD_NOTES.map(lastInversion)).toEqual([2, 3, 3, 3, 3])
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

  it('runs from any degree up an octave, each note keeping its degree from the tonic', () => {
    const fromE = placeScale(note('C'), 'major', 2)
    expect(keys(fromE)).toEqual([64, 65, 67, 69, 71, 72, 74, 76])
    expect(fromE.map((placed) => placed.tone.degree)).toEqual([
      '3',
      '4',
      '5',
      '6',
      '7',
      '1',
      '2',
      '3',
    ])
  })
})

describe('placeScaleChords', () => {
  it('stands each triad of C major on its degree’s key, with its numeral', () => {
    const chords = placeScaleChords(note('C'), 'major', 3, 0)
    expect(chords.map((c) => c.numeral)).toEqual(['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'])
    expect(chords.map((c) => c.key)).toEqual([60, 62, 64, 65, 67, 69, 71])
    expect(keys(chords[1]?.tones ?? [])).toEqual([62, 65, 69])
  })

  it('stacks a 7th chord from its degree’s key, even past the octave, figured in root position', () => {
    const iii = placeScaleChords(note('A'), 'major', 4, 0)[2]
    expect(iii?.chord.quality).toBe('m7')
    expect(iii?.symbol).toBe('C#m7')
    expect(iii?.numeral).toBe('iii⁷')
    expect(iii?.key).toBe(73)
    expect(keys(iii?.tones ?? [])).toEqual([73, 76, 80, 83])
  })

  it('raises the lowest tones for an inversion, over its bass, with its figure', () => {
    const tonic = placeScaleChords(note('C'), 'major', 3, 1)[0]
    expect(keys(tonic?.tones ?? [])).toEqual([64, 67, 72])
    expect(tonic?.symbol).toBe('C/E')
    expect(tonic?.numeral).toBe('I⁶')
    expect(placeScaleChords(note('C'), 'major', 4, 3)[4]?.numeral).toBe('V⁴₂')
  })

  it('refuses an inversion the chords do not have', () => {
    expect(() => placeScaleChords(note('C'), 'major', 3, 3)).toThrow(RangeError)
  })

  it('has none for a scale without seven notes', () => {
    expect(placeScaleChords(note('C'), 'blues', 3, 0)).toEqual([])
  })
})

describe('placeBorrowedChords', () => {
  it('stands each borrowed chord on its root’s key above the tonic', () => {
    const chords = placeBorrowedChords({ tonic: note('C'), minor: false }, 3, 0)
    expect(chords.map((c) => c.key)).toEqual([63, 65, 68, 70])
    expect(keys(chords[1]?.tones ?? [])).toEqual([65, 68, 72])
    expect(chords[3]?.numeral).toBe('♭VII')
  })
})

describe('walkChords', () => {
  it('goes up the seven chords, the tonic’s an octave up, and back down', () => {
    const walk = walkChords(placeScaleChords(note('C'), 'major', 3, 0))
    expect(walk.map((placed) => placed.numeral)).toEqual([
      'I',
      'ii',
      'iii',
      'IV',
      'V',
      'vi',
      'vii°',
      'I',
      'vii°',
      'vi',
      'V',
      'IV',
      'iii',
      'ii',
      'I',
    ])
    expect(walk[7]?.tones.map((tone) => tone.midi)).toEqual([72, 76, 79])
    expect(rangeOf(walk.flatMap((chord) => chord.tones.map((tone) => tone.midi)))).toEqual({
      from: 60,
      to: 79,
    })
  })
})
