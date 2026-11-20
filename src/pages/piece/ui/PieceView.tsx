import { Link } from '@tanstack/react-router'
import { Pencil } from 'lucide-react'
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
import { ButtonLink } from '@/shared/ui'
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
import { SongMore } from './SongMore'
import { SongPlace } from './SongPlace'
import { YourPractice } from './YourPractice'

/**
 * A song's page (R32-C; Apple Music's album page, MuseScore's score page): its bar (Back, the title
 * with ✎, which opens the score editor, ♡, Learned, More); the song (its cover, a tap changing it; who wrote it; one line of facts; what is said of it); its music (its sections, the
 * learner's practice, its chords and progressions); and its Details, every property a row edited
 * where it stands (Notion's). From a laptop's width the song is the left column and its music, then
 * its practice and Details, the right; a phone reads them in the same order. Play floats, the Player as it was
 * left, until the song has been played: then Continue from bar n and From the start stand under its facts.
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
  // The bars as written: the Player keeps its place by them.
  const writtenBars = performance.bars.reduce(
    (most, bar, i) => Math.max(most, (bar.written ?? i) + 1),
    0,
  )
  return (
    // One centred 880 column on a laptop, the bar on its edges (the SongLaptop board): the cover beside
    // the song's name, facts and plays, then its chords, sections and details across the column.
    <div className="flex flex-col gap-1 pb-24 lg:mx-auto lg:w-full lg:max-w-[55rem] lg:**:data-[slot=screen-bar]:mx-0 lg:**:data-[slot=screen-bar]:px-0 lg:**:data-[slot=screen-bar]:pt-0">
      <PieceHeader
        entry={piece}
        tools={
          <>
            <LearnedButton step={step} bar worded />
            {piece.kind === 'study' ? null : <FavouriteButton piece={piece.id} />}
          </>
        }
        titleOnPage
        settings={<SongMore piece={piece} />}
      />
      <div className="flex flex-col gap-4 lg:gap-5">
        <section
          aria-label={t('piece:song')}
          className="flex min-w-0 flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,23.75rem)_minmax(0,1fr)] lg:items-end lg:gap-8"
        >
          <PieceFirstPage piece={piece} />
          <div className="flex min-w-0 flex-col gap-4">
            <div className="flex flex-col gap-1">
              {/* The title with Edit 8 after its words, a 44 glass circle with the icon in ink (the Song board's EDITB). */}
              <div className="flex items-center gap-2">
                <p
                  aria-hidden
                  className="min-w-0 font-sans text-[1.75rem]/[1.15] font-bold tracking-[-0.01em] text-balance break-words"
                >
                  {entryTitles(piece, locale).primary}
                </p>
                <ButtonLink
                  variant="ghost"
                  size="icon"
                  className="shrink-0 rounded-pill glass text-foreground hover:bg-glass"
                  // Title and credits, as the Song board's pencil: the editor opened on that page of
                  // its gear, the one place they are typed; the score itself is the ···'s Edit score.
                  aria-label={t('piece:editCredits')}
                  title={t('piece:editCredits')}
                  render={
                    <Link
                      to="/edit/$pieceId"
                      params={{ pieceId: piece.id }}
                      search={{ credits: true }}
                    />
                  }
                >
                  <Pencil aria-hidden className="size-4.5" />
                </ButtonLink>
              </div>
              <PieceByline piece={piece} />
            </div>
            {/* Key · Time · Tempo, one row; the level, genre and language are its Details'. */}
            <PieceFactLine
              piece={piece}
              keyLink={(key) => <ScaleLink entry={piece}>{key}</ScaleLink>}
            />
            <SongPlace piece={piece} bars={writtenBars} />
            <PieceAbout entry={piece} />
          </div>
        </section>
        <PieceChords performance={performance}>
          <PieceProgressions piece={piece} />
        </PieceChords>
        {/* Its sections under its chords, as the Song board's (a song of one section too: its page is the way in). */}
        {sections.length > 0 ? (
          <SectionRows piece={piece} headings={headings} sections={sections} />
        ) : null}
        {/* Your practice and Details side by side on a wide screen (canvas, row 2); Details alone,
              before any practice, takes the whole width. */}
        <div className="grid gap-6 xl:items-start xl:has-[>:nth-child(2)]:grid-cols-2">
          <YourPractice piece={piece} performance={performance} />
          {details}
        </div>
      </div>
    </div>
  )
}
