import type { Tick } from '@/shared/lib/music'
import { leftAt, xAmong, type ScoreLayout } from './layout'
import { spaceOf } from './selection'

/**
 * The playhead's measures, in staff spaces (ADR 0096): how far before what sounds it stands, clear
 * of the heads and their accidentals, and how far past the system's outer lines it reaches.
 */
export const PLAYHEAD = { lead: 0.5, reach: 0.5 } as const

type Laid = Pick<ScoreLayout, 'measures' | 'onsets' | 'staves' | 'heads' | 'rests'>

/**
 * Where the playhead stands at a tick (ADR 0096): just before what is drawn there on every staff in
 * sight (`leftAt`), between two onsets in proportion to the ticks between them, toward the barline
 * after a bar's last onset.
 */
export function playheadX(layout: Laid, tick: Tick): number {
  const measure =
    layout.measures.find((m) => tick < m.startTick + m.ticks) ?? layout.measures.at(-1)
  if (!measure) return 0
  const end = measure.startTick + measure.ticks
  const lead = PLAYHEAD.lead * spaceOf(layout)
  const onsets = layout.onsets
    .filter((onset) => onset.tick >= measure.startTick && onset.tick < end)
    .map((onset) => ({ tick: onset.tick, x: leftAt(layout, onset.tick) - lead }))
  const opening = onsets.some((onset) => onset.tick === measure.startTick)
    ? []
    : [{ tick: measure.startTick, x: Math.max(measure.x, measure.notes - lead) }]
  return xAmong([...opening, ...onsets, { tick: end, x: measure.x + measure.width }], tick)
}

/**
 * The playhead's height (ADR 0096): the whole system's, from its highest staff's top line to its
 * lowest's foot and a little past them, the same wherever on the line it stands.
 */
export function playheadSpan(layout: Pick<ScoreLayout, 'staffTop' | 'staffBottom' | 'staves'>): {
  readonly top: number
  readonly height: number
} {
  const reach = PLAYHEAD.reach * spaceOf(layout)
  return { top: layout.staffTop - reach, height: layout.staffBottom - layout.staffTop + 2 * reach }
}

/**
 * Where a line wider than its view scrolls to keep the playhead in sight: nowhere while it is in the
 * view's middle half, else so it stands a quarter in.
 */
export function followScroll(x: number, view: { left: number; width: number }): number | null {
  if (x >= view.left + view.width / 4 && x <= view.left + (view.width * 3) / 4) return null
  return Math.max(0, x - view.width / 4)
}
