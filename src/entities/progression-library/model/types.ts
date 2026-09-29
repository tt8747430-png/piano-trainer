import type { LocalText } from '@/shared/i18n'

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

/** A named progression in Roman numerals, read in any key by the Progressions tool. */
export interface LibraryProgression {
  readonly id: string
  readonly style: ProgressionStyle
  readonly name: LocalText
  /** As `parseNumerals` reads them: `I V vi IV`. */
  readonly numerals: string
  /** Written in a minor key, counted from natural minor. */
  readonly minor: boolean
}
