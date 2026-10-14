import type { ProgressStore } from '@/entities/progress'
import type { StepId } from '@/entities/path'

export function unmarkLearned(store: ProgressStore, id: StepId): void {
  store.setState((state) => {
    const { [id]: _unmarked, ...learned } = state.learned
    return { learned }
  })
}
