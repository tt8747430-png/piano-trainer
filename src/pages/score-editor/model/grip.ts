/** How far a finger may move and still tap, in CSS px. */
export const GRIP_SLOP = 6
/** How far the grab handle is dragged to expand or compact the sheet, in CSS px. */
export const GRIP_PULL = 24

/**
 * What the palette sheet's grab handle does when let go after moving `dy` px down (Flat's sheet,
 * docked at the foot): a tap toggles; dragged up it expands, dragged down it goes compact. Whether
 * it is to be compact (`folded`), or null where it stays as it is.
 */
export function gripRelease(dy: number, folded: boolean): boolean | null {
  if (Math.abs(dy) <= GRIP_SLOP) return !folded
  if (-dy >= GRIP_PULL) return folded ? false : null
  if (dy >= GRIP_PULL) return folded ? null : true
  return null
}
