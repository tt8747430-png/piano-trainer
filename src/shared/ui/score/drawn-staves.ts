import type { Score, StaffId } from '@/shared/lib/notation'

/** The staves a score is drawn on: `staff` alone, or those of `staves` it writes, or all it writes. */
export const drawnStaves = (
  score: Score,
  staff: StaffId | undefined,
  staves: readonly StaffId[] | undefined,
): readonly StaffId[] =>
  staff ? [staff] : (staves?.filter((each) => score.staves.includes(each)) ?? score.staves)
