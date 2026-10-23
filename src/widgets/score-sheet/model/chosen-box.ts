import type { Tick } from '@/shared/lib/music'
import type { StaffId } from '@/shared/lib/notation'
import { MARK, rangeMark, type MarkBox, type ScoreLayout, type Span } from '@/shared/ui/score'

/**
 * The notes chosen on a line as the one selection's box (ADR 0082, 0088): hugging the heads that
 * start in the piece's span `selection` on the staff of the row they are chosen in, from the first's
 * left to the last's right; in the chord row (`row` high), from the first chord's place to where the
 * last ends. None where the line (from `lineStart`) holds none of it.
 */
export function chosenBox(
  layout: Pick<ScoreLayout, 'measures' | 'onsets' | 'staves' | 'heads' | 'rests'>,
  lineStart: Tick,
  selection: { readonly from: Tick; readonly to: Tick } | null,
  {
    row = 0,
    staff,
  }: { row?: number; staff?: (Span & { readonly staff: StaffId }) | undefined } = {},
): MarkBox | null {
  if (!selection) return null
  const chosen = {
    staves: staff ? [staff.staff] : [],
    from: selection.from - lineStart,
    to: selection.to - lineStart,
  }
  return rangeMark(layout, chosen, staff ?? chordRow(row))
}

/** The chord row over the staff (`row` high) as a span: a mark over it fills it, reaching past it as over a staff. */
export const chordRow = (row: number): Span => ({ top: -row + MARK.reach, bottom: -MARK.reach })
