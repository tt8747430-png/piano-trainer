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

/** The order with group `group` (its key) taken out and put at place `to` among the groups. */
export function withGroupAt(order: RowOrder, group: string, to: number): RowOrder {
  const moved = order.find((each) => each.key === group)
  if (!moved) return order
  const rest = order.filter((each) => each !== moved)
  return [...rest.slice(0, to), moved, ...rest.slice(to)]
}

/** The order without row `row`. */
export const withRowRemoved = (order: RowOrder, row: string): RowOrder =>
  order.map((each) => ({ ...each, rows: each.rows.filter((key) => key !== row) }))
