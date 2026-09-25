import { skillsOfStep, stepById, type StepId } from '@/entities/path'
import { chordRootsOfPiece, pieceById, skillsOfPiece } from '@/entities/piece'
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
const LEAST = 6

/** A Check's questions (spec §4.6): a piece's chords, a chord family in turn, or a scale. */
export function checkPlan(of: StepId): CheckPlan | null {
  const placed = stepById(of)
  if (!placed) return null
  const { step } = placed
  if (step.kind === 'piece') {
    const piece = pieceById(step.pieceId)
    if (!piece) return null
    const skills = skillsOfPiece(piece)
    return {
      of,
      skills,
      length: PIECE_CHECK,
      marks: null,
      config: {
        chordMode: 'build-chord',
        scope: { skills, roots: chordRootsOfPiece(piece), length: PIECE_CHECK },
      },
    }
  }
  const skills = skillsOfStep(step)
  const length = step.kind === 'chords' ? Math.max(LEAST, skills.length * 2) : LEAST
  return {
    of,
    skills,
    length,
    marks: of,
    config: {
      chordMode: 'build-chord',
      scope: step.kind === 'chords' ? { skills, length, ordered: true } : { skills, length },
    },
  }
}
