import type { StepId } from '@/entities/path'
import type { ProgressStore } from '@/entities/progress'

export function unmarkLearned(store: ProgressStore, id: StepId): void {
  store.setState((state) => {
    const { [id]: _unmarked, ...learned } = state.learned
    return { learned }
  })
}
