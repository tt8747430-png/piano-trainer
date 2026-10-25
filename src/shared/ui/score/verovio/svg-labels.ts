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
 * as its letters, and which staves it names, the tune's or the piano's, by the staves it stands
 * beside (Verovio keeps no id on a name).
 */
export function labelsOf(
  svg: SVGSVGElement,
  at: (box: Extent) => Extent,
  staves: ScoreLayout['staves'],
): StaffLabel[] {
  const tune = middleOf([staves.melody])
  const piano = middleOf([staves.treble, staves.bass])
  return [...svg.querySelectorAll('g.label text')].flatMap((text) => {
    const printed = textBox(text, 'end')
    if (!printed) return []
    const drawn = at(printed)
    // No further left than the engraving's edge.
    const box = { ...drawn, left: Math.max(0, drawn.left) }
    const middle = (box.top + box.bottom) / 2
    const nearer =
      piano === null || (tune !== null && Math.abs(middle - tune) < Math.abs(middle - piano))
    return [{ staves: nearer ? ('melody' as const) : ('piano' as const), ...box }]
  })
}
