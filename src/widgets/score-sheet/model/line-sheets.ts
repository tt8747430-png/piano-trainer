import type { Draft } from '@/features/score-editor'
import type { TimeSignature } from '@/shared/lib/music'
import { notate, type Score, type TimedMusic } from '@/shared/lib/notation'
import {
  lineMusic,
  linesOf,
  oneLine,
  timeBeforeLine,
  type PlayedHands,
  type SheetLineBars,
} from './line-music'

/** A line as the sheet shows it: its bars, its music and that music engraved, the time before it. */
export interface LineSheet {
  readonly line: SheetLineBars
  readonly music: TimedMusic
  readonly score: Score
  readonly timeBefore: TimeSignature | undefined
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
 * as one line), with what the pattern plays where a hand leaves a bar to it (`played`, ADR 0083); a
 * line that did not change always the same object (so its row is not drawn again) and the same music
 * always the same score (never engraved again).
 */
export function createLineSheets(): (
  draft: Draft,
  cut?: LineCut,
  played?: PlayedHands,
) => LineSheet[] {
  const scores = lastUsed<Score>()
  const sheets = lastUsed<LineSheet>()
  return (draft, cut, played) =>
    (cut?.across ? oneLine(draft) : linesOf(draft, cut)).map((line) => {
      const music = lineMusic(draft, line, played)
      const timeBefore = timeBeforeLine(draft, line)
      const written = JSON.stringify(music)
      return sheets(`${JSON.stringify(line)} ${written} ${JSON.stringify(timeBefore)}`, () => ({
        line,
        music,
        score: scores(written, () => notate(untimed(music))),
        timeBefore,
      }))
    })
}
