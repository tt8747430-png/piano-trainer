import type { ScoreLayout } from '@/shared/ui/score'

/** How far the Player's staff may shrink and grow to fit its room (spec §2.8). */
export const SHEET_SCALE = { min: 0.5, max: 1.6 } as const
/** The width, in px at scale 1, of a bar of a busy line: a staff whose bars are not known yet grows by it. */
const BUSY_BAR = 360

/**
 * The scale at which a staff `natural` tall fills a room, within `SHEET_SCALE`: the music grows where
 * the screen has height and width to spare (a laptop, a phone upright), so two of its bars (`bar`
 * wide at scale 1, else a busy line's) still show, and shrinks where it has little height (a phone on
 * its side). A room not measured yet (no width) engraves at 1.
 */
export function fitScale(
  room: { width: number; height: number },
  natural: number,
  bar: number = BUSY_BAR,
): number {
  if (room.width <= 0 || natural <= 0) return 1
  const most = Math.min(SHEET_SCALE.max, Math.max(1, room.width / (2 * bar)))
  return Math.min(most, Math.max(SHEET_SCALE.min, room.height / natural))
}

/** The widest bar's notes, in px at scale 1, past any clef, key and time; none in a score without bars. */
export function widestBar(layout: ScoreLayout, scale: number): number | undefined {
  if (layout.measures.length === 0 || scale <= 0) return undefined
  return Math.max(...layout.measures.map((bar) => (bar.x + bar.width - bar.notes) / scale))
}
