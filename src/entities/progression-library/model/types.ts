import type { PatternId } from '@/entities/pattern'
import type { LocalText } from '@/shared/i18n'
import type { ChordSize } from '@/shared/lib/music'

/** The styles the Progressions library groups its progressions by. */
export const PROGRESSION_STYLES = [
  'pop',
  'rock',
  'jazz',
  'blues',
  'classical',
  'soul',
  'gospel',
  'theory',
] as const
export type ProgressionStyle = (typeof PROGRESSION_STYLES)[number]

/**
 * A progression's lines of numerals as `parseNumerals` reads them, one for each mode it has (ADR 0112):
 * a major key's (`I V vi IV`), a minor key's counted from natural minor (`i VI III VII`), or both.
 */
export type ModeLines =
  | { readonly major: string; readonly minor?: string }
  | { readonly major?: undefined; readonly minor: string }

/**
 * A named progression in Roman numerals, read in any key: the one model of a progression that is
 * practised, one idea with its line in each mode it has, so the key's Major · Minor shows the other.
 */
export type LibraryProgression = ModeLines & {
  readonly id: string
  readonly style: ProgressionStyle
  readonly name: LocalText
  /** What it teaches, in a line. */
  readonly note?: LocalText
  /** The pattern its Player opens with, where it has one of its own. */
  readonly pattern?: PatternId
  /** The chord size it opens at, where triads would lose what it teaches. */
  readonly size?: ChordSize
}
