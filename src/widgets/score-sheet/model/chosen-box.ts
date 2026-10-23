import type { BarRange } from '@/features/score-editor'
import { MARK, rangeBox, type MarkBox, type ScoreLayout, type Span } from '@/shared/ui/score'

/**
 * The bars chosen on a line as the one selection's box (ADR 0082): exactly the line's bars from
 * `selection.from` to `selection.to` (`bars` are the piece's index of each of the line's measures),
 * over the staff of the row they are chosen in, or over the chord row (`row` high) where the chords
 * are chosen. None where no bar of the line is chosen.
 */
export function chosenBox(
  layout: Pick<ScoreLayout, 'measures'>,
  bars: readonly number[],
  selection: BarRange | null,
  { row = 0, staff }: { row?: number; staff?: Span | undefined } = {},
): MarkBox | null {
  if (!selection) return null
  const inside = layout.measures.flatMap((_, index) => {
    const bar = bars[index] ?? -1
    return bar >= selection.from && bar <= selection.to ? [index] : []
  })
  const first = inside[0]
  const last = inside.at(-1)
  if (first === undefined || last === undefined) return null
  return rangeBox(layout, first, last, staff ?? chordRow(row))
}

/** The chord row over the staff (`row` high) as a span: a mark over it fills it, reaching past it as over a staff. */
export const chordRow = (row: number): Span => ({ top: -row + MARK.reach, bottom: -MARK.reach })
