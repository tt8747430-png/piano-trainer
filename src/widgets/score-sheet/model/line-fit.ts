import { staffHeight } from '@/shared/ui/score'

/** A section's heading over its first line, the labels' row over each line, in CSS px. */
const HEADING = 52
const LABELS = 44
/** The room a tempo mark over a line's first bar takes above its top staff, in VexFlow units. */
const TEMPO_ROOM = 32
/** How small a line is drawn to fit a short sheet: smaller, it is not read. */
const LEAST_FIT = 0.6

/**
 * The size a line is drawn at so a whole system is in sight in the sheet's height (a phone on its
 * side): its section's heading where the view has headings, its labels' row, a tempo mark and its
 * staves; at most its own size, never under `LEAST_FIT`.
 */
export function lineFit({
  room,
  staves,
  headed,
}: {
  room: number
  staves: number
  headed: boolean
}): number {
  const system = staffHeight(undefined, staves) + TEMPO_ROOM
  const left = room - LABELS - (headed ? HEADING : 0)
  return Math.min(1, Math.max(LEAST_FIT, left / system))
}
