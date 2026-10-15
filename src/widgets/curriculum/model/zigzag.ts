/** The column of a journey's node, of three: down the middle, out to one side, back, out to the other. */
const COLUMNS = [1, 0, 1, 2] as const

export const columnOf = (index: number): 0 | 1 | 2 => COLUMNS[index % COLUMNS.length] ?? 1

/** A column's centre across the map, in per cent of its width. */
export const centreOf = (column: 0 | 1 | 2): number => ((column + 0.5) / 3) * 100
