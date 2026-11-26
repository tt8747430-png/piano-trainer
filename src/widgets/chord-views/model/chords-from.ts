import type { Performance } from '@/shared/lib/arrangement'
import { barNumber, opensOnPickup, type Tick } from '@/shared/lib/music'
import type { Span } from './lyric-lines'

/** The chord sounding in a beat and the change after it, indexes into the performance's chords. */
interface ChordsFrom {
  /** None in a bar of no chord, or before the first. */
  readonly now: number | null
  /** None past the music's last chord. */
  readonly next: number | null
}

/**
 * What the Diagrams view shows (ADR 0108): the chord sounding in a beat (as played; the later
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

/** A chord of the song, as the summary's In this song lists it (R29 A37). */
interface SongChord {
  readonly symbol: string
  /** How many times the music changes to it. */
  readonly count: number
  /** The bars it changes to it in, as played, numbered as a musician numbers them (`barNumber`). */
  readonly bars: readonly number[]
}

/** A change of chord, as the summary's In order lists it: the chord it starts with, and its bar. */
interface OrderCard {
  /** Index into the performance's chords: where a tap takes the cursor. */
  readonly chord: number
  readonly symbol: string
  /** Its bar as played, numbered as a musician numbers it (`barNumber`). */
  readonly bar: number
  /** Its section, by the performance's numbering. */
  readonly section: number
}

/** Every change of chord as played (a chord held on is no change): one card each. */
export function chordsInOrder(performance: Performance): readonly OrderCard[] {
  const pickup = opensOnPickup(performance.bars, performance.meter)
  return performance.chords.flatMap((chord, index) =>
    performance.chords[index - 1]?.symbol === chord.symbol
      ? []
      : [
          {
            chord: index,
            symbol: chord.symbol,
            bar: barNumber(chord.bar, pickup),
            section: performance.bars[chord.bar]?.section ?? 0,
          },
        ],
  )
}

/** Each chord of the song once, in the order it first sounds, with its changes' count and bars. */
export function chordsInSong(performance: Performance): readonly SongChord[] {
  const found = new Map<string, { count: number; bars: number[] }>()
  for (const card of chordsInOrder(performance)) {
    const seen = found.get(card.symbol) ?? { count: 0, bars: [] }
    found.set(card.symbol, { count: seen.count + 1, bars: [...seen.bars, card.bar] })
  }
  return [...found].map(([symbol, { count, bars }]) => ({ symbol, count, bars }))
}
