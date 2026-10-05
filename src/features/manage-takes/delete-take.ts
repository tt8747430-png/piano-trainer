import type { TakeId, TakesStore } from '@/entities/take'

/** Deletes a take; its number is never given again. */
export function deleteTake(store: TakesStore, id: TakeId): void {
  store.setState((state) => ({ takes: state.takes.filter((take) => take.id !== id) }))
}
