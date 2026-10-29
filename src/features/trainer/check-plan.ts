import { skillsOfStep, stepOf, type StepId } from '@/entities/step'
import { stillToKnow, type Answer } from '@/entities/progress'
import type { SkillId } from '@/shared/lib/music'
import type { Asks } from './draw'

export interface CheckPlan {
  readonly of: StepId
  readonly skills: readonly SkillId[]
  /** Its rounds, asked in order. */
  readonly asks: Asks
  readonly length: number
}

const NO_EVIDENCE = (): readonly Answer[] => []

/**
 * The skills in turn, each as often as its evidence still lacks to be Known (at least once): a
 * learner who answers every question right ends the check with every skill Known.
 */
function untilKnown(
  skills: readonly SkillId[],
  answersOf: (skill: SkillId) => readonly Answer[],
): SkillId[] {
  const times = skills.map((skill) => Math.max(1, stillToKnow(answersOf(skill))))
  const rounds = Math.max(...times)
  return Array.from({ length: rounds }, (_, round) =>
    skills.filter((_, index) => (times[index] ?? 0) > round),
  ).flat()
}

/**
 * A Check's questions: a journey's chapter's chord family or scale until each is Known, which marks
 * the step learned (ADR 0025). A lesson is read and a song played, never checked.
 */
export function checkPlan(
  of: StepId,
  answersOf: (skill: SkillId) => readonly Answer[] = NO_EVIDENCE,
): CheckPlan | null {
  const step = stepOf(of)
  if (!step || step.kind === 'lesson' || step.kind === 'course-lesson' || step.kind === 'piece')
    return null
  const skills = skillsOfStep(step)
  const asked = untilKnown(skills, answersOf)
  return {
    of,
    skills,
    length: asked.length,
    asks: { kind: 'skills', skills: asked, ordered: true },
  }
}
