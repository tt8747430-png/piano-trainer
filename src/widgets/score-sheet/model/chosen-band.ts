import type { Tick } from '@/shared/lib/music'
import { snapRange, type BeatMark, type StaffId } from '@/shared/lib/notation'
import {
  beatsBand,
  MARK,
  spaceOf,
  type BandBox,
  type ScoreLayout,
  type Span,
} from '@/shared/ui/score'

type Laid = Pick<ScoreLayout, 'measures' | 'onsets' | 'staves' | 'heads' | 'rests' | 'signs'>

/**
 * The notes chosen on a line as the one selection's band (ADR 0096, R29-P16): over the staff of the
 * row they are chosen in (the chord row, `row` high, choosing chords), snapped to the bars' beats
 * (`beats`, the line's grid from its start): from the beat the first note falls in to the end of the
 * beat the last one ends in, bar line to bar line for whole bars. None where the line (from
 * `lineStart`) holds none of it.
 */
export function chosenBand(
  layout: Laid,
  lineStart: Tick,
  selection: { readonly from: Tick; readonly to: Tick } | null,
  {
    row = 0,
    staff,
    beats = [],
  }: {
    row?: number
    staff?: (Span & { readonly staff: StaffId }) | undefined
    beats?: readonly BeatMark[]
  } = {},
): BandBox | null {
  if (!selection) return null
  const { from, to } = snapRange(
    { from: selection.from - lineStart, to: selection.to - lineStart },
    beats,
  )
  return beatsBand(layout, from, to, staff ?? chordRow(layout, row))
}

/**
 * The chord row over the staff (`row` high) as a span a mark over it fills exactly, reaching past it
 * as over a staff.
 */
export function chordRow(layout: Pick<ScoreLayout, 'staves'>, row: number): Span {
  const reach = MARK.reach * spaceOf(layout)
  return { top: -row + reach, bottom: -reach }
}
