import { Link, useParams } from '@tanstack/react-router'
import { Play } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { entryTitles, useRepertoire, type Piece } from '@/entities/piece'
import { selectLessons, useProgress } from '@/entities/progress'
import { PieceInversions } from '@/features/choose-diagram-inversion'
import { loopParam } from '@/features/practice'
import { useLocale } from '@/shared/i18n'
import { OPEN_PLAINLY } from '@/shared/lib'
import { BackButton, ButtonLink, NotFound, RoundLink, ScreenHeader } from '@/shared/ui'
import { lessonKeys } from '../model/section-lessons'
import { sectionPaint } from '../model/section-paint'
import { progressOf, sectionIndex } from '../model/song-progress'
import { useSongLessons } from '../model/use-song-lessons'
import { SectionCard } from './SectionCard'
import { SectionLessonGroups } from './SectionLessonGroups'

/** Back from a section: the way the learner came, or its piece's page on its shelf. */
function SectionBack({ piece }: { piece: Pick<Piece, 'id' | 'kind'> }) {
  const params = { pieceId: piece.id }
  return piece.kind === 'study' ? (
    <BackButton fallback={{ to: '/practice/accompaniment/studies/$pieceId', params }} />
  ) : (
    <BackButton fallback={{ to: '/songs/$pieceId', params }} />
  )
}

/**
 * A section's page (ADR 0100, spec §3.2): "Learn the Verse", its card (the song, the section's chords,
 * its lessons done), then its lessons in order, each looping its bars in the Player; Practise in the
 * bar loops the whole section.
 */
function SectionView({ piece, section }: { piece: Piece; section: number }) {
  const { t } = useTranslation('piece')
  const locale = useLocale()
  const { performance, headings, sections } = useSongLessons(piece)
  const done = useProgress(selectLessons)
  const lessons = sections[section]
  // The route found no section the piece has not.
  if (!lessons) return null
  const heading = headings[section] ?? ''
  const paint = sectionPaint(heading)
  return (
    // Its chords drawn in the inversions chosen for them in this piece (ADR 0101).
    <PieceInversions pieceId={piece.id}>
      <div className="flex flex-col gap-8 pb-4">
        <ScreenHeader
          title={t('learnSection.title', { section: heading })}
          back={<SectionBack piece={piece} />}
          actions={
            <RoundLink
              label={t('practise')}
              icon={Play}
              render={
                <Link
                  to="/play/$pieceId"
                  params={{ pieceId: piece.id }}
                  search={{ loop: loopParam(lessons.bars) }}
                  state={OPEN_PLAINLY}
                />
              }
            />
          }
        />
        <SectionCard
          title={entryTitles(piece, locale).primary}
          lessons={lessons}
          paint={paint}
          progress={progressOf(lessonKeys(lessons), done)}
        />
        <SectionLessonGroups
          piece={piece}
          performance={performance}
          lessons={lessons}
          paint={paint}
        />
      </div>
    </PieceInversions>
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
  return <SectionView key={`${piece.id} ${index}`} piece={piece} section={index} />
}
