import { withoutSteps, type ProgressStore } from '@/entities/progress'
import type { StepId } from '@/entities/step'

/** Forgets a lesson's or a course's progress: these steps not learned, none of their sections read. */
export function resetSteps(store: ProgressStore, ids: readonly StepId[]): void {
  store.setState((state) => withoutSteps(state, ids))
}
