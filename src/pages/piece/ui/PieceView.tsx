import { Link } from '@tanstack/react-router'
import { PencilLine, Play, Settings } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  hasEditableOriginal,
  isDegreePiece,
  isOwnSongId,
  PieceFactLine,
  type Piece,
} from '@/entities/piece'
import { pieceStepId } from '@/entities/step'
import { FavouriteButton } from '@/features/manage-library'
import { LearnedButton } from '@/features/mark-learned'
import { OPEN_PLAINLY } from '@/shared/lib'
import { editsContent, useAccount } from '@/shared/lib/account'
import { ButtonLink, RoundLink } from '@/shared/ui'
import { EditToggle } from '@/widgets/mode-switch'
import { useSongLessons } from '../model/use-song-lessons'
import { PieceAbout } from './PieceAbout'
import { PieceByline } from './PieceByline'
import { PieceChords } from './PieceChords'
import { PieceHeader } from './PieceHeader'
import { PieceProgressions } from './PieceProgressions'
import { SectionRows } from './SectionRows'
import { OriginalSongEdit, OwnSongEdit } from './SongEdit'

/**
 * A song's page (round 26, Noji's and memory-palaces' deck page), in one calm column. Its bar: Back,
 * the title, then Settings (a gear: everything else it can be set to or done with, a page of its own)
 * and Edit at its end: the page itself in place, where what it says is the learner's to write (their
 * own song) or an editor's (one of the app's, round 28), else the learner's version of its score. Under the title its
 * byline; the overview card, its key, time and tempo, its way to its key's scale, Practise (the Player
 * as it was left), Learned and Favourite; what is said of it behind an ⓘ; its chords as diagrams,
 * each opening its sheet; and, where it has more than one, its sections, each a row to its page of
 * lessons.
 */
export function PieceView({ piece }: { piece: Piece }) {
  const { t } = useTranslation(['piece', 'songs'])
  const own = isOwnSongId(piece.id)
  const { performance, headings, sections } = useSongLessons(piece)
  const step = pieceStepId(piece.id)
  // A study, on Practice, is in no library (ADR 0106): no favourite.
  const inLibrary = piece.kind !== 'study'
  const { account } = useAccount()
  const [editing, setEditing] = useState(false)
  const chart = isDegreePiece(piece) ? null : piece
  const ownId = own && chart ? chart.id : null
  const original = editsContent(account) && hasEditableOriginal(piece.id) ? chart : null
  const done = () => setEditing(false)
  if (editing && chart && isOwnSongId(chart.id))
    return <OwnSongEdit piece={chart} id={chart.id} onDone={done} />
  if (editing && original) return <OriginalSongEdit piece={original} onDone={done} />
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
          ownId || original ? (
            <>
              {settings}
              <EditToggle editing={false} onEdit={() => setEditing(true)} onDone={done} />
            </>
          ) : (
            <>
              {/* Every piece is edited: one written in degrees as its chart in its key (ADR 0115). */}
              <RoundLink
                label={t('edit')}
                icon={PencilLine}
                render={<Link to="/edit/$pieceId" params={{ pieceId: piece.id }} />}
              />
              {settings}
            </>
          )
        }
      />
      <PieceByline piece={piece} />
      <section aria-label={t('settings.overview')} className="flex flex-col gap-4 card p-4">
        <PieceFactLine piece={piece} />
        {/* The one thing to do first: play it (ADR 0111, amended), the Player as it was left. */}
        <ButtonLink
          size="lg"
          className="w-full"
          render={<Link to="/play/$pieceId" params={{ pieceId: piece.id }} state={OPEN_PLAINLY} />}
        >
          <Play data-icon="inline-start" aria-hidden className="fill-current" />
          {t('practise')}
        </ButtonLink>
        {own && !inLibrary ? null : (
          <div className="flex items-center gap-2">
            {own ? null : <LearnedButton step={step} className="h-11 flex-1" />}
            {inLibrary ? <FavouriteButton piece={piece.id} /> : null}
          </div>
        )}
      </section>
      <PieceAbout entry={piece} />
      <PieceChords performance={performance}>
        <PieceProgressions piece={piece} />
      </PieceChords>
      {/* A song of one section has no section machinery: its chords above are all it needs. */}
      {sections.length > 1 ? (
        <SectionRows piece={piece} headings={headings} sections={sections} />
      ) : null}
    </div>
  )
}
