import type { StaffId } from '@/shared/lib/notation'

/** Where each staff of several stands below the one over it, in the engraving's units (a staff space 10 at scale 1): the treble at 0 (lines 40–80), the bass at 90 (130–170). */
export const STAFF_GAP = 90
/** The room the last of several staves takes from its own top, down to its last ledger lines. */
export const LAST_STAFF = 120
/** The engraving's height for the grand staff: two staves. */
export const SCORE_HEIGHT = STAFF_GAP + LAST_STAFF
/**
 * Where one staff alone stands, and its height: its lines at 60–100, room above for a 13th over B4
 * (G♯6, with its sharp) and below for two ledger lines (C4 under the treble, C2 under the bass).
 */
export const ONE_STAFF_Y = 20
export const STAFF_HEIGHT = 130

/** The height a score takes before fingers: one staff's, or `count` staves' (the grand staff's by default). */
export const staffHeight = (staff: StaffId | undefined, count = 2): number =>
  staff || count === 1 ? STAFF_HEIGHT : STAFF_GAP * (count - 1) + LAST_STAFF

/** Where each of `count` staves' top line stands in a score drawn without fingers: a placeholder's lines. */
export const staffTops = (count: number): number[] =>
  count === 1
    ? [ONE_STAFF_Y + 40]
    : Array.from({ length: count }, (_, index) => index * STAFF_GAP + 40)
