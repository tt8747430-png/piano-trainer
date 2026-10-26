import { clefsInForce, HOME_CLEF, type Clef, type Hand } from '@/shared/lib/music'
import { staffPlace } from '@/shared/lib/notation'
import { isHandLayer, type Draft, type NoteLayer } from './draft'
import { withBar } from './notes'
import { barsOf } from './timeline'

/**
 * The clef a staff is in at bar `index`: a hand's as its bars change it (ADR 0069), a single
 * staff's its own, the whole staff's (ADR 0097).
 */
export function clefAt(draft: Draft, index: number, layer: NoteLayer): Clef {
  if (!isHandLayer(layer)) return draft.staves[staffPlace(layer)]?.clef ?? 'treble'
  const bars = barsOf(draft).map(({ bar }) => bar)
  return (clefsInForce(bars)[index] ?? HOME_CLEF)[layer]
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
