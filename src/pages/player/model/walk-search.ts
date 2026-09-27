import { WALK, type WalkChoice } from '@/features/practice'
import { noteFromParam, type NoteParam, type ScaleKind } from '@/shared/lib/music'
import type { FigureChange, SetupChange, SetupParams } from '@/widgets/player-setup'
import type { PracticeView } from '@/widgets/practice-player'

/** The walk's URL: its scale, how the Player goes, and the walk's own choices (absent is its own). */
export type WalkSearch = PracticeView & {
  readonly root: NoteParam
  readonly kind: ScaleKind
} & Omit<SetupParams, 'key'>

/** What the walk's Setup changes: the pattern and figures, and the chord size. */
export type WalkChange = FigureChange & Pick<SetupChange, 'chordSize'>

/** The walk's URL read: what it leaves out is the walk's own; its chart names no methods, so From the chart is its own pattern. */
export function walkChoice(
  search: Pick<WalkSearch, 'root' | 'kind' | 'pattern' | 'rh' | 'lh' | 'chordSize'>,
): WalkChoice {
  return {
    root: noteFromParam(search.root),
    kind: search.kind,
    pattern:
      search.pattern === undefined || search.pattern === 'chart' ? WALK.pattern : search.pattern,
    rh: search.rh ?? null,
    lh: search.lh ?? null,
    chordSize: search.chordSize ?? WALK.chordSize,
  }
}

/** A Setup change as the walk's URL writes it: its own pattern or chord size left out. */
export function walkPatch(change: WalkChange): Partial<WalkSearch> {
  return {
    ...change,
    ...('pattern' in change
      ? { pattern: change.pattern === WALK.pattern ? undefined : change.pattern }
      : {}),
    ...('chordSize' in change
      ? { chordSize: change.chordSize === WALK.chordSize ? undefined : change.chordSize }
      : {}),
  }
}
