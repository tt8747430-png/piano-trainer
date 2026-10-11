import type { PieceId } from '@/entities/piece'
import { localDay, withDay, type ProgressStore } from '@/entities/progress'

/** Records that a piece was opened in the Player now, and so that the learner practised today. */
export function recordPractised(store: ProgressStore, pieceId: PieceId, now: Date): void {
  store.setState((state) =>
    withDay(
      { ...state, practised: { ...state.practised, [pieceId]: now.toISOString() } },
      localDay(now),
    ),
  )
}
