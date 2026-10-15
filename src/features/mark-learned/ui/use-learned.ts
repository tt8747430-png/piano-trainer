import { selectIsLearned, useProgress, useProgressStoreApi } from '@/entities/progress'
import { type StepId } from '@/entities/course'
import { markLearned } from '../mark-learned'
import { unmarkLearned } from '../unmark-learned'

/** Whether a step is learned, the tap that marks or unmarks it, and the step that only marks it. */
export function useLearned(step: StepId): {
  readonly learned: boolean
  toggle(): void
  learn(): void
} {
  const store = useProgressStoreApi()
  const learned = useProgress(selectIsLearned(step))
  return {
    learned,
    toggle: () => (learned ? unmarkLearned(store, step) : markLearned(store, step, new Date())),
    learn: () => {
      if (!learned) markLearned(store, step, new Date())
    },
  }
}
