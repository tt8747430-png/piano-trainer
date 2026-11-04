import { Link, useNavigate } from '@tanstack/react-router'
import { Play, Settings } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PieceFactLine, type Piece } from '@/entities/piece'
import { pieceStepId } from '@/entities/step'
import { FavouriteButton } from '@/features/manage-library'
import { LearnedButton } from '@/features/mark-learned'
import { OPEN_PLAINLY } from '@/shared/lib'
import { ButtonLink, RoundLink } from '@/shared/ui'
import { EditToggle } from '@/widgets/mode-switch'
import { useSongLessons } from '../model/use-song-lessons'
import { PieceAbout, ScaleLink } from './PieceAbout'
import { PieceByline } from './PieceByline'
import { PieceChords } from './PieceChords'
import { PieceHeader } from './PieceHeader'
import { PieceProgressions } from './PieceProgressions'
import { SectionRows } from './SectionRows'

/**
 * A song's page (round 26, Noji's and memory-palaces' deck page), in one calm column. Its bar: Back,
 * the title, then Settings (a gear: everything else it can be set to or done with, a page of its own)
 * and ✎ at its end: its score in the editor (R29 1.2; what the song says of itself is written on its
 * Settings › Details). Under the title its
 * byline; the overview card, its key, time and tempo, its way to its key's scale, Practise (the Player
 * as it was left), Learned and Favourite; what is said of it behind an ⓘ; its chords as diagrams,
 * each opening its sheet; and, where it has more than one, its sections, each a row to its page of
 * lessons.
 */
export function PieceView({ piece }: { piece: Piece }) {
  const { t } = useTranslation(['piece', 'songs'])
  const { performance, headings, sections } = useSongLessons(piece)
  const step = pieceStepId(piece.id)
  // A study, on Practice, is in no library (ADR 0106): no favourite.
  const inLibrary = piece.kind !== 'study'
  const navigate = useNavigate()
  const settings = (
    <RoundLink
      label={t('settings.open')}
      icon={Settings}
      render={<Link to="/songs/$pieceId/settings" params={{ pieceId: piece.id }} />}
    />
  )
  return (
    <div className="flex flex-col gap-6 pb-4">
      <PieceHeader
        entry={piece}
        actions={
          // The pencil opens the score in the editor (R29 1.2): a learner's edit of a built-in
          // song is their version, an editor's the song everyone sees (A38, ADR 0115).
          <>
            {settings}
            <EditToggle
              editing={false}
              onEdit={() => void navigate({ to: '/edit/$pieceId', params: { pieceId: piece.id } })}
              onDone={() => undefined}
            />
          </>
        }
      />
      {/* From a laptop's width two columns (A28): the head, the about and the overview card at a
          reading width on the left; the chords and sections on the right. One column below. */}
      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:items-start lg:gap-x-10">
        <div className="flex min-w-0 flex-col gap-6 lg:sticky lg:top-6">
          <PieceByline piece={piece} />
          <PieceAbout entry={piece} />
          <section aria-label={t('settings.overview')} className="flex flex-col gap-4 card p-4">
            <PieceFactLine
              piece={piece}
              keyLink={(key) => <ScaleLink entry={piece}>{key}</ScaleLink>}
            />
            {/* The one thing to do first: play it (ADR 0111, amended), the Player as it was left. */}
            <ButtonLink
              size="lg"
              className="w-full"
              render={
                <Link to="/play/$pieceId" params={{ pieceId: piece.id }} state={OPEN_PLAINLY} />
              }
            >
              <Play data-icon="inline-start" aria-hidden className="fill-current" />
              {t('practise')}
            </ButtonLink>
            <div className="flex items-center gap-2">
              <LearnedButton step={step} className="h-11 flex-1" />
              {inLibrary ? <FavouriteButton piece={piece.id} /> : null}
            </div>
          </section>
        </div>
        <div className="flex min-w-0 flex-col gap-6">
          <PieceChords performance={performance}>
            <PieceProgressions piece={piece} />
          </PieceChords>
          {/* A song of one section has no section machinery: its chords above are all it needs. */}
          {sections.length > 1 ? (
            <SectionRows piece={piece} headings={headings} sections={sections} />
          ) : null}
        </div>
      </div>
    </div>
  )
}
