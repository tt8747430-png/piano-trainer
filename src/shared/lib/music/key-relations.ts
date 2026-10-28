import { keySignature, signatureKey, writtenKey, type Key } from './key'

/** The circle's length in fifths: twelve steps bring a key home. */
const CIRCLE = 12
/** The most sharps or flats a signature writes. */
const MOST = 7

/** The key on the same tonic in the other mode (C major's C minor), as a signature writes it. */
export const parallelKey = (key: Key): Key => writtenKey({ tonic: key.tonic, minor: !key.minor })

/**
 * The same key written the other way, where the circle's ends overlap (B major is C♭ major, F♯ is G♭,
 * D♭ is C♯): its signature twelve fifths round, still within seven. None for the others.
 */
export function enharmonicKey(key: Key): Key | undefined {
  const count = keySignature(key)
  const other = count > 0 ? count - CIRCLE : count + CIRCLE
  return Math.abs(other) <= MOST ? signatureKey(other, key.minor) : undefined
}

/** A signature's count round the circle, kept within seven sharps or flats. */
const onCircle = (count: number): number =>
  count > MOST ? count - CIRCLE : count < -MOST ? count + CIRCLE : count

/**
 * The keys beside a key on the circle, in its mode: its subdominant key (a flat more, a fifth below)
 * and its dominant key (a sharp more, a fifth above), its closest relations.
 */
export function neighbourKeys(key: Key): readonly [Key, Key] {
  const count = keySignature(key)
  return [
    signatureKey(onCircle(count - 1), key.minor),
    signatureKey(onCircle(count + 1), key.minor),
  ]
}

/** The names of a scale's seven degrees, from the tonic. */
export const DEGREE_NAMES = [
  'tonic',
  'supertonic',
  'mediant',
  'subdominant',
  'dominant',
  'submediant',
  'leadingTone',
  'subtonic',
] as const
export type DegreeName = (typeof DEGREE_NAMES)[number]

/**
 * A key's degrees by name: the seventh a semitone under the tonic is the leading tone; a natural minor
 * key's, a whole tone under it, the subtonic.
 */
export const degreeNames = (minor: boolean): readonly DegreeName[] => [
  ...DEGREE_NAMES.slice(0, 6),
  minor ? 'subtonic' : 'leadingTone',
]
