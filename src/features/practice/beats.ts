import type { Performance } from '@/shared/lib/arrangement'
import { beatsBefore, beatsToTicks, TICKS_PER_BEAT, type Tick } from '@/shared/lib/music'
import { firstPlayedBar, writtenBarOf } from './written-bar'

// The chord views count a bar in beats (ADR 0099): quarters in x/4, dotted quarters in 6/8 and 12/8
// (`beatsPerBar`), a bar's chords named in the beat each starts in.

/** One beat of a bar: where it starts and ends from its bar's start, and the chords starting in it. */
export interface BeatCell {
  readonly from: Tick
  readonly to: Tick
  /** Indexes into the performance's chords, of the bar's first pass. */
  readonly chords: readonly number[]
}

/** A bar as written, in beats, as it is played the first time. */
export interface CellBar {
  /** The chart's bar, counted from 0. */
  readonly written: number
  /** Its first pass, among the bars played. */
  readonly played: number
  readonly section: number
  readonly line: number
  readonly cells: readonly BeatCell[]
}

/** Where the music is, in beats: the bar played, its beat (from 0), and where that beat starts. */
export interface PlayedBeat {
  readonly bar: number
  readonly beat: number
  readonly startTick: Tick
}

/**
 * A bar played in beats from its own start: as many as it lasts, a part beat rounded up. A pickup
 * is the end of a bar, so its beats fall where they would in its meter's bar: its first a part beat.
 */
function beatSpans(performance: Performance, played: number): { from: Tick; to: Tick }[] {
  const bar = performance.bars[played]
  if (!bar) return []
  const length = beatsToTicks(bar.beats)
  const before = beatsToTicks(beatsBefore(performance.bars, played, performance.meter))
  const spans: { from: Tick; to: Tick }[] = []
  let from = 0
  while (from < length) {
    // To the next beat of the meter's bar, or the bar's end.
    const to = Math.min(length, from + TICKS_PER_BEAT - ((before + from) % TICKS_PER_BEAT))
    spans.push({ from, to })
    from = to
  }
  return spans
}

/**
 * A bar played in beats, with its own chords; none past the last. Every pass counts its beats as its
 * first does, as the cursor's beat is counted (`beatAt`): a pickup played again is still its bar's end.
 */
function cellBar(performance: Performance, played: number): CellBar | null {
  const bar = performance.bars[played]
  if (!bar) return null
  const startsIn = (chord: number, from: Tick, to: Tick) => {
    const start = (performance.chords[chord]?.startTick ?? -1) - bar.startTick
    return start >= from && start < to
  }
  const written = writtenBarOf(performance, played)
  const first = firstPlayedBar(performance, written) ?? played
  const cells = beatSpans(performance, first).map(({ from, to }) => ({
    from,
    to,
    chords: bar.chords.filter((chord) => startsIn(chord, from, to)),
  }))
  return { written, played, section: bar.section, line: bar.line, cells }
}

/** Every bar as written, each once (its first pass, where the repeats are played), in beats. */
export function beatCells(performance: Performance): CellBar[] {
  const written = new Set(performance.bars.map((_, played) => writtenBarOf(performance, played)))
  return [...written]
    .sort((a, b) => a - b)
    .flatMap((each) => {
      const played = firstPlayedBar(performance, each)
      return (played === null ? null : cellBar(performance, played)) ?? []
    })
}

/** Every bar as played, the repeats taken (the beat strip's, ADR 0099), in beats. */
export function playedBeatCells(performance: Performance): CellBar[] {
  return performance.bars.flatMap((_, played) => cellBar(performance, played) ?? [])
}

/**
 * The beat group at a tick, else the first after it: where a beat tapped takes the cursor (ADR
 * 0099). Past the last, the last; none in music of no notes.
 */
export function beatGroupFrom(performance: Performance, tick: Tick): number | null {
  const { beatGroups } = performance
  if (beatGroups.length === 0) return null
  const from = beatGroups.findIndex((group) => group.tick >= tick)
  return from < 0 ? beatGroups.length - 1 : from
}

/**
 * The beat a tick is in: in the bar played then, counted as its bar's first pass counts it. Before
 * the music, its first beat; past its end, its last.
 */
export function beatAt(performance: Performance, tick: Tick): PlayedBeat {
  const played = Math.max(
    0,
    performance.bars.findLastIndex((bar) => bar.startTick <= tick),
  )
  const bar = performance.bars[played]
  if (!bar) return { bar: 0, beat: 0, startTick: 0 }
  const first = firstPlayedBar(performance, writtenBarOf(performance, played)) ?? played
  const spans = beatSpans(performance, first)
  const beat = Math.max(
    0,
    spans.findLastIndex((span) => span.from <= tick - bar.startTick),
  )
  return { bar: played, beat, startTick: bar.startTick + (spans[beat]?.from ?? 0) }
}
