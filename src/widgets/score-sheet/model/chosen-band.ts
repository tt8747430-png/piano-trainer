import type { Tick } from '@/shared/lib/music'
import type { StaffId } from '@/shared/lib/notation'
import {
  MARK,
  rangeBand,
  spaceOf,
  type BandBox,
  type ScoreLayout,
  type Span,
} from '@/shared/ui/score'

type Laid = Pick<ScoreLayout, 'measures' | 'onsets' | 'staves' | 'heads' | 'rests'>

/**
 * The notes chosen on a line as the one selection's band (ADR 0096): over the staff of the row they
 * are chosen in, from the first note starting in the piece's span `selection` to the last's right
 * edge; in the chord row (`row` high), from the first chord's place to where the last ends. None
 * where the line (from `lineStart`) holds none of it.
 */
export function chosenBand(
  layout: Laid,
  lineStart: Tick,
  selection: { readonly from: Tick; readonly to: Tick } | null,
  {
    row = 0,
    staff,
  }: { row?: number; staff?: (Span & { readonly staff: StaffId }) | undefined } = {},
): BandBox | null {
  if (!selection) return null
  const chosen = {
    staves: staff ? [staff.staff] : [],
    from: selection.from - lineStart,
    to: selection.to - lineStart,
  }
  return rangeBand(layout, chosen, staff ?? chordRow(layout, row))
}

/**
 * The chord row over the staff (`row` high) as a span a mark over it fills exactly, reaching past it
 * as over a staff.
 */
export function chordRow(layout: Pick<ScoreLayout, 'staves'>, row: number): Span {
  const reach = MARK.reach * spaceOf(layout)
  return { top: -row + reach, bottom: -reach }
}
