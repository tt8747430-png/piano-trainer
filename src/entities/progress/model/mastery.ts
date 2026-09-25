import { skillsOfStep, stepIdOf, stepOfSkill, type StepId } from '@/entities/path'
import type { SkillId } from '@/shared/lib/music'
import type { Answer, ProgressState, QuizStats } from './types'

/** How many of a skill's latest answers count as evidence. */
export const EVIDENCE_SIZE = 5
/** Right answers among the evidence that make a skill Known, the latest among them. */
const KNOWN_AT = 4

export type Rating = 'known' | 'gap' | 'unknown'

export const latestEvidence = (answers: readonly Answer[]): readonly Answer[] =>
  answers.slice(-EVIDENCE_SIZE)

/** Known: at least 4 of the last 5 right, the latest included. Gap: answered, not known. */
export function rate(answers: readonly Answer[]): Rating {
  const evidence = latestEvidence(answers)
  if (evidence.length === 0) return 'unknown'
  const right = evidence.filter((answer) => answer.correct).length
  return right >= KNOWN_AT && evidence.at(-1)?.correct ? 'known' : 'gap'
}

/** One array for every skill with no evidence, so a subscriber never sees a new reference. */
export const NO_ANSWERS: readonly Answer[] = []

/** A skill's rating from all saved answers: the one place a missing skill reads as no evidence. */
export const ratingOf = (answers: ProgressState['answers'], skill: SkillId): Rating =>
  rate(answers[skill] ?? NO_ANSWERS)

/** The skills a check should ask about: gaps and unknowns, in the order given. */
export const skillsToCheck = (
  skills: readonly SkillId[],
  answers: ProgressState['answers'],
): SkillId[] => skills.filter((skill) => ratingOf(answers, skill) !== 'known')

export const knownCount = (skills: readonly SkillId[], answers: ProgressState['answers']): number =>
  skills.filter((skill) => ratingOf(answers, skill) === 'known').length

export function countAnswer(stats: QuizStats, correct: boolean): QuizStats {
  const streak = correct ? stats.streak + 1 : 0
  return {
    correct: stats.correct + (correct ? 1 : 0),
    total: stats.total + 1,
    streak,
    best: Math.max(stats.best, streak),
  }
}

const allKnown = (state: ProgressState, skills: readonly SkillId[]) =>
  skills.every((skill) => ratingOf(state.answers, skill) === 'known')

/** The step this answer completed: the skill's step, when every skill of it is Known after and was not before. */
export function stepCompletedBy(
  before: ProgressState,
  after: ProgressState,
  skill: SkillId,
): StepId | null {
  const step = stepOfSkill(skill)
  const skills = skillsOfStep(step)
  return allKnown(after, skills) && !allKnown(before, skills) ? stepIdOf(step) : null
}
