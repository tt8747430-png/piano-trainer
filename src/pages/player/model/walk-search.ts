import {
  LEFT_FIGURES,
  playableFigure,
  playablePattern,
  RIGHT_FIGURES,
  type PatternBook,
} from '@/entities/pattern'
import { WALK, type WalkChoice } from '@/features/practice'
import { noteFromParam, type NoteParam, type ScaleKind } from '@/shared/lib/music'
import type { FigureChange, SetupChange, SetupParams } from '@/widgets/player-setup'
import type { PracticeView } from '@/widgets/practice-player'
import { ownLeftOut } from './own-left-out'

/** The walk's URL: its scale, how the Player goes, and the walk's own choices (absent is its own). */
export type WalkSearch = PracticeView & {
  readonly root: NoteParam
  readonly kind: ScaleKind
} & Omit<SetupParams, 'key' | 'walk'>

/** What the walk's Setup changes: its root, the pattern and figures, and the chord size. */
export type WalkChange = FigureChange &
  Pick<SetupChange, 'chordSize'> & { readonly root?: NoteParam }

/** The walk's URL read: what it leaves out is the walk's own, and so is a pattern or figure it cannot play (From the chart, a tune). */
export function walkChoice(
  search: Pick<WalkSearch, 'root' | 'kind' | 'pattern' | 'rh' | 'lh' | 'inversion' | 'chordSize'>,
  book: PatternBook,
): WalkChoice {
  return {
    root: noteFromParam(search.root),
    kind: search.kind,
    pattern: playablePattern(book, search.pattern, WALK.pattern, WALK.fit),
    rh: playableFigure(search.rh, RIGHT_FIGURES, WALK.fit),
    lh: playableFigure(search.lh, LEFT_FIGURES, WALK.fit),
    inversion: search.inversion ?? null,
    chordSize: search.chordSize ?? WALK.chordSize,
  }
}

/** A Setup change as the walk's URL writes it: its own pattern or chord size left out. */
export const walkPatch = (change: WalkChange): Partial<WalkSearch> => ownLeftOut(change, WALK)
