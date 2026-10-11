import { withLearned, type LearnedId, type ProgressStore } from '@/entities/progress'

/** Marks a step learned, keeping the day it was first marked. */
export function markLearned(store: ProgressStore, id: LearnedId, now: Date): void {
  store.setState((state) => withLearned(state, id, now.toISOString()))
}
