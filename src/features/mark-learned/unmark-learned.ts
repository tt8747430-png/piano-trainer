import type { LearnedId, ProgressStore } from '@/entities/progress'

export function unmarkLearned(store: ProgressStore, id: LearnedId): void {
  store.setState((state) => {
    const { [id]: _unmarked, ...learned } = state.learned
    return { learned }
  })
}
