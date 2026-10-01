/** `list` with `item` put in (at the end) or taken out: as `on` says, else the other way from now. */
export const toggled = <T>(list: readonly T[], item: T, on = !list.includes(item)): T[] =>
  on ? [...list.filter((each) => each !== item), item] : list.filter((each) => each !== item)
