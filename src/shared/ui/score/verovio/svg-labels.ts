import type { Extent, ScoreLayout, StaffLabel } from '../layout'
import { numbers } from './svg-glyphs'

/** A name's character, as wide as Verovio reckons its text font's: a share of its size. */
const CHAR = 0.6
/** How far a name's letters reach over its baseline and under it, as shares of its size. */
const ASCENT = 0.75
const DESCENT = 0.25

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
    const [x] = numbers(text.getAttribute('x'))
    const [y] = numbers(text.getAttribute('y'))
    const sized = [...text.querySelectorAll('tspan[font-size]')].at(-1)
    const [size] = numbers(sized?.getAttribute('font-size') ?? null)
    const name = text.textContent?.trim() ?? ''
    if (x === undefined || y === undefined || !size || name === '') return []
    const drawn = at({
      left: x - name.length * CHAR * size,
      right: x,
      top: y - ASCENT * size,
      bottom: y + DESCENT * size,
    })
    // No further left than the engraving's edge.
    const box = { ...drawn, left: Math.max(0, drawn.left) }
    const middle = (box.top + box.bottom) / 2
    const nearer =
      piano === null || (tune !== null && Math.abs(middle - tune) < Math.abs(middle - piano))
    return [{ staves: nearer ? ('melody' as const) : ('piano' as const), ...box }]
  })
}
