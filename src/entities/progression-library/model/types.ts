import type { PatternId } from '@/entities/pattern'
import type { LocalText } from '@/shared/i18n'
import type { ChordSize } from '@/shared/lib/music'

/** The styles the Progressions library groups its progressions by (roadmap §10.1). */
export const PROGRESSION_STYLES = [
  'pop',
  'rock',
  'jazz',
  'blues',
  'classical',
  'soul',
  'latin',
  'gospel',
  'minor',
  'theory',
] as const
export type ProgressionStyle = (typeof PROGRESSION_STYLES)[number]

/**
 * A named progression in Roman numerals, read in any key: the one model of a progression that is
 * practised. A line of numerals names one progression in its mode, so the page knows which is shown.
 */
export interface LibraryProgression {
  readonly id: string
  readonly style: ProgressionStyle
  readonly name: LocalText
  /** As `parseNumerals` reads them: `I V vi IV`. */
  readonly numerals: string
  /** Written in a minor key, counted from natural minor. */
  readonly minor: boolean
  /** What it teaches, in a line. */
  readonly note?: LocalText
  /** The pattern its Player opens with, where it has one of its own. */
  readonly pattern?: PatternId
  /** The chord size it opens at, where triads would lose what it teaches. */
  readonly size?: ChordSize
}
