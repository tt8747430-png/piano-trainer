import type { StaffId } from '@/shared/lib/notation'
import type { Column, Extent, Head, Rest } from '../layout'

/** The numbers in a `translate(x, y) scale(s)` or a path's `M x y L x y`. */
const numbers = (text: string | null) => (text?.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number)

/**
 * The glyphs a head carries, Bravura's boxes in staff spaces from their origin (SMuFL's `bBoxSW` and
 * `bBoxNE`: left, foot, right, top, y up): the heads, then the accidentals.
 */
const GLYPHS: Readonly<Record<string, readonly [number, number, number, number]>> = {
  E0A0: [0, -0.5, 2.5, 0.5],
  E0A2: [0, -0.5, 1.688, 0.5],
  E0A3: [0, -0.5, 1.18, 0.5],
  E0A4: [0, -0.5, 1.18, 0.5],
  E260: [0, -0.7, 0.904, 1.756],
  E261: [0, -1.34, 0.672, 1.364],
  E262: [0, -1.392, 0.996, 1.4],
  E263: [0, -0.5, 0.988, 0.508],
  E264: [0, -0.7, 1.644, 1.756],
  // The rests: whole, half, quarter, 8th, 16th, 32nd.
  E4E3: [0, -0.5, 1.128, 0.04],
  E4E4: [0, -0.04, 1.128, 0.5],
  E4E5: [0, -1.5, 1.08, 1.5],
  E4E6: [0, -1, 0.988, 0.75],
  E4E7: [0, -2, 1.28, 0.75],
  E4E8: [0, -2, 1.46, 1.75],
}
/** A glyph not in the table: as large as a black head. */
const ANY = GLYPHS.E0A4 ?? [0, -0.5, 1.18, 0.5]
/** The scale Verovio draws a glyph at its full size: a staff space of its font's quarter em. */
const FULL = 0.72

/** Where a glyph `use` stands, in Verovio's units: its box from its origin and scale. */
function glyphBox(use: Element | null | undefined, space: number): Extent | null {
  if (!use) return null
  const [x = 0, y = 0, scale = FULL] = numbers(use.getAttribute('transform'))
  const href = use.getAttribute('href') ?? use.getAttribute('xlink:href') ?? ''
  const [left, foot, right, top] = GLYPHS[href.slice(1, 5)] ?? ANY
  const k = (space * scale) / FULL
  return { left: x + left * k, right: x + right * k, top: y - top * k, bottom: y - foot * k }
}

const union = (boxes: readonly (Extent | null)[]): Extent | null =>
  boxes.reduce<Extent | null>(
    (all, box) =>
      !box
        ? all
        : !all
          ? box
          : {
              left: Math.min(all.left, box.left),
              right: Math.max(all.right, box.right),
              top: Math.min(all.top, box.top),
              bottom: Math.max(all.bottom, box.bottom),
            },
    null,
  )

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
 * Each notehead of a line Verovio engraved (ADR 0088), with its accidental and its dots, and each
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
