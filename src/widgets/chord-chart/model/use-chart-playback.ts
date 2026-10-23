import type { Performance } from '@/shared/lib/arrangement'
import { audibleHands, barSounds } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'

/**
 * A chart's bars played from their buttons, both hands at the piece's tempo: the bar sounding, and
 * a tap on a bar, which plays it, or stops it while it sounds (the song page's chart and a shared
 * song's alike).
 */
export function useChartPlayback(
  performance: Performance,
  tempo: number,
): { playing: number | null; toggleBar: (bar: number) => void } {
  const playback = usePlayback<number>()
  return {
    playing: playback.playing,
    toggleBar: (bar) =>
      playback.toggle(bar, () =>
        barSounds(performance, bar, { tempo, hands: audibleHands('both') }),
      ),
  }
}
