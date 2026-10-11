import { TEMPO_RANGE, type ClickSound } from '@/shared/lib/schedule'

export { METRONOME_BEATS, type MetronomeBeats } from '@/shared/lib/schedule'

/** One bar of clicks at `tempo`, from 0 s: a click a beat, the first accented. */
export const metronomeBar = (beats: number, tempo: number): ClickSound[] =>
  Array.from({ length: beats }, (_, beat) => ({
    kind: 'click',
    at: (beat * 60) / tempo,
    accent: beat === 0,
  }))

/** How long ago a tap may be and still count toward the next: longer is a new start. */
const TAP_GAP_MS = 2000
/** The taps an average is taken over. */
const TAPS_KEPT = 5

/** The taps kept after one at `at` (milliseconds): those since the last long pause, the latest few. */
export const withTap = (taps: readonly number[], at: number): number[] => {
  const last = taps.at(-1)
  const going = last !== undefined && at - last <= TAP_GAP_MS ? taps : []
  return [...going, at].slice(-TAPS_KEPT)
}

/** The tempo the taps keep, in the app's range; null until there are two. */
export function tappedTempo(taps: readonly number[]): number | null {
  const first = taps[0]
  const last = taps.at(-1)
  if (taps.length < 2 || first === undefined || last === undefined) return null
  const beat = (last - first) / (taps.length - 1)
  if (beat <= 0) return null
  return Math.min(TEMPO_RANGE.max, Math.max(TEMPO_RANGE.min, Math.round(60_000 / beat)))
}
