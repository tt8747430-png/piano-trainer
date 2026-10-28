import { withSectionRead, type ProgressStore } from '@/entities/progress'
import type { StepId } from '@/entities/step'

/** Saves a lesson's section read, by its place: what fills the lesson's ring in its contents. */
export function recordSectionRead(store: ProgressStore, id: StepId, section: number): void {
  store.setState((state) => withSectionRead(state, id, section))
}
