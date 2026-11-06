import type { Tick } from '@/shared/lib/music'
import type { ScoreLayout } from './layout'

/**
 * The heads sounding at `at` (R35): on each staff, those of its latest onset at or before it, a rest
 * there silencing the staff. By their engraved ids, so the score can light them in their hand's colour.
 */
export function soundingHeads(layout: Pick<ScoreLayout, 'heads' | 'rests'>, at: Tick): string[] {
  const latest = new Map<string, Tick>()
  for (const onset of [...(layout.heads ?? []), ...(layout.rests ?? [])])
    if (onset.tick <= at && onset.tick > (latest.get(onset.staff) ?? -1))
      latest.set(onset.staff, onset.tick)
  return (layout.heads ?? [])
    .filter((head) => latest.get(head.staff) === head.tick)
    .map((head) => head.id)
}
