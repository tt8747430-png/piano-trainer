import type { PieceId } from '@/entities/piece'
import type { ProgressStore } from '@/entities/progress'
import { recordDay } from './record-day'

/** Records that a piece was opened in the Player now, and so that the learner practised today. */
export function recordPractised(store: ProgressStore, pieceId: PieceId, now: Date): void {
  store.setState((state) => ({ practised: { ...state.practised, [pieceId]: now.toISOString() } }))
  recordDay(store, now)
}
