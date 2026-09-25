import { Link } from '@tanstack/react-router'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { pieceStepId } from '@/entities/path'
import { skillsOfPiece, type Piece } from '@/entities/piece'
import { ratingOf, selectAllAnswers, useProgress } from '@/entities/progress'
import type { Performance } from '@/shared/lib/arrangement'
import { noteParam, qualitySuffix, skillOf } from '@/shared/lib/music'
import { ButtonLink, RatingMark } from '@/shared/ui'

/** The chord qualities a piece uses, each with its rating and a way into the explorer; a check of them all. */
export function PieceSkills({ piece, performance }: { piece: Piece; performance: Performance }) {
  const { t } = useTranslation(['piece', 'theory', 'common'])
  const headingId = useId()
  const answers = useProgress(selectAllAnswers)
  const skills = skillsOfPiece(piece)
  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-3">
      <h2 id={headingId} className="text-xl font-bold">
        {t(`piece:chords.${piece.kind}`)}
      </h2>
      <ul className="flex flex-wrap gap-2">
        {skills.map((id) => {
          const skill = skillOf(id)
          if (skill.kind !== 'chord') return null
          const rating = ratingOf(answers, id)
          const first = performance.chords.find((c) => c.quality === skill.quality)
          return (
            <li key={id}>
              <Link
                to="/theory/chords"
                search={{
                  quality: skill.quality,
                  ...(first ? { root: noteParam(first.root) } : {}),
                }}
                aria-label={`${t(`theory:quality.${skill.quality}`)}, ${t(`common:rating.${rating}`)}`}
                className="flex h-11 items-center gap-2 rounded-full bg-card px-4 font-semibold ring-1 ring-border transition-colors duration-200 ease-out outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring"
              >
                {qualitySuffix(skill.quality) || t('theory:major')}
                <RatingMark rating={rating} />
              </Link>
            </li>
          )
        })}
      </ul>
      <ButtonLink
        variant="link"
        className="self-start px-0"
        render={<Link to="/check" search={{ of: pieceStepId(piece.id) }} />}
      >
        {t('piece:checkChords')}
      </ButtonLink>
    </section>
  )
}
