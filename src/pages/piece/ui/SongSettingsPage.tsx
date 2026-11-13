import { Link, useNavigate, useParams, useRouter } from '@tanstack/react-router'
import { Archive, ArchiveRestore, Copy, Download, FolderInput, Globe, Link2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { placeIn, useFolderName, useLibraryLayout } from '@/entities/library'
import {
  hasEditableOriginal,
  isDegreePiece,
  isOwnSongId,
  selectHasVersion,
  usePieces,
  usePiecesStoreApi,
  useRepertoire,
  entryTitles,
  type ChartPiece,
  type Piece,
  type PieceId,
} from '@/entities/piece'
import { selectView } from '@/entities/views'
import { useOriginalDraft } from '@/features/edit-original'
import { duplicateSong } from '@/features/edit-piece'
import { useLibraryActs, useSongActions } from '@/features/manage-library'
import { ShareSaid, songToShare, useShareSong } from '@/features/share-song'
import { SongExportSheet } from '@/features/song-files'
import { useLocale } from '@/shared/i18n'
import { useForgetScreens } from '@/shared/lib'
import { editsContent, useAccount } from '@/shared/lib/account'
import {
  BackButton,
  ButtonLink,
  ConfirmDialog,
  NotFound,
  DangerGroup,
  DangerRow,
  RowButton,
  RowLink,
  ScreenHeader,
  SettingsGroup,
} from '@/shared/ui'
import { PublishRow } from '@/widgets/content-editor'
import { useSongPublish } from '../model/use-song-publish'
import { ResetVersionAsk } from './ResetVersionAsk'
import { SongCoverPicker } from './SongCover'

/** The route's song, or the way back where it is gone (an own song deleted in another tab). */
export function SongSettingsPage() {
  const { t } = useTranslation('common')
  const { pieceId } = useParams({ from: '/shell/songs/$pieceId/settings' })
  const piece = useRepertoire().piece(pieceId)
  if (!piece)
    return (
      <NotFound>
        <ButtonLink render={<Link to="/songs" />}>{t('notFound.toSongs')}</ButtonLink>
      </NotFound>
    )
  return <SongSettings key={piece.id} piece={piece} />
}

/**
 * A song's Settings (R32-C; Noji's and memory-palaces' deck settings): how the song lives in the
 * library and how it leaves it, the page editing what it says of itself. The song at the head; its
 * Library (Folder, Favourite, Duplicate, Archive or Restore); Share (Publish with its state, Share
 * link, Export…); and last, apart, the learner's own music given up: Delete, or Reset to the
 * original, asked first.
 */
function SongSettings({ piece }: { piece: Piece }) {
  const { t } = useTranslation(['piece', 'songs', 'editor'])
  const { account } = useAccount()
  const own = isOwnSongId(piece.id) ? piece.id : null
  const hasVersion = usePieces((state) => selectHasVersion(state, piece.id))
  const { item, title, publishing } = useSongPublish(piece)
  // Its other name (as the other language writes it), in a line under the title.
  const subtitle = entryTitles(piece, useLocale()).secondary
  const shared = useShareSong()
  const router = useRouter()
  const layout = useLibraryLayout()
  const folderName = useFolderName()
  const library = useSongActions(piece)
  const [exporting, setExporting] = useState(false)
  const [asking, setAsking] = useState(false)
  const [copying, setCopying] = useState(false)
  const piecesStore = usePiecesStoreApi()
  const navigate = useNavigate()
  const copyable = !isDegreePiece(piece)
  const duplicate = () => {
    if (isDegreePiece(piece)) return
    const id = duplicateSong(piecesStore, piece, t('settings.copyTitle', { title }))
    void navigate({ to: '/songs/$pieceId', params: { pieceId: id } })
  }
  const acts = useLibraryActs()
  const forget = useForgetScreens()
  /** The learner's own song deleted (R34): the page left first, then into the Trash, with Undo. */
  const trash = (id: PieceId) => {
    forget(`/songs/${id}`, `/play/${id}`, `/edit/${id}`)
    void navigate({ to: '/songs', replace: true }).then(() => acts.trash([id]))
  }
  // Where the focus goes back once a Reset is not wanted: the row that asked.
  const danger = useRef<HTMLDivElement>(null)
  const inLibrary = piece.kind !== 'study'
  const place = placeIn(layout, piece.id)
  const folder =
    place === 'archived'
      ? t('settings.archived')
      : place?.folder
        ? folderName(
            layout.folders.find((each) => each.id === place.folder) ?? { id: place.folder },
          )
        : t('settings.home')
  // An own song carries its music; one of the app's is a link to itself, as last played (ADR 0107).
  const shareable = !(own && isDegreePiece(piece))
  const share = () => {
    const what = songToShare(
      piece,
      title,
      selectView(router.options.context.views.getState(), `/play/${piece.id}`),
    )
    if (what) shared.share(what)
  }
  const ownMusic = own
    ? ({ kind: 'song', id: own, title } as const)
    : hasVersion
      ? ({ kind: 'version', id: piece.id, title } as const)
      : null
  const archived = place === 'archived'
  const original =
    editsContent(account) && hasEditableOriginal(piece.id) && !isDegreePiece(piece) ? piece : null
  return (
    <div className="flex flex-col gap-6 pb-8">
      <ScreenHeader title={t('settings.title')} back={<BackButton />} />
      <ShareSaid said={shared.said} />
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-7">
        {/* The song at the head: what these settings are for (R32-C). */}
        <SettingsGroup flush>
          <div className="flex min-h-20 items-center gap-4 px-4 py-3">
            {/* Its cover's picture is chosen here, a tap on it (R32-C): the page's cover is its music. */}
            <SongCoverPicker piece={piece} className="w-14 text-xl" />
            <div className="flex min-w-0 flex-col gap-0.5">
              <p className="font-display text-lg leading-tight font-semibold text-balance">
                {title}
              </p>
              {subtitle ? (
                <p className="truncate text-sm text-muted-foreground">{subtitle}</p>
              ) : null}
            </div>
          </div>
        </SettingsGroup>
        {inLibrary ? (
          <SettingsGroup flush title={t('settings.library')}>
            {/* Where it may leave its folder (R29 B4): one of the app's songs in its folder stays. */}
            {archived || !library.actions.some((each) => each.key === 'move') ? null : (
              <RowButton
                title={t('settings.folder')}
                value={folder}
                icon={FolderInput}
                paint="grass"
                onClick={() => library.actions.find((each) => each.key === 'move')?.onSelect()}
              />
            )}
            {/* Duplicate (R29 B9): a copy as the learner's own, a song in degrees aside. */}
            {copyable ? (
              <RowButton
                title={t('settings.duplicate')}
                icon={Copy}
                paint="yellow"
                onClick={() => setCopying(true)}
              />
            ) : null}
            <RowButton
              title={t(archived ? 'songs:library.restore' : 'songs:library.archive')}
              icon={archived ? ArchiveRestore : Archive}
              paint="lilac"
              onClick={() =>
                library.actions
                  .find((each) => each.key === (archived ? 'restore' : 'archive'))
                  ?.onSelect()
              }
            />
          </SettingsGroup>
        ) : null}
        {/* Publish, Share link and Export, each once: Export holds the files alone (R31-S). */}
        <SettingsGroup flush title={t('settings.share')}>
          {item ? (
            <RowLink
              title={t('editor:publishPage.open')}
              value={t(
                publishing.state === 'published'
                  ? 'editor:publishPage.standing.published'
                  : publishing.state === 'changed'
                    ? 'editor:publishPage.standing.changed'
                    : 'editor:publishPage.standing.unpublished',
              )}
              icon={Globe}
              paint="lilac"
              render={<Link to="/songs/$pieceId/publish" params={{ pieceId: piece.id }} />}
            />
          ) : original ? (
            <OriginalPublishRow piece={original} />
          ) : null}
          {shareable ? (
            <RowButton title={t('settings.shareLink')} icon={Link2} paint="grass" onClick={share} />
          ) : null}
          <RowButton
            title={t('songs:export.action')}
            detail={t('settings.exportLine')}
            icon={Download}
            paint="sky"
            onClick={() => setExporting(true)}
          />
        </SettingsGroup>
        {ownMusic ? (
          <div ref={danger}>
            <DangerGroup
              footnote={t(ownMusic.kind === 'song' ? 'deleting.says' : 'resetting.says')}
            >
              <DangerRow
                title={t(ownMusic.kind === 'song' ? 'settings.deleteSong' : 'reset')}
                onClick={() => (ownMusic.kind === 'song' ? trash(ownMusic.id) : setAsking(true))}
              />
            </DangerGroup>
          </div>
        ) : null}
      </div>
      {inLibrary ? library.sheet : null}
      <SongExportSheet piece={exporting ? piece : null} onOpenChange={setExporting} />
      <ConfirmDialog
        open={copying}
        onOpenChange={setCopying}
        title={t('settings.duplicateTitle', { title })}
        body={t('settings.duplicateBody')}
        action={t('settings.duplicate')}
        destructive={false}
        onConfirm={duplicate}
      />
      {ownMusic?.kind === 'version' ? (
        <ResetVersionAsk
          piece={ownMusic}
          open={asking}
          onOpenChange={setAsking}
          returnTo={danger}
        />
      ) : null}
    </div>
  )
}

/** An editor's built-in song's Publish… (R29 B6): its Publish page, where its draft stands. */
function OriginalPublishRow({ piece }: { piece: ChartPiece }) {
  const draft = useOriginalDraft(piece)
  return (
    <PublishRow
      kind="piece"
      id={piece.id}
      draft={draft}
      link={<Link to="/songs/$pieceId/publish" params={{ pieceId: piece.id }} />}
    />
  )
}
