import { isSingleStaff } from '@/shared/lib/notation'
import type { Extent, ScoreLayout, StaffLabel } from '../layout'
import { textBox } from './svg-glyphs'

/** The middle of the staves' boxes given, top to bottom; none where none is drawn. */
function middleOf(boxes: readonly ({ top: number; bottom: number } | undefined)[]): number | null {
  const drawn = boxes.filter((box) => box !== undefined)
  const top = Math.min(...drawn.map((box) => box.top))
  const bottom = Math.max(...drawn.map((box) => box.bottom))
  return drawn.length > 0 ? (top + bottom) / 2 : null
}

/**
 * The staves' names Verovio printed at a first line's head (ADR 0094), in the line's px (`at` turns
 * Verovio's units into them): each name's box, its text right-aligned before its staves and as wide
 * as its letters, and which staves it names, a single staff (ADR 0097) or the piano's, by the staves
 * it stands nearest beside (Verovio keeps no id on a name).
 */
export function labelsOf(
  svg: SVGSVGElement,
  at: (box: Extent) => Extent,
  staves: ScoreLayout['staves'],
): StaffLabel[] {
  const piano = middleOf([staves.treble, staves.bass])
  const named: { readonly staves: StaffLabel['staves']; readonly middle: number }[] = [
    ...Object.entries(staves).flatMap(([staff, box]) =>
      isSingleStaff(staff) && box ? [{ staves: staff, middle: (box.top + box.bottom) / 2 }] : [],
    ),
    ...(piano === null ? [] : [{ staves: 'piano' as const, middle: piano }]),
  ]
  return [...svg.querySelectorAll('g.label text')].flatMap((text) => {
    const printed = textBox(text, 'end')
    if (!printed) return []
    const drawn = at(printed)
    // No further left than the engraving's edge.
    const box = { ...drawn, left: Math.max(0, drawn.left) }
    const middle = (box.top + box.bottom) / 2
    const nearest = named.reduce<(typeof named)[number] | undefined>(
      (best, each) =>
        !best || Math.abs(middle - each.middle) < Math.abs(middle - best.middle) ? each : best,
      undefined,
    )
    return nearest ? [{ staves: nearest.staves, ...box }] : []
  })
}
