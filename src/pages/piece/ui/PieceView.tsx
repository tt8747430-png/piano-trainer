import { Link } from '@tanstack/react-router'
import { Pencil, Play, Settings } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  entryTitles,
  hasEditableOriginal,
  isDegreePiece,
  isOwnSongId,
  PieceFactLine,
  type Piece,
} from '@/entities/piece'
import { pieceStepId } from '@/entities/step'
import { FavouriteButton } from '@/features/manage-library'
import { LearnedButton } from '@/features/mark-learned'
import { editsContent, useAccount } from '@/shared/lib/account'
import { OPEN_PLAINLY } from '@/shared/lib'
import { ButtonLink, FabLink, FloatingActions, RoundLink } from '@/shared/ui'
import { useLocale } from '@/shared/i18n'
import { PieceFirstPage } from '@/widgets/piece-cover'
import { useSongLessons } from '../model/use-song-lessons'
import { PieceAbout, ScaleLink } from './PieceAbout'
import { PieceByline } from './PieceByline'
import { PieceChords } from './PieceChords'
import { PieceHeader } from './PieceHeader'
import { PieceProgressions } from './PieceProgressions'
import { SectionRows } from './SectionRows'
import { SongDetails } from './SongDetails'
import { YourPractice } from './YourPractice'

/**
 * A song's page (R32-C; Apple Music's album page, MuseScore's score page): its bar (Back, the title
 * with ✎, which opens the score editor, ♡, Learned, Settings); the song (its cover, a tap changing it; who wrote it; one line of facts; what is said of it); its music (its sections, the
 * learner's practice, its chords and progressions); and its Details, every property a row edited
 * where it stands (Notion's). From a laptop's width the song is the left column and its music, then
 * its practice and Details, the right; a phone reads them in the same order. Play floats, the Player as it was left.
 */
export function PieceView({ piece }: { piece: Piece }) {
  const { t } = useTranslation(['piece', 'songs'])
  const { performance, headings, sections } = useSongLessons(piece)
  const { account } = useAccount()
  const locale = useLocale()
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
        tools={
          <>
            <LearnedButton step={step} bar worded />
            {piece.kind === 'study' ? null : <FavouriteButton piece={piece.id} />}
          </>
        }
        titleOnPage
        settings={
          <RoundLink
            label={t('settings.open')}
            icon={Settings}
            render={<Link to="/songs/$pieceId/settings" params={{ pieceId: piece.id }} />}
          />
        }
      />
      <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:items-start lg:gap-x-12">
        <section aria-label={t('piece:song')} className="flex min-w-0 flex-col gap-5">
          <PieceFirstPage piece={piece} />
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1">
              <p
                aria-hidden
                className="min-w-0 font-sans text-[1.75rem]/tight font-bold tracking-[-0.02em] text-balance break-words"
              >
                {entryTitles(piece, locale).primary}
              </p>
              <ButtonLink
                variant="ghost"
                size="icon"
                className="rounded-pill text-muted-foreground"
                aria-label={t('piece:editScore')}
                title={t('piece:editScore')}
                render={<Link to="/edit/$pieceId" params={{ pieceId: piece.id }} />}
              >
                <Pencil aria-hidden />
              </ButtonLink>
            </div>
            <PieceByline piece={piece} />
          </div>
          {/* Key · Time · Tempo, one row; the level, genre and language are its Details'. */}
          <PieceFactLine
            piece={piece}
            keyLink={(key) => <ScaleLink entry={piece}>{key}</ScaleLink>}
          />
          <PieceAbout entry={piece} />
        </section>
        <div className="flex min-w-0 flex-col gap-8">
          {/* A song of one section has no section machinery: its chords are all it needs. */}
          {sections.length > 1 ? (
            <SectionRows piece={piece} headings={headings} sections={sections} />
          ) : null}
          <PieceChords performance={performance}>
            <PieceProgressions piece={piece} />
          </PieceChords>
          {/* Your practice and Details side by side on a wide screen (canvas, row 2); Details alone,
              before any practice, takes the whole width. */}
          <div className="grid gap-6 xl:items-start xl:has-[>:nth-child(2)]:grid-cols-2">
            <YourPractice piece={piece} performance={performance} />
            {details}
          </div>
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
