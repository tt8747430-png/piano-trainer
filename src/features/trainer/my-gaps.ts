import { pieceById, skillsOfPiece } from '@/entities/piece'
import { isDue, ratingOf, type ProgressState } from '@/entities/progress'
import { SKILLS, type SkillId } from '@/shared/lib/music'

/**
 * My gaps: gap skills first, then Known skills due for a review (`isDue`), then unknown
 * skills of pieces the learner has opened.
 */
export function myGaps(
  answers: ProgressState['answers'],
  practised: ProgressState['practised'],
  now = new Date(),
): SkillId[] {
  const used = new Set(
    Object.keys(practised).flatMap((id) => {
      const piece = pieceById(id)
      return piece ? skillsOfPiece(piece) : []
    }),
  )
  return [
    ...SKILLS.filter((skill) => ratingOf(answers, skill) === 'gap'),
    ...SKILLS.filter((skill) => isDue(answers[skill] ?? [], now)),
    ...SKILLS.filter((skill) => used.has(skill) && ratingOf(answers, skill) === 'unknown'),
  ]
}
