// A row's swipe as Mindscape's (memory-palaces) reads it: how far it has gone, which side is armed,
// and what letting go does. Pure, so every threshold is tested without a finger.

/** How hard a row pulls back past the point that fires its edge action. */
const OVERSHOOT_RUBBER = 0.35
/** How little it gives towards a side with no actions. */
const WRONG_WAY_RUBBER = 0.12
/** How far into its tray a row must go to stay open there. */
const OPEN_FRACTION = 0.5

/** Whether the platform took the gesture away (a scroll, a call), rather than the finger letting go. */
export function wasCanceled(event: Event | undefined): boolean {
  return event?.type === 'pointercancel' || event?.type === 'touchcancel'
}

/** One frame of a drag: a tap, still moving, let go, or taken away. */
export type DragFrame = 'tap' | 'canceled' | 'released' | 'moving'

export function dragFrame({
  tap,
  last,
  event,
}: {
  tap: boolean
  last: boolean
  event: Event | undefined
}): DragFrame {
  if (tap) return 'tap'
  if (!last) return 'moving'
  return wasCanceled(event) ? 'canceled' : 'released'
}

/** A row's trays: whether each side has one, its width, and how far a drag goes to fire its edge action. */
export interface SwipeGeometry {
  hasLeading: boolean
  hasTrailing: boolean
  leadingWidth: number
  trailingWidth: number
  leadingCommit: number
  trailingCommit: number
}

/** How far the row follows the finger: freely to each commit point, resisting past it or towards no tray. */
export function clampSwipeOffset(raw: number, g: SwipeGeometry): number {
  if (raw > 0) {
    if (!g.hasLeading) return raw * WRONG_WAY_RUBBER
    if (raw <= g.leadingCommit) return raw
    return g.leadingCommit + (raw - g.leadingCommit) * OVERSHOOT_RUBBER
  }
  if (raw < 0) {
    if (!g.hasTrailing) return raw * WRONG_WAY_RUBBER
    if (raw >= -g.trailingCommit) return raw
    return -(g.trailingCommit + (-raw - g.trailingCommit) * OVERSHOOT_RUBBER)
  }
  return 0
}

/** The side whose edge action fires if the finger lets go here. */
export function armedSide(offset: number, g: SwipeGeometry): 'leading' | 'trailing' | null {
  if (offset <= -g.trailingCommit && g.hasTrailing) return 'trailing'
  if (offset >= g.leadingCommit && g.hasLeading) return 'leading'
  return null
}

export type SwipeRelease =
  | { kind: 'commit-leading' }
  | { kind: 'commit-trailing' }
  | { kind: 'open-leading'; settleTo: number }
  | { kind: 'open-trailing'; settleTo: number }
  | { kind: 'close'; settleTo: number }

/** What letting go does: fire an edge action, stay open on a tray, or close. */
export function resolveSwipeRelease(offset: number, g: SwipeGeometry): SwipeRelease {
  if (offset <= -g.trailingCommit && g.hasTrailing) return { kind: 'commit-trailing' }
  if (offset >= g.leadingCommit && g.hasLeading) return { kind: 'commit-leading' }
  if (offset <= -g.trailingWidth * OPEN_FRACTION && g.hasTrailing) {
    return { kind: 'open-trailing', settleTo: -g.trailingWidth }
  }
  if (offset >= g.leadingWidth * OPEN_FRACTION && g.hasLeading) {
    return { kind: 'open-leading', settleTo: g.leadingWidth }
  }
  return { kind: 'close', settleTo: 0 }
}
