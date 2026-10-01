import { LEFT_FIGURES, playableFigure, playablePattern, RIGHT_FIGURES } from '@/entities/pattern'
import { PROGRESSION, type ProgressionChoice } from '@/features/practice'
import { keyFromParam, parseNumerals, type KeyParam } from '@/shared/lib/music'
import type { FigureChange, SetupChange, SetupParams } from '@/widgets/player-setup'
import type { PracticeView } from '@/widgets/practice-player'
import { ownLeftOut } from './own-left-out'

/** A progression's URL: its numerals and key, how the Player goes, and its own choices (absent is its own). */
export type ProgressionSearch = PracticeView & {
  /** Numerals as `numeralsParam` writes them: `ii-V-I`. */
  readonly p: string
  readonly key: KeyParam
} & Omit<SetupParams, 'key'>

/** What a progression's Setup changes: its key, the pattern and figures, and the chord size. */
export type ProgressionChange = FigureChange &
  Pick<SetupChange, 'chordSize'> & { readonly key?: KeyParam }

/** The URL read: what it leaves out is the Player's own, and so is a pattern or figure it cannot play (From the chart, a tune). */
export function progressionChoice(
  search: Pick<ProgressionSearch, 'p' | 'key' | 'pattern' | 'rh' | 'lh' | 'chordSize'>,
): ProgressionChoice {
  return {
    numerals: parseNumerals(search.p) ?? [],
    key: keyFromParam(search.key),
    pattern: playablePattern(search.pattern, PROGRESSION.pattern, PROGRESSION.fit),
    rh: playableFigure(search.rh, RIGHT_FIGURES, PROGRESSION.fit),
    lh: playableFigure(search.lh, LEFT_FIGURES, PROGRESSION.fit),
    chordSize: search.chordSize ?? PROGRESSION.chordSize,
  }
}

/** A Setup change as the URL writes it: its own pattern or chord size left out. */
export function progressionPatch({
  key,
  ...change
}: ProgressionChange): Partial<ProgressionSearch> {
  return { ...ownLeftOut(change, PROGRESSION), ...(key ? { key } : {}) }
}
