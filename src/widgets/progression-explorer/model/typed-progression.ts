import {
  chordsOfLine,
  keyParam,
  keysOfChords,
  numeralsParam,
  parseNumerals,
  readInKey,
  type Key,
  type KeyParam,
  type Numeral,
} from '@/shared/lib/music'

/** A typed line as Progressions plays it: its numerals, in the key they are read in. */
export interface TypedProgression {
  readonly numerals: readonly Numeral[]
  readonly key: Key
}

/** How many chords a typed line needs before it may move the key: a chord or two says too little. */
const TO_MOVE_KEY = 3

/**
 * What a learner typed (ADR 0052): numerals as written, in the key shown; or a song's chords (`Am F
 * C G`, `Dm7 Gm9 Asus4`) as their numerals, an applied dominant by the chord it leads to. Chords are
 * read in the key shown until a line of three or more is held better by another key: then in the key
 * they are most likely in, so the key holds still while the first chords are typed. Null while any
 * part cannot be read or written as a numeral.
 */
export function readProgression(text: string, key: Key): TypedProgression | null {
  const numerals = parseNumerals(text)
  if (numerals) return { numerals, key }
  const chords = chordsOfLine(text)
  if (!chords) return null
  const found = keysOfChords(chords)
  const [best] = found
  const shown = found.find((reading) => keyParam(reading.key) === keyParam(key))
  const moves =
    best !== undefined &&
    chords.length >= TO_MOVE_KEY &&
    best.held > (shown?.held ?? 0) &&
    (shown?.held ?? 0) < chords.length
  const readIn = moves ? best.key : key
  const read = readInKey(chords, readIn).map((reading) => reading.numeral)
  return read.every((numeral): numeral is Numeral => numeral !== null)
    ? { numerals: read, key: readIn }
    : null
}

/**
 * Progressions' URL for a typed line (a lesson's song, Search's chords): its numerals and the key they
 * are read in, starting from `key`; null for a line that does not read.
 */
export function typedSearch(text: string, key: Key): { key: KeyParam; p: string } | null {
  const read = readProgression(text, key)
  return read && { key: keyParam(read.key), p: numeralsParam(read.numerals) }
}
