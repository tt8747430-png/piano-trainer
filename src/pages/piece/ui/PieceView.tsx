import { Link, useRouter } from '@tanstack/react-router'
import {
  Ellipsis,
  FileCode,
  FileMusic,
  Globe,
  GlobeLock,
  PencilLine,
  Play,
  RotateCcw,
  Share2,
  Trash2,
} from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { pieceStepId } from '@/entities/step'
import {
  entryTitles,
  isDegreePiece,
  isOwnSongId,
  musicOf,
  PieceFactCards,
  selectHasVersion,
  usePieces,
  type Piece,
} from '@/entities/piece'
import { selectView } from '@/entities/views'
import { FavouriteButton, useSongActions } from '@/features/manage-library'
import { LearnedButton } from '@/features/mark-learned'
import { PublishDialog, PublishSaid, usePublish, type PublishItem } from '@/features/publish'
import { ShareSaid, useShareSong } from '@/features/share-song'
import { useSongExport } from '@/features/song-files'
import { OPEN_PLAINLY } from '@/shared/lib'
import { useLocale } from '@/shared/i18n'
import { ActionMenu, ButtonLink, RoundLink } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { playedAs } from '../model/played-as'
import { useSongLessons } from '../model/use-song-lessons'
import { PieceAbout } from './PieceAbout'
import { PieceByline } from './PieceByline'
import { PieceChords } from './PieceChords'
import { OwnMusicAsk } from './OwnMusicAsk'
import { PieceHeader } from './PieceHeader'
import { PieceProgressions } from './PieceProgressions'
import { SectionRows } from './SectionRows'

/**
 * A piece with a chart, in one calm column: Learn the song (ADR 0111, amended). Its bar (Back, the
 * title, then Edit, its ♡ (ADR 0106) and More: Move to… and Archive (Restore while it is archived; a
 * study is in no library, ADR 0106), Share, Export to MIDI and to MusicXML (ADR 0107), and for the
 * learner's own music its way back, asked first). Edit opens the editor, where an editor switches to
 * the original (ADR 0116). Under the title its byline (what else it is called, its stage, who wrote
 * it); then, first and largest, Practise, the Player as it was left, with Learned beside it; its key, time and tempo as cards, the way to its key's scale under them and what is
 * said of it behind an ⓘ; its chords as diagrams, once, each opening its sheet; and, where it has
 * more than one, its sections, each a row to its page of lessons. Its chart is the Player's: the page
 * shows no keys but a chord's sheet's.
 */
export function PieceView({ piece }: { piece: Piece }) {
  const { t } = useTranslation(['piece', 'player', 'songs'])
  const locale = useLocale()
  const own = isOwnSongId(piece.id) ? piece.id : null
  const hasVersion = usePieces((state) => selectHasVersion(state, piece.id))
  const title = entryTitles(piece, locale).primary
  const { performance, headings, sections } = useSongLessons(piece)
  const shared = useShareSong()
  // An own song, written as a chart, may go to the Public library (ADR 0116).
  // Held as a save holds an own song, its title beside its music: read back by `readSharedSong`.
  const publishable = useMemo((): PublishItem | null => {
    if (!own || isDegreePiece(piece)) return null
    const music = musicOf(piece)
    return {
      kind: 'song',
      sourceId: own,
      title,
      meta: { key: music.key, meter: music.meter },
      body: { title, ...music },
    }
  }, [own, piece, title])
  const publishing = usePublish(publishable)
  const [publishAsked, setPublishAsked] = useState(false)
  const [asking, setAsking] = useState(false)
  // More, which takes the focus back from a dialog it opened: the action chosen is folded away.
  const more = useRef<HTMLDivElement>(null)
  const step = pieceStepId(piece.id)
  const router = useRouter()
  // A song's place in the library (ADR 0106); a study, on Practice, is in none.
  const library = useSongActions(piece)
  const inLibrary = piece.kind !== 'study'
  const files = useSongExport(piece)
  const ownMusic = own
    ? ({ kind: 'song', id: own, title } as const)
    : hasVersion
      ? ({ kind: 'version', id: piece.id, title } as const)
      : null
  const actions = [
    ...(inLibrary ? library.actions : []),
    // An own song carries its music; one of the app's is a link to itself, as last played (ADR 0107).
    ...(own && isDegreePiece(piece)
      ? []
      : [
          {
            key: 'share',
            label: t('share'),
            icon: Share2,
            onSelect: () =>
              shared.share(
                own && !isDegreePiece(piece)
                  ? { kind: 'own', song: { title, music: musicOf(piece) } }
                  : {
                      kind: 'piece',
                      id: piece.id,
                      title,
                      played: playedAs(
                        piece,
                        selectView(router.options.context.views.getState(), `/play/${piece.id}`),
                      ),
                    },
              ),
          },
        ]),
    ...(publishable
      ? [
          ...(publishing.state === 'published' || publishing.state === 'unknown'
            ? []
            : [
                {
                  key: 'publish',
                  label: t(
                    publishing.state === 'changed' ? 'songs:public.update' : 'songs:public.publish',
                  ),
                  icon: Globe,
                  onSelect: () =>
                    publishing.state === 'changed'
                      ? void publishing.publish()
                      : setPublishAsked(true),
                },
              ]),
          ...(publishing.state === 'published' || publishing.state === 'changed'
            ? [
                {
                  key: 'unpublish',
                  label: t('songs:public.unpublish'),
                  icon: GlobeLock,
                  onSelect: () => void publishing.unpublish(),
                },
              ]
            : []),
        ]
      : []),
    // Its files, as the Player's More exports them (ADR 0107).
    { key: 'midi', label: t('player:exportMidi'), icon: FileMusic, onSelect: files.midi },
    {
      key: 'musicxml',
      label: t('player:exportMusicXml'),
      icon: FileCode,
      onSelect: files.musicXml,
    },
    ...(ownMusic
      ? [
          {
            key: 'back',
            label: t(ownMusic.kind === 'song' ? 'delete' : 'reset'),
            icon: ownMusic.kind === 'song' ? Trash2 : RotateCcw,
            destructive: true,
            onSelect: () => setAsking(true),
          },
        ]
      : []),
  ]

  return (
    <div className="flex flex-col gap-6 pb-4">
      <PieceHeader
        entry={piece}
        actions={
          <>
            {/* Every piece is edited: one written in degrees as its chart in its key (ADR 0115). */}
            <RoundLink
              label={t('edit')}
              icon={PencilLine}
              render={<Link to="/edit/$pieceId" params={{ pieceId: piece.id }} />}
            />
            {inLibrary ? <FavouriteButton piece={piece.id} /> : null}
            <div ref={more} className="contents">
              <ActionMenu
                label={t('more')}
                align="end"
                trigger={<Ellipsis aria-hidden />}
                render={
                  <Button
                    variant="bar"
                    size="icon"
                    className="rounded-full"
                    aria-label={t('more')}
                    title={t('more')}
                  />
                }
                actions={actions}
              />
            </div>
          </>
        }
      />
      <PieceByline piece={piece} />
      <ShareSaid said={shared.said} />
      <PublishSaid said={publishing.said} />
      <PublishDialog
        open={publishAsked}
        onOpenChange={setPublishAsked}
        title={title}
        authorName={publishing.authorName}
        signedIn={publishing.signedIn}
        busy={publishing.busy}
        onPublish={() => {
          setPublishAsked(false)
          void publishing.publish()
        }}
      />
      {/* The one thing to do first: play it (ADR 0111, amended), the Player as it was left. */}
      <div className="flex items-center gap-3">
        <ButtonLink
          size="lg"
          className="h-14 flex-1 rounded-2xl text-lg sm:flex-none sm:px-8"
          render={<Link to="/play/$pieceId" params={{ pieceId: piece.id }} state={OPEN_PLAINLY} />}
        >
          <Play data-icon="inline-start" aria-hidden className="fill-current" />
          {t('practise')}
        </ButtonLink>
        {own ? null : <LearnedButton step={step} />}
      </div>
      <PieceFactCards piece={piece} />
      <PieceAbout entry={piece} />
      <PieceChords performance={performance}>
        <PieceProgressions piece={piece} />
      </PieceChords>
      {/* A song of one section has no section machinery: its chords above are all it needs. */}
      {sections.length > 1 ? (
        <SectionRows piece={piece} headings={headings} sections={sections} />
      ) : null}
      {ownMusic ? (
        <OwnMusicAsk piece={ownMusic} open={asking} onOpenChange={setAsking} returnTo={more} />
      ) : null}
      {inLibrary ? library.sheet : null}
    </div>
  )
}
