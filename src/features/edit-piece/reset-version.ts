import type { PieceId, PiecesStore } from '@/entities/piece'

/** Takes the learner's version away: the piece plays as the catalog writes it again. */
export function resetVersion(store: PiecesStore, id: PieceId): void {
  store.setState((state) => ({
    versions: Object.fromEntries(Object.entries(state.versions).filter(([kept]) => kept !== id)),
  }))
}
