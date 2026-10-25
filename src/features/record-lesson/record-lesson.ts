import type { PieceId } from '@/entities/piece'
import {
  barsLessonKey,
  chordLessonKey,
  selectLessonDone,
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

/** Records a pass finished in Wait mode over bars as played: a loop's, or the whole piece's (ADR 0100). */
export function recordPass(store: ProgressStore, pieceId: PieceId, bars: BarRange, now: Date) {
  recordLesson(store, barsLessonKey(pieceId, bars), now)
}

/** Records a chord of a piece played in its sheet on a section's page (ADR 0100). */
export function recordChord(store: ProgressStore, pieceId: PieceId, symbol: string, now: Date) {
  recordLesson(store, chordLessonKey(pieceId, symbol), now)
}
