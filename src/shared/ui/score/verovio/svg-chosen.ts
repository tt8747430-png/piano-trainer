import type { Chosen } from '../selection'
import { glyphBox, numbers } from './svg-glyphs'

/** What an engraved note or rest is on, from its id: `n-<staff>-<tick>-<i>`, `r-<staff>-<tick>` (ADR 0087). */
const placeOf = (element: Element) => {
  const [, staff = '', tick = ''] = element.id.split('-')
  return { staff, tick: Number(tick) }
}

/** A staff's top and bottom lines and its space, in Verovio's units. */
function linesOf(staff: Element) {
  const paths = [...staff.children].filter((child) => child.tagName === 'path')
  const top = numbers(paths[0]?.getAttribute('d') ?? null)[1] ?? 0
  const bottom = numbers(paths.at(-1)?.getAttribute('d') ?? null)[1] ?? 0
  return { top, bottom, space: (bottom - top) / 4 || 180 }
}

/** Where a note's head stands, in Verovio's units: its height on the staff. */
const headY = (note: Element) =>
  numbers(note.querySelector(':scope > g.notehead > use')?.getAttribute('transform') ?? null)[1] ??
  0

/** The ledger lines a note's head stands on or beyond, from its staff out to it, under its head. */
function ledgersOf(note: Element): Element[] {
  const staff = note.closest('g.staff')
  if (!staff) return []
  const lines = linesOf(staff)
  const box = glyphBox(note.querySelector(':scope > g.notehead > use'), lines.space)
  if (!box) return []
  const y = headY(note)
  // A head on a line stands where the line is drawn, give or take Verovio's rounding.
  const near = lines.space / 4
  return [...staff.querySelectorAll(':scope > g.ledgerLines > path')].filter((dash) => {
    const [x1 = 0, at = 0, x2 = 0] = numbers(dash.getAttribute('d'))
    const under = Math.min(x1, x2) < box.right && Math.max(x1, x2) > box.left
    const out = at < lines.top ? at >= y - near : at > lines.bottom && at <= y + near
    return under && out
  })
}

/** A chord's dots that are its chosen notes': each dot is the head's nearest it. */
function dotsOf(chord: Element, chosen: ReadonlySet<Element>): Element[] {
  const heads = [...chord.children]
    .filter((child) => child.classList.contains('note'))
    .map((note) => ({ note, y: headY(note) }))
  return [...chord.querySelectorAll(':scope > g.dots > ellipse')].filter((dot) => {
    const cy = Number(dot.getAttribute('cy'))
    const nearest = heads.slice().sort((a, b) => Math.abs(a.y - cy) - Math.abs(b.y - cy))[0]
    return nearest !== undefined && chosen.has(nearest.note)
  })
}

/**
 * The parts of an engraving that draw what is chosen (ADR 0096), to colour: each note starting in
 * [from, to) on the staves chosen (every staff without), only those of `keys` where one key of a
 * chord is chosen (its head and accidental, and its dot); a chord whose notes are all chosen, whole,
 * with its stem, flag and dots (a lone note holds its own); each rest, unless one key is chosen; and
 * each ledger line from its staff out to a head chosen.
 */
export function chosenParts(
  svg: Element,
  chosen: Chosen,
  keys: ReadonlySet<string> | null,
): Element[] {
  const staves = chosen.staves as readonly string[] | undefined
  const inChoice = (element: Element) => {
    const { staff, tick } = placeOf(element)
    return tick >= chosen.from && tick < chosen.to && (!staves || staves.includes(staff))
  }
  const notes = [...svg.querySelectorAll('g.note[id^="n-"]')].filter(
    (note) => inChoice(note) && (!keys || keys.has(note.id)),
  )
  const marked = new Set(notes)
  const chords = [
    ...new Set(
      notes.flatMap((note) =>
        note.parentElement?.classList.contains('chord') ? [note.parentElement] : [],
      ),
    ),
  ]
  const whole = chords.filter((chord) =>
    [...chord.children]
      .filter((child) => child.classList.contains('note'))
      .every((note) => marked.has(note)),
  )
  const rests = keys ? [] : [...svg.querySelectorAll('g.rest[id^="r-"]')].filter(inChoice)
  return [
    ...notes,
    ...whole,
    ...chords.filter((chord) => !whole.includes(chord)).flatMap((chord) => dotsOf(chord, marked)),
    ...rests,
    ...notes.flatMap(ledgersOf),
  ]
}
