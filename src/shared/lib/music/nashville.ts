import { qualitySuffix, type Chord } from './chord'
import type { Key } from './key'
import { letterIndex, pitchClassOf, type SpelledNote } from './note'

/** The major scale's semitones over its tonic, degree by degree. */
const MAJOR = [0, 2, 4, 5, 7, 9, 11] as const

const SUPERSCRIPTS: Readonly<Record<string, string>> = {
  '0': '⁰',
  '1': '¹',
  '2': '²',
  '3': '³',
  '4': '⁴',
  '5': '⁵',
  '6': '⁶',
  '7': '⁷',
  '8': '⁸',
  '9': '⁹',
}

/**
 * A note as its number from the tonic: its letter's step over the tonic's, flattened or sharpened by
 * how far it lies from the tonic's major scale (A♭ in C is ♭6, E♭ in A minor ♭3).
 */
function degreeNumber(spelled: SpelledNote, tonic: SpelledNote): string {
  const step = (letterIndex(spelled.letter) - letterIndex(tonic.letter) + 7) % 7
  const semitones = (pitchClassOf(spelled) - pitchClassOf(tonic) + 12) % 12
  const off = ((semitones - (MAJOR[step] ?? 0) + 18) % 12) - 6
  const sign = off < 0 ? '♭'.repeat(-off) : '♯'.repeat(off)
  return sign + String(step + 1)
}

/** A chord's suffix as the number system writes it: the quality's letters, its figures raised. */
const raisedSuffix = (chord: Chord): string =>
  qualitySuffix(chord.quality)
    .replace(/^Maj/, 'maj')
    .replace(/\d/g, (digit) => SUPERSCRIPTS[digit] ?? digit)

/**
 * A chord as the Nashville number system writes it in a key: its root's number from the tonic (`1`,
 * `♭7`), the tonic's major scale counting in a minor key too (`1m ♭3 4m 5`), then its quality with its
 * figures raised (`2m⁷`, `5⁷`), and a bass by its number after a slash (`1/3`).
 */
export function nashvilleNumber(chord: Chord, key: Key): string {
  const own = degreeNumber(chord.root, key.tonic) + raisedSuffix(chord)
  return chord.bass ? `${own}/${degreeNumber(chord.bass, key.tonic)}` : own
}
