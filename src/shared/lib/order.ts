// A list's order as a drag leaves it (Mindscape's): written back over the whole list, and held on
// screen until the list says the same.

/**
 * An order dropped on a list a search narrowed, written back over the whole one: the rows on screen
 * take the order the finger gave them, in the slots they held, and a row the search hid keeps its
 * own, for nothing on screen said anything of it. A row the list does not hold is not written.
 */
export function mergeVisibleOrder<T>(all: readonly T[], visibleOrder: readonly T[]): T[] {
  const held = new Set(all)
  const moved = visibleOrder.filter((id) => held.has(id))
  const moving = new Set(moved)
  let next = 0
  return all.map((id) => (moving.has(id) ? (moved[next++] ?? id) : id))
}

/**
 * The order a drop asked for, against the list as it stands: the rows it still has in the order
 * dropped, then any it gained; `settled` once the list says the same, so the hold lets go.
 */
export function reconcileHeldOrder<T>(
  held: readonly T[],
  ids: readonly T[],
): { order: T[]; settled: boolean } {
  const present = new Set(ids)
  const holding = new Set(held)
  const order = [...held.filter((id) => present.has(id)), ...ids.filter((id) => !holding.has(id))]
  const settled = ids.length === order.length && ids.every((id, i) => id === order[i])
  return { order, settled }
}
