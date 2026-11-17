import type { Performance } from '@/shared/lib/arrangement'
import { audibleHands, barSounds, schedule } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'

/** What `playing` reads while the whole song sounds from its first bar. */
export const WHOLE_SONG = -1

/**
 * A chart's bars played from their buttons, both hands at the piece's tempo: the bar sounding, and
 * a tap on a bar, which plays it, or stops it while it sounds (the song page's chart and a shared
 * song's alike); `toggleAll` plays the whole song from its start, or stops it (Flat's Play).
 */
export function useChartPlayback(
  performance: Performance,
  tempo: number,
): { playing: number | null; toggleBar: (bar: number) => void; toggleAll: () => void } {
  const playback = usePlayback<number>()
  const hands = audibleHands('both')
  return {
    playing: playback.playing,
    toggleBar: (bar) => playback.toggle(bar, () => barSounds(performance, bar, { tempo, hands })),
    toggleAll: () =>
      playback.toggle(WHOLE_SONG, () => schedule(performance, { tempo, hands }).sounds),
  }
}
