import { chordBass, qualityIntervals, type Chord, type ChordQuality } from './chord'
import { CIRCLE_OF_FIFTHS } from './circle'
import { isWrittenKey, keySignature, type Key } from './key'
import { pitchClassOf } from './note'
import { hasMinorThird, numeralBass, numeralOf, type Numeral } from './numerals'
import { chordInKey } from './passing-chords'
import { pitchClass } from './pitch'
import { spellInKey } from './scale'

/** A key a line of chords may be in: how many of them it holds, and how likely it is. */
export interface KeyReading {
  readonly key: Key
  /** The chords all of whose notes are the key's. */
  readonly held: number
  readonly score: number
}

/** A chord read in a key: spelled as the key spells it, its numeral there, and whether its notes are all the key's. */
export interface ChordReading {
  readonly chord: Chord
  readonly numeral: Numeral | null
  readonly inKey: boolean
}

/** Every key, as the circle of fifths spells it: the majors, then the minors, each from C. */
const KEYS: readonly Key[] = [
  ...CIRCLE_OF_FIFTHS.map((place) => place.major),
  ...CIRCLE_OF_FIFTHS.map((place) => place.minor),
]

const hasInterval = (quality: ChordQuality, steps: number, semitones: number): boolean =>
  qualityIntervals(quality).some((each) => each.steps === steps && each.semitones === semitones)

/** A chord that can be a dominant: a major 3rd, and a minor 7th or none (G, G7, G7♭9, G13, G7alt). */
const isDominant = (quality: ChordQuality): boolean =>
  hasInterval(quality, 2, 4) && (quality === 'maj' || hasInterval(quality, 6, 10))

/** Whether a chord is the key's tonic chord: on its tonic, with the key's 3rd and a perfect 5th. */
const isTonic = (chord: Chord | undefined, key: Key): boolean =>
  chord !== undefined &&
  pitchClassOf(chord.root) === pitchClassOf(key.tonic) &&
  hasInterval(chord.quality, 2, key.minor ? 3 : 4) &&
  hasInterval(chord.quality, 4, 7)

/**
 * A chord spelled as the key spells its root and bass, where that makes every note of it the key's
 * (`A#` in D minor is B♭); any other chord as it was typed (`B♭` in G stays B♭, its ♭III).
 */
function spelledIn(chord: Chord, key: Key): Chord {
  const root = spellInKey(pitchClassOf(chord.root), key)
  const respelled: Chord = chord.bass
    ? {
        root,
        quality: chord.quality,
        bass: chordBass(root, chord.quality, spellInKey(pitchClassOf(chord.bass), key)),
      }
    : { root, quality: chord.quality }
  return chordInKey(respelled, key) ? respelled : chord
}

/**
 * The dominant a chord out of the key is of the chord after it, where it leads there a 5th down to a
 * degree of the key that is not its tonic (`V7/ii`: A7 into Dm in C); null for any other chord.
 */
function appliedNumeral(chord: Chord, next: Chord | undefined, key: Key): Numeral | null {
  if (!next || !isDominant(chord.quality)) return null
  if (pitchClass(pitchClassOf(chord.root) + 5) !== pitchClassOf(next.root)) return null
  const target = numeralOf(next, key)
  if (!target || (target.degree === 0 && target.shift === 0)) return null
  const bass = numeralBass(chord)
  return {
    degree: 4,
    shift: 0,
    quality: chord.quality,
    ...(bass ? { bass } : {}),
    of: { degree: target.degree, shift: target.shift, minor: hasMinorThird(next.quality) },
  }
}

/**
 * A line of chords read in a key, each spelled as the key spells it: its numeral there, an applied
 * dominant by the chord it leads to (`V/iv`), any other chord out of the key by its root's degree
 * (D in D minor is I); and whether its notes are all the key's (a minor key's raised 6th and 7th
 * among them, as `chordInKey` reads a key).
 */
export function readInKey(chords: readonly Chord[], key: Key): ChordReading[] {
  const spelled = chords.map((chord) => spelledIn(chord, key))
  return spelled.map((chord, place) => {
    const inKey = chordInKey(chord, key)
    const applied = inKey ? null : appliedNumeral(chord, spelled[place + 1], key)
    return { chord, numeral: applied ?? numeralOf(chord, key), inKey }
  })
}

/** A key with its tonic spelled as the chords spell it, where a signature writes that spelling. */
function spelledAsTyped(key: Key, chords: readonly Chord[]): Key {
  const tonic = chords.find((chord) => pitchClassOf(chord.root) === pitchClassOf(key.tonic))?.root
  const typed = tonic && { tonic, minor: key.minor }
  return typed && isWrittenKey(typed) ? typed : key
}

/**
 * The keys a line of chords may be in, most likely first, as a song's key is found from its chords
 * (Gorshkov's lesson 3): each key scores two for each chord it holds, one where its tonic chord opens
 * the line and two where it closes it, and one for each chord out of it that leads as a dominant to
 * the next. Ties go to the key nearest C on the circle, then to major. Only keys that hold a chord
 * are listed, each spelled as the chords spell its tonic.
 */
export function keysOfChords(chords: readonly Chord[]): KeyReading[] {
  return KEYS.flatMap((circleKey) => {
    const key = spelledAsTyped(circleKey, chords)
    const read = readInKey(chords, key)
    const held = read.filter((reading) => reading.inKey).length
    if (held === 0) return []
    const applied = read.filter((reading) => reading.numeral?.of).length
    const score =
      2 * held + (isTonic(chords[0], key) ? 1 : 0) + (isTonic(chords.at(-1), key) ? 2 : 0) + applied
    return [{ key, held, score }]
  }).sort(
    (a, b) =>
      b.score - a.score ||
      Math.abs(keySignature(a.key)) - Math.abs(keySignature(b.key)) ||
      Number(a.key.minor) - Number(b.key.minor),
  )
}
