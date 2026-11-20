import { Link, useNavigate, useRouter } from '@tanstack/react-router'
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
  type ChartPiece,
  type Piece,
  type PieceId,
} from '@/entities/piece'
import { useTakesStoreApi } from '@/entities/take'
import { selectView } from '@/entities/views'
import { useOriginalDraft } from '@/features/edit-original'
import { deleteSong, duplicateSong } from '@/features/edit-piece'
import { useLibraryActs, useSongActions } from '@/features/manage-library'
import { ShareSaid, songToShare, useShareSong } from '@/features/share-song'
import { SongExportSheet } from '@/features/song-files'
import { useForgetScreens } from '@/shared/lib'
import { editsContent, useAccount } from '@/shared/lib/account'
import {
  ActionRow,
  DangerGroup,
  DangerRow,
  RowButton,
  RowLink,
  sayUndo,
  SettingsGroup,
  SettingsWindow,
  ThingHead,
} from '@/shared/ui'
import { PublishRow } from '@/widgets/content-editor'
import { useSongByline } from '../model/use-song-byline'
import { useSongPublish } from '../model/use-song-publish'
import { ResetVersionAsk } from './ResetVersionAsk'
import { SongCoverPicker } from './SongCover'

/**
 * A song's Settings (R32-C; Noji's and memory-palaces' deck settings), a window over the song's page
 * (the SongSettings boards): how the song lives in the library and how it leaves it. The song at the
 * head; its Library (Folder, Duplicate, Archive or Restore); Share (Publish with its state, Share
 * link, Export…); and last, apart, the learner's own music given up: Delete, or Reset to the
 * original, asked first. One column, as the window is 720 wide.
 */
export function SongSettingsWindow({
  piece,
  open,
  onOpenChange,
}: {
  piece: Piece
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { t } = useTranslation(['piece', 'songs', 'editor'])
  const { account } = useAccount()
  const own = isOwnSongId(piece.id) ? piece.id : null
  const hasVersion = usePieces((state) => selectHasVersion(state, piece.id))
  const { item, title, publishing } = useSongPublish(piece)
  const shared = useShareSong()
  const router = useRouter()
  const layout = useLibraryLayout()
  const folderName = useFolderName()
  const library = useSongActions(piece)
  const [exporting, setExporting] = useState(false)
  const [asking, setAsking] = useState(false)
  const piecesStore = usePiecesStoreApi()
  const navigate = useNavigate()
  const copyable = !isDegreePiece(piece)
  const takesStore = useTakesStoreApi()
  // Duplicate makes the copy at once, a gain and no loss (the SongSettings board): Undo in its toast
  // deletes it again.
  const duplicate = () => {
    if (isDegreePiece(piece)) return
    const copy = t('settings.copyTitle', { title })
    const id = duplicateSong(piecesStore, piece, copy)
    sayUndo(t('settings.duplicated', { title: copy }), () =>
      deleteSong(piecesStore, takesStore, id),
    )
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
  const byline = useSongByline(piece)
  const ownMusic = own
    ? ({ kind: 'song', id: own, title } as const)
    : hasVersion
      ? ({ kind: 'version', id: piece.id, title } as const)
      : null
  const archived = place === 'archived'
  const original =
    editsContent(account) && hasEditableOriginal(piece.id) && !isDegreePiece(piece) ? piece : null
  return (
    <SettingsWindow open={open} onOpenChange={onOpenChange} title={t('settings.title')}>
      <ShareSaid said={shared.said} />
      {/* The one Settings shape (YourLessonSettings): the head (THINGHEAD), its groups 24 apart,
          the loss of the whole song at the foot. */}
      <div className="flex flex-col gap-6">
        {/* The song at the head, its cover's picture chosen with a tap on it (R32-C). */}
        <ThingHead mark={<SongCoverPicker piece={piece} />} name={title} line={byline} />
        {inLibrary ? (
          <SettingsGroup flush title={t('settings.library')}>
            {/* Where it may leave its folder (R29 B4): one of the app's songs in its folder stays. */}
            {archived || !library.actions.some((each) => each.key === 'move') ? null : (
              <RowButton
                title={t('settings.folder')}
                value={folder}
                opens
                onClick={() => library.actions.find((each) => each.key === 'move')?.onSelect()}
              />
            )}
            {/* Duplicate (R29 B9): a copy as the learner's own, a song in degrees aside. */}
            {copyable ? <ActionRow title={t('settings.duplicate')} onClick={duplicate} /> : null}
            <ActionRow
              title={t(archived ? 'songs:library.restore' : 'songs:library.archive')}
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
              render={<Link to="/songs/$pieceId/publish" params={{ pieceId: piece.id }} />}
            />
          ) : original ? (
            <OriginalPublishRow piece={original} />
          ) : null}
          {shareable ? <ActionRow title={t('settings.shareLink')} onClick={share} /> : null}
          <RowButton
            title={t('songs:export.action')}
            value={t('settings.exportLine')}
            opens
            onClick={() => setExporting(true)}
          />
        </SettingsGroup>
        {ownMusic ? (
          <div ref={danger} className="-mt-2">
            <DangerGroup>
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
      {ownMusic?.kind === 'version' ? (
        <ResetVersionAsk
          piece={ownMusic}
          open={asking}
          onOpenChange={setAsking}
          returnTo={danger}
        />
      ) : null}
    </SettingsWindow>
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
