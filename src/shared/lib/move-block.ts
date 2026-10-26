/**
 * Where rows dropped on another land (Mindscape's): carried together, side by side in their own
 * order, after the row from above it and before it from below, as from their top one. Dropped on a
 * row they carry, on a row not there, or carrying none, nothing moves. A new list either way.
 */
export function moveBlock<T>(order: readonly T[], carried: ReadonlySet<T>, overId: T): T[] {
  if (carried.has(overId) || !order.includes(overId)) return [...order]
  const block = order.filter((id) => carried.has(id))
  if (block.length === 0) return [...order]
  const rest = order.filter((id) => !carried.has(id))
  const overIndex = order.indexOf(overId)
  const firstCarried = order.findIndex((id) => carried.has(id))
  const at = rest.indexOf(overId) + (overIndex > firstCarried ? 1 : 0)
  return [...rest.slice(0, at), ...block, ...rest.slice(at)]
}
