/** How far the Player's staff may shrink and grow to fit its room (spec §2.8). */
export const SHEET_SCALE = { min: 0.5, max: 1.6 } as const
/** The width, in px at scale 1, that two bars of a busy line take: the staff grows only as wide rooms allow. */
const TWO_BARS = 720

/**
 * The scale at which a staff `natural` tall fills a room, within `SHEET_SCALE`: the music grows where
 * the screen has height and width to spare (a laptop), so two bars still show, and shrinks where it
 * has little height (a phone on its side). A room not measured yet (no width) engraves at 1.
 */
export function fitScale(room: { width: number; height: number }, natural: number): number {
  if (room.width <= 0 || natural <= 0) return 1
  const most = Math.min(SHEET_SCALE.max, Math.max(1, room.width / TWO_BARS))
  return Math.min(most, Math.max(SHEET_SCALE.min, room.height / natural))
}
