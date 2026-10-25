import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Piece } from '@/entities/piece'
import { selectLessons, useProgress } from '@/entities/progress'
import type { SectionLessons } from '../model/section-lessons'
import { nextStep, songProgress } from '../model/song-progress'
import { LessonsMeter } from './LessonsMeter'
import { SectionLink } from './SectionLink'

const LINE =
  'group inline-flex items-center gap-2 self-start text-lg font-semibold text-pretty text-link underline-offset-4 hover:underline'

/**
 * Learn the song's card (spec §3.1): where to go next, a link there (a section's page; the Player
 * once every lesson is done), and the song's lessons done of all. None for a song with nothing to
 * learn: it has no chord symbols.
 */
export function LearnCard({
  piece,
  headings,
  sections,
}: {
  piece: Pick<Piece, 'id' | 'kind'>
  headings: readonly string[]
  sections: readonly (SectionLessons | null)[]
}) {
  const { t } = useTranslation('piece')
  const lessons = useProgress(selectLessons)
  const step = nextStep(sections, lessons)
  if (!step) return null
  const arrow = (
    <ArrowRight
      aria-hidden
      className="size-5 shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-0.5"
    />
  )
  return (
    <div className="flex flex-col gap-4 card p-5">
      {step.kind === 'done' ? (
        // The whole song, played the learner's way.
        <Link to="/play/$pieceId" params={{ pieceId: piece.id }} className={LINE}>
          {t('learnSong.done')}
          {arrow}
        </Link>
      ) : (
        <SectionLink piece={piece} section={step.section} className={LINE}>
          {t(`learnSong.${step.kind}`, { section: headings[step.section] ?? '' })}
          {arrow}
        </SectionLink>
      )}
      <LessonsMeter progress={songProgress(sections, lessons)} />
    </div>
  )
}
