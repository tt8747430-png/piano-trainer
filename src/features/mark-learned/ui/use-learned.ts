import type { StepId } from '@/entities/path'
import { selectIsLearned, useProgress, useProgressStoreApi } from '@/entities/progress'
import { markLearned } from '../mark-learned'
import { unmarkLearned } from '../unmark-learned'

/** Whether a step is learned, and the tap that marks or unmarks it. */
export function useLearned(step: StepId): { readonly learned: boolean; toggle(): void } {
  const store = useProgressStoreApi()
  const learned = useProgress(selectIsLearned(step))
  return {
    learned,
    toggle: () => (learned ? unmarkLearned(store, step) : markLearned(store, step, new Date())),
  }
}
