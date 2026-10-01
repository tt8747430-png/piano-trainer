import type { Chord, Tick } from '@/shared/lib/music'
import type { Draft, DraftBar } from './draft'

/** A bar where it is: its index in the piece, its section and line, and its first tick. */
export interface PlacedBar {
  readonly index: number
  readonly section: number
  readonly line: number
  readonly start: Tick
  readonly bar: DraftBar
}

export function barsOf(draft: Draft): PlacedBar[] {
  const placed: PlacedBar[] = []
  let start = 0
  draft.sections.forEach((section, s) =>
    section.lines.forEach((line, l) =>
      line.forEach((bar) => {
        placed.push({ index: placed.length, section: s, line: l, start, bar })
        start += bar.ticks
      }),
    ),
  )
  return placed
}

export const totalTicks = (draft: Draft): Tick =>
  draft.sections.reduce(
    (sum, section) => sum + section.lines.flat().reduce((ticks, bar) => ticks + bar.ticks, 0),
    0,
  )

/** The bar a tick is in: at a barline the later bar; at the piece's end the last. */
export function barAt(draft: Draft, tick: Tick): PlacedBar {
  const bars = barsOf(draft)
  const found = bars.findLast((placed) => placed.start <= tick) ?? bars[0]
  if (!found) throw new RangeError('A draft always has a bar')
  return found
}

/** Each chord of a bar with its length: until the next chord or the barline. */
export function chordsAt(
  bar: DraftBar,
): { at: Tick; ticks: Tick; chord: Chord; method?: string }[] {
  return bar.chords.map((chord, i) => ({
    ...chord,
    ticks: (bar.chords[i + 1]?.at ?? bar.ticks) - chord.at,
  }))
}
