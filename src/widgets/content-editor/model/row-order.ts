/** Rows in groups, by key: a course's lessons (one group), a journey's chapters' steps. */
export type RowOrder = readonly { readonly key: string; readonly rows: readonly string[] }[]

/** Where row `row` is: its group's index and its place in it; null where no group has it. */
export function rowPlace(order: RowOrder, row: string): { group: number; at: number } | null {
  for (const [group, each] of order.entries()) {
    const at = each.rows.indexOf(row)
    if (at !== -1) return { group, at }
  }
  return null
}

/** The order with row `row` taken out and put in group `group` before its row `at` (its end past it). */
export function withRowAt(order: RowOrder, row: string, group: number, at: number): RowOrder {
  const without = order.map((each) => ({ ...each, rows: each.rows.filter((key) => key !== row) }))
  return without.map((each, index) =>
    index === group
      ? { ...each, rows: [...each.rows.slice(0, at), row, ...each.rows.slice(at)] }
      : each,
  )
}

/**
 * The order with a row moved one place up or down: past its neighbour, or from a group's edge onto
 * the next group's (the previous one's end, the next one's start); null where it cannot move.
 */
export function withRowMoved(order: RowOrder, row: string, by: -1 | 1): RowOrder | null {
  const place = rowPlace(order, row)
  if (!place) return null
  const rows = order[place.group]?.rows ?? []
  const to = place.at + by
  if (to >= 0 && to < rows.length) return withRowAt(order, row, place.group, to)
  const group = place.group + by
  const next = order[group]
  if (!next) return null
  return withRowAt(order, row, group, by < 0 ? next.rows.length : 0)
}

/** The order without row `row`. */
export const withRowRemoved = (order: RowOrder, row: string): RowOrder =>
  order.map((each) => ({ ...each, rows: each.rows.filter((key) => key !== row) }))
