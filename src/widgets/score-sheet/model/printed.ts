import type { ComponentProps, ReactElement, ReactNode } from 'react'
import type { StaffId } from '@/shared/lib/notation'
import type { Extent, ScoreLayout, Sign } from '@/shared/ui/score'

/**
 * What is printed on the sheet and edited where it is (ADR 0094), as Flat's and Dorico's: the tempo
 * mark; a key or time signature, from the piece's bar it stands at; a staff's clef there.
 */
export type Printed =
  | { readonly kind: 'tempo' }
  | { readonly kind: 'key'; readonly bar: number }
  | { readonly kind: 'time'; readonly bar: number }
  | { readonly kind: 'clef'; readonly bar: number; readonly staff: StaffId }

/**
 * What edits a thing printed: the page wraps the sheet's button over it (`trigger`) in what opens
 * there, a popover anchored to it.
 */
export type EditPrinted = (
  printed: Printed,
  trigger: ReactElement<ComponentProps<'button'>>,
) => ReactNode

/** A thing printed, the staff it is printed on, and the box a click on it takes, in the line's px. */
export interface PrintedTarget {
  readonly printed: Printed
  readonly staff: StaffId
  readonly box: Extent
}

/** How far a target reaches past its glyphs where nothing printed is beside it, in CSS px. */
const REACH = 6

/** The thing a sign printed at the piece's bar `bar` is. */
const printedOf = (sign: Sign, bar: number): Printed =>
  sign.kind === 'clef' ? { kind: 'clef', bar, staff: sign.staff } : { kind: sign.kind, bar }

/**
 * The targets over a line's clefs, key and time signatures (ADR 0094), `bars` the piece's bar of each
 * of its measures: each sign's box grown to meet its neighbours on its staff halfway, from the line's
 * start to short of its measure's first note, and over its staff's lines at least. The tune's staff
 * keeps its clef: only the piano's two change clef.
 */
export function signTargets(layout: ScoreLayout, bars: readonly number[]): PrintedTarget[] {
  const signs = layout.signs ?? []
  return signs.flatMap((sign, index) => {
    const bar = bars[sign.measure]
    const lines = layout.staves[sign.staff]
    const measure = layout.measures[sign.measure]
    if (bar === undefined || !lines || !measure) return []
    if (sign.kind === 'clef' && sign.staff === 'melody') return []
    const beside = (other: Sign | undefined): other is Sign =>
      other !== undefined && other.staff === sign.staff && other.measure === sign.measure
    const before = signs[index - 1]
    const after = signs[index + 1]
    const left = beside(before)
      ? (before.right + sign.left) / 2
      : Math.max(measure.x, sign.left - REACH)
    const right = beside(after)
      ? (sign.right + after.left) / 2
      : Math.max(sign.right, Math.min(sign.right + REACH, measure.notes - REACH))
    return [
      {
        printed: printedOf(sign, bar),
        staff: sign.staff,
        box: {
          left,
          right,
          top: Math.min(sign.top, lines.top - REACH),
          bottom: Math.max(sign.bottom, lines.bottom + REACH),
        },
      },
    ]
  })
}
