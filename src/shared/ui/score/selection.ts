import type { Tick } from '@/shared/lib/music'
import { xAtTick, type ScoreLayout } from './layout'

/**
 * The one selection's measures (ADR 0082), the score editor's and the Player's alike in every layout:
 * how far left of a notehead a note's box starts (clear of its accidental), its width, how far past
 * its staves any mark reaches (a staff space, as Sibelius's and Flat's do), how far in from their
 * barlines the bars chosen stand, and an empty place's line.
 */
export const MARK = { lead: 9, width: 30, reach: 12, inset: 4, line: 3 } as const

/**
 * The one selection's look: the sky-mist of the cursor with the focus colour's ring, the notes inside
 * it in the focus colour (ScoreView's `selected`). A note is a padded box round its column, an empty
 * place a line in the focus colour, the bars chosen one rounded box.
 */
export const MARK_CLASS = {
  note: 'rounded-lg bg-secondary ring-1 ring-ring/40',
  insert: 'rounded-full bg-ring',
  range: 'rounded-xl bg-secondary/70 ring-1 ring-ring/45',
} as const

export type MarkKind = keyof typeof MARK_CLASS

/** A mark's box over the engraving, in its layout's px. */
export interface MarkBox {
  readonly left: number
  readonly width: number
  readonly top: number
  readonly height: number
}

/** A staff's (or a row's) top and foot. */
export interface Span {
  readonly top: number
  readonly bottom: number
}

/** The staves a mark is over as one span, from the highest's top to the lowest's foot. */
export const spanOf = (staves: readonly Span[]): Span => ({
  top: Math.min(...staves.map((staff) => staff.top)),
  bottom: Math.max(...staves.map((staff) => staff.bottom)),
})

const over = ({ top, bottom }: Span, reach: number) => ({
  top: top - reach,
  height: bottom - top + 2 * reach,
})

/** One note (or chord, or beat group) chosen: a padded box round its column on the staves. */
export const noteBox = (
  layout: Pick<ScoreLayout, 'measures' | 'onsets'>,
  tick: Tick,
  span: Span,
  reach: number = MARK.reach,
): MarkBox => ({
  left: xAtTick(layout, tick) - MARK.lead,
  width: MARK.width,
  ...over(span, reach),
})

/** An empty place (a bar the pattern plays, the room after the last note): a slim line where the next note goes. */
export const insertBox = (
  layout: Pick<ScoreLayout, 'measures' | 'onsets'>,
  tick: Tick,
  span: Span,
  reach: number = MARK.reach,
): MarkBox => ({
  left: xAtTick(layout, tick) - MARK.lead,
  width: MARK.line,
  ...over(span, reach),
})

/**
 * The bars chosen on a line, measures `first` to `last` of its layout, as one box: from the first's
 * notes (a line's clef and key left out) to the last's barline, in from the barlines so a neighbour's
 * bars stay clear.
 */
export function rangeBox(
  layout: Pick<ScoreLayout, 'measures'>,
  first: number,
  last: number,
  span: Span,
  reach: number = MARK.reach,
): MarkBox {
  const from = layout.measures[first]
  const to = layout.measures[last]
  if (!from || !to) return { left: 0, width: 0, ...over(span, reach) }
  const left = Math.max(from.x + MARK.inset, from.notes - MARK.lead)
  return { left, width: to.x + to.width - MARK.inset - left, ...over(span, reach) }
}
