import type { Midi, Tick } from '@/shared/lib/music'
import type { StaffId, StaffInstruments } from '@/shared/lib/notation'

/** Where an engraving's staves, bars and onsets stand, in CSS px from its top left. */
export interface ScoreLayout {
  /** The engraving's size in CSS pixels. */
  readonly width: number
  readonly height: number
  /** The top staff's top line and the bottom staff's bottom line. */
  readonly staffTop: number
  readonly staffBottom: number
  readonly measures: readonly {
    readonly startTick: Tick
    readonly ticks: Tick
    readonly x: number
    readonly width: number
    /** Where its notes begin, after any clef, key and time signature. */
    readonly notes: number
  }[]
  /** Each staff drawn: its top and bottom lines. */
  readonly staves: Partial<Record<StaffId, { readonly top: number; readonly bottom: number }>>
  /** What each sung staff is played on, where one is chosen (ADR 0070): its name over it. */
  readonly staffInstruments?: StaffInstruments
  /** Each written onset left to right: its tick and its first notehead's or rest's x. */
  readonly onsets: readonly { readonly tick: Tick; readonly x: number }[]
  /** Each notehead drawn, with its accidental and dots (ADR 0086): what a selection hugs. */
  readonly heads?: readonly Head[]
  /** Each chord's (or note's) column on its staff: its heads and its stem, what a click on it chooses whole. */
  readonly columns?: readonly Column[]
}

/** A box on the engraving, in its px: its left, right, top and foot. */
export interface Extent {
  readonly left: number
  readonly right: number
  readonly top: number
  readonly bottom: number
}

/** A notehead drawn: its note's id (`n-<staff>-<tick>-<i>`, ADR 0078), its key where known, and its box. */
export interface Head extends Extent {
  readonly id: string
  readonly staff: StaffId
  readonly tick: Tick
  /** Its place in its chord, lowest first. */
  readonly index: number
  readonly midi?: Midi
}

/** A chord's (or a note's) column on its staff: its heads with its stem. */
export interface Column extends Extent {
  readonly staff: StaffId
  readonly tick: Tick
}

/**
 * The x of a tick among a bar's points in tick order (its onsets, then its end): a point's own, or in
 * proportion between the two around it; past the last, the last's.
 */
export function xAmong(points: readonly { tick: Tick; x: number }[], tick: Tick): number {
  const next = points.findIndex((point) => point.tick >= tick)
  const after = points[next]
  const before = points[next - 1]
  if (!after) return points.at(-1)?.x ?? 0
  if (!before || after.tick === tick) return after.x
  return before.x + ((after.x - before.x) * (tick - before.tick)) / (after.tick - before.tick)
}

/**
 * The x of any tick: an onset's own, or in proportion between the onsets around it, its bar's start
 * where nothing is written there (where its notes begin) and its bar's end.
 */
export function xAtTick(layout: Pick<ScoreLayout, 'measures' | 'onsets'>, tick: Tick): number {
  const measure =
    layout.measures.find((m) => tick < m.startTick + m.ticks) ?? layout.measures.at(-1)
  if (!measure) return 0
  const end = measure.startTick + measure.ticks
  const onsets = layout.onsets.filter(
    (onset) => onset.tick >= measure.startTick && onset.tick < end,
  )
  const opening = onsets.some((onset) => onset.tick === measure.startTick)
    ? []
    : [{ tick: measure.startTick, x: measure.notes }]
  return xAmong([...opening, ...onsets, { tick: end, x: measure.x + measure.width }], tick)
}
