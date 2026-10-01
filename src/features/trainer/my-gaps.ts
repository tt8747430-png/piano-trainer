import { pieceById, skillsOfPiece } from '@/entities/piece'
import { ratingOf, type ProgressState } from '@/entities/progress'
import { SKILLS, type SkillId } from '@/shared/lib/music'

/** My gaps (spec §4.6 ③): gap skills first, then unknown skills of pieces the learner has opened. */
export function myGaps(
  answers: ProgressState['answers'],
  practised: ProgressState['practised'],
): SkillId[] {
  const used = new Set(
    Object.keys(practised).flatMap((id) => {
      const piece = pieceById(id)
      return piece ? skillsOfPiece(piece) : []
    }),
  )
  return [
    ...SKILLS.filter((skill) => ratingOf(answers, skill) === 'gap'),
    ...SKILLS.filter((skill) => used.has(skill) && ratingOf(answers, skill) === 'unknown'),
  ]
}
