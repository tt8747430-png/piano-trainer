import type { Chord, ChordQuality } from './chord'
import { CIRCLE_OF_FIFTHS } from './circle'
import type { Key } from './key'
import { pitchClassOf, type SpelledNote } from './note'
import { numeralOf, type Numeral } from './numerals'
import { chordInKey } from './passing-chords'
import { spellInKey } from './scale'

/** A key that holds a chord: the chord as the key spells it, and its numeral there. */
export interface KeyHolding {
  readonly key: Key
  readonly chord: Chord
  readonly numeral: Numeral
}

/** Every key, as the circle of fifths spells it: the majors, then the minors, each from C and A. */
const KEYS: readonly Key[] = [
  ...CIRCLE_OF_FIFTHS.map((place) => place.major),
  ...CIRCLE_OF_FIFTHS.map((place) => place.minor),
]

/**
 * The keys that hold a chord: spelled from its root as each key spells that note, every note of it
 * the key's (a minor key's raised 6th and 7th included, as `chordInKey` reads a key, so D–F–A is not
 * F♯ minor's though its E♯ sounds as F). Each with the chord as the key spells it and its numeral:
 * the majors first, then the minors, each in the circle's order.
 */
export function keysHolding(root: SpelledNote, quality: ChordQuality): KeyHolding[] {
  return KEYS.flatMap((key) => {
    const chord: Chord = { root: spellInKey(pitchClassOf(root), key), quality }
    const numeral = chordInKey(chord, key) ? numeralOf(chord, key) : null
    return numeral ? [{ key, chord, numeral }] : []
  })
}
