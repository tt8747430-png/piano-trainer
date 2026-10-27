import type { StaffId } from '@/shared/lib/notation'
import type { Extent, Sign, SignKind } from '../layout'
import { glyphBox, union } from './svg-glyphs'

/** Each sign Verovio draws, by its group's class. */
const KINDS: readonly (readonly [SignKind, string])[] = [
  ['clef', 'clef'],
  ['key', 'keySig'],
  ['time', 'meterSig'],
]

/**
 * Each clef, key and time signature of a line Verovio engraved (ADR 0114), in the line's px (`at`
 * turns Verovio's units into them), top staff first and each staff's left to right: the staff
 * whose group holds it (a clef changed inside a measure stands in its layer), the measure (`m-<i>`)
 * and the box round its glyphs. A sign past its measure's first note is a courtesy for the next
 * line, Verovio's at the line's end, and is left out.
 */
export function signsOf(
  svg: SVGSVGElement,
  space: number,
  at: (box: Extent) => Extent,
  staves: readonly StaffId[],
  /** Where each measure's notes begin, in the line's px. */
  notesAt: (measure: number) => number,
): Sign[] {
  const signs: Sign[] = []
  for (const measure of svg.querySelectorAll('g.measure[id^="m-"]')) {
    const index = Number(measure.id.slice(2))
    if (Number.isNaN(index)) continue
    const groups = [...measure.children].filter((child) => child.classList.contains('staff'))
    groups.forEach((group, number) => {
      const staff = staves[number]
      if (!staff) return
      const found = KINDS.flatMap(([kind, name]) =>
        [...group.querySelectorAll(`g.${name}`)].flatMap((sign) => {
          const box = union([...sign.querySelectorAll('use')].map((use) => glyphBox(use, space)))
          return box ? [{ kind, staff, measure: index, ...at(box) }] : []
        }),
      )
      signs.push(
        ...found.filter((sign) => sign.left < notesAt(index)).sort((a, b) => a.left - b.left),
      )
    })
  }
  return signs
}
