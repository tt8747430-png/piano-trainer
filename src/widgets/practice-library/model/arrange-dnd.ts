/**
 * A library's Edit drag (R32): one context for the places and their rows, as memory-palaces keeps
 * one per surface. A place is `place|<id>`, a row `row|<place>|<id>`; a place lands among the places,
 * a row among its own place's rows (moving it elsewhere is its More's Move to…).
 */
export type ArrangeDragged =
  | { readonly kind: 'place'; readonly place: string }
  | { readonly kind: 'row'; readonly place: string; readonly id: string }

export const placeDragId = (place: string): string => `place|${place}`
export const rowDragId = (place: string, id: string): string => `row|${place}|${id}`

/** Reads a drag id back; null for one that is not the library's. */
export function readArrangeId(value: unknown): ArrangeDragged | null {
  if (typeof value !== 'string') return null
  const [kind, place, id, ...rest] = value.split('|')
  if (rest.length > 0 || !place) return null
  if (kind === 'place' && id === undefined) return { kind: 'place', place }
  if (kind === 'row' && id) return { kind: 'row', place, id }
  return null
}

/** Whether what is in hand may land on what is under it. */
export function arrangeLandsOn(active: ArrangeDragged, over: ArrangeDragged): boolean {
  if (active.kind === 'place') return over.kind === 'place'
  return over.kind === 'row' && over.place === active.place
}

/**
 * The order a drop asks for: the places' or one place's rows, with the one in hand where the other
 * stood; null where it moves nothing or may not land.
 */
export function arrangeDrop(
  activeId: unknown,
  overId: unknown,
  places: readonly string[],
  rowsOf: (place: string) => readonly string[],
):
  | { readonly kind: 'places'; readonly order: string[] }
  | { readonly kind: 'rows'; readonly place: string; readonly order: string[] }
  | null {
  const active = readArrangeId(activeId)
  const over = readArrangeId(overId)
  if (!active || !over || !arrangeLandsOn(active, over)) return null
  const move = (list: readonly string[], from: string, to: string): string[] | null => {
    const at = list.indexOf(from)
    const onto = list.indexOf(to)
    if (at < 0 || onto < 0 || at === onto) return null
    const next = list.filter((each) => each !== from)
    next.splice(onto, 0, from)
    return next
  }
  if (active.kind === 'place') {
    const order = move(places, active.place, over.place)
    return order ? { kind: 'places', order } : null
  }
  if (over.kind !== 'row') return null
  const order = move(rowsOf(active.place), active.id, over.id)
  return order ? { kind: 'rows', place: active.place, order } : null
}
