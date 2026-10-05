import { takeId, type Take, type TakeId, type TakesStore } from '@/entities/take'

/** Keeps a take just played as the next take; hands back its id. */
export function saveTake(store: TakesStore, take: Omit<Take, 'id'>): TakeId {
  const { takes, nextTake } = store.getState()
  const id = takeId(nextTake)
  store.setState({ takes: [...takes, { id, ...take }], nextTake: nextTake + 1 })
  return id
}
