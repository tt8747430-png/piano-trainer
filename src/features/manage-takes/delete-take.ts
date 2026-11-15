import type { TakeId, TakesStore } from '@/entities/take'

/** Deletes a take, its number never given again; what it returns puts it back where it was (its Undo). */
export function deleteTake(store: TakesStore, id: TakeId): () => void {
  const at = store.getState().takes.findIndex((take) => take.id === id)
  const take = store.getState().takes[at]
  store.setState((state) => ({ takes: state.takes.filter((kept) => kept.id !== id) }))
  return () => {
    if (!take) return
    store.setState((state) =>
      state.takes.some((kept) => kept.id === id)
        ? state
        : { takes: [...state.takes.slice(0, at), take, ...state.takes.slice(at)] },
    )
  }
}
