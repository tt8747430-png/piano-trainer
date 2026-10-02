import type { Draft } from '@/features/score-editor'
import type { TimeSignature } from '@/shared/lib/music'
import { notate, type Score, type TimedMusic } from '@/shared/lib/notation'
import { lineMusic, linesOf, timeBeforeLine, type SheetLineBars } from './line-music'

/** A line as the sheet shows it: its bars, its music and that music engraved, the time before it. */
export interface LineSheet {
  readonly line: SheetLineBars
  readonly music: TimedMusic
  readonly score: Score
  readonly timeBefore: TimeSignature | undefined
}

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

/**
 * The draft's lines as the sheet shows them, a line that did not change always the same object (so its
 * row is not drawn again) and the same music always the same score (never engraved again).
 */
export function createLineSheets(): (draft: Draft) => LineSheet[] {
  const scores = lastUsed<Score>()
  const sheets = lastUsed<LineSheet>()
  return (draft) =>
    linesOf(draft).map((line) => {
      const music = lineMusic(draft, line)
      const timeBefore = timeBeforeLine(draft, line)
      const written = JSON.stringify(music)
      return sheets(`${JSON.stringify(line)} ${written} ${JSON.stringify(timeBefore)}`, () => ({
        line,
        music,
        score: scores(written, () => notate(music)),
        timeBefore,
      }))
    })
}
