import { skillsOfStep, stepOf, type StepId } from '@/entities/step'
import { chordsOfPiece, pieceById, skillsOfPiece, type Piece } from '@/entities/piece'
import { stillToKnow, type Answer } from '@/entities/progress'
import type { SkillId } from '@/shared/lib/music'
import type { Asks } from './draw'

export interface CheckPlan {
  readonly of: StepId
  readonly skills: readonly SkillId[]
  /** Its rounds, asked in order. */
  readonly asks: Asks
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
 * A Check's questions (spec §4.6): a piece's own chords as written, in turn, six questions or one each
 * (none for a piece of no chord symbol, ADR 0094); a step's chord family or scale until each is Known,
 * which marks the step learned (ADR 0006). A piece is looked up in `pieceOf`: the repertoire's, so a
 * learner's version and own song are checked as they play.
 */
export function checkPlan(
  of: StepId,
  answersOf: (skill: SkillId) => readonly Answer[] = NO_EVIDENCE,
  pieceOf: (id: string) => Piece | undefined = pieceById,
): CheckPlan | null {
  const step = stepOf(of)
  // A lesson is read, never checked.
  if (!step || step.kind === 'lesson' || step.kind === 'course-lesson') return null
  if (step.kind === 'piece') {
    const piece = pieceOf(step.pieceId)
    if (!piece) return null
    const skills = skillsOfPiece(piece)
    const chords = chordsOfPiece(piece).map((chord) => ({ ...chord, inversion: null }))
    if (chords.length === 0) return null
    const length = Math.max(PIECE_CHECK, chords.length)
    return {
      of,
      skills,
      length,
      marks: null,
      asks: { kind: 'chords', mode: 'build-chord', chords, ordered: true },
    }
  }
  const skills = skillsOfStep(step)
  const asked = untilKnown(skills, answersOf)
  return {
    of,
    skills,
    length: asked.length,
    marks: of,
    asks: { kind: 'skills', chords: 'build-chord', skills: asked, ordered: true },
  }
}
