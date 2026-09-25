import type { PieceId } from '@/entities/piece'
import type { ProgressStore } from '@/entities/progress'

/** Records that a piece was opened in the Player now. */
export function recordPractised(store: ProgressStore, pieceId: PieceId, now: Date): void {
  store.setState((state) => ({ practised: { ...state.practised, [pieceId]: now.toISOString() } }))
}
