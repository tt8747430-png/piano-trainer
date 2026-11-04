import { SMUFL, type SmuflName } from './smufl'

/** The font's units to a staff space: an em is four. */
export const UNITS_PER_SPACE = 250

/** The figures of a number in a family of digit glyphs: 12 → timeSig1, timeSig2. */
export function figures(value: number, family: 'timeSig' | 'tuplet'): readonly SmuflName[] {
  return [...String(Math.trunc(Math.abs(value)))].map((digit) => `${family}${digit}` as SmuflName)
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
