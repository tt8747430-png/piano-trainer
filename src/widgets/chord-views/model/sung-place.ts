import { firstPlayedBar, loopTicks, writtenBarOf, type BarRange } from '@/features/practice'
import type { Performance } from '@/shared/lib/arrangement'
import type { LyricLine, Span } from './lyric-lines'

/** Where the words are as the bars are played: the Diagrams view's words (ADR 0108). */
export type SungPlace =
  /** In a line that sings: it, and the next line sung. */
  | { readonly kind: 'line'; readonly line: LyricLine; readonly coming: LyricLine | undefined }
  /** Between lines that sing: how far through the wait for the next line's first word, 0 to 1. */
  | { readonly kind: 'wait'; readonly coming: LyricLine; readonly progress: number }

/**
 * The next line sung after a bar played, and the bar played it is reached at, in the order the
 * Player plays the bars: a repeat's lines again, and where the loop goes round, the line it goes
 * round to. A line starts again where the bars played jump or move on to another line.
 */
function comingAfter(
  performance: Performance,
  lineOf: ReadonlyMap<number, LyricLine>,
  played: number,
  loop: BarRange | null,
): { readonly line: LyricLine; readonly bar: number } | undefined {
  const after = (bar: number) => (loop && bar === loop.last ? loop.first : bar + 1)
  const count = performance.bars.length
  let before = writtenBarOf(performance, played)
  // Each bar looked at once: a loop that sings nothing goes round no more.
  for (let bar = after(played), steps = 0; bar < count && steps < count; steps++) {
    const written = writtenBarOf(performance, bar)
    const line = lineOf.get(written)
    if (line?.sung && (line !== lineOf.get(before) || written !== before + 1)) return { line, bar }
    before = written
    bar = after(bar)
  }
  return undefined
}

/**
 * Where the words are at a beat played (`at`: its bar and its ticks as played): in the line that
 * sings there, the next line sung after it; between lines that sing, the wait for the next line's
 * first word, from the first bar after the words stopped (or the music's or the loop's start), its
 * beats counted to the end of the one sounding. None where no line sings there or after it.
 */
export function sungPlace(
  performance: Performance,
  lines: readonly LyricLine[],
  at: { readonly bar: number; readonly played: Span },
  loop: BarRange | null,
): SungPlace | null {
  const lineOf = new Map<number, LyricLine>()
  for (const line of lines) for (const bar of line.bars) lineOf.set(bar, line)
  const lineAt = (played: number) => lineOf.get(writtenBarOf(performance, played))
  const next = comingAfter(performance, lineOf, at.bar, loop)
  const here = lineAt(at.bar)
  if (here?.sung) return { kind: 'line', line: here, coming: next?.line }
  if (!next) return null
  let start = at.bar
  while (start > (loop?.first ?? 0) && !lineAt(start - 1)?.sung) start--
  const from = performance.bars[start]?.startTick ?? 0
  // The first word as played, where the bars played reach its line; past the loop's end where the
  // loop goes round to it.
  const reached = performance.bars[next.bar]?.startTick ?? 0
  const written = firstPlayedBar(performance, writtenBarOf(performance, next.bar)) ?? next.bar
  const word = next.line.words[0]?.[0]?.at ?? next.line.from
  const passage = loop ? loopTicks(performance, loop) : null
  const round = passage && next.bar <= at.bar ? passage.to - passage.from : 0
  const to = reached + word - (performance.bars[written]?.startTick ?? 0) + round
  const progress = to > from ? (at.played.to - from) / (to - from) : 1
  return { kind: 'wait', coming: next.line, progress: Math.min(1, Math.max(0, progress)) }
}
