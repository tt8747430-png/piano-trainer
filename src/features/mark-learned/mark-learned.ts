import { withLearned, type ProgressStore } from '@/entities/progress'
import { type StepId } from '@/entities/course'

/** Marks a step learned, keeping the day it was first marked. */
export function markLearned(store: ProgressStore, id: StepId, now: Date): void {
  store.setState((state) => withLearned(state, id, now.toISOString()))
}
