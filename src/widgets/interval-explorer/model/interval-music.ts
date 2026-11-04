import { TICKS_PER_BEAT } from '@/shared/lib/music'
import type { TimedMusic } from '@/shared/lib/notation'
import type { IntervalWay } from '@/shared/lib/schedule'

const WHOLE_BAR = 4 * TICKS_PER_BEAT
const HALF = 2 * TICKS_PER_BEAT

/**
 * An interval's bar as it is played (A22): together, its two notes held for the bar;
 * up, the lower then the upper, a half note each; down, the upper first. `music` is
 * the example's, the lower note first.
 */
export function intervalMusic(music: TimedMusic, way: IntervalWay): TimedMusic {
  const [low, high] = music.notes
  if (!low || !high) return music
  const notes =
    way === 'together'
      ? [
          { ...low, startTick: 0, durationTicks: WHOLE_BAR },
          { ...high, startTick: 0, durationTicks: WHOLE_BAR },
        ]
      : way === 'down'
        ? [
            { ...high, startTick: 0, durationTicks: HALF },
            { ...low, startTick: HALF, durationTicks: HALF },
          ]
        : [
            { ...low, startTick: 0, durationTicks: HALF },
            { ...high, startTick: HALF, durationTicks: HALF },
          ]
  return { ...music, notes }
}
