import { Link, useNavigate } from '@tanstack/react-router'
import { Play, Settings } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  hasEditableOriginal,
  isDegreePiece,
  isOwnSongId,
  PieceFactLine,
  type Piece,
} from '@/entities/piece'
import { pieceStepId } from '@/entities/step'
import { LearnedButton } from '@/features/mark-learned'
import { editsContent, useAccount } from '@/shared/lib/account'
import { OPEN_PLAINLY, useMediaQuery } from '@/shared/lib'
import { FabLink, FloatingActions, LIBRARY_PANES, RoundLink } from '@/shared/ui'
import { useSongLessons } from '../model/use-song-lessons'
import { PieceAbout, ScaleLink } from './PieceAbout'
import { PieceByline } from './PieceByline'
import { PieceChords } from './PieceChords'
import { PieceHeader } from './PieceHeader'
import { PieceProgressions } from './PieceProgressions'
import { SectionRows } from './SectionRows'
import { SongCoverPicker } from './SongCover'
import { SongDetailChips } from './SongDetailChips'
import { SongDetails } from './SongDetails'
import { YourPractice } from './YourPractice'

/**
 * A song's page (R32-C; Apple Music's album page, MuseScore's score page): its bar (Back, the title
 * with ✎, which opens the score editor, Learned, Settings); the song (its cover, a tap changing it,
 * with its ♡; who wrote it; one line of facts; what is said of it); its music (its sections, the
 * learner's practice, its chords and progressions); and its Details, every property a row edited
 * where it stands (Notion's). From a laptop's width the song and its Details are the left column and
 * the music the right; on a phone Details follow the music. Play floats, the Player as it was left.
 */
export function PieceView({ piece }: { piece: Piece }) {
  const { t } = useTranslation(['piece', 'songs'])
  const { performance, headings, sections } = useSongLessons(piece)
  const { account } = useAccount()
  const navigate = useNavigate()
  const laptop = useMediaQuery(LIBRARY_PANES)
  const step = pieceStepId(piece.id)
  // What the song says of itself is the learner's on an own song, an editor's on the app's original.
  const chart = isDegreePiece(piece) ? null : piece
  const own = chart && isOwnSongId(piece.id) ? { piece: chart, id: piece.id } : null
  const original =
    chart && !own && editsContent(account) && hasEditableOriginal(piece.id) ? chart : null
  const details = <SongDetails piece={piece} own={own} original={original} />
  return (
    <div className="flex flex-col gap-6 pb-24">
      <PieceHeader
        entry={piece}
        tools={<LearnedButton step={step} bar />}
        settings={
          <RoundLink
            label={t('settings.open')}
            icon={Settings}
            render={<Link to="/songs/$pieceId/settings" params={{ pieceId: piece.id }} />}
          />
        }
        edit={{
          editing: false,
          label: t('piece:editScore'),
          onEdit: () => void navigate({ to: '/edit/$pieceId', params: { pieceId: piece.id } }),
          onDone: () => undefined,
        }}
      />
      <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:items-start lg:gap-x-12">
        <section aria-label={t('piece:song')} className="flex min-w-0 flex-col gap-5">
          <div className="flex items-center gap-5 lg:flex-col lg:items-start">
            <SongCoverPicker piece={piece} className="w-28 text-5xl lg:w-60 lg:text-8xl" />
            <PieceByline piece={piece} />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <PieceFactLine
              piece={piece}
              keyLink={(key) => <ScaleLink entry={piece}>{key}</ScaleLink>}
            />
            <SongDetailChips id={piece.id} />
          </div>
          <PieceAbout entry={piece} />
          {laptop ? details : null}
        </section>
        <div className="flex min-w-0 flex-col gap-8">
          <div className="grid gap-6 xl:grid-cols-2 xl:items-start">
            {/* A song of one section has no section machinery: its chords are all it needs. */}
            {sections.length > 1 ? (
              <SectionRows piece={piece} headings={headings} sections={sections} />
            ) : null}
            <YourPractice id={piece.id} />
          </div>
          <PieceChords performance={performance}>
            <PieceProgressions piece={piece} />
          </PieceChords>
          {laptop ? null : details}
        </div>
      </div>
      {/* The one thing to do first: play it (ADR 0111), the Player as it was left. */}
      <FloatingActions>
        <FabLink
          label={t('practise')}
          icon={Play}
          render={<Link to="/play/$pieceId" params={{ pieceId: piece.id }} state={OPEN_PLAINLY} />}
        />
      </FloatingActions>
    </div>
  )
}
