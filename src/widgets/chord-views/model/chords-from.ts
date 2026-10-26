import type { Performance } from '@/shared/lib/arrangement'
import type { Span } from './lyric-lines'

/** The chord sounding in a beat and the changes after it, indexes into the performance's chords. */
export interface ChordsFrom {
  /** None in a bar of no chord, or before the first. */
  readonly now: number | null
  readonly next: readonly number[]
}

/**
 * What the Diagrams view shows (ADR 0099): the chord sounding in a beat (as played; the later where
 * two start in it), and the `count` chords after it in played order, each a change (a chord held
 * again is no next chord). Where a loop goes round, after its last chord comes the one sounding as
 * it starts; with none, the music ends.
 */
export function chordsFrom(
  performance: Performance,
  beat: Span,
  loop: Span | null,
  count: number,
): ChordsFrom {
  const { chords } = performance
  /** The last chord sounding in a span; -1 for none. */
  const soundingIn = (span: Span) =>
    chords.findLastIndex(
      (chord) => chord.startTick < span.to && chord.startTick + chord.durationTicks > span.from,
    )
  /** A chord played before the loop's end, or anywhere with no loop. */
  const inLoop = (index: number) => {
    const chord = chords[index]
    return chord !== undefined && (!loop || chord.startTick < loop.to)
  }
  // What the loop goes round to: the chord sounding as it starts, else the first in it.
  const sounding = loop ? soundingIn({ from: loop.from, to: loop.from + 1 }) : -1
  const round =
    !loop || sounding >= 0 ? sounding : chords.findIndex((chord) => chord.startTick >= loop.from)
  const after = (index: number) => (inLoop(index + 1) ? index + 1 : round)

  const found = soundingIn(beat)
  const now = found < 0 ? null : found
  const coming = chords.findIndex((chord) => chord.startTick >= beat.to)
  let at = now !== null ? after(now) : inLoop(coming) ? coming : round
  let last = now === null ? null : (chords[now]?.symbol ?? null)
  const next: number[] = []
  // A loop of one chord held goes round for ever: each chord is looked at twice at most.
  for (let steps = 0; at >= 0 && next.length < count && steps < 2 * chords.length; steps++) {
    const symbol = chords[at]?.symbol ?? null
    if (symbol !== last) next.push(at)
    last = symbol
    at = after(at)
  }
  return { now, next }
}
