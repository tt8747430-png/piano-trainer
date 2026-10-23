/** How far a finger may move and still tap, in CSS px. */
export const GRIP_SLOP = 6
/** How far the grab handle is dragged to open or fold the palette, in CSS px. */
export const GRIP_PULL = 24

/**
 * What the palette's grab handle does when let go after moving `dy` px down (Flat's sheet): a tap
 * toggles; a drag the way the palette opens (`up` at the sheet's foot, `down` hanging beside it)
 * opens it, the other way folds it. The fold it is to have, or null where it stays as it is.
 */
export function gripRelease(dy: number, folded: boolean, opens: 'up' | 'down'): boolean | null {
  if (Math.abs(dy) <= GRIP_SLOP) return !folded
  const pull = opens === 'up' ? -dy : dy
  if (pull >= GRIP_PULL) return folded ? false : null
  if (pull <= -GRIP_PULL) return folded ? null : true
  return null
}
