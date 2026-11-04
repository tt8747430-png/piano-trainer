import { takeId, type FreeTake, type Take, type TakeId, type TakesStore } from '@/entities/take'

/** Keeps a take just played as the next take; hands back its id. */
export function saveTake(store: TakesStore, take: Omit<Take, 'id'>): TakeId {
  const { takes, nextTake } = store.getState()
  const id = takeId(nextTake)
  store.setState({ takes: [...takes, { id, ...take }], nextTake: nextTake + 1 })
  return id
}

/** Keeps a free recording just played (R29 B11), numbered as the takes are; hands back its id. */
export function saveFreeTake(store: TakesStore, take: Omit<FreeTake, 'id'>): TakeId {
  const { free, nextTake } = store.getState()
  const id = takeId(nextTake)
  store.setState({ free: [...free, { id, ...take }], nextTake: nextTake + 1 })
  return id
}
