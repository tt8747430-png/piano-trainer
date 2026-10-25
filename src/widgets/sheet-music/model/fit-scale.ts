import type { StaffId } from '@/shared/lib/notation'
import type { ScoreLayout } from '@/shared/ui/score'

/** The room fingers take under and over the staff, in CSS px. */
export const FINGERS = 36
/**
 * How far the Player's staff may shrink and grow to fit its room (spec §2.8): on a phone on its side
 * its whole system stays in sight over the keys, small.
 */
export const SHEET_SCALE = { min: 0.4, max: 1.6 } as const
/** The width, in px at scale 1, of a bar of a busy line: a staff whose bars are not known yet grows by it. */
const BUSY_BAR = 360

/**
 * The scale at which a staff `natural` tall fills a room under its labels' row (`row`, as tall at a
 * scale as its labels are drawn there), within `SHEET_SCALE`: the music grows where the screen has
 * height and width to spare (a laptop, a phone upright), so two of its bars (`bar` wide at scale 1,
 * else a busy line's) still show, and shrinks where it has little height (a phone on its side). A
 * room not measured yet (no width) engraves at 1.
 */
export function fitScale(
  room: { width: number; height: number },
  natural: number,
  bar: number = BUSY_BAR,
  row: (scale: number) => number = () => 0,
): number {
  if (room.width <= 0 || natural <= 0) return 1
  const most = Math.min(SHEET_SCALE.max, Math.max(1, room.width / (2 * bar)))
  // The row grows with the staff, less than it does: a few steps find the size that fills the room,
  // stepping either side of it; the smaller of the last two fits.
  let scale = room.height / natural
  let before = scale
  for (let step = 0; step < 6; step++) {
    before = scale
    scale = (room.height - row(scale)) / natural
  }
  return Math.min(most, Math.max(SHEET_SCALE.min, Math.min(scale, before)))
}

/**
 * The size a line down the screen is drawn at so its whole system, the labels' row over it, is in
 * sight in a short sheet's `room` (a phone on its side), as the editor's lines are: at most `most`
 * (the size the sheet's width gives), never under a panorama's least. A sheet not measured yet keeps
 * `most`.
 */
export function systemFit({
  room,
  natural,
  labels,
  most = 1,
}: {
  /** The sheet's height, in CSS px. */
  room: number
  /** The system's height at scale 1: its staves and the verses under its tune. */
  natural: number
  /** The labels' row over the line, in CSS px. */
  labels: number
  most?: number
}): number {
  if (room <= 0 || natural <= 0) return most
  return Math.min(most, Math.max(SHEET_SCALE.min, (room - labels) / natural))
}

/**
 * An engraving's height at scale 1 (it was drawn at `scale`) as the sheet reads it, its notes far over
 * or under its staves and its fingers counted: all of it; or, where the staves under the last of
 * those `read` are not read (a hand practised alone, its other staff soft), down to that staff with
 * the room the engraving keeps under its lowest. Unknown for an engraving with no size.
 */
export function engravedHeight(
  layout: Pick<ScoreLayout, 'height' | 'staves'>,
  staves: readonly StaffId[],
  read: readonly StaffId[],
  scale: number,
): number | undefined {
  if (layout.height <= 0 || scale <= 0) return undefined
  const lowest = staves.at(-1)
  const last = read.at(-1)
  const under =
    lowest === undefined || last === undefined || last === lowest
      ? 0
      : (layout.staves[lowest]?.bottom ?? 0) - (layout.staves[last]?.bottom ?? 0)
  return (layout.height - Math.max(0, under)) / scale
}

/** The widest bar's notes, in px at scale 1, past any clef, key and time; none in a score without bars. */
export function widestBar(layout: ScoreLayout, scale: number): number | undefined {
  if (layout.measures.length === 0 || scale <= 0) return undefined
  return Math.max(...layout.measures.map((bar) => (bar.x + bar.width - bar.notes) / scale))
}
