import { TICKS_PER_BEAT } from '@/shared/lib/music'
import type { TimedMusic } from '@/shared/lib/notation'
import type { IntervalWay } from '@/shared/lib/schedule'

const WHOLE = 4 * TICKS_PER_BEAT

/**
 * An interval as the canvas writes it (canvas 176): one treble staff with no time signature, its two
 * notes open whole notes; together, stacked; up, the lower then the upper side by side; down, the
 * upper first. `music` is the example's, the lower note first.
 */
export function intervalMusic(music: TimedMusic, way: IntervalWay): TimedMusic {
  const [low, high] = music.notes
  if (!low || !high) return music
  const onStaff = (n: typeof low, startTick: number) => ({
    ...n,
    hand: 'staff' as const,
    staff: 0,
    startTick,
    durationTicks: WHOLE,
  })
  const together = way === 'together'
  const [first, second] = way === 'down' ? [high, low] : [low, high]
  return {
    ...music,
    timeHidden: true,
    staves: [{ clef: 'treble' }],
    piano: false,
    // One bar either way, as a theory book writes an interval: no bar line between its notes.
    bars: [{ startTick: 0, beats: together ? 4 : 8 }],
    notes: together
      ? [onStaff(low, 0), onStaff(high, 0)]
      : [onStaff(first, 0), onStaff(second, WHOLE)],
  }
}
