import { Link, useParams } from '@tanstack/react-router'
import { Play } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useRepertoire, type Piece } from '@/entities/piece'
import { PieceInversions } from '@/features/choose-diagram-inversion'
import { loopParam } from '@/features/practice'
import { OPEN_PLAINLY } from '@/shared/lib'
import { opensOnPickup } from '@/shared/lib/music'
import {
  BackButton,
  ButtonLink,
  FabLink,
  FloatingActions,
  NotFound,
  ScreenHeader,
} from '@/shared/ui'
import { sectionIndex } from '../model/song-progress'
import { useSongLessons } from '../model/use-song-lessons'
import { SectionCard } from './SectionCard'
import { SectionLessonGroups } from './SectionLessonGroups'

/**
 * A section's page (ADR 0111): "Learn the Verse", its name on the paper (its rounds, its bars and
 * chords), then its lessons in order, each looping its bars in the Player; Practise, floating,
 * loops the whole section.
 */
function SectionView({ piece, section }: { piece: Piece; section: number }) {
  const { t } = useTranslation('piece')
  const { performance, headings, sections } = useSongLessons(piece)
  const lessons = sections[section]
  // The route found no section the piece has not.
  if (!lessons) return null
  const heading = headings[section] ?? ''
  return (
    <div className="flex flex-col gap-2 pb-4 lg:gap-4">
      <ScreenHeader
        column="until-laptop"
        title={t('learnSection.title', { section: heading })}
        back={<BackButton />}
      />
      {/* The section's name on the paper, 24 under the bar on a laptop as every page under a song (its
          Settings), then its ways in: one column on a phone; on a laptop the
          Section board's two, the chords and in time at the left, the changes and patterns at the
          right, every row 56 and, there, its state beside its words with no chevron far from them. */}
      <div className="page-column flex flex-col gap-4 lg:mx-0 lg:max-w-none lg:gap-5 lg:px-[calc(3.5rem-var(--gutter))] [&_.group\/row]:min-h-14 lg:[&_.group\/row>span:has([data-slot=row-title])]:flex-none lg:[&_[data-slot=row-chevron]]:hidden">
        <SectionCard
          heading={heading}
          lessons={lessons}
          pickup={opensOnPickup(performance.bars, performance.meter)}
        />
        <SectionLessonGroups piece={piece} performance={performance} lessons={lessons} />
      </div>
      {/* The whole section looped in the Player, the screen's floating action. */}
      <FloatingActions>
        <FabLink
          extended
          label={t('practise')}
          icon={Play}
          className="[&_svg]:fill-current"
          render={
            <Link
              to="/play/$pieceId"
              params={{ pieceId: piece.id }}
              search={{ loop: loopParam(lessons.bars) }}
              state={OPEN_PLAINLY}
            />
          }
        />
      </FloatingActions>
    </div>
  )
}

/** A section of a song or a study: the route's piece and section, counted from 1. */
export function SectionPage() {
  const { t } = useTranslation('common')
  const { pieceId, section } = useParams({ strict: false })
  const piece = useRepertoire().piece(pieceId ?? '')
  const index = piece && section !== undefined ? sectionIndex(piece, section) : null
  if (!piece || index === null) {
    // An own song deleted in another tab, or its sections cut down there.
    return (
      <NotFound>
        <ButtonLink render={<Link to="/songs" />}>{t('notFound.toSongs')}</ButtonLink>
      </NotFound>
    )
  }
  return (
    // Its chords drawn in the inversions chosen for them in this piece (ADR 0108).
    <PieceInversions pieceId={piece.id}>
      <SectionView key={`${piece.id} ${index}`} piece={piece} section={index} />
    </PieceInversions>
  )
}
