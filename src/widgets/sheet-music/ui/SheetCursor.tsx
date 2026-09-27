import type { Ref } from 'react'
import type { ScoreLayout } from '@/shared/ui/score'

/** How far left of a notehead's edge the cursor's band starts, and how far it reaches past the staff. */
const LEAD = 8
const REACH = 16

/** The cursor: a sky-mist band behind the notes of the beat group now, moved as they move. */
export function SheetCursor({
  x,
  layout,
  ref,
}: {
  x: number
  layout: ScoreLayout
  ref: Ref<HTMLDivElement>
}) {
  return (
    <div
      ref={ref}
      aria-hidden
      className="absolute left-0 z-0 w-7 rounded-md bg-secondary transition-transform duration-200 ease-out"
      style={{
        top: layout.staffTop - REACH,
        height: layout.staffBottom - layout.staffTop + 2 * REACH,
        transform: `translateX(${x - LEAD}px)`,
      }}
    />
  )
}
