import type { PieceId } from '@/entities/piece'
import {
  barsLessonKey,
  chordLessonKey,
  selectLessonDone,
  withHold,
  withLesson,
  type LessonKey,
  type ProgressStore,
} from '@/entities/progress'
import type { BarRange } from '@/features/practice'

/** Saves a song lesson done now; once it is kept nothing is written: its first day stays. */
function recordLesson(store: ProgressStore, key: LessonKey, now: Date): void {
  if (selectLessonDone(key)(store.getState())) return
  store.setState((state) => withLesson(state, key, now.toISOString()))
}

/** Records a pass finished in Wait mode over bars as played: a loop's, or the whole piece's (ADR 0111). */
export function recordPass(store: ProgressStore, pieceId: PieceId, bars: BarRange, now: Date) {
  recordLesson(store, barsLessonKey(pieceId, bars), now)
}

/**
 * Records a chord of a piece held in its sheet on a section's page, let go since it was last held:
 * its third hold learns it (ADR 0111).
 */
export function recordHold(store: ProgressStore, pieceId: PieceId, symbol: string, now: Date) {
  store.setState((state) => withHold(state, chordLessonKey(pieceId, symbol), now.toISOString()))
}
