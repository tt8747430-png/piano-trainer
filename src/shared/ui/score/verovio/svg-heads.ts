import type { StaffId } from '@/shared/lib/notation'
import type { Column, Extent, Head, Rest } from '../layout'
import { glyphBox, numbers, union } from './svg-glyphs'

/** The dots' right edge: a note's own, or its chord's. */
function dotsRight(note: Element): number | null {
  const group =
    note.querySelector(':scope > g.dots') ?? note.parentElement?.querySelector(':scope > g.dots')
  const ends = [...(group?.querySelectorAll('ellipse') ?? [])].map(
    (dot) => Number(dot.getAttribute('cx')) + Number(dot.getAttribute('rx')),
  )
  return ends.length > 0 ? Math.max(...ends) : null
}

/** A stem's line, in Verovio's units: its x and its two ends. */
function stemBox(group: Element | null): Extent | null {
  const path = group?.querySelector(':scope > g.stem > path')
  const [x1, y1, x2, y2] = numbers(path?.getAttribute('d') ?? null)
  if (x1 === undefined || y1 === undefined || x2 === undefined || y2 === undefined) return null
  return {
    left: Math.min(x1, x2),
    right: Math.max(x1, x2),
    top: Math.min(y1, y2),
    bottom: Math.max(y1, y2),
  }
}

/**
 * Each notehead of a line Verovio engraved (ADR 0096), with its accidental and its dots, and each
 * chord's column with its stem, in the line's px (`at` turns Verovio's units into them): read from
 * the glyphs' places and their boxes in the font, so it reads the same anywhere, a test's DOM too.
 */
export function headsOf(
  svg: SVGSVGElement,
  space: number,
  at: (box: Extent) => Extent,
): { heads: Head[]; columns: Column[]; rests: Rest[] } {
  const heads: Head[] = []
  /** Each head's chord (or the note itself, alone): where its stem is drawn. */
  const groups = new Map<string, Element>()
  for (const note of svg.querySelectorAll('g.note[id^="n-"]')) {
    const [, staff, tick, index] = note.id.split('-')
    const head = glyphBox(note.querySelector(':scope > g.notehead > use'), space)
    if (!staff || !head) continue
    const accid = glyphBox(note.querySelector(':scope > g.accid use'), space)
    const dots = dotsRight(note)
    const box = union([head, accid, dots === null ? null : { ...head, right: dots }])
    if (!box) continue
    const parent = note.parentElement
    const key = `${staff}-${tick}`
    if (!groups.has(key)) groups.set(key, parent?.classList.contains('chord') ? parent : note)
    heads.push({
      id: note.id,
      staff: staff as StaffId,
      tick: Number(tick),
      index: Number(index),
      ...at(box),
    })
  }
  const columns = new Map<string, Column>()
  for (const head of heads) {
    const key = `${head.staff}-${head.tick}`
    const before = columns.get(key)
    if (!before) {
      const stem = stemBox(groups.get(key) ?? null)
      columns.set(key, {
        staff: head.staff,
        tick: head.tick,
        ...(union([head, stem && at(stem)]) ?? head),
      })
    } else columns.set(key, { ...before, ...(union([before, head]) ?? before) })
  }
  const rests: Rest[] = []
  for (const rest of svg.querySelectorAll('g.rest[id^="r-"]')) {
    const [, staff, tick] = rest.id.split('-')
    const box = glyphBox(rest.querySelector('use'), space)
    if (staff && box) rests.push({ staff: staff as StaffId, tick: Number(tick), ...at(box) })
  }
  return { heads, columns: [...columns.values()], rests }
}
