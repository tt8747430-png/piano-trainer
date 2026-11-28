/** The least a chord's name is set in its tile, px: `chord-fit`'s floor, its raised part too. */
const LEAST = 12
/** A letter's width at a size of 1, the reckoning kept on the safe side. */
const LETTER = 0.95
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

/**
 * Each beat column's least width, px, in rows of `columns` beats: its share of the names over it at
 * `LEAST`. Tiles run on, a tile that will not fit the row's rest starting the next, as the grid places them.
 */
function leastWidths(tiles: readonly TileRoom[], columns: number): number[] {
  const least = Array.from({ length: columns }, () => 0)
  let at = 0
  for (const tile of tiles) {
    const span = Math.min(tile.beats, columns)
    if (at + span > columns) at = 0
    const need = tile.name.length * LETTER * LEAST + 2 * tile.inset - (span - 1) * GAP
    for (let column = at; column < at + span; column++)
      least[column] = Math.max(least[column] ?? 0, need / span)
    at = (at + span) % columns
  }
  return least.map(Math.ceil)
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
  let rowBars = bars
  let least = leastWidths(tiles, perBar * rowBars)
  const fits = () => least.reduce((sum, px) => sum + px, 0) + (least.length - 1) * GAP <= width
  while (rowBars > 1 && width > 0 && !fits()) {
    rowBars = Math.max(1, Math.floor(rowBars / 2))
    least = leastWidths(tiles, perBar * rowBars)
  }
  return {
    columns: perBar * rowBars,
    template: least.map((px) => `minmax(${px}px, 1fr)`).join(' '),
  }
}
