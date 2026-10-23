/** A chord name's character, as a share of its size: the display face's semibold, a little generous. */
const CHAR = 0.6
/** The gap kept before the next chord's name. */
const GAP = 4
/** The least share of its size a name is drawn at: smaller, it is not read at a glance. */
const LEAST = 0.7

/**
 * The size each chord name over a staff is drawn at (CSS px): `size`, or smaller where the name would
 * run into the next one (or past the line's `end`), so a bar of many chords stays readable; never
 * under `LEAST` of it. `chords` stand in order at their x.
 */
export function chordLabelSizes(
  chords: readonly { readonly x: number; readonly symbol: string }[],
  end: number,
  size: number,
): number[] {
  return chords.map((chord, index) => {
    const room = (chords[index + 1]?.x ?? end) - chord.x - GAP
    const fits = room / (chord.symbol.length * CHAR)
    return Math.max(size * LEAST, Math.min(size, fits))
  })
}
