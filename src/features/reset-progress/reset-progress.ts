import { EMPTY_PROGRESS, type ProgressStore } from '@/entities/progress'

/** Forgets everything the learner has done on this device. */
export function resetProgress(store: ProgressStore): void {
  store.setState(EMPTY_PROGRESS, true)
}
