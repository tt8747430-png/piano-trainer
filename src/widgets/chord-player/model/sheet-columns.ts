/** The least a chord's name is set in its tile, px: `chord-fit`'s floor, its raised part too. */
const LEAST = 12
/** A letter's width at a size of 1, the reckoning kept on the safe side. */
const LETTER = 0.9
/** The tiles' gap, px (`gap-2`). */
const GAP = 8

/** A tile as the sheet lays it: how many beats it spans, its name, and its inset either side. */
export interface TileRoom {
  readonly beats: number
  readonly name: string
  readonly inset: number
}

/** A section's rows: how many beats a row holds, and its columns' template. */
export interface SheetLayout {
  readonly columns: number
  readonly template: string
}

/** Where each tile stands in rows of `columns` beats, as the grid places them: its first column and span. */
function placed(tiles: readonly TileRoom[], columns: number) {
  let at = 0
  return tiles.map((tile) => {
    const span = Math.min(tile.beats, columns)
    if (at + span > columns) at = 0
    const place = { tile, from: at, span }
    at = (at + span) % columns
    return place
  })
}

/**
 * The columns' widths as the grid gives them across `width`: each column its least, the rest of the
 * row shared evenly by the columns its share is not below the least of (`minmax(least, 1fr)`).
 */
function resolved(least: readonly number[], width: number): number[] {
  const free = width - (least.length - 1) * GAP
  const fixed = new Set<number>()
  for (;;) {
    const left = least.reduce((sum, px, at) => (fixed.has(at) ? sum - px : sum), free)
    const share = left / (least.length - fixed.size)
    const more = least.findIndex((px, at) => !fixed.has(at) && px > share)
    if (more < 0) return least.map((px, at) => (fixed.has(at) ? px : share))
    fixed.add(more)
  }
}

/**
 * Each beat column's least width, px, in rows of `columns` beats across `width`, or null where the row
 * cannot hold every name whole at `LEAST`: a tile whose name does not fit the width the grid gives it
 * asks its columns for the room, again until every tile fits.
 */
function leastWidths(tiles: readonly TileRoom[], columns: number, width: number): number[] | null {
  const places = placed(tiles, columns)
  const least = Array.from({ length: columns }, () => 0)
  for (let round = 0; round <= tiles.length; round++) {
    const widths = resolved(least, width)
    let grew = false
    for (const { tile, from, span } of places) {
      const has = widths.slice(from, from + span).reduce((sum, px) => sum + px, 0)
      const need = tile.name.length * LETTER * LEAST + 2 * tile.inset - (span - 1) * GAP
      if (need <= has + 0.5) continue
      for (let column = from; column < from + span; column++)
        least[column] = Math.max(least[column] ?? 0, Math.ceil(need / span))
      grew = true
    }
    if (least.reduce((sum, px) => sum + px, 0) + (columns - 1) * GAP > width) return null
    if (!grew) return least
  }
  return least
}

/**
 * A section's rows (owner, 2026-11-28: "the chords are cropped … because not enough space"): as many
 * bars a row as `bars` allows, fewer where the row's `width` cannot hold every name whole at `LEAST`;
 * each beat its share of the row, a column never narrower than the names over it need, so a long name
 * on one beat (Cmaj⁷/E) is set whole and the beats beside it give it the room.
 */
export function sheetLayout(
  tiles: readonly TileRoom[],
  perBar: number,
  bars: number,
  width: number,
): SheetLayout {
  for (let rowBars = bars; ; rowBars = Math.floor(rowBars / 2)) {
    const columns = perBar * Math.max(1, rowBars)
    const least = width > 0 ? leastWidths(tiles, columns, width) : null
    if (least || rowBars <= 1)
      return {
        columns,
        template: (least ?? Array.from({ length: columns }, () => 0))
          .map((px) => `minmax(${px}px, 1fr)`)
          .join(' '),
      }
  }
}
