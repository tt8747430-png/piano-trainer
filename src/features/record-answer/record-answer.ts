import { withAnswer, type ProgressStore, type QuizAnswer } from '@/entities/progress'

/**
 * Records a quiz answer as evidence on its skill; the answer that makes every
 * skill of a chord or scale step Known marks that step learned (`withAnswer`).
 */
export function recordAnswer(store: ProgressStore, answer: QuizAnswer, now: Date): void {
  store.setState((state) => withAnswer(state, answer, now.toISOString()))
}
