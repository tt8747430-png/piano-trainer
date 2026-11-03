import type { Performance } from '@/shared/lib/arrangement'
import { pedalId } from '@/shared/lib/notation'
import { pedalSpanAt } from '@/shared/lib/schedule'

/**
 * The score's Ped. mark the music plays under, lit in the playhead's ink while its pedal is down
 * (A27, Show it): a rule on its engraved mark, by its id, so a new engraving is lit as it is drawn.
 */
export function PedalMarks({
  performance,
  current,
}: {
  performance: Pick<Performance, 'pedal' | 'beatGroups'>
  current: number
}) {
  const tick = performance.beatGroups[current]?.tick
  const span = tick === undefined ? null : pedalSpanAt(performance.pedal, tick)
  if (span === null) return null
  return (
    <style data-slot="pedal-marks">{`[data-slot="score"] [id="${pedalId(span.from)}"] { fill: var(--color-ring); color: var(--color-ring); }`}</style>
  )
}
