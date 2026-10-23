import type { Ref } from 'react'
import type { Tick } from '@/shared/lib/music'
import { noteMark, ScoreMark, type Picked, type ScoreLayout } from '@/shared/ui/score'

/**
 * The cursor: the beat group now, marked as the one selection marks a note (ADR 0082, 0088), the
 * editor's caret alike: a box hugging its heads on every staff, moved as it moves; the note or chord
 * clicked to put it there, that alone.
 */
export function SheetCursor({
  tick,
  picked,
  layout,
  ref,
}: {
  tick: Tick
  /** What a click chose here: one head, or a chord on one staff. */
  picked?: Picked | null | undefined
  layout: ScoreLayout
  ref: Ref<HTMLDivElement>
}) {
  const span = { top: layout.staffTop, bottom: layout.staffBottom }
  const chosen = picked
    ? { staves: [picked.staff], from: picked.tick, to: picked.tick + 1, midi: picked.midi }
    : { from: tick, to: tick + 1 }
  return <ScoreMark ref={ref} slot="cursor" kind="note" box={noteMark(layout, chosen, span)} />
}
