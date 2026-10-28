import type { Key } from './key'
import type { SpelledNote } from './note'
import { numeralOf, numeralGrows, type Numeral } from './numerals'
import { scaleChordAt } from './scale-chord'

/**
 * The church modes a progression can be read in besides major and minor (Ionian and Aeolian), as a
 * progression player's Mode lists them, brightest first after the major key's.
 */
export const CHURCH_MODES = ['lydian', 'mixolydian', 'dorian', 'phrygian', 'locrian'] as const
export type ChurchMode = (typeof CHURCH_MODES)[number]

/** The modes with a minor 3rd over their tonic: read against the minor key on it. */
const MINOR_MODES: ReadonlySet<ChurchMode> = new Set(['dorian', 'phrygian', 'locrian'])

/**
 * The key a mode on `tonic` is written against: the major key of the same tonic for a mode with a major
 * 3rd (Lydian, Mixolydian), the minor key for one with a minor 3rd. Its numerals are that key's, the
 * mode's own notes written as its chromatic ones (Mixolydian's ♭VII, Phrygian's ♭II).
 */
export const modeKey = (tonic: SpelledNote, mode: ChurchMode): Key => ({
  tonic,
  minor: MINOR_MODES.has(mode),
})

/**
 * A line of numerals re-read in a mode, as a progression player's Mode does: each plain degree (a
 * triad with no ♭ or ♯, no applied slash) becomes the mode's own chord on that degree, written against
 * the mode's key (`modeKey`): I IV V in Dorian is i IV v, in Mixolydian I IV v, and VII in Mixolydian
 * ♭VII. A chromatic, applied or written-out chord (♭VI, V7/V, V7) is kept as written; a bass stays.
 */
export function readInMode(numerals: readonly Numeral[], key: Key, mode: ChurchMode): Numeral[] {
  return numerals.map((numeral) => {
    if (numeral.shift !== 0 || numeral.of || !numeralGrows(numeral)) return numeral
    const own = numeralOf(scaleChordAt(key.tonic, mode, numeral.degree, 3), key)
    if (!own) return numeral
    return numeral.bass ? { ...own, bass: numeral.bass } : own
  })
}
