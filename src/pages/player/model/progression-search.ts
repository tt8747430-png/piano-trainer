import {
  LEFT_FIGURES,
  playableFigure,
  playablePattern,
  RIGHT_FIGURES,
  type PatternFit,
} from '@/entities/pattern'
import { PROGRESSION, walkingFit, type ProgressionChoice } from '@/features/practice'
import { keyFromParam, parseNumerals, type KeyParam, type KeyWalk } from '@/shared/lib/music'
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
  Pick<SetupChange, 'chordSize' | 'walk'> & { readonly key?: KeyParam }

/** What a progression, as it is played, has for its patterns: no key's triads while it walks the keys. */
export const progressionFit = (walk: KeyWalk | null): PatternFit =>
  walkingFit(PROGRESSION.fit, walk)

/** The URL read: what it leaves out is the Player's own, and so is a pattern or figure it cannot play (From the chart, a tune). */
export function progressionChoice(
  search: Pick<
    ProgressionSearch,
    'p' | 'key' | 'pattern' | 'rh' | 'lh' | 'inversion' | 'chordSize' | 'walk'
  >,
): ProgressionChoice {
  const walk = search.walk ?? null
  const fit = progressionFit(walk)
  return {
    numerals: parseNumerals(search.p) ?? [],
    key: keyFromParam(search.key),
    pattern: playablePattern(search.pattern, PROGRESSION.pattern, fit),
    rh: playableFigure(search.rh, RIGHT_FIGURES, fit),
    lh: playableFigure(search.lh, LEFT_FIGURES, fit),
    inversion: search.inversion ?? null,
    chordSize: search.chordSize ?? PROGRESSION.chordSize,
    walk,
  }
}

/** A Setup change as the URL writes it: its own pattern or chord size left out. */
export function progressionPatch({
  key,
  ...change
}: ProgressionChange): Partial<ProgressionSearch> {
  return { ...ownLeftOut(change, PROGRESSION), ...(key ? { key } : {}) }
}
