import { Link, useNavigate, useRouter } from '@tanstack/react-router'
import {
  BookLock,
  Download,
  Ellipsis,
  Globe,
  GlobeLock,
  Heart,
  PencilLine,
  Play,
  RotateCcw,
  Trash2,
} from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { pieceStepId } from '@/entities/step'
import {
  entryTitles,
  hasEditableOriginal,
  isDegreePiece,
  isOwnSongId,
  musicOf,
  PieceFactLine,
  selectHasVersion,
  usePieces,
  type Piece,
} from '@/entities/piece'
import { selectView } from '@/entities/views'
import { selectIsFavourite, useLibrary, useLibraryStoreApi } from '@/entities/library'
import { toggleFavourite, useSongActions } from '@/features/manage-library'
import { LearnedButton } from '@/features/mark-learned'
import { PublishDialog, PublishSaid, usePublish, type PublishItem } from '@/features/publish'
import { ShareSaid, songToShare, useShareSong } from '@/features/share-song'
import { ExportSheet } from '@/features/song-files'
import { OPEN_PLAINLY } from '@/shared/lib'
import { editsContent, useAccount } from '@/shared/lib/account'
import { useLocale } from '@/shared/i18n'
import { ActionMenu, FabLink, FloatingActions, RoundLink } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { useSongLessons } from '../model/use-song-lessons'
import { PieceAbout } from './PieceAbout'
import { PieceByline } from './PieceByline'
import { PieceChords } from './PieceChords'
import { OwnMusicAsk } from './OwnMusicAsk'
import { PieceHeader } from './PieceHeader'
import { PieceProgressions } from './PieceProgressions'
import { SectionRows } from './SectionRows'

/**
 * A piece with a chart, in one calm column: Learn the song (ADR 0111, amended). Its bar: Back, the
 * title, then Edit (a pull-down: the learner's version, and to an editor the original, ADR 0116),
 * Learned and More (Favourite, Move to… and Archive, Restore while it is archived, a study in no
 * library, ADR 0106; Export…, its MusicXML, MIDI and link in one sheet, ADR 0107; for the
 * learner's own music its way back, asked first). Under the title its byline and its key, time and
 * tempo in one line, the way to its key's scale and what is said of it behind an ⓘ; its chords as diagrams, each opening its
 * sheet; and, where it has more than one, its sections, each a row to its page of lessons. Practise,
 * the Player as it was left, is the floating action.
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
  const [exporting, setExporting] = useState(false)
  // An own song carries its music; one of the app's is a link to itself, as last played (ADR 0107).
  const shareable = !(own && isDegreePiece(piece))
  const share = () => {
    const views = router.options.context.views.getState()
    const what = songToShare(piece, title, selectView(views, `/play/${piece.id}`))
    if (what) shared.share(what)
  }
  const navigate = useNavigate()
  const { account } = useAccount()
  const libraryStore = useLibraryStoreApi()
  const favourite = useLibrary(selectIsFavourite(piece.id))
  // What Edit opens: the learner's own version (an own song is theirs), and an editor the original.
  const edits = [
    {
      key: 'mine',
      label: t(own ? 'edit' : 'editMine'),
      icon: PencilLine,
      onSelect: () => void navigate({ to: '/edit/$pieceId', params: { pieceId: piece.id } }),
    },
    ...(editsContent(account) && hasEditableOriginal(piece.id)
      ? [
          {
            key: 'original',
            label: t('editOriginal'),
            icon: BookLock,
            onSelect: () =>
              void navigate({
                to: '/edit/$pieceId',
                params: { pieceId: piece.id },
                search: { original: true },
              }),
          },
        ]
      : []),
  ]
  const ownMusic = own
    ? ({ kind: 'song', id: own, title } as const)
    : hasVersion
      ? ({ kind: 'version', id: piece.id, title } as const)
      : null
  const actions = [
    ...(inLibrary
      ? [
          {
            key: 'favourite',
            label: t(favourite ? 'songs:library.unfavourite' : 'songs:library.favourite'),
            icon: Heart,
            onSelect: () => toggleFavourite(libraryStore, piece.id),
          },
          ...library.actions,
        ]
      : []),
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
    // Its ways out in one menu (ADR 0107): MusicXML, MIDI and its link.
    {
      key: 'export',
      label: t('songs:export.action'),
      icon: Download,
      onSelect: () => setExporting(true),
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
            {edits.length === 1 ? (
              <RoundLink
                label={t('edit')}
                icon={PencilLine}
                render={<Link to="/edit/$pieceId" params={{ pieceId: piece.id }} />}
              />
            ) : (
              <ActionMenu
                label={t('edit')}
                align="end"
                trigger={<PencilLine aria-hidden />}
                render={
                  <Button
                    variant="bar"
                    size="icon"
                    className="rounded-full"
                    aria-label={t('edit')}
                    title={t('edit')}
                  />
                }
                actions={edits}
              />
            )}
            {own ? null : <LearnedButton step={step} round />}
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
      <PieceFactLine piece={piece} />
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
      <ExportSheet
        piece={exporting ? piece : null}
        onOpenChange={setExporting}
        share={
          shareable
            ? {
                detail: t(own ? 'songs:export.shareOwn' : 'songs:export.sharePiece'),
                onSelect: share,
              }
            : undefined
        }
      />
      {/* The one thing to do first: play it (ADR 0111, amended), the Player as it was left. */}
      <FloatingActions>
        <FabLink
          label={t('practise')}
          icon={Play}
          className="[&_svg]:fill-current"
          render={<Link to="/play/$pieceId" params={{ pieceId: piece.id }} state={OPEN_PLAINLY} />}
        />
      </FloatingActions>
    </div>
  )
}
