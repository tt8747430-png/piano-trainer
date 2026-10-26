import { labelRow, staffHeight } from '@/shared/ui/score'

/** The room a tempo mark over a line's first bar takes above its top staff, in the engraving's units. */
const TEMPO_ROOM = 32
/**
 * How small a line is drawn to fit a short sheet, as small as the Player's draws it: its whole system
 * in sight over the keys out on a phone on its side; smaller, it is not read.
 */
const LEAST_FIT = 0.4

/**
 * The size a line is drawn at so a whole system is in sight in the sheet's height (a phone on its
 * side): its labels' row (a section's name in it, ADR 0095), a tempo mark, its staves and the verses
 * under the tune, or the line as engraved where it is known (`natural`: a line across, whose notes
 * anywhere in the piece reach over or under its staves); at most its own size, never under
 * `LEAST_FIT`.
 */
export function lineFit({
  room,
  staves,
  chordNames = true,
  verses = 0,
  natural,
}: {
  room: number
  staves: number
  /** Whether the line has its chord row over it. */
  chordNames?: boolean
  /** The verses of words under the staff that sings them (ADR 0093). */
  verses?: number
  /** The line's height as engraved, at its own size, where it is known. */
  natural?: number | undefined
}): number {
  const system = natural ?? staffHeight(undefined, staves, verses) + TEMPO_ROOM
  // The labels' row over each line is the chord row's height.
  const left = room - labelRow(chordNames)
  return Math.min(1, Math.max(LEAST_FIT, left / system))
}
