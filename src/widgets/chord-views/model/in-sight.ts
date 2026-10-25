/** The room a scroller keeps at its foot under what floats over it: its `scroll-pb`, the transport's. */
export const footRoom = (scroller: Element): number =>
  Number.parseFloat(getComputedStyle(scroller).scrollPaddingBottom) || 0

/**
 * Whether an element stands wholly in sight in its scroller, clear of what floats over its foot: a
 * view opening leaves it there.
 */
export function inSight(element: Element, scroller: Element): boolean {
  const box = element.getBoundingClientRect()
  const room = scroller.getBoundingClientRect()
  return box.top >= room.top && box.bottom <= room.bottom - footRoom(scroller)
}

/** How far down the room under the strip the line playing is kept: in its top third, a quarter down. */
const THIRD = 1 / 3
const KEPT_AT = 1 / 4

/**
 * How far Chords over lyrics scrolls to keep the line playing in sight (ADR 0099): none where it
 * stands in the top third of the room under the strip held at the top and over the transport,
 * wholly in it; else by as much as brings its top a quarter of the way down that room, or higher
 * where its foot would reach under the transport, its top never under the strip. `top` is the line's
 * from the scroller's top in sight, `held` the strip's height, `room` the height between the strip
 * and the transport.
 */
export function lineScroll({
  top,
  height,
  held,
  room,
}: {
  top: number
  height: number
  held: number
  room: number
}): number | null {
  if (top >= held && top <= held + room * THIRD && top + height <= held + room) return null
  return top - (held + Math.max(0, Math.min(room * KEPT_AT, room - height)))
}
