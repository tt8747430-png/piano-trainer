import type { Extent } from '../layout'

/** The numbers in a `translate(x, y) scale(s)` or a path's `M x y L x y`. */
export const numbers = (text: string | null) => (text?.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number)

/**
 * The glyphs Verovio draws, Bravura's boxes in staff spaces from their origin (SMuFL's `bBoxSW` and
 * `bBoxNE`: left, foot, right, top, y up): the heads, the accidentals, the rests, the clefs (and the
 * smaller ones a clef changes to inside a line).
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
  // The clefs: treble and bass, then each as a change inside a line.
  E050: [0, -2.632, 2.684, 4.392],
  E062: [-0.02, -2.54, 2.736, 1.048],
  E07A: [0, -2.104, 2.144, 3.52],
  E07C: [-0.016, -2.032, 2.188, 0.838],
}
/** A time signature's digit (E080 to E089), common or cut time: a staff space over and under its line. */
const TIME_DIGIT = [0.08, -1, 1.76, 1] as const
/** A glyph not in the table: as large as a black head. */
const ANY = GLYPHS.E0A4 ?? [0, -0.5, 1.18, 0.5]
/** The scale Verovio draws a glyph at its full size: a staff space of its font's quarter em. */
const FULL = 0.72

/** Where a glyph `use` stands, in Verovio's units: its box from its origin and scale. */
export function glyphBox(use: Element | null | undefined, space: number): Extent | null {
  if (!use) return null
  const [x = 0, y = 0, scale = FULL] = numbers(use.getAttribute('transform'))
  const href = use.getAttribute('href') ?? use.getAttribute('xlink:href') ?? ''
  const name = href.slice(1, 5)
  const [left, foot, right, top] = GLYPHS[name] ?? (name.startsWith('E08') ? TIME_DIGIT : ANY)
  const k = (space * scale) / FULL
  return { left: x + left * k, right: x + right * k, top: y - top * k, bottom: y - foot * k }
}

/** The box round all of `boxes`; none where none is given. */
export const union = (boxes: readonly (Extent | null)[]): Extent | null =>
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
