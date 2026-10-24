import { staffHeight } from '@/shared/ui/score'
import { labelRow } from './label-row'

/** A section's heading over its first line, in CSS px. */
export const HEADING = 52
/** The room a tempo mark over a line's first bar takes above its top staff, in the engraving's units. */
const TEMPO_ROOM = 32
/** How small a line is drawn to fit a short sheet: smaller, it is not read. */
const LEAST_FIT = 0.6

/**
 * The size a line is drawn at so a whole system is in sight in the sheet's height (a phone on its
 * side): its section's heading where the view has headings, its labels' row, a tempo mark, its
 * staves and the verses under the tune; at most its own size, never under `LEAST_FIT`.
 */
export function lineFit({
  room,
  staves,
  headed,
  chordNames = true,
  verses = 0,
}: {
  room: number
  staves: number
  headed: boolean
  /** Whether the line has its chord row over it. */
  chordNames?: boolean
  /** The verses of words under the tune's staff (ADR 0093). */
  verses?: number
}): number {
  const system = staffHeight(undefined, staves, verses) + TEMPO_ROOM
  // The labels' row over each line is the chord row's height.
  const left = room - labelRow(chordNames) - (headed ? HEADING : 0)
  return Math.min(1, Math.max(LEAST_FIT, left / system))
}
