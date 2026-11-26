import { SMUFL, type SmuflName } from './smufl'

/** The font's units to a staff space: an em is four. */
export const UNITS_PER_SPACE = 250

/** Each family's digit glyphs, 0 to 9. */
const DIGITS = {
  timeSig: [
    'timeSig0',
    'timeSig1',
    'timeSig2',
    'timeSig3',
    'timeSig4',
    'timeSig5',
    'timeSig6',
    'timeSig7',
    'timeSig8',
    'timeSig9',
  ],
  tuplet: [
    'tuplet0',
    'tuplet1',
    'tuplet2',
    'tuplet3',
    'tuplet4',
    'tuplet5',
    'tuplet6',
    'tuplet7',
    'tuplet8',
    'tuplet9',
  ],
} as const satisfies Record<string, readonly SmuflName[]>

/** The figures of a number in a family of digit glyphs: 12 → timeSig1, timeSig2. */
export function figures(value: number, family: keyof typeof DIGITS): readonly SmuflName[] {
  return [...String(Math.trunc(Math.abs(value)))].flatMap(
    (digit) => DIGITS[family][Number(digit)] ?? [],
  )
}

/**
 * How far a run's ink reaches from its origin, in the font's units: its first glyph's left, its
 * last's right.
 */
export function runInk(names: readonly SmuflName[]): readonly [number, number] {
  const first = names[0]
  const last = names.at(-1)
  if (!first || !last) return [0, 0]
  const before = names.slice(0, -1).reduce((sum, name) => sum + SMUFL[name].advance, 0)
  return [SMUFL[first].box[0], before + SMUFL[last].box[2]]
}

/** Where each glyph of a run starts, in the font's units from the run's origin. */
export const runOrigins = (names: readonly SmuflName[]): readonly number[] =>
  names.map((_, at) => names.slice(0, at).reduce((sum, name) => sum + SMUFL[name].advance, 0))
