import type { Ref } from 'react'
import type { Tick } from '@/shared/lib/music'
import { noteBox, ScoreMark, type ScoreLayout } from '@/shared/ui/score'

/**
 * The cursor: the beat group now, marked as the one selection marks a note (ADR 0082), the editor's
 * caret alike: a padded box round its column on every staff, moved as it moves.
 */
export function SheetCursor({
  tick,
  layout,
  ref,
}: {
  tick: Tick
  layout: ScoreLayout
  ref: Ref<HTMLDivElement>
}) {
  const span = { top: layout.staffTop, bottom: layout.staffBottom }
  return <ScoreMark ref={ref} slot="cursor" kind="note" box={noteBox(layout, tick, span)} />
}
