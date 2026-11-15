import { Link, useParams } from '@tanstack/react-router'
import { Play } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useRepertoire, type Piece } from '@/entities/piece'
import { PieceInversions } from '@/features/choose-diagram-inversion'
import { loopParam } from '@/features/practice'
import { OPEN_PLAINLY } from '@/shared/lib'
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
 * A section's page (ADR 0111): "Learn the Verse", its card (the song, the section's chords,
 * its lessons done), then its lessons in order, each looping its bars in the Player; Practise, floating,
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
    <div className="flex flex-col gap-6 pb-4">
      <ScreenHeader title={t('learnSection.title', { section: heading })} back={<BackButton />} />
      {/* One column of rows, as the other detail pages' (Profile's, a folder's settings). */}
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <SectionCard heading={heading} lessons={lessons} />
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
