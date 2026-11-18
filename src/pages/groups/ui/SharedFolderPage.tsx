import { Link, useNavigate, useParams } from '@tanstack/react-router'
import { Folder, Heart, HeartOff, Lock, PencilLine, Play } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FOLDER_PAINTS, useLibrary, useLibraryStoreApi } from '@/entities/library'
import { MoveSheet, toggleFavourite } from '@/features/manage-library'
import { entryTitles, pieceKey, useRepertoire, type Entry, type PieceId } from '@/entities/piece'
import { readSharedEntries, useGroupsData } from '@/features/share-folder'
import { PlaylistCover } from '@/widgets/piece-cover'
import { PLACE_COLUMN, PlaceBar, SongTable } from '@/widgets/song-library'
import { songLinkData } from '@/features/share-song'
import { useLocale } from '@/shared/i18n'
import { cn, isOneOf, LAPTOP, useMediaQuery } from '@/shared/lib'
import { useGroups } from '@/shared/lib/groups'
import { keySymbol, printedSymbol } from '@/shared/lib/music'
import {
  BackButton,
  ConfirmDialog,
  DangerGroup,
  DangerRow,
  RowButton,
  RowLink,
  ScreenHeader,
  SettingsGroup,
  type RowAction,
} from '@/shared/ui'
import { GroupsState, RowsLoading } from './GroupsState'

const isFolderPaint = isOneOf(FOLDER_PAINTS)

/**
 * A folder shared with one of the learner's groups (R30 S6, R32-C): its picture on its paint, who
 * shared it and with which group, whether the learner may edit it; its songs, one of the app's opening
 * its own page, a learner's own opening as a shared song does (Save to my songs). The learner's own
 * share ends with Stop sharing, asked first. While it is read, failed, offline or gone, it says so.
 */
export function SharedFolderPage() {
  const { t } = useTranslation('songs')
  const locale = useLocale()
  const repertoire = useRepertoire()
  const navigate = useNavigate()
  const port = useGroups()
  const { sharedId } = useParams({ from: '/shell/songs/shared-folders/$sharedId' })
  const { data, reload } = useGroupsData()
  const [asking, setAsking] = useState(false)
  const [failed, setFailed] = useState(false)
  const [adding, setAdding] = useState<{ id: PieceId; title: string } | null>(null)
  const library = useLibraryStoreApi()
  const favourites = useLibrary((state) => state.favourites)
  const laptop = useMediaQuery(LAPTOP)
  const folder =
    data.kind === 'ready' ? data.shared.find((each) => each.id === sharedId) : undefined
  const group =
    data.kind === 'ready' ? data.groups.find((each) => each.id === folder?.groupId) : undefined
  if (!folder)
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <ScreenHeader title={t('groups.sharedWithMe')} back={<BackButton />} />
        {data.kind === 'loading' ? (
          <RowsLoading label={t('groups.loading')} />
        ) : data.kind === 'ready' ? (
          <p className="text-muted-foreground">{t('groups.notFound')}</p>
        ) : (
          <GroupsState data={data} onRetry={reload} />
        )}
      </div>
    )
  const entries = readSharedEntries(folder.songs)
  const groupName = group?.name ?? ''
  const stop = async () => {
    const done = await port.unshare(folder.groupId, folder.folderKey)
    if (!done.ok) return setFailed(true)
    reload()
    void navigate({
      to: '/songs/groups/$groupId',
      params: { groupId: folder.groupId },
      replace: true,
    })
  }
  // The songs of the app it holds, as All songs' table on a laptop; their menu a viewer's (canvas
  // 2026-11-18, VIEWITEMS): Practise, Add to a playlist, Favourite, never the sharer's own acts.
  const pieces = entries.flatMap((entry) => {
    const found = entry.kind === 'built-in' ? repertoire.entry(entry.id) : undefined
    return found && found.kind !== 'listing' ? [found] : []
  })
  const viewerActions = (entry: Entry): RowAction[] => [
    {
      key: 'practise',
      label: t('library.practise'),
      icon: Play,
      paint: 'yellow',
      onSelect: () => void navigate({ to: '/play/$pieceId', params: { pieceId: entry.id } }),
    },
    {
      key: 'add',
      label: t('select.move'),
      icon: Folder,
      paint: 'sky',
      onSelect: () => setAdding({ id: entry.id, title: entryTitles(entry, locale).primary }),
    },
    {
      key: 'favourite',
      label: t(favourites.includes(entry.id) ? 'select.unfavourite' : 'select.favourite'),
      icon: favourites.includes(entry.id) ? HeartOff : Heart,
      paint: 'sand',
      onSelect: () => toggleFavourite(library, entry.id),
    },
  ]
  const head = (
    <div className="flex items-center gap-4">
      <PlaylistCover
        paint={isFolderPaint(folder.paint) ? folder.paint : 'grass'}
        songs={entries.flatMap((entry) => {
          const found = entry.kind === 'built-in' ? repertoire.entry(entry.id) : undefined
          return found && found.kind !== 'listing' ? [found] : []
        })}
        face={folder.mine ? undefined : folder.ownerName}
        className="size-24 lg:size-40"
      />
      <div className="flex min-w-0 flex-col gap-1">
        <p className="text-pretty">
          {folder.mine
            ? t('groups.yours', { group: groupName })
            : t('groups.sharedBy', { name: folder.ownerName, group: groupName })}
        </p>
        <p className="inline-flex items-center gap-1.5 text-muted-foreground">
          {folder.canEdit ? (
            <PencilLine aria-hidden className="size-4" />
          ) : (
            <Lock aria-hidden className="size-4" />
          )}
          {t(folder.canEdit ? 'groups.mayEdit' : 'groups.viewOnly')}
        </p>
      </div>
    </div>
  )
  const stopping = (
    <>
      {folder.mine ? (
        <DangerGroup footnote={t('groups.stopBody', { group: groupName })}>
          <DangerRow title={t('groups.stopSharing')} onClick={() => setAsking(true)} />
        </DangerGroup>
      ) : null}
      <ConfirmDialog
        open={asking}
        onOpenChange={setAsking}
        title={t('groups.stopTitle', { name: folder.name })}
        body={t('groups.stopBody', { group: groupName })}
        action={t('groups.stopSharing')}
        onConfirm={() => void stop()}
      />
    </>
  )
  return laptop ? (
    <div className={cn('flex flex-col gap-6 pb-8', PLACE_COLUMN)}>
      <PlaceBar title={folder.name} count={t('folder.songCount', { count: entries.length })} />
      {head}
      {failed ? (
        <p role="alert" className="text-sm text-destructive">
          {t('groups.failed')}
        </p>
      ) : null}
      <SongTable label={folder.name} entries={pieces} actionsOf={viewerActions} sort={null} />
      {stopping}
      <MoveSheet
        moving={adding ? { songs: [adding.id], folders: [] } : null}
        what={adding?.title ?? ''}
        onOpenChange={(open) => (open ? undefined : setAdding(null))}
      />
    </div>
  ) : (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 pb-8">
      <ScreenHeader title={folder.name} large back={<BackButton />} />
      {head}
      {failed ? (
        <p role="alert" className="text-sm text-destructive">
          {t('groups.failed')}
        </p>
      ) : null}
      <SettingsGroup flush title={t('folder.songCount', { count: entries.length })}>
        {entries.map((entry, index) => {
          if (entry.kind === 'built-in') {
            const piece = repertoire.entry(entry.id)
            if (!piece) return null
            const titles = entryTitles(piece, locale)
            return (
              <RowLink
                key={`${entry.id}-${index}`}
                title={titles.primary}
                detail={titles.secondary || undefined}
                value={printedSymbol(keySymbol(pieceKey(piece)))}
                render={<Link to="/songs/$pieceId" params={{ pieceId: piece.id }} />}
              />
            )
          }
          return (
            <RowButton
              key={`own-${index}`}
              title={entry.song.title}
              onClick={() =>
                void songLinkData(entry.song).then((song) => {
                  if (song) void navigate({ to: '/songs/shared', search: { song } })
                })
              }
            />
          )
        })}
      </SettingsGroup>
      {stopping}
    </div>
  )
}
