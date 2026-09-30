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

/** What a progression's Setup changes: the pattern and figures, and the chord size. */
export type ProgressionChange = FigureChange & Pick<SetupChange, 'chordSize'>

/** The URL read: what it leaves out is the Player's own; its chart names no methods, so From the chart is its own pattern. */
export function progressionChoice(
  search: Pick<ProgressionSearch, 'p' | 'key' | 'pattern' | 'rh' | 'lh' | 'chordSize'>,
): ProgressionChoice {
  return {
    numerals: parseNumerals(search.p) ?? [],
    key: keyFromParam(search.key),
    pattern:
      search.pattern === undefined || search.pattern === 'chart'
        ? PROGRESSION.pattern
        : search.pattern,
    rh: search.rh ?? null,
    lh: search.lh ?? null,
    chordSize: search.chordSize ?? PROGRESSION.chordSize,
  }
}

/** A Setup change as the URL writes it: its own pattern or chord size left out. */
export const progressionPatch = (change: ProgressionChange): Partial<ProgressionSearch> =>
  ownLeftOut(change, PROGRESSION)
