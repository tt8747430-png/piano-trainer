import type { TakeId, TakesStore } from '@/entities/take'

/** Deletes a take, or a free recording (R29 B11); its number is never given again. */
export function deleteTake(store: TakesStore, id: TakeId): void {
  store.setState((state) => ({
    takes: state.takes.filter((take) => take.id !== id),
    free: state.free.filter((take) => take.id !== id),
  }))
}
