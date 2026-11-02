import { Link, useParams, useRouter } from '@tanstack/react-router'
import {
  Archive,
  ArchiveRestore,
  FilePen,
  Download,
  FolderInput,
  Globe,
  Heart,
  Link2,
  PencilLine,
  RotateCcw,
  Trash2,
} from 'lucide-react'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  placeIn,
  selectIsFavourite,
  useFolderName,
  useLibrary,
  useLibraryLayout,
  useLibraryStoreApi,
} from '@/entities/library'
import {
  hasEditableOriginal,
  isDegreePiece,
  isOwnSongId,
  selectHasVersion,
  usePieces,
  useRepertoire,
  type ChartPiece,
  type Piece,
} from '@/entities/piece'
import { selectView } from '@/entities/views'
import { DraftActions, DraftStatus, useOriginalDraft } from '@/features/edit-original'
import { toggleFavourite, useSongActions } from '@/features/manage-library'
import { ShareSaid, songToShare, useShareSong } from '@/features/share-song'
import { SongExportSheet } from '@/features/song-files'
import { editsContent, useAccount } from '@/shared/lib/account'
import {
  BackButton,
  ButtonLink,
  NotFound,
  RowButton,
  RowLink,
  ScreenHeader,
  SettingsGroup,
  SwitchRow,
  TileMark,
} from '@/shared/ui'
import { useSongPublish } from '../model/use-song-publish'
import { OwnMusicAsk } from './OwnMusicAsk'

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
 * A song's Settings (round 26, Noji's deck settings, memory-palaces' deck settings): one list of
 * grouped rows, each a setting with its value at its end or a way on, a sheet or a page. Its music,
 * edited on the score; its place in the library (Favourite, its folder, Archive or Restore); its ways
 * out (Export…, Share link, Publish in library, a page); an editor's unpublished changes, their status and
 * menu (Publish, Versions, Discard); and last, apart, the learner's own music given up: Delete, or
 * Reset to the original, asked first.
 */
function SongSettings({ piece }: { piece: Piece }) {
  const { t } = useTranslation(['piece', 'songs'])
  const { account } = useAccount()
  const own = isOwnSongId(piece.id) ? piece.id : null
  const hasVersion = usePieces((state) => selectHasVersion(state, piece.id))
  const { item, title, publishing } = useSongPublish(piece)
  const shared = useShareSong()
  const router = useRouter()
  const libraryStore = useLibraryStoreApi()
  const favourite = useLibrary(selectIsFavourite(piece.id))
  const layout = useLibraryLayout()
  const folderName = useFolderName()
  const library = useSongActions(piece)
  const [exporting, setExporting] = useState(false)
  const [asking, setAsking] = useState(false)
  // Where the focus goes back once a Delete or Reset is not wanted: the row that asked.
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
      <ScreenHeader
        title={t('settings.title')}
        back={<BackButton fallback={{ to: '/songs/$pieceId', params: { pieceId: piece.id } }} />}
      />
      <ShareSaid said={shared.said} />
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-7">
        <p className="px-1 font-display text-2xl font-semibold text-balance">{title}</p>
        <SettingsGroup flush title={t('settings.music')}>
          <RowLink
            title={t('settings.editScore')}
            icon={PencilLine}
            paint="sky"
            render={<Link to="/edit/$pieceId" params={{ pieceId: piece.id }} />}
          />
        </SettingsGroup>
        {inLibrary ? (
          <SettingsGroup flush title={t('settings.library')}>
            <SwitchRow
              icon={<TileMark icon={Heart} paint="sand" />}
              label={t('settings.favourite')}
              checked={favourite}
              onCheckedChange={() => toggleFavourite(libraryStore, piece.id)}
              className="gap-3 border-0 pr-3 pl-2 font-semibold"
            />
            {archived ? null : (
              <RowButton
                title={t('settings.folder')}
                value={folder}
                icon={FolderInput}
                paint="grass"
                onClick={() => library.actions.find((each) => each.key === 'move')?.onSelect()}
              />
            )}
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
        <SettingsGroup flush title={t('settings.share')}>
          <RowButton
            title={t('songs:export.action')}
            icon={Download}
            paint="sky"
            onClick={() => setExporting(true)}
          />
          {shareable ? (
            <RowButton title={t('settings.shareLink')} icon={Link2} paint="grass" onClick={share} />
          ) : null}
          {item ? (
            <RowLink
              title={t('settings.publish')}
              value={t(
                publishing.state === 'published'
                  ? 'settings.published'
                  : publishing.state === 'changed'
                    ? 'settings.changed'
                    : 'settings.notPublished',
              )}
              icon={Globe}
              paint="lilac"
              render={<Link to="/songs/$pieceId/publish" params={{ pieceId: piece.id }} />}
            />
          ) : null}
        </SettingsGroup>
        {original ? <UnpublishedChanges piece={original} title={title} /> : null}
        {ownMusic ? (
          <div ref={danger}>
            <SettingsGroup flush title={t('settings.danger')}>
              <RowButton
                title={t(ownMusic.kind === 'song' ? 'delete' : 'reset')}
                icon={ownMusic.kind === 'song' ? Trash2 : RotateCcw}
                paint="sand"
                destructive
                onClick={() => setAsking(true)}
              />
            </SettingsGroup>
          </div>
        ) : null}
      </div>
      {inLibrary ? library.sheet : null}
      <SongExportSheet
        piece={exporting ? piece : null}
        onOpenChange={setExporting}
        share={
          shareable
            ? {
                onSelect: share,
              }
            : undefined
        }
      />
      {ownMusic ? (
        <OwnMusicAsk piece={ownMusic} open={asking} onOpenChange={setAsking} returnTo={danger} />
      ) : null}
    </div>
  )
}

/**
 * A built-in song's changes not published yet, an editor's (ADR 0116): where they stand, with their
 * menu (Publish, Versions, Discard). Nothing shows while the song is as published.
 */
function UnpublishedChanges({ piece, title }: { piece: ChartPiece; title: string }) {
  const { t } = useTranslation(['piece', 'editor'])
  const draft = useOriginalDraft(piece)
  if (draft.load.state !== 'ready' || !draft.drafted) return null
  return (
    <SettingsGroup flush>
      <div className="flex min-h-16 items-center gap-3 py-2 pr-2 pl-2">
        <TileMark icon={FilePen} paint="sand" />
        <span className="min-w-0 flex-1 text-lg font-semibold">{t('settings.changes')}</span>
        <DraftStatus draft={draft} />
        <DraftActions
          draft={draft}
          title={title}
          unreadable={t('editor:original.unreadable')}
          onReset={draft.reopen}
        />
      </div>
    </SettingsGroup>
  )
}
