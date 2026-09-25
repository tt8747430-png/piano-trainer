import type { StepId } from '@/entities/path'
import { countAnswer, latestEvidence, stepCompletedBy } from './mastery'
import { selectAnswers, selectIsLearned } from './selectors'
import type { ProgressState, QuizAnswer } from './types'

/** The progress with a step learned on `at` (an ISO date), keeping the day it was first marked. */
export const withLearned = (state: ProgressState, id: StepId, at: string): ProgressState =>
  selectIsLearned(id)(state) ? state : { ...state, learned: { ...state.learned, [id]: at } }

/**
 * The progress after a quiz answer on `at`: evidence on its skill and a count in the quiz stats. The
 * answer that makes every skill of a chord or scale step Known marks that step learned, once: a step
 * the learner unmarked stays unmarked until one of its skills slips and comes back.
 */
export function withAnswer(state: ProgressState, answer: QuizAnswer, at: string): ProgressState {
  const evidence = [...selectAnswers(answer.skill)(state), { correct: answer.correct, at }]
  const answered: ProgressState = {
    ...state,
    answers: { ...state.answers, [answer.skill]: latestEvidence(evidence) },
    quiz: countAnswer(state.quiz, answer.correct),
  }
  const completed = stepCompletedBy(state, answered, answer.skill)
  return completed ? withLearned(answered, completed, at) : answered
}
