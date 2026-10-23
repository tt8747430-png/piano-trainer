import type { Draft } from '@/features/score-editor'
import type { TimeSignature } from '@/shared/lib/music'
import { notate, type NextLine, type Score, type TimedMusic } from '@/shared/lib/notation'
import { lineMusic, linesOf, oneLine, timeBeforeLine, type SheetLineBars } from './line-music'

/** A line as the sheet shows it: its bars, its music and that music engraved, the time before it. */
export interface LineSheet {
  readonly line: SheetLineBars
  readonly music: TimedMusic
  readonly score: Score
  readonly timeBefore: TimeSignature | undefined
  /** What the next line starts in: a key, time or clef it changes to is printed at this line's end. */
  readonly next: NextLine | undefined
}

/**
 * The music as it is engraved on the sheet: its tempo marks left out, as the line's labels write
 * them in the row over the staff (ADR 0074), so a tempo takes no row of its own over the system.
 */
export const untimed = (music: TimedMusic): TimedMusic => ({
  ...music,
  bars: music.bars.map(({ tempo: _, ...bar }) => bar),
})

/** How many are kept: a long song's lines, and the versions just written. */
const KEPT = 400

/** Values by key, the one used longest ago forgotten past `KEPT`. */
function lastUsed<T>(): (key: string, make: () => T) => T {
  const kept = new Map<string, T>()
  return (key, make) => {
    const value = kept.get(key) ?? make()
    kept.delete(key)
    kept.set(key, value)
    const [oldest] = kept.keys()
    if (kept.size > KEPT && oldest !== undefined) kept.delete(oldest)
    return value
  }
}

/** How the sheet's lines are cut: all its bars as one line (`across`), or each chart line to fit. */
export type LineCut =
  | { readonly across: true }
  | { readonly across?: false; readonly room: number; readonly widths: readonly number[] }

/**
 * The draft's lines as the sheet shows them (each chart line cut to fit its room; or all its bars
 * as one line); a line that did not change always the same object (so its row is not drawn again)
 * and the same music always the same score (never engraved again).
 */
export function createLineSheets(): (draft: Draft, cut?: LineCut) => LineSheet[] {
  const scores = lastUsed<Score>()
  const sheets = lastUsed<LineSheet>()
  return (draft, cut) => {
    const written = (cut?.across ? oneLine(draft) : linesOf(draft, cut)).map((line) => {
      const music = lineMusic(draft, line)
      const text = JSON.stringify(music)
      return { line, music, text, score: scores(text, () => notate(untimed(music))) }
    })
    return written.map(({ line, music, text, score }, index) => {
      const timeBefore = timeBeforeLine(draft, line)
      const start = written[index + 1]?.score.measures[0]
      const next: NextLine | undefined = start
        ? { key: start.key, time: start.time, clefs: start.clefs }
        : undefined
      const key = `${JSON.stringify(line)} ${text} ${JSON.stringify(timeBefore)} ${JSON.stringify(next)}`
      return sheets(key, () => ({ line, music, score, timeBefore, next }))
    })
  }
}
