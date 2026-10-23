import type { Midi, Tick } from '@/shared/lib/music'
import type { StaffId } from '@/shared/lib/notation'
import { xAtTick, type Extent, type Head, type ScoreLayout } from './layout'

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

/**
 * How far a mark stands clear of the heads it hugs, and how far round a head a click still lands on
 * it, in staff spaces (ADR 0086): a hair's room, about 3 px on a full-size staff.
 */
export const HUG = { pad: 0.3, grab: 0.35 } as const

/** A staff space on this engraving, in its px: a quarter of a staff's height (10 at full size). */
export function spaceOf(layout: Pick<ScoreLayout, 'staves'>): number {
  const [staff] = Object.values(layout.staves)
  return staff ? (staff.bottom - staff.top) / 4 : 10
}

/** What a mark is over (ADR 0086): the notes starting in [from, to) on these staves (every staff without), one key alone where `midi` says. */
export interface Chosen {
  readonly staves?: readonly StaffId[] | undefined
  readonly from: Tick
  readonly to: Tick
  readonly midi?: Midi | undefined
}

/** The heads a choice is over. */
export const headsChosen = (layout: Pick<ScoreLayout, 'heads'>, chosen: Chosen): Head[] =>
  (layout.heads ?? []).filter(
    (head) =>
      head.tick >= chosen.from &&
      head.tick < chosen.to &&
      (!chosen.staves || chosen.staves.includes(head.staff)) &&
      (chosen.midi === undefined || head.midi === chosen.midi),
  )

/** A box hugging boxes, `pad` clear of them all round; none round none. */
export function hug(boxes: readonly Extent[], pad: number): MarkBox | null {
  if (boxes.length === 0) return null
  const left = Math.min(...boxes.map((box) => box.left)) - pad
  const top = Math.min(...boxes.map((box) => box.top)) - pad
  return {
    left,
    top,
    width: Math.max(...boxes.map((box) => box.right)) + pad - left,
    height: Math.max(...boxes.map((box) => box.bottom)) + pad - top,
  }
}

type Laid = Pick<ScoreLayout, 'measures' | 'onsets' | 'staves' | 'heads'>

/**
 * A note, a chord or a beat chosen (ADR 0086), the editor's caret and the Player's cursor alike:
 * a box hugging exactly its heads, their accidentals and dots; where none is drawn (a rest), a
 * padded box round its column over `span`.
 */
export function noteMark(layout: Laid, chosen: Chosen, span: Span): MarkBox {
  return (
    hug(headsChosen(layout, chosen), HUG.pad * spaceOf(layout)) ??
    noteBox(layout, chosen.from, span)
  )
}

/**
 * Notes chosen (ADR 0086), the editor's range and the Player's loop alike: one box hugging their
 * heads on this line, from the first's left to the last's right and the highest's top to the
 * lowest's foot; where none is drawn here (rests, the chord row), from the first's place to where
 * the last ends over `span`. None where the line holds none of it.
 */
export function rangeMark(layout: Laid, chosen: Chosen, span: Span): MarkBox | null {
  const hugged = hug(headsChosen(layout, chosen), HUG.pad * spaceOf(layout))
  if (hugged) return hugged
  const first = layout.measures[0]
  const last = layout.measures.at(-1)
  if (!first || !last) return null
  const end = last.startTick + last.ticks
  const from = Math.max(chosen.from, first.startTick)
  const to = Math.min(chosen.to, end)
  if (from >= to) return null
  const left = xAtTick(layout, from) - MARK.lead
  // To a barline: in from it, so the next bar stays clear.
  const atBar = layout.measures.find((m) => m.startTick + m.ticks === to)
  const right = atBar ? atBar.x + atBar.width - MARK.inset : xAtTick(layout, to) - MARK.lead
  return { left, width: Math.max(MARK.line, right - left), ...over(span, MARK.reach) }
}

/** What a point on the engraving lands on (ADR 0086): one head (`index`, `midi`), or a chord's column whole. */
export interface Picked {
  readonly staff: StaffId
  readonly tick: Tick
  /** One note of its chord, its head clicked; none, the chord whole (its stem, its free room). */
  readonly index?: number
  readonly midi?: Midi
}

const holds = (box: Extent, x: number, y: number, room: number) =>
  x >= box.left - room && x <= box.right + room && y >= box.top - room && y <= box.bottom + room

const centre = (box: Extent, x: number, y: number) =>
  Math.hypot((box.left + box.right) / 2 - x, (box.top + box.bottom) / 2 - y)

/**
 * What a click at (x, y) on the engraving chooses (ADR 0086), the editor's and the Player's alike:
 * the head under it (the nearest, where a chord's heads touch); else the chord whose column (its
 * heads and stem) it is on; else nothing: empty staff is never chosen. `accept` leaves heads out (a
 * bar the pattern plays, drawn soft, in the editor).
 */
export function pickAt(
  layout: Pick<ScoreLayout, 'heads' | 'columns' | 'staves'>,
  x: number,
  y: number,
  accept: (head: Head) => boolean = () => true,
): Picked | null {
  const grab = HUG.grab * spaceOf(layout)
  const heads = (layout.heads ?? []).filter(accept)
  const under = heads
    .filter((head) => holds(head, x, y, grab))
    .sort((a, b) => centre(a, x, y) - centre(b, x, y))[0]
  if (under) {
    const { staff, tick, index, midi } = under
    return midi === undefined ? { staff, tick, index } : { staff, tick, index, midi }
  }
  const column = (layout.columns ?? []).find(
    (each) =>
      holds(each, x, y, grab) &&
      heads.some((head) => head.staff === each.staff && head.tick === each.tick),
  )
  return column ? { staff: column.staff, tick: column.tick } : null
}
