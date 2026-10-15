/** Where a node sits on its line: the line runs on past it, up into it, or both. */
export type NodePlace = 'first' | 'between' | 'last' | 'alone'

/** Where a node sits on its line, from its index among `count`. */
export const placeOf = (i: number, count: number): NodePlace =>
  count === 1 ? 'alone' : i === 0 ? 'first' : i === count - 1 ? 'last' : 'between'
