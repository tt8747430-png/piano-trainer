import type { FoundChord } from './chord-finder'
import { noteName } from './note'
import { pitchClass, type Midi } from './pitch'

/**
 * How a chord's keys are laid out, as jazz pianists name it (ADR 0054): close within an octave, open
 * past it, drop 2 and drop 3 (a close voicing's second or third voice from the top an octave down),
 * a shell (root, 3rd and 7th alone), a stack of 4ths, or the So What voicing (three 4ths, a 3rd on top).
 */
export const VOICING_KINDS = [
  'quartal',
  'soWhat',
  'shell',
  'drop2',
  'drop3',
  'close',
  'open',
] as const
export type VoicingKind = (typeof VOICING_KINDS)[number]

const OCTAVE = 12
const FOURTH = 5
const MAJOR_THIRD = 4

const lowestFirst = (keys: readonly Midi[]): number[] => [...new Set(keys)].sort((a, b) => a - b)
const steps = (sorted: readonly number[]): number[] =>
  sorted.slice(1).map((key, i) => key - (sorted[i] ?? key))
const within = (sorted: readonly number[]) => (sorted.at(-1) ?? 0) - (sorted[0] ?? 0) < OCTAVE

/** A close voicing an octave apart at `at` from the top: the dropped voice, raised back, lands there. */
function dropped(sorted: readonly number[], fromTop: 2 | 3): boolean {
  const [lowest, ...rest] = sorted
  if (lowest === undefined || sorted.length !== 4) return false
  const raised = [...rest, lowest + OCTAVE].sort((a, b) => a - b)
  return within(raised) && raised.indexOf(lowest + OCTAVE) === raised.length - fromTop
}

/**
 * The layout of three keys or more, each pitch once; `found`, the chord they are read as, is needed
 * only for a shell. Undefined below three keys or where a key doubles another's pitch class.
 */
export function voicingKind(keys: readonly Midi[], found?: FoundChord): VoicingKind | undefined {
  const sorted = lowestFirst(keys)
  if (sorted.length < 3) return undefined
  if (new Set(sorted.map((key) => pitchClass(key))).size !== sorted.length) return undefined
  const gaps = steps(sorted)
  if (gaps.every((gap) => gap === FOURTH)) return 'quartal'
  if (
    gaps.length === 4 &&
    gaps.slice(0, 3).every((gap) => gap === FOURTH) &&
    gaps[3] === MAJOR_THIRD
  )
    return 'soWhat'
  if (found && isShell(sorted, found)) return 'shell'
  if (dropped(sorted, 2)) return 'drop2'
  if (dropped(sorted, 3)) return 'drop3'
  return within(sorted) ? 'close' : 'open'
}

/** Root, 3rd and 7th alone, the root lowest. */
function isShell(sorted: readonly number[], found: FoundChord): boolean {
  if (sorted.length !== 3 || found.bass) return false
  const roles = sorted.map(
    (key) => found.chord.tones.find((tone) => tone.pitchClass === pitchClass(key))?.role,
  )
  return roles[0] === 'root' && roles.includes('3rd') && roles.includes('7th')
}

/**
 * A dominant 7th with two altered tensions or more (♭5 or #5, ♭9, #9, #11, ♭13) and no natural 9th or
 * 13th, as a jazz chart writes it: `C7alt`. Undefined for any other chord.
 */
export function alteredSymbol(found: FoundChord): string | undefined {
  const { parts, chord } = found
  if (parts.size !== 7 || parts.seventh !== 'minor') return undefined
  if (parts.triad !== 'maj' && parts.triad !== 'aug') return undefined
  const altered = parts.alterations.length + (parts.triad === 'aug' ? 1 : 0)
  return altered >= 2 ? `${noteName(chord.root)}7alt` : undefined
}
