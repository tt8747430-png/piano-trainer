import { describe, expect, it } from 'vitest'
import { spellChord, type ChordQuality } from './chord'
import { buildChord, CHORD_PARTS, type ChordParts } from './chord-parts'
import { rangeOf } from './keyboard'
import { note, type SpelledNote } from './note'
import {
  chordInversions,
  fitChordInversion,
  fitInversion,
  lastInversion,
  placeBorrowedChords,
  placeChord,
  placeScale,
  placeScaleChords,
  TWO_HANDS_FROM,
  walkChords,
} from './place'
import { CHORD_NOTES } from './scale-chord'
import type { Tone } from './tone'

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

describe('placeChord, two hands from five notes', () => {
  const built = (parts: Partial<ChordParts>) =>
    buildChord(note('C'), {
      triad: 'maj',
      size: 5,
      seventh: 'minor',
      added: [],
      alterations: [],
      ...parts,
    }).tones
  const hands = (chord: readonly Tone[], inversion = 0) => {
    const placed = placeChord(chord, { inversion, bothHands: true })
    return [keys(placed.lh), keys(placed.rh)]
  }
  const span = (placed: readonly { midi: number }[]) =>
    Math.max(...keys(placed)) - Math.min(...keys(placed))

  it('leaves a 9th chord’s root to the left hand, its 3rd, 5th, 7th and 9th to the right', () => {
    // C9: C3 · E4 G4 B♭4 D5; C7♭9: C3 · E4 G4 B♭4 D♭5.
    expect(hands(built({ size: 9 }))).toEqual([[48], [64, 67, 70, 74]])
    expect(hands(built({ size: 9, alterations: ['b9'] }))).toEqual([[48], [64, 67, 70, 73]])
  })

  it('gives the left hand the 5th too from six notes, the right hand the rest inside an octave', () => {
    // Cm11: C3 G3 · E♭4 F4 B♭4 D5; C13 (no 11th over its major 3rd): C3 G3 · E4 A4 B♭4 D5.
    expect(hands(built({ triad: 'min', size: 11 }))).toEqual([
      [48, 55],
      [63, 65, 70, 74],
    ])
    expect(hands(built({ size: 13 }))).toEqual([
      [48, 55],
      [64, 69, 70, 74],
    ])
  })

  it('turns the right hand to start from the 7th, an octave down, in the 3rd inversion', () => {
    // C9: C3 · B♭3 D4 E4 G4; C13: C3 G3 · B♭3 D4 E4 A4; a 6/9 turns from its 6th: C3 · A3 D4 E4 G4.
    expect(hands(built({ size: 9 }), 3)).toEqual([[48], [58, 62, 64, 67]])
    expect(hands(built({ size: 13 }), 3)).toEqual([
      [48, 55],
      [58, 62, 64, 69],
    ])
    expect(hands(built({ added: ['add6', 'add9'] }), 3)).toEqual([[48], [57, 62, 64, 67]])
  })

  it('offers a chord of five notes or more root position and, where its right hand has a 7th or 6th, the 3rd inversion', () => {
    expect(chordInversions(built({}))).toEqual([0, 1, 2])
    expect(chordInversions(built({ size: 7 }))).toEqual([0, 1, 2, 3])
    expect(chordInversions(built({ size: 9 }))).toEqual([0, 3])
    expect(chordInversions(built({ added: ['add6', 'add9'] }))).toEqual([0, 3])
    expect(() => placeChord(built({ size: 9 }), { inversion: 1, bothHands: true })).toThrow(
      RangeError,
    )
  })

  it('fits an inversion to the nearest the chord has at or under it', () => {
    expect(fitChordInversion(3, built({}))).toBe(2)
    expect(fitChordInversion(2, built({ size: 9 }))).toBe(0)
    expect(fitChordInversion(3, built({ size: 9 }))).toBe(3)
  })

  it('holds every tone of every chord of five notes or more once, each hand within its reach', () => {
    for (const parts of CHORD_PARTS) {
      const chord = buildChord(note('C'), parts)
      if (chord.tones.length < TWO_HANDS_FROM) continue
      for (const inversion of chordInversions(chord.tones)) {
        const placed = placeChord(chord.tones, { inversion, bothHands: true })
        const name = `C${chord.suffix} ${inversion}`
        expect([...placed.lh, ...placed.rh].map((each) => each.tone.degree).sort(), name).toEqual(
          chord.tones.map((tone) => tone.degree).sort(),
        )
        expect(placed.rh.length, name).toBeLessThanOrEqual(5)
        // Inside an octave: a major 7th at most; the left hand under the right.
        expect(span(placed.rh), name).toBeLessThanOrEqual(11)
        expect(span(placed.lh), name).toBeLessThanOrEqual(11)
        expect(Math.max(...keys(placed.lh)), name).toBeLessThan(Math.min(...keys(placed.rh)))
      }
    }
  })

  it('keeps the whole stack in one hand for a caller that spells the chord', () => {
    const placed = placeChord(built({ size: 9 }), { inversion: 0, bothHands: false })
    expect(keys(placed.rh)).toEqual([60, 64, 67, 70, 74])
    expect(placed.lh).toEqual([])
  })
})

describe('lastInversion', () => {
  it('offers as many inversions as the chord has tones after its root, at most three', () => {
    expect(lastInversion(3)).toBe(2)
    expect(lastInversion(4)).toBe(3)
    expect(CHORD_NOTES.map(lastInversion)).toEqual([2, 3, 3, 3, 3])
  })
})

describe('fitInversion', () => {
  it('keeps an inversion the chord has, else takes its last', () => {
    expect(fitInversion(1, 3)).toBe(1)
    expect(fitInversion(3, 3)).toBe(2)
    expect(fitInversion(3, 4)).toBe(3)
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
