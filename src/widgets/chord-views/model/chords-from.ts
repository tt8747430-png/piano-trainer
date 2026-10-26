import type { Performance } from '@/shared/lib/arrangement'
import { TICKS_PER_BEAT, type Tick } from '@/shared/lib/music'
import type { Span } from './lyric-lines'

/** The chord sounding in a beat and the change after it, indexes into the performance's chords. */
export interface ChordsFrom {
  /** None in a bar of no chord, or before the first. */
  readonly now: number | null
  /** None past the music's last chord. */
  readonly next: number | null
}

/**
 * What the Diagrams view shows (ADR 0099, 0101): the chord sounding in a beat (as played; the later
 * where two start in it), and the next chord in played order, a change (a chord held again is no
 * next chord). Where a loop goes round, after its last chord comes the one sounding as it starts;
 * with none, the music ends.
 */
export function chordsFrom(performance: Performance, beat: Span, loop: Span | null): ChordsFrom {
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
  const held = now === null ? null : (chords[now]?.symbol ?? null)
  // A loop of one chord held goes round for ever: each chord is looked at once at most.
  for (let steps = 0; at >= 0 && steps < chords.length; steps++) {
    if (chords[at]?.symbol !== held) return { now, next: at }
    at = after(at)
  }
  return { now, next: null }
}

/** How long before a change the Diagrams view's pair slides to it: half a beat. */
const SLIDING = TICKS_PER_BEAT / 2

/**
 * How far the Diagrams view's pair has slid on toward its change at a tick (ADR 0108), from 0 to 1,
 * eased: still until half a beat before the next chord starts (or before the loop goes round to it),
 * then the next sliding into the place of the one sounding as the change comes. Still with no next,
 * or none sounding.
 */
export function pairSlide(
  performance: Performance,
  { now, next }: ChordsFrom,
  loop: Span | null,
  tick: Tick,
): number {
  if (now === null || next === null) return 0
  const sounding = performance.chords[now]
  const coming = performance.chords[next]
  if (!sounding || !coming) return 0
  const at =
    coming.startTick > sounding.startTick
      ? coming.startTick
      : (loop?.to ?? sounding.startTick + sounding.durationTicks)
  const through = Math.min(1, Math.max(0, (tick - (at - SLIDING)) / SLIDING))
  return through * through * (3 - 2 * through)
}

/**
 * A chord of a symbol where it next starts from a tick, else where it first does: where a tap on its
 * diagram takes the cursor (ADR 0108). None where the music has no such chord.
 */
export function chordNear(performance: Performance, symbol: string, tick: Tick): number | null {
  const { chords } = performance
  const after = chords.findIndex((chord) => chord.symbol === symbol && chord.startTick >= tick)
  const found = after >= 0 ? after : chords.findIndex((chord) => chord.symbol === symbol)
  return found < 0 ? null : found
}
