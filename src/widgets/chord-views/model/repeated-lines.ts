import { writtenBarOf } from '@/features/practice'
import type { Performance } from '@/shared/lib/arrangement'
import type { Tick } from '@/shared/lib/music'
import type { LyricLine } from './lyric-lines'

/** A line of Chords over lyrics as shown: once, however many times it is played straight on. */
export interface ShownLine extends LyricLine {
  /** How many times it is played straight on: more than once, it says ×N (ADR 0108). */
  readonly times: number
  /**
   * Where each copy of it written out starts, from its own start: 0 for itself, then each line it
   * folded in. A copy's chord sounding is marked on it.
   */
  readonly copies: readonly Tick[]
}

/** The chords of a line alone, each with where it starts and ends in it: two lines alike match. */
const chordsOf = (performance: Performance, line: LyricLine): string =>
  [
    line.to - line.from,
    ...line.segments.map(({ chord, from, to }) =>
      chord === null
        ? ''
        : `${performance.chords[chord]?.symbol ?? ''}@${from - line.from}-${to - line.from}`,
    ),
  ].join(' ')

/**
 * How many times a line's bars are played in a row where it is first played: twice in a repeat
 * (`|: … :|`), once otherwise.
 */
function timesPlayed(performance: Performance, bars: readonly number[]): number {
  const played = performance.bars.map((_, at) => writtenBarOf(performance, at))
  const at = played.indexOf(bars[0] ?? -1)
  if (at < 0) return 1
  const playsAt = (from: number) => bars.every((bar, i) => played[from + i] === bar)
  let times = 0
  while (playsAt(at + times * bars.length)) times++
  return Math.max(1, times)
}

/**
 * Chords over lyrics' lines with a line of chords alone played again straight after itself shown
 * once (ADR 0108, Chordify's "x3"): the same chords on the same beats, with no words, in its repeat
 * or written out again in the same section. Its bars are all its copies', so the cursor in any is in
 * it. A line with words is never folded: each verse is shown.
 */
export function foldRepeats(performance: Performance, lines: readonly LyricLine[]): ShownLine[] {
  const shown: ShownLine[] = []
  for (const line of lines) {
    const chords = line.segments.some(({ chord }) => chord !== null)
    const times = !line.sung && chords ? timesPlayed(performance, line.bars) : 1
    const last = shown.at(-1)
    const folds =
      last !== undefined &&
      !line.sung &&
      !last.sung &&
      chords &&
      last.section === line.section &&
      line.bars[0] === (last.bars.at(-1) ?? -1) + 1 &&
      chordsOf(performance, last) === chordsOf(performance, line)
    if (folds) {
      shown[shown.length - 1] = {
        ...last,
        bars: [...last.bars, ...line.bars],
        times: last.times + times,
        copies: [...last.copies, line.from - last.from],
      }
    } else shown.push({ ...line, times, copies: [0] })
  }
  return shown
}
