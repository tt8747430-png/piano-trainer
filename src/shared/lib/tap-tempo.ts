/** The taps averaged: the last five, four gaps between them. */
const TAPS_KEPT = 5

/** A pause this long (milliseconds) starts the taps again. */
const TAP_PAUSE = 2000

/** A gap this far off the average of the gaps before it (either way) starts the taps again from it. */
const STRAY = 1.5

/**
 * Tap tempo (ADR 0052): a tap at `time` (milliseconds) after the taps before it. The tempo is the
 * average gap between the last few taps, in beats a minute; a tap after a pause starts again, a gap
 * half again longer or shorter than the average before it keeps only its own two taps (Chordio's
 * stray-tap rule), and one tap alone reads none.
 */
export function tapTempo(
  taps: readonly number[],
  time: number,
): { readonly taps: readonly number[]; readonly bpm: number | null } {
  const last = taps.at(-1)
  const before = last !== undefined && time - last < TAP_PAUSE ? taps : []
  const head = before[0]
  const mean =
    before.length > 1 && head !== undefined ? ((last ?? head) - head) / (before.length - 1) : 0
  const stray =
    last !== undefined && mean > 0 && Math.max((time - last) / mean, mean / (time - last)) > STRAY
  const kept = (stray ? [last, time] : [...before, time]).slice(-TAPS_KEPT)
  const first = kept[0]
  if (kept.length < 2 || first === undefined) return { taps: kept, bpm: null }
  const gap = (time - first) / (kept.length - 1)
  return { taps: kept, bpm: Math.round(60000 / gap) }
}
