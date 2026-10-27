import type { Midi, Tick } from '@/shared/lib/music'
import type { StaffId } from '@/shared/lib/notation'
import { leftAt, xAtTick, type Extent, type Head, type ScoreLayout } from './layout'

/**
 * The one selection's measures, in staff spaces (ADR 0096), the score editor's and the Player's
 * alike in every layout: how far past its staves' outer lines a mark reaches, how far clear of the
 * notes a band stands, how far before its notes a line (the caret, the playhead) stands, and how far
 * in from their barlines the bars chosen stand.
 */
export const MARK = { reach: 0.5, pad: 0.3, lead: 0.5, inset: 0.4 } as const

/** How far round a head a click still lands on it, in staff spaces (ADR 0096). */
export const GRAB = 0.35

/**
 * The marks' look (ADR 0096): what is chosen is coloured (the notes themselves, ScoreView's
 * `selected`); a range is a light band of the selection colour; the caret and the playhead a thin
 * line of it, its ends rounded.
 */
export const MARK_CLASS = {
  band: 'rounded-xs bg-ring/15',
  line: 'w-0.5 rounded-full bg-ring',
} as const

export type MarkKind = keyof typeof MARK_CLASS

/** A mark's place over the engraving, in its layout's px: a line's width is its look's. */
export interface MarkBox {
  readonly left: number
  readonly width?: number
  readonly top: number
  readonly height: number
}

/** A band's box: as wide as what it is over. */
export interface BandBox extends MarkBox {
  readonly width: number
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

/** A staff space on this engraving, in its px: a quarter of a staff's height (10 at full size). */
export function spaceOf(layout: Pick<ScoreLayout, 'staves'>): number {
  const [staff] = Object.values(layout.staves)
  return staff ? (staff.bottom - staff.top) / 4 : 10
}

/** A mark's height over its staves: their top line to their foot, a little past them. */
const over = ({ top, bottom }: Span, space: number) => ({
  top: top - MARK.reach * space,
  height: bottom - top + 2 * MARK.reach * space,
})

/** What a mark is over (ADR 0096): the notes starting in [from, to) on these staves (every staff without), one key alone where `midi` says. */
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

/** What is drawn of a choice: its heads, and its rests where it is no one key of a chord. */
const drawnChosen = (layout: Pick<ScoreLayout, 'heads' | 'rests'>, chosen: Chosen): Extent[] => [
  ...headsChosen(layout, chosen),
  ...(chosen.midi === undefined
    ? (layout.rests ?? []).filter(
        (rest) =>
          rest.tick >= chosen.from &&
          rest.tick < chosen.to &&
          (!chosen.staves || chosen.staves.includes(rest.staff)),
      )
    : []),
]

type Laid = Pick<ScoreLayout, 'measures' | 'onsets' | 'staves' | 'heads' | 'rests' | 'signs'>

/**
 * A range chosen (ADR 0096), the editor's notes: a light band over the staves `span` takes, from
 * its first note's left edge to its last note's right edge (its rests too), top line to foot and a
 * little past them; where nothing chosen is drawn here (the chord row), from its first place to
 * where its last ends. None where the line holds none of it.
 */
export function rangeBand(layout: Laid, chosen: Chosen, span: Span): BandBox | null {
  const space = spaceOf(layout)
  const drawn = drawnChosen(layout, chosen)
  if (drawn.length > 0) {
    const left = Math.min(...drawn.map((box) => box.left)) - MARK.pad * space
    const right = Math.max(...drawn.map((box) => box.right)) + MARK.pad * space
    return { left, width: right - left, ...over(span, space) }
  }
  const first = layout.measures[0]
  const last = layout.measures.at(-1)
  if (!first || !last) return null
  const from = Math.max(chosen.from, first.startTick)
  const to = Math.min(chosen.to, last.startTick + last.ticks)
  if (from >= to) return null
  const left = xAtTick(layout, from) - MARK.lead * space
  // To a barline: in from it, so the next bar stays clear.
  const atBar = layout.measures.find((m) => m.startTick + m.ticks === to)
  const right = atBar
    ? atBar.x + atBar.width - MARK.inset * space
    : xAtTick(layout, to) - MARK.lead * space
  return { left, width: Math.max(MARK.pad * space, right - left), ...over(span, space) }
}

/**
 * Where bars `first` to `last` of a layout start and end, as the loop's grips stand on them (ADR
 * 0096): on the first's barline, clear of what follows it (an accidental), or at a line's start
 * between its clef, key and time and its first notes (just before those where the line's head is
 * not read); on the last's closing barline.
 */
export function loopEnds(
  layout: Laid,
  first: number,
  last: number,
): { start: number; end: number } {
  const from = layout.measures[first]
  const to = layout.measures[last]
  if (!from || !to) return { start: 0, end: 0 }
  const end = to.x + to.width
  if (first > 0) return { start: from.x, end }
  const notes = leftAt(layout, from.startTick)
  const head = (layout.signs ?? []).filter((sign) => sign.measure === 0)
  return {
    start:
      head.length > 0
        ? (Math.max(...head.map((sign) => sign.right)) + notes) / 2
        : notes - MARK.lead * spaceOf(layout),
    end,
  }
}

/**
 * Bars chosen (ADR 0096), the Player's loop: one band over the staves `span` takes, measures
 * `first` to `last` of its layout, from where they start (`loopEnds`: a line's clef and key left
 * out) to the last's barline, in from its barlines so the bars beside it stay clear.
 */
export function barsBand(layout: Laid, first: number, last: number, span: Span): BandBox {
  const space = spaceOf(layout)
  if (!layout.measures[first] || !layout.measures[last])
    return { left: 0, width: 0, ...over(span, space) }
  const { start, end } = loopEnds(layout, first, last)
  const left = first > 0 ? start + MARK.inset * space : start
  return { left, width: end - MARK.inset * space - left, ...over(span, space) }
}

/**
 * The caret (ADR 0096): a thin line on its staff (`staves`, over `span`) just before the notes it
 * stands on and their accidentals, or where the next note goes on an empty place.
 */
export function caretLine(
  layout: Laid,
  tick: Tick,
  staves: readonly StaffId[],
  span: Span,
): MarkBox {
  const space = spaceOf(layout)
  return { left: leftAt(layout, tick, staves) - MARK.lead * space, ...over(span, space) }
}

/** What a point on the engraving lands on (ADR 0096): one head (`index`, `midi`), or a chord's column whole. */
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
 * What a click at (x, y) on the engraving chooses (ADR 0096), the editor's and the Player's alike:
 * the head under it (the nearest, where a chord's heads touch); else the chord whose column (its
 * heads and stem) it is on; else nothing: empty staff is never chosen.
 */
export function pickAt(
  layout: Pick<ScoreLayout, 'heads' | 'columns' | 'staves'>,
  x: number,
  y: number,
): Picked | null {
  const grab = GRAB * spaceOf(layout)
  const heads = layout.heads ?? []
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
