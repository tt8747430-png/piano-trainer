import type { StaffId } from '@/shared/lib/notation'

/**
 * A staff's room as Verovio engraves it at scale 1 (a staff space 10, ADR 0078), its least: ledger
 * lines far over or under take more. Its top line stands `TOP_LINE` down, each staff `STAFF_GAP`
 * under the one over it, and the last takes `LAST_STAFF` from its own top to the engraving's foot.
 */
export const TOP_LINE = 30
export const STAFF_GAP = 101
export const LAST_STAFF = 101

/** The height a score takes before fingers: `count` staves' (the grand staff's by default, one for `staff`). */
export const staffHeight = (staff: StaffId | undefined, count = 2): number =>
  STAFF_GAP * ((staff ? 1 : count) - 1) + LAST_STAFF

/** Where each of `count` staves' top line stands in a score drawn without fingers: a placeholder's lines. */
export const staffTops = (count: number): number[] =>
  Array.from({ length: count }, (_, index) => index * STAFF_GAP + TOP_LINE)
