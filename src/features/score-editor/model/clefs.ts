import { clefsInForce, HOME_CLEF, type Clef, type Hand } from '@/shared/lib/music'
import type { Draft } from './draft'
import { withBar } from './notes'
import { barsOf } from './timeline'

/** The clef a hand's staff is in at bar `index`. */
export function clefAt(draft: Draft, index: number, hand: Hand): Clef {
  const bars = barsOf(draft).map(({ bar }) => bar)
  return (clefsInForce(bars)[index] ?? HOME_CLEF)[hand]
}

/**
 * A hand's staff changed to `clef` from bar `index` on (ADR 0069): a change written there, or taken
 * away where the staff is in that clef already from the bars before.
 */
export function setClef(draft: Draft, index: number, hand: Hand, clef: Clef): Draft {
  const bars = barsOf(draft).map(({ bar }) => bar)
  const before = index > 0 ? (clefsInForce(bars)[index - 1] ?? HOME_CLEF) : HOME_CLEF
  return withBar(draft, index, ({ clefs, ...bar }) => {
    const { [hand]: _was, ...others } = clefs ?? {}
    const next = before[hand] === clef ? others : { ...others, [hand]: clef }
    return Object.keys(next).length > 0 ? { ...bar, clefs: next } : bar
  })
}
