import {
  countAnswer,
  latestEvidence,
  stepCompletedBy,
  type ProgressState,
  type ProgressStore,
} from '@/entities/progress'
import type { SkillId } from '@/shared/lib/music'

/**
 * Records a quiz answer as evidence on its skill and in the quiz stats. The answer that makes every
 * skill of a chord or scale step Known marks that step learned, once: a step the learner unmarked
 * stays unmarked until one of its skills slips and comes back.
 */
export function recordAnswer(
  store: ProgressStore,
  answer: { readonly skill: SkillId; readonly correct: boolean },
  now: Date,
): void {
  const before = store.getState()
  const at = now.toISOString()
  const answered: ProgressState = {
    ...before,
    answers: {
      ...before.answers,
      [answer.skill]: latestEvidence([
        ...(before.answers[answer.skill] ?? []),
        { correct: answer.correct, at },
      ]),
    },
    quiz: countAnswer(before.quiz, answer.correct),
  }
  const completed = stepCompletedBy(before, answered, answer.skill)
  const learned =
    completed && answered.learned[completed] === undefined
      ? { ...answered.learned, [completed]: at }
      : answered.learned
  store.setState({ answers: answered.answers, quiz: answered.quiz, learned })
}
