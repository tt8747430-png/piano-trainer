/** `list` with `item` put in (at the end) or taken out: as `on` says, else the other way from now. */
export const toggled = <T>(list: readonly T[], item: T, on = !list.includes(item)): T[] =>
  on ? [...list.filter((each) => each !== item), item] : list.filter((each) => each !== item)

/** `set` with `item` taken out if it is in, else put in: a fold opened or closed, a row picked or not. */
export const flipped = <T>(set: ReadonlySet<T>, item: T): Set<T> => {
  const next = new Set(set)
  if (!next.delete(item)) next.add(item)
  return next
}
