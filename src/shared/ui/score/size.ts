import type { StaffId } from '@/shared/lib/notation'

/** The engraving's height in VexFlow units: the treble staff at 0 (lines 40–80), the bass at 90 (130–170). */
export const SCORE_HEIGHT = 210
/**
 * Where one staff alone stands, and its height: its lines at 60–100, room above for a 13th over B4
 * (G♯6, with its sharp) and below for two ledger lines (C4 under the treble, C2 under the bass).
 */
export const ONE_STAFF_Y = 20
export const STAFF_HEIGHT = 130

/** The height a score takes before fingers: one staff's, or the grand staff's. */
export const staffHeight = (staff: StaffId | undefined): number =>
  staff ? STAFF_HEIGHT : SCORE_HEIGHT
