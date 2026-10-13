import { transposeChord } from '@/shared/lib/arrangement'
import {
  keyParam,
  keysOfChords,
  noteFromParam,
  readInKey,
  writtenKey,
  type Chord,
  type ChordReading,
  type Key,
  type KeyReading,
} from '@/shared/lib/music'
import type { TransposeView } from './transpose-view'

/** How many of the keys found are offered to read the chords in. */
const OFFERED = 3

/** What Transpose shows for its chords: the keys offered, the key read in, the key played in, the chords there. */
export interface Transposition {
  /** The keys found first, and the one read in where the learner chose another. */
  readonly keys: readonly KeyReading[]
  readonly read: KeyReading
  readonly to: Key
  /** Each chord in the key played, with its numeral and whether it is in the key, as read in the read key. */
  readonly chords: readonly ChordReading[]
}

/**
 * A line of chords read in its key and played in another (ADR 0045): read in the key the view chose
 * where that key holds any of them, else in the key found first; played on the view's tonic in the
 * read key's mode, each chord moved by the interval between the tonics, its bass with it. Null where
 * no key holds any of them.
 */
export function transposition(
  chords: readonly Chord[],
  view: Omit<TransposeView, 'chords'>,
): Transposition | null {
  const found = keysOfChords(chords)
  const read = found.find((reading) => keyParam(reading.key) === view.key) ?? found[0]
  if (!read) return null
  const offered = found.slice(0, OFFERED)
  const to = view.to
    ? writtenKey({ tonic: noteFromParam(view.to), minor: read.key.minor })
    : read.key
  return {
    keys: offered.includes(read) ? offered : [...offered, read],
    read,
    to,
    chords: readInKey(chords, read.key).map((reading) => ({
      ...reading,
      chord: transposeChord(reading.chord, read.key.tonic, to.tonic),
    })),
  }
}
