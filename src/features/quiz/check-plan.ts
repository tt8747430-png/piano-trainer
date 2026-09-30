import { skillsOfStep, stepById, type StepId } from '@/entities/path'
import { chordRootsOfPiece, pieceById, skillsOfPiece } from '@/entities/piece'
import { stillToKnow, type Answer } from '@/entities/progress'
import type { SkillId } from '@/shared/lib/music'
import type { QuizConfig } from './quiz-machine'

export interface CheckPlan {
  readonly of: StepId
  readonly skills: readonly SkillId[]
  readonly config: QuizConfig
  readonly length: number
  /** The step whose skills this check can make Known, marking it learned. */
  readonly marks: StepId | null
}

const PIECE_CHECK = 6
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
 * A Check's questions (spec §4.6): a piece's chords in turn, six questions or one each; a step's
 * chord family or scale until each is Known, which marks the step learned (ADR 0006).
 */
export function checkPlan(
  of: StepId,
  answersOf: (skill: SkillId) => readonly Answer[] = NO_EVIDENCE,
): CheckPlan | null {
  const placed = stepById(of)
  if (!placed) return null
  const { step } = placed
  if (step.kind === 'piece') {
    const piece = pieceById(step.pieceId)
    if (!piece) return null
    const skills = skillsOfPiece(piece)
    const length = Math.max(PIECE_CHECK, skills.length)
    return {
      of,
      skills,
      length,
      marks: null,
      config: {
        chordMode: 'build-chord',
        scope: { skills, roots: chordRootsOfPiece(piece), length, ordered: true },
      },
    }
  }
  const skills = skillsOfStep(step)
  const asked = untilKnown(skills, answersOf)
  return {
    of,
    skills,
    length: asked.length,
    marks: of,
    config: {
      chordMode: 'build-chord',
      scope: { skills: asked, length: asked.length, ordered: true },
    },
  }
}
