/** The taps averaged: the last five, four gaps between them. */
const TAPS_KEPT = 5

/** A pause this long (milliseconds) starts the taps again. */
const TAP_PAUSE = 2000

/**
 * Tap tempo (ADR 0113): a tap at `time` (milliseconds) after the taps before it. The tempo is the
 * average gap between the last few taps, in beats a minute; a tap after a pause starts again, and
 * one tap alone reads none.
 */
export function tapTempo(
  taps: readonly number[],
  time: number,
): { readonly taps: readonly number[]; readonly bpm: number | null } {
  const last = taps.at(-1)
  const kept = [...(last !== undefined && time - last < TAP_PAUSE ? taps : []), time].slice(
    -TAPS_KEPT,
  )
  const first = kept[0]
  if (kept.length < 2 || first === undefined) return { taps: kept, bpm: null }
  const gap = (time - first) / (kept.length - 1)
  return { taps: kept, bpm: Math.round(60000 / gap) }
}
