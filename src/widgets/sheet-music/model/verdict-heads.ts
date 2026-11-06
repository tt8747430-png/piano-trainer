import type { VerdictMark } from '@/shared/ui'

/**
 * Each judged note's engraved heads with its verdict: the take's verdicts by where each note plays
 * (`notePlace`), read through the engraving's ids of those places (`noteIds`).
 */
export function verdictHeads(
  ids: ReadonlyMap<string, readonly string[]>,
  verdicts: ReadonlyMap<string, VerdictMark>,
): ReadonlyMap<string, VerdictMark> {
  const heads = new Map<string, VerdictMark>()
  for (const [place, verdict] of verdicts)
    for (const id of ids.get(place) ?? []) heads.set(id, verdict)
  return heads
}
