import { Link, useParams, useRouter, useSearch } from '@tanstack/react-router'
import {
  Archive,
  ArchiveRestore,
  Download,
  FileText,
  FolderInput,
  Globe,
  Link2,
} from 'lucide-react'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { placeIn, useFolderName, useLibraryLayout } from '@/entities/library'
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
import { useOriginalDraft } from '@/features/edit-original'
import { useSongActions } from '@/features/manage-library'
import { ShareSaid, songToShare, useShareSong } from '@/features/share-song'
import { SongExportSheet } from '@/features/song-files'
import { useSetSearch } from '@/shared/lib'
import { editsContent, useAccount } from '@/shared/lib/account'
import {
  BackButton,
  ButtonLink,
  NotFound,
  DangerGroup,
  DangerRow,
  RowButton,
  RowLink,
  ScreenHeader,
  SettingsGroup,
} from '@/shared/ui'
import { PublishRow } from '@/widgets/content-editor'
import { ResetStepsRow } from '@/features/reset-progress'
import { pieceStepId } from '@/entities/step'
import { useSongPublish } from '../model/use-song-publish'
import { OwnMusicAsk } from './OwnMusicAsk'
import { OriginalSongDetails, OwnSongDetails } from './SongDetails'

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
  // What the song says of itself (title, who wrote it, about), where it is the learner's or an
  // editor's to write: Settings › Details (R29 1.2), a step in the address.
  const ownChart = own && !isDegreePiece(piece) ? piece : null
  const details = ownChart !== null || original !== null
  const { page } = useSearch({ strict: false }) as { page?: string }
  const setSearch = useSetSearch<{ page: string | undefined }>()
  if (details && page === 'details')
    return (
      <div className="flex flex-col gap-6 pb-8">
        <ScreenHeader
          title={t('settings.details')}
          back={<BackButton onClick={() => setSearch({ page: undefined })} />}
        />
        {ownChart && own ? (
          <OwnSongDetails piece={ownChart} id={own} />
        ) : original ? (
          <OriginalSongDetails piece={original} />
        ) : null}
      </div>
    )
  return (
    <div className="flex flex-col gap-6 pb-8">
      <ScreenHeader title={t('settings.title')} back={<BackButton />} />
      <ShareSaid said={shared.said} />
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-7">
        <p className="px-1 font-display text-2xl font-semibold text-balance">{title}</p>
        {details ? (
          <SettingsGroup flush>
            <RowButton
              title={t('settings.details')}
              icon={FileText}
              paint="sky"
              onClick={() => setSearch({ page: 'details' })}
            />
          </SettingsGroup>
        ) : null}
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
        {/* Publish…, Share link, then Delete last (R29 B6), as every item's Settings. */}
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
            icon={Download}
            paint="sky"
            onClick={() => setExporting(true)}
          />
        </SettingsGroup>
        {/* Reset progress (R29 B9): the song's Learned mark, kept apart from its music. */}
        <ResetStepsRow
          steps={[pieceStepId(piece.id)]}
          words={{
            row: t('settings.resetProgress'),
            title: t('settings.resetProgressTitle'),
            body: t('settings.resetProgressBody'),
            cancel: t('settings.resetProgressCancel'),
            confirm: t('settings.resetProgressConfirm'),
            done: t('settings.resetProgressDone'),
          }}
        />
        {ownMusic ? (
          <div ref={danger}>
            <DangerGroup
              footnote={t(ownMusic.kind === 'song' ? 'deleting.says' : 'resetting.says')}
            >
              <DangerRow
                title={t(ownMusic.kind === 'song' ? 'delete' : 'reset')}
                onClick={() => setAsking(true)}
              />
            </DangerGroup>
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
