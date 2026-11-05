import { Link, useSearch } from '@tanstack/react-router'
import { Info, Play, Settings } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLibrary, useLibraryStoreApi } from '@/entities/library'
import {
  hasEditableOriginal,
  isDegreePiece,
  isOwnSongId,
  PieceFactLine,
  type Piece,
} from '@/entities/piece'
import { pieceStepId } from '@/entities/step'
import { LookFields, setSongLook } from '@/features/manage-library'
import { LearnedButton } from '@/features/mark-learned'
import { editsContent, useAccount } from '@/shared/lib/account'
import { OPEN_PLAINLY, useSetSearch } from '@/shared/lib'
import { FabLink, FloatingActions, RoundLink } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { useSongLessons } from '../model/use-song-lessons'
import { PieceAbout, ScaleLink } from './PieceAbout'
import { PieceByline } from './PieceByline'
import { PieceChords } from './PieceChords'
import { PieceHeader } from './PieceHeader'
import { PieceProgressions } from './PieceProgressions'
import { SectionRows } from './SectionRows'
import { SongCover } from './SongCover'
import { OriginalSongDetails, OwnSongDetails } from './SongDetails'
import { SongDetailChips, SongDetailsFields, SongTags } from './SongDetailsFields'
import { YourPractice } from './YourPractice'

/**
 * A song's page (R30 S4, Apple Music's and Noji's): its bar, Back, the title with its ✎ beside it, then
 * Learned (named) and Settings; the song (its cover with its ♡, who wrote it as its score prints it,
 * its key, time, tempo, level, genre and language, what is said of it, its tags) and its music (its
 * sections, the learner's practice of it, its chords and progressions), side by side from a laptop's
 * width; Play floats, the Player as it was left.
 *
 * Its ✎ puts the page in Edit where it reads (`?edit=true`): the bar keeps its title with Done in the
 * pencil's place; its title and about become fields where they are the learner's (an own song) or an
 * editor's (the app's original); its cover, level, genre, language and tags are every learner's. Who
 * wrote it is the score's: the page says so and links to the score.
 */
export function PieceView({ piece }: { piece: Piece }) {
  const { t } = useTranslation(['piece', 'songs'])
  const { performance, headings, sections } = useSongLessons(piece)
  const { account } = useAccount()
  const editing = useSearch({ strict: false }).edit === true
  const setSearch = useSetSearch<{ edit: boolean }>()
  const step = pieceStepId(piece.id)
  const settings = (
    <RoundLink
      label={t('settings.open')}
      icon={Settings}
      render={<Link to="/songs/$pieceId/settings" params={{ pieceId: piece.id }} />}
    />
  )
  // What the song says of itself is the learner's on an own song, an editor's on the app's original.
  const chart = isDegreePiece(piece) ? null : piece
  const own = chart && isOwnSongId(piece.id) ? piece.id : null
  const original =
    chart && !own && editsContent(account) && hasEditableOriginal(piece.id) ? chart : null
  return (
    <div className="flex flex-col gap-6 pb-24">
      <PieceHeader
        entry={piece}
        tools={editing ? null : <LearnedButton step={step} bar />}
        settings={editing ? null : settings}
        edit={{
          editing,
          onEdit: () => setSearch({ edit: true }),
          onDone: () => setSearch({ edit: false }),
        }}
      />
      <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:items-start lg:gap-x-10">
        <section aria-label={t('piece:song')} className="flex min-w-0 flex-col gap-5">
          {editing && chart && own ? <OwnSongDetails piece={chart} id={own} /> : null}
          {editing && original ? <OriginalSongDetails piece={original} /> : null}
          <div className="flex items-center gap-5 lg:flex-col lg:items-start">
            <SongCover piece={piece} className="w-20 shrink-0 text-3xl lg:w-40 lg:text-6xl" />
            <PieceByline piece={piece} />
          </div>
          {editing ? (
            <p className="-mt-2 text-sm text-pretty text-muted-foreground">
              <Info aria-hidden className="me-1.5 inline size-4 align-[-0.15em]" />
              {t('piece:details.printed')}{' '}
              <Link
                to="/edit/$pieceId"
                params={{ pieceId: piece.id }}
                className="font-medium text-link underline-offset-4 hover:underline"
              >
                {t('piece:details.editOnScore')}
              </Link>
            </p>
          ) : null}
          {editing ? <CoverLook id={piece.id} /> : null}
          <div className="flex flex-wrap items-center gap-2">
            <PieceFactLine
              piece={piece}
              keyLink={(key) => <ScaleLink entry={piece}>{key}</ScaleLink>}
            />
            <SongDetailChips id={piece.id} />
          </div>
          {editing ? <SongDetailsFields id={piece.id} /> : null}
          {editing && (own || original) ? null : <PieceAbout entry={piece} />}
          {editing ? null : <SongTags id={piece.id} />}
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

/** The cover's picture and paint in the song's Edit (B9's Appearance, where the cover reads). */
function CoverLook({ id }: { id: Piece['id'] }) {
  const { t } = useTranslation('piece')
  const store = useLibraryStoreApi()
  const saved = useLibrary((state) => state.songLooks[id])
  return (
    <div className="flex flex-col items-start gap-2">
      <LookFields
        look={saved ?? { picture: 'music', paint: 'yellow' }}
        onChange={(next) => setSongLook(store, id, next)}
      />
      {/* Back to the song's key on the soft yellow, as the app draws it. */}
      {saved ? (
        <Button
          variant="link"
          className="h-auto min-h-11 px-0"
          onClick={() => setSongLook(store, id, null)}
        >
          {t('removeCover')}
        </Button>
      ) : null}
    </div>
  )
}
